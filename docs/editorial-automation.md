# Publiceringskö för DG97 Kontorsguiden

## Upplägg

20 färdiga svenska artiklar med befintliga miljöbilder från DG97 ligger i `content/posts/`. Publiceringsordningen finns i `data/editorial-schedule.json`. Artiklarna har `draft: true` och ingår inte i publik blogg, API eller sitemap innan de släpps.

Den första artikeln är planerad till **7 oktober 2026**. Codex kontrollerar kön dagligen klockan 09.00 i Europe/Stockholm. Varje släpp följs av ett slumpat uppehåll på 4, 5 eller 6 kalenderdagar. Vid en missad körning släpps högst en artikel nästa gång; nytt intervall räknas från den körningen. Serien tar ungefär tre månader. När kön är slut skapar eller publicerar schemat inget mer.

Schemat körs som en återkommande uppföljning i denna Codex-chatt. Datorn måste vara på och Codex-appen igång för arbetet med lokala filer. Det kan ändras eller stoppas via appens schemalagda uppgifter. Detta är inte en serverbaserad cron som körs när datorn är avstängd.

Inget anrop till OpenAI API görs. Projektets API-nycklar och den äldre Python-generatorn används inte. Webbplatsens pausade publicerings- och genererings-API:er återaktiveras inte.

## Körning

1. Arbeta i detta repo på `main`. Kontrollera först Git-status och eventuell ofärdig publicering från föregående körning. Rör inte användarens andra ändringar, inklusive `.vscode/settings.json`.
2. Hämta aktuell remote och uppdatera med en vanlig fast-forward endast om det kan göras utan att påverka användarens filer. Skriv inte över lokala ändringar. Vid konflikt eller oklart ägarskap, avbryt och be om hjälp.
3. Återuppta ett redan förberett men opushat släpp före ett nytt. Om artikel och schemastat ändrats av föregående körning, verifiera och färdigställ samma släpp. Kontrollera också om föregående push redan finns på remote. Släpp inte ytterligare en artikel som återhämtning.
4. Kontrollera `node scripts/editorial-schedule.mjs status`. Om `due` är falskt och ingen tidigare publicering återstår, avsluta utan ändringar eller statusmeddelande.
5. När `due` är sant, kontrollera nästa artikel och dess DG97-länkar. Artiklarna ska inte ges nya obestyrkta priser, tjänster eller verksamhetspåståenden.
6. Kör `node scripts/editorial-schedule.mjs release`. Kommandot släpper exakt en artikel, sätter dess faktiska publiceringsdatum, tar bort den från kön och sparar nästa slumpade datum. En andra körning samma dag släpper inget nytt.
7. Kör `npm run lint`, `npm test`, `npm run test:images`, `npm run build` och `npm run test:smoke`. Om någon kontroll misslyckas, pusha inte; behåll arbetet och rapportera felet så samma släpp kan slutföras senare.
8. Committa och pusha endast den släppta artikelns Markdownfil, `data/editorial-schedule.json` och byggens uppdaterade `public/sitemap-0.xml` till `main`. Inga andra utkast ändras. Använd aldrig force-push, hård återställning eller en allmän `git add .`.
9. Bekräfta pushen och kontrollera tillgänglig deployment-status. Meddela artikel, länk, commit och nästa datum när ett släpp har gjorts, eller rapportera ett fel som kräver åtgärd. En push är inte i sig en bekräftelse på lyckad Vercel-deployment.

Användaren har begärt automatisk, utspridd publicering av denna färdiga serie. Det tidigare förslaget att skapa nya granskningsutkast har därför ersatts. Skapa inte ytterligare artiklar eller aktivera API-generering inom detta schema.

## Redaktionella principer

Texterna har egna frågor, exempel och praktiska underlag. Språk och struktur varierar utan påhittade personliga erfarenheter, intervjuer eller kundhistorier. DG97 Kontorsguiden är avsändare. Ingen text tillskrivs en person som påstås ha skrivit den för hand.

Bilderna kommer från projektets befintliga DG97-foton och används som miljöbilder. De är inte besked om lediga rum, möblering i ett specifikt erbjudande eller vilken service som ingår. Artiklarna hänvisar till huvudwebbplatsen för aktuella verksamhetsuppgifter.

Varje artikel har en egen begriplig slug. Det finns inga extra kopior för olika orter eller sökordsvarianter. Slumpade släppdatum är en redaktionell takt, inte ett löfte om bättre Google-ranking. Läsvärde och riktiga sakuppgifter prioriteras.

## Artiklar i serien

1. [Kontorsvisning: frågorna som är lätta att glömma](../content/posts/checklista-infor-kontorsvisning.md) · 402 ord
2. [Coworking eller eget rum? Utgå från jobbet, inte etiketten](../content/posts/coworking-eller-eget-kontorsrum.md) · 400 ord
3. [Hybridteamets kontor börjar med kalendern](../content/posts/planera-kontoret-for-hybridteam.md) · 387 ord
4. [Var tar man samtalet när någon annan behöver tystnad?](../content/posts/tysta-zoner-och-telefonsamtal.md) · 368 ord
5. [Två kontorsofferter på bordet: gör dem jämförbara](../content/posts/jamfor-kontorsofferter.md) · 404 ord
6. [Flytta det lilla företaget utan att tappa bort vardagen](../content/posts/flytta-litet-foretag-till-kontorshotell.md) · 401 ord
7. [Första veckan på nytt kontor: gör det lätt att hitta rätt](../content/posts/forsta-veckan-pa-nytt-kontor.md) · 381 ord
8. [Ett bra kundmöte börjar innan någon sätter sig](../content/posts/motesrum-for-kundmoten.md) · 377 ord
9. [Digitala möten: testa platsen, inte bara länken](../content/posts/digitala-moten-fran-kontoret.md) · 370 ord
10. [Konsultteamets kontor behöver fungera mellan uppdragen](../content/posts/kontor-for-konsultteam.md) · 396 ord
11. [Kontor för två: börja med hur ni delar dagen](../content/posts/kontor-for-tva-personer.md) · 366 ord
12. [När teamet växer: är det rummet eller rutinen som är för liten?](../content/posts/nar-teamet-vaxer-ur-kontoret.md) · 400 ord
13. [Förvaring på delat kontor: ge sakerna en bestämd plats](../content/posts/forvaring-pa-delat-kontor.md) · 384 ord
14. [Ta emot besökare utan att någon behöver leta efter er](../content/posts/ta-emot-besokare-pa-kontoret.md) · 375 ord
15. [Kontorsdagen i Stockholm: planera hela vägen fram](../content/posts/planera-kontorsdagen-i-stockholm.md) · 356 ord
16. [Ge koncentrationen en plats i kontorsdagen](../content/posts/plats-for-koncentration-pa-kontoret.md) · 383 ord
17. [Det gemensamma köket behöver några enkla vanor](../content/posts/gemensamt-kok-pa-kontoret.md) · 391 ord
18. [En workshop som leder vidare behöver ett tydligt uppdrag](../content/posts/planera-workshop-pa-kontoret.md) · 369 ord
19. [Vad berättar en kontorsbild, och vad behöver du se på plats?](../content/posts/kontorsbilder-och-visning.md) · 366 ord
20. [Har kontoret blivit som ni tänkte? Följ upp med rätt frågor](../content/posts/utvardera-kontoret-efter-inflyttning.md) · 397 ord
