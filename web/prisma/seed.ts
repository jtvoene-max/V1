// Seed-script: vult de lokale database met realistische testdata.
// Draaien: npx prisma db seed  (of: npx tsx prisma/seed.ts)
// Alle testaccounts hebben wachtwoord: Test1234!
import "dotenv/config";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  AccountType,
  Condition,
  ListingStatus,
  OrderStatus,
  OfferStatus,
  ShipmentLeg,
  ShipmentPaidBy,
  ShipmentStatus,
  UserRole,
  type User,
  type Listing,
} from "../src/generated/prisma/client";
import { orderSnapshot } from "../src/lib/order-snapshot";
import { naarSlug } from "../src/lib/model-slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

faker.seed(20260727);

const CHANEL_MODELS: { model: string; category: string; min: number; max: number }[] = [
  { model: "Classic Flap Small", category: "bag", min: 3500, max: 9000 },
  { model: "Classic Flap Medium", category: "bag", min: 4500, max: 12000 },
  { model: "Classic Flap Jumbo", category: "bag", min: 5000, max: 14000 },
  { model: "2.55 Reissue 226", category: "bag", min: 4000, max: 11000 },
  { model: "Boy Bag Old Medium", category: "bag", min: 3000, max: 8000 },
  { model: "Chanel 19 Large", category: "bag", min: 3500, max: 7500 },
  { model: "Coco Handle Small", category: "bag", min: 3800, max: 8500 },
  { model: "Gabrielle Hobo", category: "bag", min: 2500, max: 6000 },
  { model: "Wallet on Chain", category: "bag", min: 1800, max: 4500 },
  { model: "Vanity Case", category: "bag", min: 2200, max: 7000 },
  { model: "Deauville Tote Large", category: "bag", min: 1500, max: 4000 },
  { model: "Timeless Clutch", category: "bag", min: 1200, max: 3500 },
  { model: "Diana Flap Vintage", category: "bag", min: 4000, max: 10000 },
  { model: "Kelly Flap Vintage", category: "bag", min: 3000, max: 9000 },
  { model: "Duma Backpack Vintage", category: "bag", min: 2500, max: 6500 },
  { model: "CC Drop Earrings Vintage", category: "jewelry", min: 400, max: 1800 },
  { model: "Gripoix Necklace Vintage", category: "jewelry", min: 800, max: 4500 },
  { model: "CC Brooch Gold", category: "jewelry", min: 350, max: 1500 },
  { model: "Pearl Necklace CC Vintage", category: "jewelry", min: 600, max: 3000 },
  { model: "Silk Scarf Camellia", category: "accessory", min: 150, max: 600 },
  { model: "Chain Belt Vintage", category: "accessory", min: 500, max: 2200 },
  { model: "Sunglasses Vintage", category: "accessory", min: 200, max: 800 },
];

const CONDITIONS: Condition[] = [
  Condition.NEW,
  Condition.EXCELLENT,
  Condition.VERY_GOOD,
  Condition.GOOD,
  Condition.VISIBLE_WEAR,
];

// Attributen per categorie, zodat de combinaties realistisch blijven:
// een sjaal is nooit van caviar-leer en een ketting heeft geen hengseldrop.
const KLEUREN = ["Black", "Beige", "Brown", "Navy", "Red", "Pink", "Ivory", "Grey", "Gold", "Multicolour"];
const MATERIALEN: Record<string, string[]> = {
  bag: ["Lambskin", "Caviar", "Calfskin", "Aged calfskin", "Patent leather", "Tweed", "Canvas"],
  jewelry: ["Gilt metal", "Gilt metal"],
  accessory: ["Silk", "Acetate", "Gilt metal", "Canvas"],
};
const HARDWARE_OPTIES = ["Gold", "Silver", "Ruthenium", "Mixed"];
const INCLUSIE_OPTIES = ["Dust bag", "Authenticity card", "Box", "Receipt", "Care booklet"];

// Slijtage per zone, passend bij de conditie
const SLIJTAGE: Record<string, Record<string, string>> = {
  NEW: {
    EXTERIOR: "Unworn, only creases from the box",
    CORNERS_EDGES: "Pristine",
    HARDWARE: "Protective film still in place",
    INTERIOR: "As new",
  },
  EXCELLENT: {
    EXTERIOR: "Light cushioning loss in the quilting, otherwise crisp",
    CORNERS_EDGES: "Minimal rubbing on the base corners",
    HARDWARE: "Fine hairline scratches on the turnlock",
    INTERIOR: "Light imprints, clean",
  },
  VERY_GOOD: {
    EXTERIOR: "Soft cushioning loss in keeping with the era",
    CORNERS_EDGES: "Slight wear on two corners",
    HARDWARE: "Gilding largely intact, light scratching",
    INTERIOR: "Light signs of use",
  },
  GOOD: {
    EXTERIOR: "Visible carry marks across the flap",
    CORNERS_EDGES: "Wear on all four corners",
    HARDWARE: "Dull patches on the chain",
    INTERIOR: "Signs of use, one pen mark",
  },
  VISIBLE_WEAR: {
    EXTERIOR: "Leather discoloured in places",
    CORNERS_EDGES: "Fraying along the base",
    HARDWARE: "Gilding worn through on the clasp",
    INTERIOR: "Staining on the base of the lining",
  },
};

function afmetingVoor(categorie: string): string | null {
  if (categorie === "bag") {
    const b = faker.number.int({ min: 18, max: 38 });
    const h = faker.number.int({ min: 11, max: 30 });
    const d = faker.number.int({ min: 4, max: 18 });
    return `${b} × ${h} × ${d} cm · strap drop ${faker.number.int({ min: 45, max: 60 })} cm`;
  }
  if (categorie === "jewelry") return `Length ${faker.number.int({ min: 40, max: 90 })} cm`;
  return `${faker.number.int({ min: 8, max: 90 })} × ${faker.number.int({ min: 5, max: 90 })} cm`;
}

function priceFor(min: number, max: number): number {
  // Prijzen in centen, afgerond op hele tientjes
  const eur = faker.number.int({ min, max });
  return Math.round(eur / 10) * 10 * 100;
}

async function main() {
  console.log("Seeding...");
  const passwordHash = await bcrypt.hash("Test1234!", 10);

  // Schoon beginnen (volgorde i.v.m. relaties)
  await prisma.auditLog.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.inspectionReport.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.listingPhoto.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // ── Vaste testaccounts ──────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: "admin@test.local",
      passwordHash,
      name: "Admin Test",
      role: UserRole.ADMIN,
      accountType: AccountType.PRIVATE,
    },
  });
  await prisma.user.create({
    data: {
      email: "team@test.local",
      passwordHash,
      name: "Team Test",
      role: UserRole.TEAM,
      accountType: AccountType.PRIVATE,
    },
  });
  const buyer = await prisma.user.create({
    data: {
      email: "koper@test.local",
      passwordHash,
      name: "Karl Buyer",
      accountType: AccountType.PRIVATE,
    },
  });
  const sellerPrivate = await prisma.user.create({
    data: {
      email: "verkoper@test.local",
      passwordHash,
      name: "Vera Seller",
      accountType: AccountType.PRIVATE,
    },
  });
  const sellerBusiness = await prisma.user.create({
    data: {
      email: "zakelijk@test.local",
      passwordHash,
      name: "Bas Boutique",
      accountType: AccountType.BUSINESS,
      companyName: "Vintage Boutique Ltd",
      vatNumber: "NL123456789B01",
      kvkNumber: "12345678",
      shopSlug: "vintage-boutique-ltd",
      shopCity: "Amsterdam",
      shopStory:
        "We have been buying and selling Chanel since 1998, first from a shop on the Spiegelgracht and now mostly online. We only take pieces we would carry ourselves, which means we turn a lot down.",
    },
  });

  // ── Extra gebruikers (mix particulier/zakelijk) ─────────────────────
  const extraSellers: User[] = [];
  for (let i = 0; i < 20; i++) {
    const isBusiness = i % 4 === 0; // kwart zakelijk
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const bedrijf = isBusiness ? faker.company.name() : null;
    extraSellers.push(
      await prisma.user.create({
        data: {
          email: faker.internet.email({ firstName: first, lastName: last, provider: `test${i}.local` }).toLowerCase(),
          passwordHash,
          name: `${first} ${last}`,
          accountType: isBusiness ? AccountType.BUSINESS : AccountType.PRIVATE,
          companyName: bedrijf,
          vatNumber: isBusiness ? `NL${faker.string.numeric(9)}B01` : null,
          kvkNumber: isBusiness ? faker.string.numeric(8) : null,
          // Winkelpagina alleen voor zakelijke verkopers. De -i achter de slug
          // houdt hem uniek als faker twee keer dezelfde bedrijfsnaam geeft.
          shopSlug: bedrijf ? `${naarSlug(bedrijf)}-${i}` : null,
          shopCity: isBusiness
            ? faker.helpers.arrayElement(["Amsterdam", "Antwerp", "Paris", "Milan", "Berlin", "Rotterdam"])
            : null,
          shopStory: isBusiness
            ? "A small team of specialists. Every piece is checked in house before we list it, and we photograph everything ourselves in daylight."
            : null,
          locale: faker.helpers.arrayElement(["nl", "en", "fr", "de"]),
        },
      })
    );
  }
  const extraBuyers: User[] = [];
  for (let i = 0; i < 15; i++) {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    extraBuyers.push(
      await prisma.user.create({
        data: {
          email: faker.internet.email({ firstName: first, lastName: last, provider: `koper${i}.local` }).toLowerCase(),
          passwordHash,
          name: `${first} ${last}`,
          accountType: i % 5 === 0 ? AccountType.BUSINESS : AccountType.PRIVATE,
          companyName: i % 5 === 0 ? faker.company.name() : null,
          vatNumber: i % 5 === 0 ? `NL${faker.string.numeric(9)}B01` : null,
        },
      })
    );
  }

  // Adressen voor vaste accounts
  for (const u of [buyer, sellerPrivate, sellerBusiness]) {
    await prisma.address.create({
      data: {
        userId: u.id,
        name: u.name,
        street: faker.location.street(),
        houseNo: String(faker.number.int({ min: 1, max: 200 })),
        postalCode: `${faker.number.int({ min: 1000, max: 9999 })} ${faker.string.alpha({ length: 2, casing: "upper" })}`,
        city: faker.location.city(),
        country: "NL",
        isDefault: true,
      },
    });
  }

  // ── Listings: 550 stuks ─────────────────────────────────────────────
  const allSellers = [sellerPrivate, sellerBusiness, ...extraSellers];
  const listings: Listing[] = [];
  const TOTAL = 550;

  for (let i = 0; i < TOTAL; i++) {
    const spec = faker.helpers.arrayElement(CHANEL_MODELS);
    const condition = faker.helpers.weightedArrayElement([
      { value: Condition.NEW, weight: 1 },
      { value: Condition.EXCELLENT, weight: 3 },
      { value: Condition.VERY_GOOD, weight: 4 },
      { value: Condition.GOOD, weight: 3 },
      { value: Condition.VISIBLE_WEAR, weight: 2 },
    ]);
    const year = faker.number.int({ min: 1985, max: 2018 });
    const seller = faker.helpers.arrayElement(allSellers);
    // ~88% actief, rest verdeeld over draft/withdrawn (verkochte komen via orders)
    const status = faker.helpers.weightedArrayElement([
      { value: ListingStatus.ACTIVE, weight: 88 },
      { value: ListingStatus.DRAFT, weight: 7 },
      { value: ListingStatus.WITHDRAWN, weight: 5 },
    ]);

    const kleur = faker.helpers.arrayElement(KLEUREN);
    const materiaal = faker.helpers.arrayElement(MATERIALEN[spec.category] ?? MATERIALEN.bag);
    const hardware = spec.category === "accessory" && materiaal === "Silk"
      ? "None"
      : faker.helpers.arrayElement(HARDWARE_OPTIES);
    const conditieTekst = {
      NEW: "Unworn, exactly as it left the boutique.",
      EXCELLENT: "In excellent condition, barely worn.",
      VERY_GOOD: "Lightly worn, with the patina you expect of the era.",
      GOOD: "In good condition with signs of wear in keeping with its age.",
      VISIBLE_WEAR: "Clear signs of wear, see photographs. Priced accordingly.",
    }[condition];

    const listing = await prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: `Chanel ${spec.model} ${year}`,
        description: [
          `Vintage Chanel ${spec.model} from ${year} in ${kleur.toLowerCase()} ${materiaal.toLowerCase()}.`,
          conditieTekst,
          "Comes with an authenticity check by our atelier.",
        ].join(" "),
        category: spec.category,
        model: spec.model,
        condition,
        productionYear: year,
        serialNumber: faker.string.numeric(8),
        color: kleur,
        material: materiaal,
        hardware,
        dimensions: afmetingVoor(spec.category),
        inclusions: faker.helpers.arrayElements(INCLUSIE_OPTIES, { min: 0, max: 4 }),
        priceCents: priceFor(spec.min, spec.max),
        status,
        allowOffers: faker.datatype.boolean({ probability: 0.8 }),
        photos: {
          create: [0, 1, 2, 3].map((p) => ({
            url: `https://picsum.photos/seed/tm-${i}-${p}/800/800`,
            position: p,
          })),
        },
        wearNotes: {
          create: (["EXTERIOR", "CORNERS_EDGES", "HARDWARE", "INTERIOR"] as const).map((zone) => ({
            zone,
            note: SLIJTAGE[condition][zone],
            verifiedByAtelier: faker.datatype.boolean({ probability: 0.3 }),
          })),
        },
      },
    });
    listings.push(listing);
    await prisma.auditLog.create({
      data: {
        entityType: "LISTING",
        entityId: listing.id,
        action: "CREATED",
        toValue: status,
        actorId: seller.id,
        note: `${listing.title} · ${Math.round(listing.priceCents / 100)} EUR (seed)`,
      },
    });
  }

  // ── Biedingen op actieve listings ───────────────────────────────────
  const activeListings = listings.filter((l) => l.status === ListingStatus.ACTIVE && l.allowOffers);
  let offerCount = 0;
  for (const listing of faker.helpers.arrayElements(activeListings, 60)) {
    const bidder = faker.helpers.arrayElement([buyer, ...extraBuyers]);
    const amount = Math.round(listing.priceCents * faker.number.float({ min: 0.7, max: 0.95 }));
    const status = faker.helpers.weightedArrayElement([
      { value: OfferStatus.PENDING, weight: 5 },
      { value: OfferStatus.REJECTED, weight: 2 },
      { value: OfferStatus.EXPIRED, weight: 2 },
      { value: OfferStatus.COUNTERED, weight: 1 },
    ]);
    const offer = await prisma.offer.create({
      data: {
        listingId: listing.id,
        buyerId: bidder.id,
        amountCents: Math.round(amount / 1000) * 1000,
        status,
        expiresAt: faker.date.soon({ days: 3 }),
      },
    });
    if (status === OfferStatus.COUNTERED) {
      await prisma.offer.create({
        data: {
          listingId: listing.id,
          buyerId: bidder.id,
          amountCents: Math.round((offer.amountCents + listing.priceCents) / 2 / 1000) * 1000,
          status: OfferStatus.PENDING,
          expiresAt: faker.date.soon({ days: 3 }),
          parentOfferId: offer.id,
        },
      });
    }
    offerCount++;
  }

  // ── Orders in verschillende fasen van de flow ───────────────────────
  // Statuspaden: hoe ver een order is, bepaalt welke shipments/events er zijn.
  const ORDER_FLOWS: { status: OrderStatus; count: number }[] = [
    { status: OrderStatus.PAID, count: 4 },
    { status: OrderStatus.AWAITING_ITEM, count: 4 },
    { status: OrderStatus.ITEM_RECEIVED, count: 3 },
    { status: OrderStatus.IN_INSPECTION, count: 3 },
    { status: OrderStatus.APPROVED, count: 2 },
    { status: OrderStatus.SHIPPED_TO_BUYER, count: 3 },
    { status: OrderStatus.DELIVERED, count: 2 },
    { status: OrderStatus.COMPLETED, count: 8 },
    { status: OrderStatus.REJECTED, count: 1 },
    { status: OrderStatus.RETURNING_TO_SELLER, count: 2 },
  ];

  const STATUS_SEQUENCE: OrderStatus[] = [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PAID,
    OrderStatus.AWAITING_ITEM,
    OrderStatus.ITEM_RECEIVED,
    OrderStatus.IN_INSPECTION,
    OrderStatus.APPROVED,
    OrderStatus.SHIPPED_TO_BUYER,
    OrderStatus.DELIVERED,
    OrderStatus.COMPLETED,
  ];

  const availableForOrder = listings.filter((l) => l.status === ListingStatus.ACTIVE);
  let orderIdx = 0;
  let orderCount = 0;

  for (const flow of ORDER_FLOWS) {
    for (let n = 0; n < flow.count; n++) {
      const listing = availableForOrder[orderIdx++];
      if (!listing) break;
      const orderBuyer = faker.helpers.arrayElement([buyer, ...extraBuyers]);

      await prisma.listing.update({ where: { id: listing.id }, data: { status: ListingStatus.SOLD } });

      const buyerFee = Math.round(listing.priceCents * 0.05); // 5% kopersfee (voorlopig)
      const sellerFee = Math.round(listing.priceCents * 0.1); // 10% verkopersfee (voorlopig)

      const order = await prisma.order.create({
        data: {
          listingId: listing.id,
          buyerId: orderBuyer.id,
          sellerId: listing.sellerId,
          status: flow.status,
          itemPriceCents: listing.priceCents,
          buyerFeeCents: buyerFee,
          sellerFeeCents: sellerFee,
          buyerShippingCents: 1250,
          sellerShippingCents: 950,
          // Kenmerken bevriezen, net als de bedragen hierboven.
          ...orderSnapshot(listing),
        },
      });

      // Events: het pad tot en met de huidige status
      const isRejectPath =
        flow.status === OrderStatus.REJECTED || flow.status === OrderStatus.RETURNING_TO_SELLER;
      const path = isRejectPath
        ? [...STATUS_SEQUENCE.slice(0, 5), OrderStatus.REJECTED, ...(flow.status === OrderStatus.RETURNING_TO_SELLER ? [OrderStatus.RETURNING_TO_SELLER] : [])]
        : STATUS_SEQUENCE.slice(0, STATUS_SEQUENCE.indexOf(flow.status) + 1);

      let prev: OrderStatus | null = null;
      for (const st of path) {
        const actorId = st === OrderStatus.IN_INSPECTION || st === OrderStatus.REJECTED ? admin.id : null;
        await prisma.orderEvent.create({
          data: { orderId: order.id, fromStatus: prev, toStatus: st, actorId },
        });
        await prisma.auditLog.create({
          data: {
            entityType: "ORDER",
            entityId: order.id,
            action: "STATUS_CHANGED",
            fromValue: prev,
            toValue: st,
            actorId,
            note: "Seed data",
          },
        });
        prev = st;
      }

      // Shipments afhankelijk van fase
      const reached = (s: OrderStatus) => path.includes(s);
      if (reached(OrderStatus.AWAITING_ITEM)) {
        await prisma.shipment.create({
          data: {
            orderId: order.id,
            leg: ShipmentLeg.SELLER_TO_PLATFORM,
            paidBy: ShipmentPaidBy.SELLER,
            status: reached(OrderStatus.ITEM_RECEIVED) ? ShipmentStatus.DELIVERED : ShipmentStatus.LABEL_CREATED,
            carrier: "postnl",
            trackingNumber: `3S${faker.string.numeric(13)}`,
            insuredValueCents: listing.priceCents,
          },
        });
      }
      if (reached(OrderStatus.SHIPPED_TO_BUYER)) {
        await prisma.shipment.create({
          data: {
            orderId: order.id,
            leg: ShipmentLeg.PLATFORM_TO_BUYER,
            paidBy: ShipmentPaidBy.BUYER,
            status: reached(OrderStatus.DELIVERED) ? ShipmentStatus.DELIVERED : ShipmentStatus.IN_TRANSIT,
            carrier: "postnl",
            trackingNumber: `3S${faker.string.numeric(13)}`,
            insuredValueCents: listing.priceCents,
          },
        });
      }
      if (flow.status === OrderStatus.RETURNING_TO_SELLER) {
        await prisma.shipment.create({
          data: {
            orderId: order.id,
            leg: ShipmentLeg.PLATFORM_TO_SELLER_RETURN,
            paidBy: ShipmentPaidBy.SELLER,
            status: ShipmentStatus.IN_TRANSIT,
            carrier: "postnl",
            trackingNumber: `3S${faker.string.numeric(13)}`,
            insuredValueCents: listing.priceCents,
          },
        });
      }

      // Inspectie + payout waar van toepassing
      if (reached(OrderStatus.APPROVED) || isRejectPath) {
        await prisma.inspectionReport.create({
          data: {
            orderId: order.id,
            result: isRejectPath ? "REJECTED" : "APPROVED",
            notes: isRejectPath ? "Differs from the description; hardware shows undisclosed damage." : "Found authentic, condition matches the listing.",
            inspectorId: admin.id,
          },
        });
      }
      if (flow.status === OrderStatus.COMPLETED) {
        const payout = await prisma.payout.create({
          data: {
            orderId: order.id,
            sellerId: listing.sellerId,
            amountCents: listing.priceCents - sellerFee,
            status: "PAID",
          },
        });
        await prisma.auditLog.create({
          data: {
            entityType: "PAYOUT",
            entityId: payout.id,
            action: "PAYOUT_CREATED",
            toValue: "PAID",
            note: `${Math.round(payout.amountCents / 100)} EUR · order ${order.id} (seed)`,
          },
        });
      }
      orderCount++;
    }
  }

  const counts = {
    users: await prisma.user.count(),
    listings: await prisma.listing.count(),
    photos: await prisma.listingPhoto.count(),
    offers: await prisma.offer.count(),
    orders: await prisma.order.count(),
    shipments: await prisma.shipment.count(),
    events: await prisma.orderEvent.count(),
    payouts: await prisma.payout.count(),
    auditRegels: await prisma.auditLog.count(),
  };
  console.log("Seed complete:", JSON.stringify(counts, null, 2));
  console.log(`(${offerCount} listings with offers, ${orderCount} orders)`);
  console.log("Test accounts (password Test1234!): admin@test.local, team@test.local, koper@test.local, verkoper@test.local, zakelijk@test.local");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
