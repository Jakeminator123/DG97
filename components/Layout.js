import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Lazy load Scroll to Top
const ScrollToTop = dynamic(() => import('./ScrollToTop'), {
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
  breadcrumbs = [],
  faq,
  pageType,
  imageGallery,
  noindex = false
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
        faq={faq}
        pageType={pageType}
        imageGallery={imageGallery}
        noindex={noindex || isAdminPage || ['/foretagsportal', '/404', '/loading'].includes(router.pathname)}
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
        <ScrollToTop />
      </div>
    </>
  );
}

