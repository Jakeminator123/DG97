import Head from "next/head";
import { Lato, Open_Sans } from "next/font/google";
import "../styles/globals.css";
import "../styles/shimmer.css";

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
  weight: ["300", "400", "700"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "600"],
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${lato.variable} ${openSans.variable} relative z-10 font-sans`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
