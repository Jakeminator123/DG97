# Veckovis publicering för DG97 Kontorsguiden

## Status

De 20 bildsatta artiklarna i den första serien publiceras tillsammans den 2 oktober 2026, på användarens begäran. Tillsammans med de tidigare guiderna finns 29 publika artiklar. Den tidigare kön med slumpade släpp är ersatt av veckovis skapande och publicering av en ny artikel.

Den befintliga uppföljningen i denna Codex-chatt körs **fredagar klockan 09.00 i Europe/Stockholm**, med första nya artikel planerad till **9 oktober 2026**. `data/editorial-schedule.json` håller nästa datum och publicerad historik. Efter en lyckad artikel räknas minst sju dagar till nästa. Missade veckor ger högst en ny artikel vid nästa körning, ingen serie av eftersläpande inlägg.

Datorn måste vara på och Codex-appen igång för arbetet med lokala filer. Uppgiften kan ändras eller stoppas via appens schemalagda uppgifter. Codex skapar texten direkt; inga anrop görs med projektets OpenAI API-nyckel och inga nycklar ändras. Webbplatsens pausade genererings- och publicerings-API:er och äldre Python-generator återaktiveras inte.

## Körning

1. Arbeta i detta repo på `main`. Kontrollera Git-status och tidigare ofärdiga veckoinlägg innan du börjar. Rör inte användarens andra ändringar, inklusive `.vscode/settings.json`.
2. Hämta aktuell remote och uppdatera med en vanlig fast-forward endast om det kan ske utan att påverka användarens filer. Ingen force-push eller hård återställning. Vid konflikt eller oklart ägarskap, bevara arbetet och be om hjälp.
3. Återuppta ett redan förberett men opushat inlägg före ett nytt. Identifiera agentens tidigare arbete genom Markdownens `automation: dg97-weekly-guide`, schemastaten och Git-diffen. Kontrollera också om föregående push redan finns på remote. Färdigställ samma inlägg och skapa inget ytterligare som återhämtning.
4. Kör `node scripts/editorial-schedule.mjs status`. Om `due` är falskt och ingen tidigare publicering återstår, avsluta utan ändringar eller statusmeddelande.
5. Läs befintliga rubriker och relevanta artiklar, välj ett nytt ämne och kontrollera primärkällor. Skapa en artikel med en egen fråga och ett konkret resultat för läsaren. Undvik varianter av samma artikel eller ortssidor för enbart söktrafik.
6. Skriv och kontrollera artikel, metadata, bild, källor och interna länkar enligt kraven nedan. Behåll `draft: true` under arbetet. Publicering är godkänd av användaren för en kvalitetskontrollerad artikel per vecka. När den är färdig, sätt `draft: false` och dagens datum.
7. Kör `node scripts/editorial-schedule.mjs record <slug>` för att registrera artikeln. Det validerar grundmetadata, bild, källor och att veckan är förfallen, och sparar nästa datum. Upprepad registrering av samma slug ändrar inget. Detta är en teknisk kontroll, inte en automatisk faktagranskning.
8. Kör `npm run lint`, `npm test`, `npm run test:images`, `npm run build` och `npm run test:smoke`. Verifiera att den nya sidan, bilden, källorna, relaterade guider och länkar till DG97 fungerar. Om någon kontroll misslyckas, pusha inte; bevara samma inlägg och rapportera felet för senare återhämtning.
9. Committa och pusha endast den nya Markdownfilen, `data/editorial-schedule.json` och byggens uppdaterade `public/sitemap-0.xml` till `main`. Lägg inte till användarens filer och använd inte `git add .`. Om en egen publicering måste korrigeras senare ska dess datum motsvara det faktiska släppet.
10. Bekräfta remote, CI och Vercels deployment. Efter lyckad publicering, meddela artikelns länk, commit och nästa datum. Vid fel, rapportera vad som behöver åtgärdas. En push bekräftar inte i sig att sidan finns live.

## Artikelkrav

- Svensk, naturlig och varierad text med en tydlig huvudfråga och konkreta råd, en checklista, en mall eller ett genomarbetat jämförelseunderlag. Cirka 400–700 ord är en riktlinje när ämnet behöver det, inget SEO-mål.
- Kort och unik slug. Läs närliggande guider först och tillför något de inte redan besvarar. Ändra inte äldre publiceringsdatum för att få innehåll att verka nytt.
- Frontmatter: `title`, dagens `date` och `modifiedDate`, `author: DG97 Kontorsguiden`, `excerpt`, en av kategorierna i `config/editorial.js`, `automation: dg97-weekly-guide`, bild och bildbeskrivning samt `sources` med faktiska HTTPS-källor. Vid färdig publicering: `draft: false`.
- Använd ett befintligt, relevant foto från `public/images/`. Inspektera bilden innan du beskriver den och använd korrekt alt-text. Skapa inte påhittade bilder av DG97:s lokaler.
- Kontrollera aktuella DG97-uppgifter på `www.dg97.se`. Övriga faktapåståenden ska vid behov stödjas av relevanta primärkällor. Ange och länka källorna; kopiera inte deras texter. Skilj egna praktiska råd från verifierade verksamhetsuppgifter.
- Inga fasta eller påhittade priser, rabatter, lediga rum, certifieringar, svarstider eller löften om avtal, service, utrustning eller säkerhet. Om en uppgift inte går att styrka, ta bort den eller formulera en fråga att ställa till DG97.
- Inga påhittade egna erfarenheter, kundcitat, intervjuer, personer eller författarbiografier. Ingen medicinsk, juridisk eller finansiell rådgivning. Tillskriv inte texten en människa som påstås ha skrivit den för hand. AI-stöd beskrivs på sidan Om guiden.
- Länka naturligt till befintliga, publika relaterade guider och till `https://www.dg97.se/` eller kontaktvägen där det är användbart. Kontrollera att de interna artikellänkarna finns.

Ämnesfilter och relaterade guider använder kategorin automatiskt. Källor i frontmatter visas som vidare läsning. DG97-rutans länkar har kampanjparametrar för uppföljning på huvudwebbplatsen; detta installerar ingen egen analysfunktion och ger ingen garanti om Google-ranking.

## Första serien: publicerad tillsammans

1. [Kontorsvisning: frågorna som är lätta att glömma](../content/posts/checklista-infor-kontorsvisning.md)
2. [Coworking eller eget rum? Utgå från jobbet, inte etiketten](../content/posts/coworking-eller-eget-kontorsrum.md)
3. [Hybridteamets kontor börjar med kalendern](../content/posts/planera-kontoret-for-hybridteam.md)
4. [Var tar man samtalet när någon annan behöver tystnad?](../content/posts/tysta-zoner-och-telefonsamtal.md)
5. [Två kontorsofferter på bordet: gör dem jämförbara](../content/posts/jamfor-kontorsofferter.md)
6. [Flytta det lilla företaget utan att tappa bort vardagen](../content/posts/flytta-litet-foretag-till-kontorshotell.md)
7. [Första veckan på nytt kontor: gör det lätt att hitta rätt](../content/posts/forsta-veckan-pa-nytt-kontor.md)
8. [Ett bra kundmöte börjar innan någon sätter sig](../content/posts/motesrum-for-kundmoten.md)
9. [Digitala möten: testa platsen, inte bara länken](../content/posts/digitala-moten-fran-kontoret.md)
10. [Konsultteamets kontor behöver fungera mellan uppdragen](../content/posts/kontor-for-konsultteam.md)
11. [Kontor för två: börja med hur ni delar dagen](../content/posts/kontor-for-tva-personer.md)
12. [När teamet växer: är det rummet eller rutinen som är för liten?](../content/posts/nar-teamet-vaxer-ur-kontoret.md)
13. [Förvaring på delat kontor: ge sakerna en bestämd plats](../content/posts/forvaring-pa-delat-kontor.md)
14. [Ta emot besökare utan att någon behöver leta efter er](../content/posts/ta-emot-besokare-pa-kontoret.md)
15. [Kontorsdagen i Stockholm: planera hela vägen fram](../content/posts/planera-kontorsdagen-i-stockholm.md)
16. [Ge koncentrationen en plats i kontorsdagen](../content/posts/plats-for-koncentration-pa-kontoret.md)
17. [Det gemensamma köket behöver några enkla vanor](../content/posts/gemensamt-kok-pa-kontoret.md)
18. [En workshop som leder vidare behöver ett tydligt uppdrag](../content/posts/planera-workshop-pa-kontoret.md)
19. [Vad berättar en kontorsbild, och vad behöver du se på plats?](../content/posts/kontorsbilder-och-visning.md)
20. [Har kontoret blivit som ni tänkte? Följ upp med rätt frågor](../content/posts/utvardera-kontoret-efter-inflyttning.md)
