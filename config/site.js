// The guide has its own URLs; enquiries belong on DG97's main website.
const GUIDE_URL = 'https://www.dg97.org';
const GUIDE_NAME = 'DG97 Kontorsguiden';
const DG97_URL = 'https://www.dg97.se';
const DG97_CONTACT_URL = `${DG97_URL}/kontakt/`;
function referralUrl(url, placement) {
  const tagged = new URL(url);
  tagged.searchParams.set('utm_source', 'dg97.org');
  tagged.searchParams.set('utm_medium', 'referral');
  tagged.searchParams.set('utm_campaign', 'kontorsguiden');
  tagged.searchParams.set('utm_content', placement);
  return tagged.toString();
}
module.exports = { GUIDE_URL, GUIDE_NAME, DG97_URL, DG97_CONTACT_URL, referralUrl };
