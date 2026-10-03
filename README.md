# DG97 Kontorsguiden

Separat inspirations- och guidesajt från DG97 om kontorshotell och arbetsliv i Stockholm. Sajten på `www.dg97.org` har egna guider och checklistor. Den ska stödja huvudwebbplatsen `www.dg97.se`, inte konkurrera om varumärkes- eller bokningssökningar.

## Project status

This is the repository connected to the Vercel project `dg-97` in the account review of 13 September 2026. It now maintains the separate guide site; it does not replace DG97's main website. Other office-site design drafts should be evaluated separately before any code is moved here.

## Innehåll och hänvisningar

- Håll guiden användbar i sig: jämförelser, frågor inför visningar och praktiska råd. Skapa inte kopior eller ortssidor enbart för söktrafik.
- Ange DG97 som avsändare. Presentera inte sajten som en oberoende jämförelsetjänst.
- Publicera inga obekräftade rabatter, svarstider, avtalsperioder, betyg, certifieringar eller kundberättelser.
- Priser och lediga rum får bara finnas på `/lediga-rum` och i det daterade räkneexemplet i artikeln *Vad kostar ett kontorshotell i Stockholm?*. Alltid `exkl. moms`. Lista inte rum 1.
- Veckoartiklarna får inte innehålla priser eller lediga rum och får inte "rätta tillbaka" de två undantagen.
- Låt förfrågningar och visningsbokning gå till `https://www.dg97.se/kontakt/` (eller `/lediga-kontor/` när den sidan finns). NAP och `sameAs` finns i `config/site.js`.
- Guider använder egna canonical-adresser på guidens domän. Organization-schemat pekar på `https://www.dg97.se/#localbusiness`. Ingen egen LocalBusiness med url dg97.org. Inga recensioner eller bokningsbekräftelser.
- Sätt `draft: true` i frontmatter för att undanta ett inlägg från publika sidor, API och sitemap. Ange `modifiedDate` när en artikel uppdateras.
- Den äldre bloggeneratorn ska inte användas för automatisk publicering utan faktagranskning. Muterande admin-API:er är fortsatt pausade.

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

- Jakob/Oscar redigerar arket **Tillgänglighet DG97**, fliken **Publik**. Kolumner: `rum,kvm,status,ledigt_fran,pris_exkl_moms,available,publish`.
- `kvm` med punkt (13.5). `ledigt_fran` som `yyyy-mm-dd` eller tomt. Booleaner `true`/`false`.
- Sidan visar bara rader där `available=true` **och** `publish=true`. Rum 1 publiceras alltså inte så länge `publish=false`.
- `ledigt nu` / `ledigt från <datum>` räknas mot dagens datum i Europe/Stockholm, inte mot texten i `status`.
- Pris alltid `kr/mån exkl. moms`. Planritningen visar rum + kvm + ledig-status, aldrig pris eller hyresgästnamn.
- Ritningen är den riktiga planskissen (`public/images/planritning-dg97.png`) med polygoner för rum 1–23 i `data/plan-rooms.json`. Rum 23 är konferensrum: alltid grått, hyrs inte ut och listas aldrig som ledigt (även om feeden skulle säga det).
- Sidan byggs om ungefär varje timme (`revalidate: 3600`). URL kan bytas med `LEDIGA_RUM_CSV_URL`.
- Om CSV inte går att hämta eller parsa används `data/lediga-rum.json`. Bygget får inte falla på feed-fel.

Se [innehållsgranskningen](docs/content-review-2026-10-02.md) för underlag och redaktionella beslut.

Alla 20 artiklar i den första bildsatta serien har publicerats tillsammans. Bloggen har ämnesfilter, sökning, källor och relaterade guider. Codex skapar och publicerar därefter en ny artikel varje fredag enligt [redaktionellt schema](docs/editorial-automation.md), första gången 9 oktober 2026. Lokal körning kräver att datorn och Codex-appen är igång; ingen OpenAI API-nyckel behövs.

## Repository guide

- [`pages/`](pages/), [`components/`](components/) and [`styles/`](styles/): website pages and UI.
- [`data/lediga-rum.json`](data/lediga-rum.json) and [`data/plan-rooms.json`](data/plan-rooms.json): vacancy fallback and floor-plan geometry.
- [`content/`](content/): editorial content.
- [`blog_generator/`](blog_generator/): supporting content-generation tooling.
- [`ADMIN_SETUP.md`](ADMIN_SETUP.md): administration setup.
- [`scripts/`](scripts/): maintenance checks, including image checks.

## Local development

Use the Node.js range in `package.json`, then run `npm ci` and `npm run dev`. Build with `npm run build`. Configuration and local data should remain specific to the environment where the site runs.

## Stabilisering

Den publika sajten prioriteras. Ofärdiga funktioner är pausade; se [ADMIN_SETUP.md](ADMIN_SETUP.md) för aktiva funktioner, adminvariabler och verifiering. Kör `npm run lint`, `npm test`, `npm run test:images`, `npm run build` och `npm run test:smoke` före publicering.
