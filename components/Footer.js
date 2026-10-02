import Link from 'next/link';
import { DG97_URL, DG97_CONTACT_URL } from '../config/site';
export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-xl font-bold mb-4">DG97 Kontorsguiden</h2>
            <p className="text-blue-100 leading-relaxed">En separat inspirations- och guidesajt från DG97 om kontorshotell och arbetsliv i Stockholm.</p>
          </div>
          <nav aria-label="Guider och information" className="space-y-3">
            <Link href="/blogg" className="block hover:underline">Läs våra guider</Link>
            <Link href="/fragor-och-svar" className="block hover:underline">Frågor inför kontorsvalet</Link>
            <Link href="/om-oss" className="block hover:underline">Om guiden och DG97</Link>
          </nav>
          <div>
            <h2 className="font-semibold mb-4">Rum, priser och kontakt</h2>
            <p className="text-blue-100 leading-relaxed mb-4">Aktuella uppgifter och förfrågningar hanteras på DG97:s huvudwebbplats.</p>
            <a href={DG97_URL} className="block underline underline-offset-4 mb-3">www.dg97.se</a>
            <a href={DG97_CONTACT_URL} className="block hover:underline">Kontakta DG97</a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/20 text-sm text-blue-200 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} DG97 Kontorsguiden</p>
          <p>Skapad av <a href="https://sajtmaskin.se/" className="underline underline-offset-4 hover:text-white">sajtmaskin.se</a></p>
        </div>
      </div>
    </footer>
  );
}
