import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="sv">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />
        <link rel="preconnect" href="https://booking.agendo.io" />

        {/* Load critical fonts with optimal performance */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap&subset=latin"
          rel="stylesheet"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap&subset=latin"
            rel="stylesheet"
          />
        </noscript>

        {/* Agendo Booking Widget Script - Loaded dynamically to avoid CORS issues */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                script.src = 'https://booking.agendo.io/agendo_loader.js';
                script.setAttribute('data-profile-id', '137');
                script.defer = true;
                script.onerror = function() {
                  console.warn('Agendo booking widget failed to load');
                };
                document.head.appendChild(script);
              })();
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
