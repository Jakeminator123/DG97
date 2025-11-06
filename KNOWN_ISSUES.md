# Kända Buggar och Lösningar

Detta dokument innehåller kända buggar som har upptäckts och åtgärdats i projektet.

## 1. ScrollReveal döljer innehåll på inloggningssidan

**Problem:**

- På `/foretagsportal` inloggningssidan kunde innehållet vara helt vitt/osynligt
- ScrollReveal-komponenten väntar på att elementet ska vara synligt i viewport innan det visas (`useInView` med `margin: "-100px"`)
- Om elementet inte är synligt vid första render kan det stanna osynligt

**Lösning:**

- Tog bort `ScrollReveal` från login-formuläret i `pages/foretagsportal.js`
- Använder nu en vanlig `<div>` istället för animerad komponent
- Innehållet visas nu direkt utan att vänta på scroll-animationer

**Datum:** 2024-12-XX
**Status:** ✅ Fixat

---

## 2. SVG Path undefined error

**Problem:**

- Konsolvarning: `Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "undefined"`
- SVG-path kan bli `undefined` vid SSR (Server-Side Rendering) i Next.js
- Framför allt i `AnimatedLogo` och `AnimatedIcons`-komponenterna

**Lösning:**

- Lagt till `useEffect` för att säkerställa att `d` alltid är definierat även vid SSR i `AnimatedLogo`
- Lagt till konstanter `dPath` och `gPath` för att garantera att `d` aldrig blir `undefined`
- Pre-beräknat path-värden i variabler innan template literals i `CoffeeIcon` och `WiFiIcon`
- Uppdaterat animationerna så att de fungerar både vid SSR och på klienten
- Lagt till `initial` state för att undvika hydration mismatch

**Filer berörda:**

- `components/animations/AnimatedLogo.js`
- `components/animations/AnimatedIcons.js`

**Datum:** 2024-12-XX
**Status:** ✅ Fixat

---

## 3. AnimatedBackground orsakar vit skärm och prestanda-problem

**Problem:**

- `AnimatedBackground` körs på alla sidor via `_app.js` med intensiva oändliga animationer
- Orsakade "blinkande" vid hydration mismatch mellan server och klient
- Vit skärm när animationerna blockerade rendering
- För stora blur-orbs (800px, 600px, 500px, 400px) med `repeat: Infinity`

**Lösning:**

- Exkluderat `/foretagsportal` och `/admin` från `AnimatedBackground`
- Reducerat animationintensitet (opacity från 0.15 till 0.08)
- Lagt till `willChange: "transform"` för bättre prestanda
- Längre animationstider (25s → 30s) för smidigare rörelser
- Kontrollerar `router.pathname` för att undvika rendering på vissa sidor

**Filer berörda:**

- `components/AnimatedBackground.js`
- `pages/_app.js`

**Datum:** 2024-12-XX
**Status:** ✅ Fixat

---

## 4. SectionBackground orsakar flimmer och prestanda-problem

**Problem:**

- `SectionBackground` har oändliga animationer (`repeat: Infinity`) som orsakar flimmer
- Animationer startar med `opacity: 0` vilket skapar synlig "pop-in" effekt
- På admin-sidan och andra kritiska sidor stör animationerna användarupplevelsen
- Elementen flimrar i DOMen när animationerna startar och stoppas

**Lösning:**

- Tagit bort `SectionBackground` från `/admin` sidan helt (precis som `AnimatedBackground`)
- Ändrat `initial={{ opacity: 0 }}` till `initial={{ opacity: 0.25 }}` för att matcha första animeringsvärdet
- För kritiska sidor (som login): använd inte `SectionBackground` alls
- För andra sidor: animationer startar nu smidigt utan synlig "pop-in"

**Filer berörda:**

- `components/SectionBackground.js`
- `pages/admin/index.js`
- `pages/foretagsportal.js`

**Datum:** 2024-12-XX
**Status:** ✅ Fixat

---

## 5. EPERM error vid Next.js build

**Problem:**

- `[Error: EPERM: operation not permitted, open 'C:\Users\...\.next\trace']`
- Fil-låsproblem på Windows när `.next`-mappen är korrupt eller låst

**Lösning:**

- Stänga alla Node-processer
- Ta bort `.next`-mappen manuellt
- Starta om dev-servern

**Kommando för Windows PowerShell:**

```powershell
taskkill /F /IM node.exe
Remove-Item -Recurse -Force .next
npm run dev
```

**Datum:** 2024-12-XX
**Status:** ✅ Fixat (workaround)

---

## 6. Chatbot z-index Problem

**Problem:**

- Chatboten (`components/Chatbot.js`) använde `z-35` vilket är för lågt
- Modaler använder `z-50`, så chatboten hamnade under dem och glasmorfiska element

**Lösning:**

- Ändrat `z-35` till `z-[60]` på både chat-knapp och chat-fönster
- Säkerställt korrekt layering: Footer < Header (z-50) < Modals (z-50) < Chatbot (z-[60]) < D-ID (z-[100])

**Filer berörda:**

- `components/Chatbot.js`

**Datum:** 2024-12-XX
**Status:** ✅ Fixat

---

## 7. Route Abort Error för /om-oss

**Problem:**

- Next.js router avbryter fetching av komponent när navigation avbryts
- Kan orsakas av SSR-problem eller fel i dynamiska imports

**Lösning:**

- Säkerställt att `Founder3DModel` endast körs på klienten (`typeof window !== 'undefined'`)
- Lagt till try-catch runt `useGLTF.preload` för att undvika fel
- Verifierat att `om-oss.js` har korrekt `"use client"` direktiv

**Filer berörda:**

- `components/Founder3DModel.js`
- `pages/om-oss.js`

**Datum:** 2024-12-XX
**Status:** ✅ Fixat

---

## 8. Synergi AI Integration Status

**Status:**

- Synergi-analysen i `/api/synergies/analyze.js` använder för närvarande simulerad AI-analys
- Ingen riktig OpenAI API-integration är implementerad ännu
- API:et simulerar GPT-liknande resonemang med regelbaserad matchning
- Funktionen fungerar men använder inte externa AI-tjänster

**Filer berörda:**

- `pages/api/synergies/analyze.js`

**Datum:** 2024-12-XX
**Status:** ⚠️ Simulerad (fungerar men inte riktig GPT-integration)

---

## Allmänna Best Practices

### Animationer och Performance

- Undvik intensiva oändliga animationer på kritiska sidor (t.ex. login-sidor)
- Använd `willChange` CSS-egenskap för element som animeras ofta
- Överväg att reducera animationer eller inaktivera dem på vissa sidor

### SSR och Hydration

- Säkerställ att alla SVG-path värden är definierade även vid SSR
- Använd `useEffect` för komponenter som behöver klient-specifik logik
- Undvik `Math.random()` i komponenter som renderas på servern
- Pre-beräkna dynamiska värden i variabler innan template literals

### Z-index och Layering

- Säkerställ att bakgrundskomponenter har negativ z-index (`-z-10`)
- Innehållscontainrar bör ha positiv z-index (`z-10`) eller `relative`
- Testa på olika skärmstorlekar för att säkerställa korrekt layering
- Använd konsekvent z-index-hierarki: Footer < Header (z-50) < Modals (z-50) < Chatbot (z-[60]) < D-ID (z-[100])

### Code Cleanup

- Ta bort kommenterad kod regelbundet
- Ta bort oanvända imports
- Undvik dead code paths

---

## 9. Externa Scripts orsakar konsolvarningar

**Problem:**

- `Failed to load resource: net::ERR_BLOCKED_BY_RESPONSE.NotSameOriginAfterDefaultedToSameOriginByCoepUnderstand` - COEP/CORP-problem från externa scripts
- `Uncaught SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported` - Canvas CORS-problem från Agendo booking widget
- `Ensure CORS response header values are valid` - Agendo script blockerad pga CORS headers
- `Datadog Browser SDK: No storage available for session` - Datadog SDK från Agendo widget
- `[LaunchDarkly] LaunchDarkly client initialized` - LaunchDarkly från Agendo widget
- `Could not load content for webpack://_N_E/src/client/components/react-dev-overlay/pages/websocket.ts?34aa` - Webpack source map error i dev mode

**Lösning:**

- Dessa fel kommer från externa scripts (`booking.agendo.io/agendo_loader.js`), inte från projektets kod
- Ändrat Agendo script till dynamisk laddning för att undvika CORS-problem
- Webpack source map fel är ett bekänt problem i Next.js dev mode och kan inte fixas helt
- Dessa fel kan inte fixas helt eftersom de kommer från tredjepartsscripts
- Fel påverkar inte funktionaliteten - de är bara konsolvarningar

**Filer berörda:**

- `pages/_document.js`
- `next.config.js`

**Datum:** 2024-12-XX
**Status:** ⚠️ Känd begränsning (orsakas av externa scripts)

---

## 10. Form Field utan id/name attribute

**Problem:**

- Checkbox-fältet `autoPublish` i admin-sidan saknade `name` attribute
- Browser accessibility checker varnar om form fields utan `id` eller `name`

**Lösning:**

- Lagt till `name="autoPublish"` på checkbox-fältet i admin dashboard
- Alla form fields har nu både `id` och `name` attributes

**Filer berörda:**

- `pages/admin/index.js`

**Datum:** 2024-12-XX
**Status:** ✅ Fixat

---

## Anteckningar

- Om du stöter på liknande problem, kontrollera först om det finns relaterade animationer eller SSR-problem
- Vid whitescreen-problem, kontrollera z-index och om animationer blockerar rendering
- SVG-path fel kan oftast lösas genom att säkerställa att `d`-attributet alltid är definierat
- Route abort errors är ofta bara dev-mode-varningar men kan förhindras genom korrekt SSR-hantering
