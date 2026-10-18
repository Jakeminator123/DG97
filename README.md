# DG97 Kontorshotell (dg97.org)

Stödsajt till [www.dg97.se](https://www.dg97.se) för DG97 Kontorshotell på Drottninggatan 97, Stockholm. Sajten visar lediga rum, blogg och en förfrågan – bokning och officiell info ligger på huvuddomänen.

## Innehåll och hänvisningar

- Unik copy, egen canonical på dg97.org, Open Graph och LocalBusiness som pekar på `https://www.dg97.se/#localbusiness`.
- Inga påhittade recensioner, betyg eller öppettider i schema.
- CTA: [dg97.se](https://www.dg97.se), [hej@dg97.se](mailto:hej@dg97.se), 070-886 22 79.
- Priser och lediga rum finns på `/lediga-rum` och i de daterade räkneexempelartiklarna. Alltid `exkl. moms`.
- Blogg: Markdown i `content/posts/`. Sätt `draft: true` för att dölja ett inlägg.
- Lead-formuläret sparar i Neon och mejlar `hej@dg97.se` via Resend när `RESEND_API_KEY` finns (avsändare `noreply@dg97.org`, reply-to = besökaren). Utan nyckel sparas bara raden. Se `ADMIN_SETUP.md`.

## Lediga rum

`/lediga-rum` hämtar publicerade rum från Google Sheets och ritar en förenklad plan.

```
Tillgänglighet DG97 (Blad1)
        ↓  fliken Publik
publicerad CSV (anonym)
        ↓  getStaticProps + ISR ~1 h
dg97.org/lediga-rum
        ↳  vid fel: data/lediga-rum.json
```

- Kolumner: `rum,kvm,status,ledigt_fran,pris_exkl_moms,available,publish`.
- Sidan visar bara rader där `available=true` **och** `publish=true`.
- Pris alltid `kr/mån exkl. moms`. Planritningen visar rum + kvm + ledig-status, aldrig pris.
- `revalidate: 3600`. URL kan bytas med `LEDIGA_RUM_CSV_URL`.

## Neon (förfrågningar)

Förfrågningar från `/kontakt` och startsidan sparas i Neon Postgres som redan är kopplad till Vercel-projektet `dg-97` (databasen `dg97-members`). Tabellen `leads` skapas automatiskt om den saknas. Admin: `/admin` (kräver `ADMIN_*`).

Om `DATABASE_URL` saknas i en miljö: Vercel → projektet `dg-97` → **Storage** → koppla befintlig Neon-resurs till Preview/Production, eller **Marketplace → Neon**. Variabeln ska heta `DATABASE_URL`. Publicera sedan om preview. Lösenord ska inte checkas in.

## Local development

Använd Node-intervallet i `package.json`. Kör `npm ci` och `npm run dev`. Bygg med `npm run build`.

```sh
npm ci
npm run lint
npm test
npm run test:images
npm run build
npm run test:smoke
```
