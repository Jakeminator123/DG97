import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import "../styles/shimmer.css";

// Lazy load the background for better performance
const AnimatedBackground = dynamic(
  () => import("../components/AnimatedBackground"),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    // Only show background after initial load for better performance
    setShowBackground(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {showBackground && <AnimatedBackground />}
      <div className="relative z-10">
        <Component {...pageProps} />
      </div>
    </>
  );
}
