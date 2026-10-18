import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DG97_CONTACT_URL, GUIDE_NAME, referralUrl } from '../config/site';

const navLinks = [
  { href: '/', label: 'Start' },
  { href: '/lediga-rum', label: 'Lediga rum' },
  { href: '/blogg', label: 'Blogg' },
  { href: '/galleri', label: 'Galleri' },
  { href: '/fragor-och-svar', label: 'Frågor & svar' },
  { href: '/kontakt', label: 'Kontakt' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const isHome = router.pathname === '/';
  const solid = !isHome || scrolled || isMenuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = href => {
    const active = router.pathname === href || (href !== '/' && router.pathname.startsWith(href));
    return `block py-2 text-sm font-semibold tracking-wide ${
      solid
        ? active ? 'text-white' : 'text-white/80 hover:text-white'
        : active ? 'text-white' : 'text-white/85 hover:text-white'
    }`;
  };

  const links = navLinks.map(link => (
    <Link
      key={link.href}
      href={link.href}
      onClick={() => setIsMenuOpen(false)}
      aria-current={router.pathname === link.href ? 'page' : undefined}
      className={linkClass(link.href)}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${solid ? 'bg-primary-800/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <nav aria-label="Huvudmeny" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4 h-20">
          <Link href="/" aria-label={`${GUIDE_NAME}, startsida`} className="flex items-center shrink-0">
            <Image src="/images/LOGGA2-min.jpg" alt="DG97" width={132} height={60} className="h-10 w-auto" priority />
          </Link>
          <div className="hidden xl:flex items-center gap-6">{links}</div>
          <div className="flex items-center gap-3">
            <Link href="/medlemmar" aria-label="Logga in som medlem" className="inline-flex items-center gap-2 rounded-lg border border-white/30 p-2 sm:px-3 sm:py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>
              <span className="sr-only sm:not-sr-only">Logga in</span>
            </Link>
            <a href={referralUrl(DG97_CONTACT_URL, 'header')} className="rounded-lg bg-white text-primary-800 hover:bg-[#F7F4EC] font-semibold text-sm px-3 sm:px-4 py-2.5">
              <span className="sm:hidden">Boka</span>
              <span className="hidden sm:inline">Boka visning</span>
            </a>
            <button
              type="button"
              className="xl:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? 'Stäng meny' : 'Öppna meny'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d={isMenuOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen ? (
          <div id="mobile-navigation" className="xl:hidden pb-5 space-y-2">
            {links}
            <Link href="/medlemmar" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold text-white">Medlemsinloggning</Link>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
