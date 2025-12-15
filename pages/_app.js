import dynamic from "next/dynamic";
import Head from "next/head";
import { Inter, Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import "../styles/shimmer.css";

// Use next/font to reduce CLS from font swapping (adds metric overrides)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

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
      <div className={`${inter.variable} ${poppins.variable} relative z-10`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
