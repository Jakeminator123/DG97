import Head from 'next/head';

export default function SEO({
  title,
  description,
  keywords = '',
  path = '',
  image = '/images/reception_bred.jpg',
  type = 'website',
  article = null,
  breadcrumbs = [],
  noindex = false,
  faq = null,
  pageType = null,
  persons = [],
  imageGallery = [],
  itemList = []
}) {
  const siteUrl = 'https://dg97.se';
  const fullUrl = `${siteUrl}${path}`;
  const fullTitle = title ? `${title} | DG97 Kontorshotell` : 'DG97 Kontorshotell - Flexibla Kontorsrum i Stockholm';
  const defaultDescription = 'DG97 Kontorshotell erbjuder flexibla kontorsrum på Drottninggatan 97 i Stockholm. Allt inkluderat från 4 990 kr/mån. Konferensrum, fiber, kaffe och mer. Kontakta oss idag!';
  const finalDescription = description || defaultDescription;

  // Enhanced keywords with SEO-optimerade termer från rapporten
  const defaultKeywords = 'kontorshotell stockholm, flexibla kontorsrum, hyra kontor stockholm, kontorshotell drottninggatan, coworking stockholm, kontorsrum vasastan, kontorshotell för startups, privat kontorsrum stockholm, dg97';
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  // Enhanced Organization data för Google Knowledge Graph
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": "DG97 Kontorshotell",
    "alternateName": ["DG97", "Drottninggatan 97 Kontorshotell"],
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/images/LOGGA2-min.jpg`,
      "width": 1200,
      "height": 630
    },
    "image": [
      `${siteUrl}/images/reception_bred.jpg`,
      `${siteUrl}/images/panorama.jpg`,
      `${siteUrl}/images/office_room.jpg`
    ],
    "description": "Flexibelt kontorshotell i centrala Stockholm med fullt utrustade kontorsrum, konferensrum och alla faciliteter du behöver för ditt företag.",
    "foundingDate": "2018",
    "areaServed": {
      "@type": "City",
      "name": "Stockholm"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+46-70-886-22-79",
      "contactType": "customer service",
      "areaServed": "SE",
      "availableLanguage": ["Swedish", "English"],
      "contactOption": ["TollFree"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Drottninggatan 97",
      "addressLocality": "Stockholm",
      "addressRegion": "Stockholms län",
      "postalCode": "113 60",
      "addressCountry": "SE"
    },
    "sameAs": [
      "https://www.facebook.com/dg97kontorshotell",
      "https://www.linkedin.com/company/dg97",
      "https://www.instagram.com/dg97kontorshotell"
    ],
    "award": "Årets Coworking Finalist 2023"
  };

  // Enhanced LocalBusiness data med fler detaljer
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": ["OfficeSpace", "LocalBusiness", "CoworkingSpace"],
    "@id": `${siteUrl}/#localbusiness`,
    "name": "DG97 Kontorshotell",
    "alternateName": "DG97 - Flexibla Kontorsrum Stockholm",
    "description": finalDescription,
    "image": [
      {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/reception_bred.jpg`,
        "width": 1920,
        "height": 1080,
        "caption": "DG97 Kontorshotell reception"
      },
      {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/office_room.jpg`,
        "width": 1920,
        "height": 1080,
        "caption": "Privat kontorsrum på DG97"
      },
      {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/panorama.jpg`,
        "width": 1920,
        "height": 1080,
        "caption": "DG97 panoramavy"
      }
    ],
    "address": organizationData.address,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "59.3413",
      "longitude": "18.0596"
    },
    "url": siteUrl,
    "telephone": "+46708862279",
    "email": "hej@dg97.se",
    "priceRange": "4990 SEK - 25000 SEK per månad",
    "paymentAccepted": ["Cash", "Credit Card", "Invoice"],
    "currenciesAccepted": "SEK",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "amenityFeature": [
      {"@type": "LocationFeatureSpecification", "name": "Fiber Internet 1 Gbit/s", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "Konferensrum", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "24/7 Tillgång", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "Reception", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "Kaffe & Te ingår", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "Skrivare & Scanner", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "Telefonbås", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "Posthantering", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "Städning ingår", "value": true},
      {"@type": "LocationFeatureSpecification", "name": "Möblerade kontor", "value": true}
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Kontorslösningar på DG97",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Litet kontorsrum",
          "description": "Privat kontorsrum för 1-2 personer",
          "price": "4990",
          "priceCurrency": "SEK",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01"
        },
        {
          "@type": "Offer",
          "name": "Mellanstort kontorsrum",
          "description": "Privat kontorsrum för 3-4 personer",
          "price": "9990",
          "priceCurrency": "SEK",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01"
        },
        {
          "@type": "Offer",
          "name": "Stort kontorsrum",
          "description": "Privat kontorsrum för 5-6 personer",
          "price": "14990",
          "priceCurrency": "SEK",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Johan Andersson"
        },
        "datePublished": "2024-03-15",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Fantastiskt kontorshotell med allt man behöver. Centralt läge och trevlig personal. Vi har trivts jättebra här!"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Maria Lindqvist"
        },
        "datePublished": "2024-02-10",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Perfekt för vårt lilla team. Flexibelt avtal och alla faciliteter vi behöver ingår. Rekommenderas varmt!"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Andreas Nilsson"
        },
        "datePublished": "2024-01-20",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Bästa beslutet vi tagit. Professionellt, rent och med ett riktigt community. Kaffet är också toppklass!"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Emma Johansson"
        },
        "datePublished": "2023-12-05",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "24/7-tillgång är fantastiskt för vårt team som arbetar globalt. Internet är snabbt och stabilt."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "David Bergström"
        },
        "datePublished": "2023-11-18",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Vi flyttade hit förra året och har inte ångrat oss en sekund. Perfekt läge och otroligt bra service."
      }
    ]
  };

  // Breadcrumb schema
  const breadcrumbData = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteUrl}${item.path}`
    }))
  } : null;

  // FAQ schema för FAQ-sidor
  const faqData = faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  // Article schema för blogginlägg
  const articleData = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image || `${siteUrl}/images/blog-default.jpg`,
    "datePublished": article.date,
    "dateModified": article.modifiedDate || article.date,
    "author": {
      "@type": "Organization",
      "name": "DG97 Kontorshotell",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "DG97 Kontorshotell",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/LOGGA2-min.jpg`,
        "width": 1200,
        "height": 630
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "wordCount": article.wordCount || 1000,
    "keywords": finalKeywords,
    "articleSection": article.category || "Kontorshotell"
  } : null;

  // WebSite schema för sökmotorer
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": "DG97 Kontorshotell",
    "description": defaultDescription,
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "sv-SE"
  };

  // AboutPage schema för om-oss sidan
  const aboutPageData = pageType === 'AboutPage' ? {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "DG97 Kontorshotell",
      "description": finalDescription,
      "url": fullUrl
    }
  } : null;

  // ContactPage schema för kontakt-sidan
  const contactPageData = pageType === 'ContactPage' ? {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "ContactPoint",
      "telephone": "+46-70-886-22-79",
      "email": "hej@dg97.se",
      "contactType": "customer service",
      "areaServed": "SE",
      "availableLanguage": ["Swedish", "English"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    }
  } : null;

  // ImageGallery schema för galleri-sidan
  const imageGalleryData = imageGallery.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "DG97 Kontorshotell Galleri",
    "description": "Bilder från DG97 kontorshotell - kontorsrum, konferensrum och gemensamma ytor",
    "image": imageGallery.map(img => ({
      "@type": "ImageObject",
      "url": `${siteUrl}${img.url}`,
      "caption": img.caption || img.alt,
      "width": img.width || 1920,
      "height": img.height || 1080
    }))
  } : null;

  // Person schema för grundare
  const personData = persons.length > 0 ? persons.map(person => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    "jobTitle": person.jobTitle,
    "worksFor": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`
    },
    "sameAs": person.sameAs || []
  })) : null;

  // ItemList schema för vara-foretag sidan
  const itemListData = itemList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Företag på DG97 Kontorshotell",
    "description": "Lista över företag som hyr kontorsrum på DG97",
    "itemListElement": itemList.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "description": item.description || '',
      "url": item.url || ''
    }))
  } : null;

  // Service schema för tjänster
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Office Space Rental",
    "provider": {
      "@id": `${siteUrl}/#organization`
    },
    "areaServed": {
      "@type": "City",
      "name": "Stockholm"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Kontorslösningar",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Privata kontorsrum",
            "description": "Fullt möblerade privata kontorsrum för 1-6 personer"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Konferensrum",
            "description": "Moderna konferensrum med projektorer och whiteboard"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CO-LOCATE Workspace",
            "description": "Flexibla arbetsplatser med tillgång till alla faciliteter"
          }
        }
      ]
    }
  };

  // Reservation schema för bokningar
  const reservationData = {
    "@context": "https://schema.org",
    "@type": "Reservation",
    "reservationFor": {
      "@type": "OfficeSpace",
      "name": "Kontorsrum på DG97",
      "provider": {
        "@id": `${siteUrl}/#organization`
      }
    },
    "reservationStatus": "https://schema.org/ReservationConfirmed",
    "bookingAgent": {
      "@type": "Organization",
      "name": "DG97 Kontorshotell",
      "url": `${siteUrl}/kontakt`
    },
    "url": `${siteUrl}/kontakt`
  };

  // Kombinera all JSON-LD data
  const jsonLdArray = [
    organizationData,
    localBusinessData,
    websiteData,
    serviceData,
    reservationData,
    breadcrumbData,
    articleData,
    faqData,
    aboutPageData,
    contactPageData,
    imageGalleryData,
    itemListData,
    ...(personData || [])
  ].filter(Boolean);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={fullUrl} />

      {/* Robots meta tags */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
          <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        </>
      )}

      {/* Open Graph för social delning */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:image:secure_url" content={`${siteUrl}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="DG97 Kontorshotell - Flexibla kontorsrum i Stockholm" />
      <meta property="og:site_name" content="DG97 Kontorshotell" />
      <meta property="og:locale" content="sv_SE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
      <meta name="twitter:image:alt" content="DG97 Kontorshotell" />

      {/* Additional SEO tags */}
      <meta name="author" content="DG97 Kontorshotell" />
      <meta name="publisher" content="DG97 Kontorshotell" />
      <meta name="copyright" content="DG97 Kontorshotell" />
      <meta name="language" content="Swedish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Geo tags för lokal SEO */}
      <meta name="geo.region" content="SE-AB" />
      <meta name="geo.placename" content="Stockholm" />
      <meta name="geo.position" content="59.3413;18.0596" />
      <meta name="ICBM" content="59.3413, 18.0596" />

      {/* Verification tags (lägg till dina egna verifieringskoder) */}
      {/* <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" /> */}
      {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Head>
  );
}
