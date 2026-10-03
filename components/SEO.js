import Head from 'next/head';
import { GUIDE_URL, GUIDE_NAME, DG97_URL, DG97_BUSINESS, DEFAULT_OG_IMAGE, DEFAULT_OG_ALT } from '../config/site';

export default function SEO({
  title,
  description = 'Guider och checklistor om kontorshotell och arbetsliv i Stockholm. Aktuella kontorsrum, priser och kontakt finns på DG97:s huvudwebbplats.',
  path = '', image = DEFAULT_OG_IMAGE, type = 'website', article = null,
  breadcrumbs = [], noindex = false, faq = null, pageType = 'WebPage', imageGallery = [],
}) {
  const fullUrl = new URL(path || '/', GUIDE_URL).href;
  const imageUrl = new URL(image || DEFAULT_OG_IMAGE, GUIDE_URL).href;
  const fullTitle = title ? `${title} | ${GUIDE_NAME}` : GUIDE_NAME;
  const publisher = {
    '@type': 'Organization',
    '@id': DG97_BUSINESS.schemaId,
    name: DG97_BUSINESS.name,
    url: DG97_URL,
    telephone: DG97_BUSINESS.telephoneIntl,
    email: DG97_BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: DG97_BUSINESS.streetAddress,
      postalCode: DG97_BUSINESS.postalCode,
      addressLocality: DG97_BUSINESS.addressLocality,
      addressCountry: DG97_BUSINESS.addressCountry,
    },
    sameAs: DG97_BUSINESS.sameAs,
  };
  const website = {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${GUIDE_URL}/#website`,
    name: GUIDE_NAME, url: GUIDE_URL, description, inLanguage: 'sv-SE',
    publisher, about: { '@id': DG97_BUSINESS.schemaId },
  };
  const page = {
    '@context': 'https://schema.org', '@type': pageType, '@id': fullUrl,
    url: fullUrl, name: title || GUIDE_NAME, description, inLanguage: 'sv-SE',
    isPartOf: { '@id': website['@id'] }, about: { '@id': DG97_BUSINESS.schemaId },
    ...(imageGallery.length ? { image: imageGallery.map(img => ({
      '@type': 'ImageObject', url: new URL(img.url, GUIDE_URL).href, caption: img.caption || img.alt,
    })) } : {}),
  };
  const articleData = article ? {
    '@context': 'https://schema.org', '@type': 'Article', headline: article.title,
    description: article.excerpt, image: new URL(article.image || imageUrl, GUIDE_URL).href,
    datePublished: article.date, dateModified: article.modifiedDate || article.date,
    author: { '@type': 'Organization', name: GUIDE_NAME, url: GUIDE_URL },
    publisher, mainEntityOfPage: { '@id': fullUrl }, inLanguage: 'sv-SE',
  } : null;
  const breadcrumbData = breadcrumbs.length ? {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name, item: new URL(item.path, GUIDE_URL).href,
    })),
  } : null;
  const faqData = faq?.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map(item => ({ '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  } : null;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={DEFAULT_OG_ALT} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={GUIDE_NAME} />
      <meta property="og:locale" content="sv_SE" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      {[website, page, articleData, breadcrumbData, faqData].filter(Boolean).map((data, index) => (
        <script key={index} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
      ))}
    </Head>
  );
}
