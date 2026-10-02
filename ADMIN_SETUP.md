# DG97: drift och administration

Den publika webbplatsen körs på Vercel-projektet `dg-97`, kopplat till `Jakeminator123/DG97` och produktionsbranchen `main`. Produktionsdomänen är https://www.dg97.org.

## Aktiva funktioner

- Publika informationssidor, bilder, priser och kontaktuppgifter.
- Blogg: Markdown i `content/posts/`. Startsidan, bloggindex och artiklar byggs från samma innehåll vid deployment. Ändringar publiceras via GitHub.
- Kontaktformulär: öppnar ett mejlutkast till `hej@dg97.se`. Besökaren måste skicka mejlet i sitt e-postprogram. Ingen leverans bekräftas av servern.
- Google Maps: inbäddad adresskarta utan API-nyckel. Externa kart- och bokningstjänster har egna driftsberoenden; telefon och mejl finns som kontaktalternativ.
- Admin: valfri, endast läsning av publicerade blogginlägg.

## Pausade funktioner

Företagsportalen, nyhetsbrevet, AI-generering, schemaläggning, serverbaserad publicering, bildhantering och innehållsredigering är pausade. API:erna svarar med tydliga fel och gör inga filskrivningar, externa publiceringar eller mejlutskick. Gamla demo-inloggningar fungerar inte.

Ingen Vercel-cron är definierad. Pythonverktygen i `blog_generator/` är separata lokala verktyg och startas aldrig av sajten. Återaktivering kräver en ny implementation med varaktig lagring, säker autentisering och fungerande bakgrundsjobb/mejltjänst. Använd inte Vercels lokala filsystem som databas.

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
