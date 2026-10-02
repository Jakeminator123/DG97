# DG97: drift och administration

Den publika webbplatsen körs på Vercel-projektet `dg-97`, kopplat till `Jakeminator123/DG97` och produktionsbranchen `main`. Produktionsdomänen är https://www.dg97.org.

## Aktiva funktioner

- Separat guidesajt med jämförelser, artiklar, frågor inför kontorsvalet och miljöbilder. Priser och lediga rum publiceras inte här.
- Blogg: Markdown i `content/posts/`. Startsidan, bloggindex och artiklar byggs från samma innehåll vid deployment. Ändringar publiceras via GitHub.
- Kontakt och visningar: länkar till `https://www.dg97.se/kontakt/`. Guiden har inget eget kontaktformulär, ingen inbäddad karta och inget globalt bokningsskript.
- Admin: valfri, endast läsning av publicerade blogginlägg.

## Pausade funktioner

Företagsportalen, nyhetsbrevet, AI-generering, schemaläggning, serverbaserad publicering, bildhantering och innehållsredigering är pausade. API:erna svarar med tydliga fel och gör inga filskrivningar, externa publiceringar eller mejlutskick. Gamla demo-inloggningar fungerar inte.

Ingen Vercel-cron är definierad. Pythonverktygen i `blog_generator/` är separata lokala verktyg och startas aldrig av sajten. Återaktivering av webbplatsens pausade API:er kräver en ny implementation med varaktig lagring, säker autentisering och fungerande bakgrundsjobb/mejltjänst. Använd inte Vercels lokala filsystem som databas.

En förberedd serie med 20 bildsatta artiklar publiceras automatiskt via Codex med 4–6 dagars slumpat mellanrum. Detta är separat från webbplatsens API:er och kräver ingen OpenAI API-nyckel. Datorn och Codex-appen måste vara igång. Se [redaktionellt schema](docs/editorial-automation.md) för körning, återhämtning och artikelöversikt. Inga nya artiklar genereras av schemat.

## Valfri admininloggning

Sätt dessa servervariabler i den miljö där admin behövs:

```env
ADMIN_USERNAME=<användarnamn>
ADMIN_PASSWORD=<starkt lösenord>
ADMIN_SESSION_SECRET=<slumpmässigt värde med minst 32 tecken>
```

Utan alla tre är admininloggningen avstängd. Sessioner är signerade, gäller högst 24 timmar och lagras endast i HttpOnly-cookie med SameSite=Strict och Secure i produktion. Byte av sessionshemlighet återkallar tidigare sessioner. Inga standardlösenord eller gamla base64-token accepteras.

Den publika sajten behöver inte `OPENAI_API_KEY`, `GITHUB_TOKEN` eller `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Dessa gamla nycklar kan tas bort från Vercel om inget annat använder dem. Inga nycklar ändras automatiskt av denna upprensning.

## Verifiering och deployment

```sh
npm ci
npm run lint
npm test
npm run test:images
npm audit --audit-level=moderate
npm run build
npm run test:smoke
```

Smoke-testet startar en separat produktionsserver på loopback port 3107 med testuppgifter och kör publika sidor, alla blogginlägg, 404-svar, autentisering och pausade API:er. Det skickar inga mejl eller GitHub-publiceringar.

GitHub Actions kör samma kontroller för PR och `main`. Vercel bygger preview för reparationsbranchen; merge till `main` publicerar förändringen på produktionsdomänen. Det finns inga databasändringar.
