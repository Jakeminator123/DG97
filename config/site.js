// The guide has its own URLs; enquiries belong on DG97's main website.
const GUIDE_URL = 'https://www.dg97.org';
const GUIDE_NAME = 'DG97 Kontorsguiden';
const DG97_URL = 'https://www.dg97.se';
const DG97_CONTACT_URL = `${DG97_URL}/kontakt/`;
// /lediga-kontor/ is not published yet (404 on 2026-10-03). Use /kontakt/ until it exists.
const DG97_VACANCY_URL = DG97_CONTACT_URL;
const DG97_PLANNED_VACANCY_URL = `${DG97_URL}/lediga-kontor/`;
const DEFAULT_OG_IMAGE = '/images/og_image_reception_1200x630.jpg';
const DEFAULT_OG_ALT = 'Ljus reception på DG97 Kontorshotell, Drottninggatan 97';
const DG97_BUSINESS = {
  name: 'DG97 Kontorshotell',
  schemaId: `${DG97_URL}/#localbusiness`,
  streetAddress: 'Drottninggatan 97',
  postalCode: '113 60',
  addressLocality: 'Stockholm',
  addressCountry: 'SE',
  telephoneDisplay: '070-886 22 79',
  telephoneIntl: '+46 70 886 22 79',
  telephoneHref: 'tel:+46708862279',
  email: 'hej@dg97.se',
  sameAs: [
    'https://www.linkedin.com/company/dg97/',
    'https://www.facebook.com/Drottninggatan97',
  ],
};
const PRICE_ALLOWED_PATHS = [
  '/lediga-rum',
  '/blogg/vad-kostar-ett-kontorshotell-i-stockholm',
];
const PRICE_ALLOWED_SLUGS = ['vad-kostar-ett-kontorshotell-i-stockholm'];

function referralUrl(url, placement) {
  const tagged = new URL(url);
  tagged.searchParams.set('utm_source', 'dg97.org');
  tagged.searchParams.set('utm_medium', 'referral');
  tagged.searchParams.set('utm_campaign', 'kontorsguiden');
  tagged.searchParams.set('utm_content', placement);
  return tagged.toString();
}

module.exports = {
  GUIDE_URL,
  GUIDE_NAME,
  DG97_URL,
  DG97_CONTACT_URL,
  DG97_VACANCY_URL,
  DG97_PLANNED_VACANCY_URL,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_ALT,
  DG97_BUSINESS,
  PRICE_ALLOWED_PATHS,
  PRICE_ALLOWED_SLUGS,
  referralUrl,
};
