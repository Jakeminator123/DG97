# DG97 Kontorsguiden

Separat inspirations- och guidesajt från DG97 om kontorshotell och arbetsliv i Stockholm. Sajten på `www.dg97.org` har egna guider och checklistor. Aktuella rum, priser, visningar och förfrågningar hänvisas till huvudwebbplatsen `www.dg97.se`.

## Project status

This is the repository connected to the Vercel project `dg-97` in the account review of 13 September 2026. It now maintains the separate guide site; it does not replace DG97's main website. Other office-site design drafts should be evaluated separately before any code is moved here.

## Innehåll och hänvisningar

- Håll guiden användbar i sig: jämförelser, frågor inför visningar och praktiska råd. Skapa inte kopior eller ortssidor enbart för söktrafik.
- Ange DG97 som avsändare. Presentera inte sajten som en oberoende jämförelsetjänst.
- Publicera inga obekräftade priser, rabatter, lediga rum, svarstider, avtalsperioder, betyg, certifieringar eller kundberättelser.
- Låt förfrågningar gå till `https://www.dg97.se/kontakt/`. Gemensamma adresser och namn finns i `config/site.js`.
- Guider använder egna canonical-adresser på guidens domän. Strukturerad data beskriver innehållet, utan erbjudanden, recensioner eller bokningsbekräftelser.
- Sätt `draft: true` i frontmatter för att undanta ett inlägg från publika sidor, API och sitemap. Ange `modifiedDate` när en artikel uppdateras.
- Den äldre bloggeneratorn ska inte användas för automatisk publicering utan faktagranskning. Muterande admin-API:er är fortsatt pausade.

Se [innehållsgranskningen](docs/content-review-2026-10-02.md) för underlag och redaktionella beslut.

Alla 20 artiklar i den första bildsatta serien har publicerats tillsammans. Bloggen har ämnesfilter, sökning, källor och relaterade guider. Codex skapar och publicerar därefter en ny artikel varje fredag enligt [redaktionellt schema](docs/editorial-automation.md), första gången 9 oktober 2026. Lokal körning kräver att datorn och Codex-appen är igång; ingen OpenAI API-nyckel behövs.

## Repository guide

- [`pages/`](pages/), [`components/`](components/) and [`styles/`](styles/): website pages and UI.
- [`content/`](content/): editorial content.
- [`blog_generator/`](blog_generator/): supporting content-generation tooling.
- [`ADMIN_SETUP.md`](ADMIN_SETUP.md): administration setup.
- [`scripts/`](scripts/): maintenance checks, including image checks.

## Local development

Use the Node.js range in `package.json`, then run `npm ci` and `npm run dev`. Build with `npm run build`. Configuration and local data should remain specific to the environment where the site runs.

## Stabilisering

Den publika sajten prioriteras. Ofärdiga funktioner är pausade; se [ADMIN_SETUP.md](ADMIN_SETUP.md) för aktiva funktioner, adminvariabler och verifiering. Kör `npm run lint`, `npm test`, `npm run test:images`, `npm run build` och `npm run test:smoke` före publicering.
