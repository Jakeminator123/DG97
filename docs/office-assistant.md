# DG97:s rumsassistent

Den publika chatten finns på guidens vanliga sidor. Den använder endast offentliga kontorsuppgifter och den aktuella publicerade rumsfeeden. Den kan inte göra bokningar, läsa medlemskonton eller ändra några uppgifter. Priser och privata frågor besvaras med en fast hänvisning till DG97. De äldre genererings-, publicerings-, synergi- och schemaläggnings-API:erna förblir pausade. Det befintliga redaktionella veckoschemat är separat och har inte ändrats.

## Drift och kostnadstak

- `OFFICE_ASSISTANT_ENABLED=true` aktiverar endast denna assistent. `OPENAI_API_KEY`, `DATABASE_URL` och `OFFICE_ASSISTANT_IP_SALT` hålls på servern, utan `NEXT_PUBLIC_`-prefix. De ska lagras som hemligheter i Vercels produktion, inte i Git eller förhandsgranskningsbyggen.
- Chatten är begränsad till högst **5 USD per kalendermånad i Europe/Stockholm**, gemensamt för alla instanser. Varje anrop reserverar en konservativ kostnad innan OpenAI kontaktas. Om databasen inte svarar görs inget betalt anrop. Ett osäkert resultat behåller hela reservationen; inga automatiska försök upprepas.
- Modellen är fast `gpt-4.1-mini-2025-04-14`, med högst 400 utdata-token, högst sex korta historikmeddelanden och en begränsad inmatningsstorlek. Kontrollera [OpenAI:s aktuella prislista](https://developers.openai.com/api/docs/models/gpt-4.1-mini) innan modellen eller prisantagandena ändras. Reservationen är 7 040 mikro-USD per försök; känd faktisk användning återför oanvänd kostnad exakt en gång.
- Högst 24 AI-frågor per besökar-IP under 24 timmar. IP-adressen lagras som ett saltat HMAC-värde; databasen lagrar inte frågorna eller svaren. Anrop använder `store:false`. Texten skickas till OpenAI, vilket förklaras i gränssnittet före första frågan.
- När AI-budgeten är slut eller tjänsten inte kan användas finns kostnadsfria svar utifrån den offentliga guiden kvar. Detta visas tydligt.
- Gränsen gäller denna assistents OpenAI-anrop. Den är inte ett gemensamt tak för andra appar som använder samma OpenAI-konto, Vercels hosting eller andra tjänster.

## Databas

En separat databas har skapats för DG97 på den befintliga kostnadsfria Neon-planen via Vercel. Projekt: `sweet-grass-63259296`, produktionsgren: `br-dry-flower-bacn0ars`, region Frankfurt. Inga andra projektdatabaser används.

Schemat versionshanteras i `db/office-assistant.sql`. Tabellen med månadens budget låses när ett anrop reserveras, så samtidiga serverinstanser inte kan passera gränsen. RLS är aktivt och PUBLIC saknar tabell- och funktionsbehörigheter.

`scripts/verify-assistant-budget.mjs` kör mot den separat förankrade testgrenen `br-raspy-frost-ba4f7yt6`. Det vägrar produktionshosten. Det verifierar kostnadstak, dubbla reservationer, återföring, IP-gräns och två samtidiga HTTP-anrop. Transaktionstester rullas tillbaka; en testpost med nollkostnad behålls på testgrenen. Ingen verklig text skickas till OpenAI under databastestet.

## Lokal verifiering

Använd projektets Node 24-version genom Volta. Lägg egna lokala servervärden i den ignorerade `.env.local`. `DG97_LOCAL_VERIFICATION=true` tillåter lokala browseranrop till ett produktionsbygge när det inte körs på Vercel. Den variabeln ska inte sättas i Vercel. För riktiga ändringar: lint, tester med fyra workers, bildkontroll, produktionsbygge och smoke-test. Verifiera därefter förhandsvisningen och den publicerade sajten.

Runway användes en gång för att rensa den tidigare planbilden (20 krediter). Den aktuella interaktiva översikten använder en ren SVG i stället för rasterbilden. Den omarkerade vänstra flygeln visas inte. Samtliga 23 ursprungliga rumspolygoner finns kvar i samma koordinatsystem; ytterkonturen i `lib/plan-overview.js` är dekorativ och orienterande. Kontorsrum 1–22 markeras blått, och endast publicerade lediga rum grönt. Konferensrum 23 markeras grått med ränder och hyrs inte ut, även om en felaktig feed skulle ange det som ledigt. Ritningen är en visuell översikt, inte en ny byggnadsritning. Rumsval öppnar en tillgänglig bilddialog med verkliga DG97-foton som uttryckligen är exempelbilder, utan påstådd koppling till rumsnummer. Inga fler bildgenereringsanrop behövdes.
