DG97 WordPress planritning

Destination: https://www.dg97.se/planritning/
WordPress page: 1879, shortcode [hfcm id="3"].
HFCM snippet: 3, HTML, Shortcode Only, all devices. Do not change site-wide insertion.

Live status, 2026-10-04: published in HFCM 3; stored content exactly matches
snippet.html. Production data reads, desktop/mobile interaction and anonymous
page access verified. See RAPPORT.txt for the consolidated owner report.

Source files
- template.html: isolated page markup, SVG click areas and scoped CSS.
- client.js: keyboard/touch selection and filtered live reads.
- planritning-clean.png: clean redraw made with the built-in image generation tool.
- planritning-clean.webp: web format of that redraw, without a layout/geometry transformation.
- build.cjs: builds snippet.html from these files using the installed sharp dependency.
- snippet.html: exact paste-ready content for HFCM 3.

Build with a Node version matching package.json and .nvmrc (Node 24):
  volta run --node 24.21.0 node integrations/wordpress/planritning/build.cjs

Data contract
GET https://www.dg97.org/api/planritning uses the existing server-side published CSV feed.
Only publishable offices 1–22 are emitted. Room 23 is a fixed conference room.
The response contains id, area, available and date; no source URL, customer, actual rent,
internal notes or price column. Date is null for rooms not published as available.
The WordPress frontend does not contain the working spreadsheet's address or credentials.

The browser retrieves data on page load, every five minutes while the tab is visible,
and when returning to a tab after five minutes. The server may cache successful reads
for 60 seconds. Upstream Google publication caching can add delay.
The timestamp describes retrieval, not the spreadsheet's last edit.

On invalid/unreachable data, the API returns 503 and an empty room list. The page clears
availability and room facts and directs visitors to DG97. It never substitutes a static
vacancy list or calls cached data current. An intentionally empty list is respected.

Prices on dg97.se remain calculated examples: area x 1,200 SEK/sqm/month excluding VAT.
They are not actual rents from the source, and the .org example rate for large rooms is
not imported into this module. Confirm actual offers with DG97.

The plan is an illustrated overview rather than a surveyed or dimensioned drawing.
The original room numbering and click geometry are retained. All labels 1–23 were
visually checked. Keep the original source sketch for reference.

Publishing
Deploy the filtered API first and verify it anonymously. Then paste snippet.html into
HFCM 3 and update. Keep pages 1862 and 1879 in Profile Builder's allowed public pages;
do not turn off the global private-site protection. Test anonymously and on mobile.

Rollback
Restore the previous HFCM 3 content or publish a clear contact-only version. The endpoint
can remain available; it is read-only and affects no booking, account or Sheet data.
