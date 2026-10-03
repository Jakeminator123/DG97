// Image optimization utilities for DG97

export const imageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 85}`;
};

// Generate srcset for responsive images
export function generateSrcSet(imagePath, sizes = [320, 640, 960, 1280, 1920]) {
  return sizes
    .map(size => `${imagePath}?w=${size} ${size}w`)
    .join(', ');
}

// Image metadata for SEO
export const imageMetadata = {
  'og_image_reception_1200x630.jpg': {
    alt: 'Ljus reception på DG97 Kontorshotell, Drottninggatan 97',
    title: 'DG97 Reception',
    seoName: 'dg97-reception-og'
  },
  'hero_reception_ekta_1600x900.jpg': {
    alt: 'Ljus reception på DG97 Kontorshotell, Drottninggatan 97',
    title: 'DG97 Reception',
    seoName: 'dg97-reception-hero'
  },
  'ekta_reception_bred.jpg': {
    alt: 'Ljus reception på DG97 Kontorshotell, Drottninggatan 97',
    title: 'DG97 Reception',
    seoName: 'dg97-ljus-reception-vasastan'
  },
  'ekta_reception_desk.jpg': {
    alt: 'Ljus receptionsdisk på DG97',
    title: 'DG97 Receptionsdisk',
    seoName: 'dg97-ljus-receptionsdisk'
  },
  'ekta_office_room.jpg': {
    alt: 'Ljust kontorsrum på DG97',
    title: 'Kontorsrum DG97',
    seoName: 'dg97-ljust-kontorsrum-ekta'
  },
  'ekta_corridor.jpg': {
    alt: 'Ljus kontorskorridor på DG97',
    title: 'Korridor DG97',
    seoName: 'dg97-ljus-korridor'
  },
  'ekta_kitchen.jpg': {
    alt: 'Ljust gemensamt kök på DG97',
    title: 'Kök DG97',
    seoName: 'dg97-ljust-kok'
  },
  'ekta_room_2.jpg': {
    alt: 'Ljust kontorsrum med fönster på DG97',
    title: 'Kontorsrum med fönster DG97',
    seoName: 'dg97-kontorsrum-fonster-ekta'
  },
  'ekta_telefonboth1.jpg': {
    alt: 'Ljust telefonbås på DG97',
    title: 'Telefonbås DG97',
    seoName: 'dg97-telefonbas-ekta'
  },
  // Reception images
  'reception_bred.jpg': {
    alt: 'Bemannad reception på kontorshotellet DG97',
    title: 'DG97 Reception - Kontorshotell Vasastan',
    seoName: 'dg97-bemannad-reception-vasastan'
  },
  'reception_galleri.jpg': {
    alt: 'Reception och lounge på DG97',
    title: 'DG97 Reception och Lounge',
    seoName: 'dg97-reception-lounge-vasastan'
  },
  'reception_desk.jpg': {
    alt: 'Receptiondisk och välkomnande entré',
    title: 'DG97 Entré och Reception',
    seoName: 'dg97-reception-entre-kontorshotell'
  },
  'reception1.jpg': {
    alt: 'Moderna receptionen på DG97',
    title: 'Reception DG97 Kontorshotell',
    seoName: 'dg97-modern-reception'
  },
  
  // Office spaces
  'office_room.jpg': {
    alt: 'Privat kontorsrum för två på DG97',
    title: 'Kontorsrum DG97 - Vasastan Stockholm',
    seoName: 'dg97-privat-kontorsrum-vasastan'
  },
  'stortrum2.jpg': {
    alt: 'Stort kontorsrum med plats för team',
    title: 'Teamkontor DG97 Stockholm',
    seoName: 'dg97-stort-kontorsrum-team'
  },
  'room_2.jpg': {
    alt: 'Ljust kontorsrum på DG97',
    title: 'Kontorsrum med fönster DG97',
    seoName: 'dg97-ljust-kontorsrum'
  },
  
  // Common areas
  'corridor.jpg': {
    alt: 'Upplyst kontorskorridor på DG97',
    title: 'Kontorskorridor DG97',
    seoName: 'dg97-kontorskorridor-vasastan'
  },
  'magazine.jpg': {
    alt: 'Magasin och avkopplingshörna på DG97',
    title: 'Lounge DG97 Kontorshotell',
    seoName: 'dg97-lounge-avkoppling'
  },
  'kichen.jpg': {
    alt: 'Gemensamt kök på DG97',
    title: 'Kök DG97 Kontorshotell',
    seoName: 'dg97-gemensamt-kok'
  },
  
  // Facilities
  'telefonboth1.jpg': {
    alt: 'Privat telefonbås för ostörda samtal',
    title: 'Telefonbås DG97',
    seoName: 'dg97-privat-telefonbas'
  },
  'telephoneboth2.jpg': {
    alt: 'Ljudisolerat telefonbås på DG97',
    title: 'Telefonbås för samtal DG97',
    seoName: 'dg97-ljudisolerat-telefonbas'
  },
  'duschrum.jpg': {
    alt: 'Duschrum på DG97 kontorshotell',
    title: 'Duschfaciliteter DG97',
    seoName: 'dg97-duschrum-faciliteter'
  },
  'storage.jpg': {
    alt: 'Förvaringsutrymmen på DG97',
    title: 'Förvaring DG97 Kontorshotell',
    seoName: 'dg97-forvaring-kontorshotell'
  },
  
  // People and atmosphere
  'working_man.jpg': {
    alt: 'Man som arbetar vid skrivbord på DG97',
    title: 'Arbetsmiljö DG97',
    seoName: 'dg97-arbetsmiljo-kontorshotell'
  },
  
  // Exterior and surroundings
  'panorama.jpg': {
    alt: 'Panoramautsikt från DG97 kontorshotell',
    title: 'Utsikt DG97 Vasastan',
    seoName: 'dg97-panorama-utsikt-stockholm'
  },
  'lunden.jpg': {
    alt: 'Vasalunden nära DG97',
    title: 'Närområde DG97 - Vasalunden',
    seoName: 'dg97-vasalunden-narmiljo'
  },
  'observatoriet.jpg': {
    alt: 'Observatoriet nära DG97',
    title: 'Närområde DG97 - Observatoriet',
    seoName: 'dg97-observatoriet-stockholm'
  },
  'Drottninggatan_97-kopia-scaled.jpg': {
    alt: 'Drottninggatan 97 entrén till DG97',
    title: 'DG97 Entré Drottninggatan',
    seoName: 'dg97-entre-drottninggatan-97'
  },
  
  // Logos
  'LOGGA2-min.jpg': {
    alt: 'DG97 logotyp',
    title: 'DG97 Kontorshotell Logo',
    seoName: 'dg97-logotyp'
  },
  'Favicon.jpg': {
    alt: 'DG97 favicon',
    title: 'DG97 Favicon',
    seoName: 'dg97-favicon'
  },
  
  // Awards
  'coworking_award.png': {
    alt: 'DG97 Coworking Award',
    title: 'Utmärkelse DG97',
    seoName: 'dg97-coworking-award'
  },
  
  // Other
  'faq_background.jpg': {
    alt: 'Bakgrundsbild för vanliga frågor',
    title: 'FAQ DG97',
    seoName: 'dg97-faq-bakgrund'
  }
};

// Get optimized image props
export function getImageProps(filename, sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw') {
  const metadata = imageMetadata[filename] || {
    alt: filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/[-_]/g, ' '),
    title: '',
    seoName: filename.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  };

  return {
    alt: metadata.alt,
    title: metadata.title,
    sizes,
    loading: 'lazy',
    decoding: 'async'
  };
}

// Get hero image props (prioritized loading)
export function getHeroImageProps(filename) {
  const props = getImageProps(filename, '100vw');
  return {
    ...props,
    loading: 'eager',
    fetchpriority: 'high'
  };
}
