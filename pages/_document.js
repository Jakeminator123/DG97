import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="sv">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />
        <link rel="preconnect" href="https://booking.agendo.io" />
        {/* Fonts are loaded via next/font in pages/_app.js to reduce CLS */}

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
