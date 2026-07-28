# Cloudflare Images aanzetten

De code is klaar. Er zijn twee waarden nodig uit je Cloudflare-account, en
daarna gaan alle foto's daar automatisch naartoe.

Hoe het in de code zit: alles loopt via één functie in
[storage.ts](../web/src/lib/storage.ts). Staan de twee sleutels in de omgeving,
dan gaat de foto naar Cloudflare. Staan ze er niet, dan schrijft hij naar de map
`public/uploads` op de schijf. Dat laatste is alleen bedoeld voor lokaal
werken, want op Vercel is de schijf tijdelijk en alleen-lezen. Willen we later
naar een andere aanbieder, dan verandert alleen dat ene bestand.

## Stap 1: Images aanzetten

In het Cloudflare-dashboard links in het menu naar **Images**. De eerste keer
moet je het product aanzetten; het is niet gratis. Reken op **$ 5 per maand per
100.000 bewaarde foto's** en ongeveer **$ 1 per 100.000 keer dat een foto
getoond wordt**. Bij 10.000 listings met acht foto's kom je ruwweg op $ 10 tot
15 per maand.

Bij het aanzetten maakt Cloudflare automatisch een variant `public` aan. Die
gebruikt de code, dus daar hoef je niets aan te doen.

## Stap 2: je Account ID

Ga naar **Images** en kijk rechts in de zijbalk, of kijk naar de URL van je
dashboard: het lange getal-en-letterblok direct na `/accounts/` is het.

Het is geen geheim, maar hoort wel bij de sleutel hieronder.

## Stap 3: een API-sleutel maken

Rechtsboven op je profielicoon, dan **My Profile**, dan **API Tokens**, dan
**Create Token**. Kies onderaan **Create Custom Token** en vul in:

- **Token name**: `Still Iconic uploads`
- **Permissions**: kies `Account`, dan `Cloudflare Images`, dan `Edit`
- **Account Resources**: je eigen account

Klik door naar **Create Token** en kopieer de sleutel. **Je ziet hem maar één
keer**, daarna niet meer. Raak je hem kwijt, maak dan gewoon een nieuwe en
verwijder de oude.

Geef die sleutel alleen deze ene rechten. Zou hij ooit uitlekken, dan kan er
niets anders mee dan foto's uploaden.

## Stap 4: de waarden op twee plekken zetten

**Lokaal**, in `web/.env`, onderaan toevoegen:

```
CLOUDFLARE_ACCOUNT_ID="hier je account id"
CLOUDFLARE_IMAGES_TOKEN="hier de sleutel uit stap 3"
```

**Op de live site**, in Vercel: je project, dan **Settings**, dan
**Environment Variables**. Voeg dezelfde twee toe, voor alle omgevingen. Klik
daarna op **Deployments** en zet de laatste versie opnieuw uit, anders kent de
site de nieuwe waarden nog niet.

## Stap 5: controleren

Plaats een listing met een foto en kijk of de foto op de productpagina staat.
Staat het adres van de foto op `imagedelivery.net`, dan loopt het via
Cloudflare. Begint het met `/uploads/`, dan zijn de sleutels nog niet gevonden.

Mislukt het uploaden, dan wordt de listing **niet** aangemaakt en krijg je een
melding. Dat is bewust: liever geen listing dan een listing zonder foto's.

## Wat we hierna nog met Cloudflare kunnen doen

Los van Images, en pas relevant vóór de livegang:

- **Turnstile** tegen bots bij registreren en inloggen. Gratis, en dat staat al
  op de [checklist voor de livegang](checklist-livegang.md).
- **Cloudflare als proxy voor de hele site**: dat raden we af, zie
  [cloudflare-en-beveiliging.md](cloudflare-en-beveiliging.md). Twee lagen
  cachen boven elkaar geeft risico op verouderde prijzen en voorraad.
