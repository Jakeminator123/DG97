import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DG97_URL } from '../config/site';

const navLinks = [
  { href: '/', label: 'Start' }, { href: '/blogg', label: 'Guider' },
  { href: '/fragor-och-svar', label: 'Frågor & svar' },
  { href: '/galleri', label: 'Miljöbilder' }, { href: '/om-oss', label: 'Om guiden' },
];
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const links = navLinks.map(link => (
    <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}
      aria-current={router.pathname === link.href ? 'page' : undefined}
      className={`block py-2 text-sm font-semibold hover:text-primary-600 ${router.pathname === link.href ? 'text-primary-700' : 'text-neutral-700'}`}>
      {link.label}
    </Link>
  ));
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary-100">
      <nav aria-label="Huvudmeny" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4 h-20">
          <Link href="/" aria-label="DG97 Kontorsguiden, startsida" className="flex flex-col shrink-0">
            <span className="text-2xl font-bold text-primary-900 leading-tight">DG97</span>
            <span className="text-sm text-neutral-600">Kontorsguiden</span>
          </Link>
          <div className="hidden lg:flex items-center gap-7">{links}</div>
          <div className="flex items-center gap-3">
            <a href={DG97_URL} className="rounded-lg bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm px-4 py-3">Till dg97.se</a>
            <button type="button" className="lg:hidden p-2 text-primary-950" onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? 'Stäng meny' : 'Öppna meny'}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d={isMenuOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && <div id="mobile-navigation" className="lg:hidden pb-5 space-y-2">{links}</div>}
      </nav>
    </header>
  );
}
