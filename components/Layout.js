import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Lazy load D-ID controller
const DIDController = dynamic(() => import('./DIDController'), {
  ssr: false,
  loading: () => null
});

// Lazy load Cookie Consent
const CookieConsent = dynamic(() => import('./CookieConsent'), {
  ssr: false,
  loading: () => null
});

// Lazy load Scroll to Top
const ScrollToTop = dynamic(() => import('./ScrollToTop'), {
  ssr: false,
  loading: () => null
});

// Lazy load Floating CTA
const FloatingCTA = dynamic(() => import('./FloatingCTA'), {
  ssr: false,
  loading: () => null
});

export default function Layout({
  children,
  title,
  description,
  path,
  image,
  type,
  article,
  breadcrumbs = []
}) {
  const router = useRouter();
  const isAdminPage = path === '/admin' || router.pathname === '/admin';

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={path}
        image={image}
        type={type}
        article={article}
        breadcrumbs={breadcrumbs}
        noindex={isAdminPage || router.pathname === '/foretagsportal'}
      />
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-500/30"
      >
        Hoppa till huvudinnehåll
      </a>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="relative flex-grow">
          <div className="app-ambient" aria-hidden="true" />
          <main id="main-content" className="relative z-10">
            {children}
          </main>
        </div>
        <Footer />
        {!isAdminPage && (
          <>
            <DIDController />
            <FloatingCTA />
          </>
        )}
        <CookieConsent />
        <ScrollToTop />
      </div>
    </>
  );
}

