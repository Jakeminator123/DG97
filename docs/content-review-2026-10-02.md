# Innehållsgranskning, 2 oktober 2026

## Syfte

DG97 Kontorsguiden är en separat guidesajt med DG97 som tydlig avsändare. Den ska hjälpa besökare att bedöma kontorslösningar och leda intresserade vidare till huvudwebbplatsen. Sidan ska vara användbar även för den som inte kontaktar DG97.

## Underlag

Granskningen jämförde den befintliga koden och artiklarna med DG97:s publika [startsida](https://www.dg97.se/), [presentation](https://www.dg97.se/om-oss/) och [kontaktsida](https://www.dg97.se/kontakt/). Adress och verksamhet kunde beläggas där. Webbplatsen är inte ett underlag för ett bindande erbjudande; aktuella priser och villkor måste bekräftas av DG97.

[Googles spamregler](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse) beskriver riskerna med mellansidor, länkar och innehåll som främst skapas för att manipulera ranking. En separat domän garanterar ingen förbättring av huvudwebbplatsens ranking. Relevanta, egna guider och tydliga hänvisningar är den valda inriktningen.

## Uppgifter som ändrats

| Tidigare innehåll | Åtgärd |
| --- | --- |
| Frånpriser och paket från 4 990 kr, samt beräknade priser och rabatter | Prislistor och kalkylator borttagna; hänvisning till aktuell offert på dg97.se |
| 30+ företag, 150+ människor, 15+ branscher | Borttagna eftersom aktuell verifiering saknas |
| Kundcitat, femstjärniga omdömen och sammanvägt betyg 4,8 från 47 recensioner | Borttagna; inget verifierat recensionsunderlag fanns i projektet |
| Miljöcertifiering och prisutmärkelse | Borttagna från publicerat innehåll tills underlag finns |
| Reception 08–18, garanterat svar inom 24 timmar och omedelbar inflyttning | Ersatta med frågor till DG97; inga löften om service eller tillgänglighet |
| Fiberhastighet, obegränsade tjänster och angivna uppsägningstider | Ersatta med frågor om aktuella specifikationer, begränsningar och avtalsvillkor |
| Företagskatalog och grundarroller utan verifierat aktuellt underlag | Ersatta med teamguide respektive presentation av guidesajtens syfte |
| AI-persona som beskrev egna arbetsår, hyresgäster och vardagshändelser | Artiklar omskrivna till praktiska guider utan påstådd förstahandserfarenhet |
| Påstått barnpassningssamarbete, garanterat fungerande kopiator och obekräftade säkerhetsfunktioner | Uppgifterna borttagna och ersatta med kontrollfrågor |
| Artikel om miljardvinster på internetspel | Sparad som opublicerat utkast; saknar relevans och verifierat sakunderlag |
| Länkar till dg97.com och canonical-uppgifter för obefintliga artikelsidor på dg97.se | Korrigerade; artiklarna hör till guidens domän, affärsförfrågningar till dg97.se |
| Schema för priser, lagerstatus, recensioner, bokningsbekräftelse och en obefintlig sökfunktion | Borttaget; schema beskriver endast webbplats, sida, artikel, synliga frågor och bilder |
| Globalt bokningsskript och cookiepanel som beskrev analys utan motsvarande funktion | Bokningsskript borttaget och panelen avmonterad; förfrågningar går till huvudwebbplatsen |

## Publiceringsprincip

Generella råd ska vara tydliga med vad besökaren behöver kontrollera. Bredare formuleringar får inte ersätta en osann uppgift med ett lika osant men vagare löfte. Detaljer om DG97 ska beläggas, medan föränderliga uppgifter hänvisas till huvudwebbplatsen. Bilder används som miljöbilder, inte som besked om lediga rum.

Guiderna har egna canonical-adresser. Att sätta alla canonical-länkar till dg97.se vore missvisande när innehållet är separat och inte finns där. Förändrad domän för guiden måste uppdateras i `config/site.js` före publicering.

Granskningen är gjord mot publika webbkällor och projektet. Den ersätter inte DG97:s bekräftelse av operativa uppgifter. Ändringarna förbereddes först lokalt. Användaren har därefter begärt commit, push och en serie med 20 artiklar. Serien publiceras tillsammans, följd av en ny artikel per vecka enligt det redaktionella schemat.
