# DG97: drift och administration

Den publika webbplatsen körs på Vercel-projektet `dg-97`, kopplat till `Jakeminator123/DG97` och produktionsbranchen `main`. Produktionsdomänen är https://www.dg97.org.

## Aktiva funktioner

- Stödsajt för DG97 Kontorshotell: hero, blogg, förfrågan och CTA till dg97.se. Priser och lediga rum finns på `/lediga-rum` plus daterade räkneexempel; `/lediga-rum` uppdateras från arket *Tillgänglighet DG97*.
- Blogg: Markdown i `content/posts/`. Startsidan, bloggindex och artiklar byggs från samma innehåll vid deployment.
- Kontaktformulär sparar leads i Neon (`DATABASE_URL`) med honeypot och IP-hashad rate limit. Admin `/admin` listar inkomna rader.
- Visning bokas även på `https://www.dg97.se/kontakt/`.

## Neon via Vercel Marketplace

Projektet använder redan Neon-databasen **dg97-members** (Vercel-teamet *jakeminator123's projects*). Förfrågningar ligger i tabellen `public.leads` (se `db/leads.sql`).

Om preview saknar `DATABASE_URL`:

1. Öppna [Vercel Dashboard](https://vercel.com) → team **jakeminator123's projects** → projekt **dg-97**.
2. Gå till **Storage** (eller **Marketplace** → Neon).
3. Koppla den befintliga Neon-resursen till **Preview** (och Production om den inte redan är kopplad).
4. Kontrollera att `DATABASE_URL` syns under **Settings → Environment Variables** för Preview.
5. **Redeploy** preview-branchen. Dela inte connection string i chatt eller git.

Valfri extra variabel: `LEAD_IP_SALT` (hashar avsändar-IP). Utan den används `ADMIN_SESSION_SECRET` eller en intern fallback.

## Mejlnotis för förfrågningar (Resend)

När en förfrågan sparats i Neon skickas ett mejl till `hej@dg97.se` från `noreply@dg97.org`, med **Reply-To** = besökarens e-post. Utan `RESEND_API_KEY` sparas raden som vanligt och besökaren får inget fel.

Det finns ingen mejlleverantör i repot sedan tidigare. Nyhetsbrevet är pausat. `dg97.org` är registrerad hos Vercel och använder redan `ns1.vercel-dns.com` / `ns2.vercel-dns.com` — DNS-poster för Resend kan därför läggas i Vercel.

**Marketplace-installationen kan inte göras från agenten** (ingen Resend-integration finns, Vercel CLI är utloggad). Jakob klickar:

1. Öppna [Vercel](https://vercel.com) → team **jakeminator123's projects**.
2. **Marketplace** (eller **Integrations**) → sök **Resend** → **Add** / **Install**.
3. Koppla resursen till projektet **dg-97**, miljöerna **Production** och **Preview**.
4. I Resend: **Domains** → **Add domain** → `dg97.org`.
5. Lägg DNS-posterna Resend visar (SPF/DKIM, ev. MX/DMARC):
   - Vercel → **Domains** → **dg97.org** → **DNS** → **Add** (samma värden som Resend ger).
   - Om Marketplace erbjuder att skriva posterna automatiskt: acceptera det.
6. Vänta tills domänen är **Verified** i Resend.
7. Kontrollera att `RESEND_API_KEY` syns under **dg-97 → Settings → Environment Variables** (Production + Preview). Dela inte nyckeln.
8. **Redeploy** production (och ev. preview).

Manuell reservplan: skapa API-nyckel på [resend.com](https://resend.com) → Vercel → **dg-97** → **Settings → Environment Variables** → `RESEND_API_KEY` (Sensitive) för Production och Preview. Verifiera sedan `dg97.org` i Resend och lägg samma DNS-poster som ovan.

Valfritt: `LEAD_NOTIFY_FROM` (standard `DG97 Kontorshotell <noreply@dg97.org>`) och `LEAD_NOTIFY_TO` (standard `hej@dg97.se`).

## Pausade funktioner

Företagsportalen, nyhetsbrevet, AI-generering, schemaläggning, serverbaserad publicering, bildhantering och innehållsredigering är pausade. API:erna svarar med tydliga fel och gör inga filskrivningar, externa publiceringar eller mejlutskick. Gamla demo-inloggningar fungerar inte.

Ingen Vercel-cron är definierad. Pythonverktygen i `blog_generator/` är separata lokala verktyg och startas aldrig av sajten. Återaktivering av webbplatsens pausade API:er kräver en ny implementation med varaktig lagring, säker autentisering och fungerande bakgrundsjobb/mejltjänst. Använd inte Vercels lokala filsystem som databas.

Den första serien med 20 bildsatta artiklar har publicerats tillsammans. Codex skapar och publicerar sedan en ny artikel per vecka, fredagar 09.00 Europe/Stockholm från 9 oktober 2026. Det är separat från webbplatsens API:er och kräver ingen OpenAI API-nyckel. Datorn och Codex-appen måste vara igång. Se [redaktionellt schema](docs/editorial-automation.md) för körning, faktakrav, återhämtning och artikelöversikt.

## Valfri admininloggning

Sätt dessa servervariabler i den miljö där admin behövs:

```env
ADMIN_USERNAME=<användarnamn>
ADMIN_PASSWORD=<starkt lösenord>
ADMIN_SESSION_SECRET=<slumpmässigt värde med minst 32 tecken>
```

Utan alla tre är admininloggningen avstängd. Sessioner är signerade, gäller högst 24 timmar och lagras endast i HttpOnly-cookie med SameSite=Strict och Secure i produktion. Byte av sessionshemlighet återkallar tidigare sessioner. Inga standardlösenord eller gamla base64-token accepteras.

Den publika sajten behöver inte `OPENAI_API_KEY`, `GITHUB_TOKEN` eller `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Dessa gamla nycklar kan tas bort från Vercel om inget annat använder dem. Inga nycklar ändras automatiskt av denna upprensning.

## Lediga rum (live-ark)

Jakob/Oscar ändrar utbudet i Google-arket **Tillgänglighet DG97**:

1. Redigera **Blad1** / källfliken som vanligt.
2. Fliken **Publik** är den publicerade vyn: `rum,kvm,status,ledigt_fran,pris_exkl_moms,available,publish`.
3. Sätt `available=true` och `publish=true` för rum som ska synas. Rum 1 ska ha `publish=false`.
4. `kvm` med punkt (13.5). `ledigt_fran` som `yyyy-mm-dd` eller tomt (= ledigt nu).
5. Arkets *Publicera på webben*-CSV läses av `getStaticProps`. Sidan uppdateras inom cirka en timme (ISR 3600).

Valfri servervariabel, med publicerad CSV som standard:

```env
LEDIGA_RUM_CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vQsetIg9Tp7-AAan7ucev64Hqp7Mi4Di3FUFl3pldsMiaWRnqTdkOyYW1GgNgLCJHgsukQ1kKL-plx7/pub?gid=345753643&single=true&output=csv
```

Om hämtning eller parse misslyckas används `data/lediga-rum.json`. Bygget ska inte falla. Planens geometri ligger i `data/plan-rooms.json` (rum 1–23 på planskissen `public/images/planritning-dg97.png`); rum 23 är konferensrum och visas aldrig som ledigt.

## Verifiering och deployment

```sh
npm ci
npm run lint
npm test
npm run test:images
npm audit --omit=dev --audit-level=moderate
npm run build
npm run test:smoke
```

Smoke-testet startar en separat produktionsserver på loopback port 3107 med testuppgifter och kör publika sidor, alla blogginlägg, 404-svar, autentisering och pausade API:er. Det skickar inga mejl eller GitHub-publiceringar.

GitHub Actions kör samma kontroller för PR och `main`. Vercel bygger preview för reparationsbranchen; merge till `main` publicerar förändringen på produktionsdomänen. Det finns inga databasändringar.
