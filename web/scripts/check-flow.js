const { Client } = require("pg");
const c = new Client({ connectionString: "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable" });
c.connect()
  .then(async () => {
    const cancelled = await c.query(`
      select o.status as orderstatus, l.status as listingstatus,
        (select count(*) from "Shipment" s where s."orderId" = o.id and s.leg = 'PLATFORM_TO_SELLER_RETURN') as retourzendingen
      from "Order" o join "Listing" l on l.id = o."listingId"
      where o.status = 'CANCELLED'
      order by o."updatedAt" desc limit 1`);
    const payout = await c.query(`
      select p."amountCents", p.status from "Payout" p
      join "Order" o on o.id = p."orderId"
      where o.status = 'COMPLETED' order by p."createdAt" desc limit 1`);
    console.log(JSON.stringify({ geannuleerdeOrder: cancelled.rows[0], nieuwstePayout: payout.rows[0] }, null, 2));
    return c.end();
  })
  .catch((e) => { console.error("FOUT:", e.message); process.exit(1); });
