import Link from 'next/link';
import { DG97_CONTACT_URL, referralUrl } from '../config/site';
import NapBlock from './NapBlock';

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-xl font-display font-bold mb-4">DG97 Kontorshotell</h2>
            <p className="text-blue-100 leading-relaxed">
              Privata, låsbara kontorsrum på Drottninggatan 97 i Vasastan.
              dg97.org är en stödsajt till www.dg97.se.
            </p>
          </div>
          <nav aria-label="Sidor" className="space-y-3">
            <Link href="/lediga-rum" className="block hover:underline">Lediga rum</Link>
            <Link href="/blogg" className="block hover:underline">Blogg</Link>
            <Link href="/galleri" className="block hover:underline">Galleri</Link>
            <Link href="/fragor-och-svar" className="block hover:underline">Frågor & svar</Link>
            <Link href="/kontakt" className="block hover:underline">Kontakt</Link>
            <Link href="/om-oss" className="block hover:underline">Om sajten</Link>
            <Link href="/medlemmar" className="block hover:underline">Medlemsinloggning</Link>
          </nav>
          <div>
            <h2 className="font-semibold mb-4">Kontorshotellet</h2>
            <NapBlock className="text-blue-100 leading-relaxed space-y-1" />
            <a href={referralUrl(DG97_CONTACT_URL, 'footer')} className="inline-block mt-4 hover:underline">Kontakta DG97 på dg97.se</a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/20 text-sm text-blue-200 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} DG97 Kontorshotell</p>
          <p>Skapad av <a href="https://sajtmaskin.se/" className="underline underline-offset-4 hover:text-white">SajtMaskin.se</a></p>
        </div>
      </div>
    </footer>
  );
}
