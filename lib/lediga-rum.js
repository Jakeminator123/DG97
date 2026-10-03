const data = require('../data/lediga-rum.json');

function formatGroupedNumber(amount) {
  const [integer, fraction] = String(amount).split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return fraction ? `${grouped},${fraction}` : grouped;
}

function formatSek(amount) {
  return `${formatGroupedNumber(amount)} kr`;
}

function withExclVat(label) {
  return `${label} ${data.pricingModel.vat}`;
}

function formatMonthlyRent(amount) {
  return withExclVat(`${formatSek(amount)}/mån`);
}

function formatSqm(sizeSqm) {
  return `${formatGroupedNumber(sizeSqm)} kvm`;
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getLedigaRum() {
  return {
    ...data,
    rooms: data.rooms.map(room => ({
      ...room,
      sizeLabel: formatSqm(room.sizeSqm),
      availableFromLabel: formatDate(room.availableFrom),
      monthlyLabel: formatMonthlyRent(room.monthlyPrice),
    })),
  };
}

module.exports = {
  getLedigaRum,
  formatSek,
  formatMonthlyRent,
  formatSqm,
  formatGroupedNumber,
  withExclVat,
};
