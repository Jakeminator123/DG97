import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ScrollToTop = dynamic(() => import('./ScrollToTop'), {
  ssr: false,
  loading: () => null,
});
const Chatbot = dynamic(() => import('./Chatbot'), { ssr: false, loading: () => null });

function IdleChatbot() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const enable = () => setReady(true);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(enable, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(enable, 2500);
    return () => window.clearTimeout(timer);
  }, []);
  return ready ? <Chatbot /> : null;
}

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
  noindex = false,
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-500/30"
      >
        Hoppa till huvudinnehåll
      </a>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="relative flex-grow">
          <main id="main-content">{children}</main>
        </div>
        <Footer />
        <ScrollToTop />
        {!isAdminPage && !['/medlemmar', '/foretagsportal'].includes(router.pathname) && <IdleChatbot />}
      </div>
    </>
  );
}
