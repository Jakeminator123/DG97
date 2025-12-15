import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AnimatedLogoText,
  BlurReveal,
  FadeIn,
  MagneticButton,
  ScaleReveal,
  ScrollReveal,
  StaggerChild,
  StaggerReveal,
  WaveDivider,
} from "../components/animations";
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import { getImageProps } from "../lib/images";

// Real gallery images from DG97
const galleryImages = [
  {
    id: 1,
    src: "/images/reception_bred.jpg",
    title: "Reception",
    ...getImageProps("reception_bred.jpg"),
  },
  {
    id: 2,
    src: "/images/office_room.jpg",
    title: "Kontorsrum",
    ...getImageProps("office_room.jpg"),
  },
  {
    id: 3,
    src: "/images/corridor.jpg",
    title: "Korridor",
    ...getImageProps("corridor.jpg"),
  },
  {
    id: 4,
    src: "/images/kichen.jpg",
    title: "Kök",
    ...getImageProps("kichen.jpg"),
  },
  {
    id: 5,
    src: "/images/reception_galleri.jpg",
    title: "Reception & Lounge",
    ...getImageProps("reception_galleri.jpg"),
  },
  {
    id: 6,
    src: "/images/telefonboth1.jpg",
    title: "Telefonbås",
    ...getImageProps("telefonboth1.jpg"),
  },
  {
    id: 7,
    src: "/images/magazine.jpg",
    title: "Lounge",
    ...getImageProps("magazine.jpg"),
  },
  {
    id: 8,
    src: "/images/stortrum2.jpg",
    title: "Stort kontorsrum",
    ...getImageProps("stortrum2.jpg"),
  },
  {
    id: 9,
    src: "/images/working_man.jpg",
    title: "Arbetsmiljö",
    ...getImageProps("working_man.jpg"),
  },
  {
    id: 10,
    src: "/images/reception_desk.jpg",
    title: "Receptionsdisk",
    ...getImageProps("reception_desk.jpg"),
  },
  {
    id: 11,
    src: "/images/duschrum.jpg",
    title: "Duschrum",
    ...getImageProps("duschrum.jpg"),
  },
  {
    id: 12,
    src: "/images/panorama.jpg",
    title: "Utsikt",
    ...getImageProps("panorama.jpg"),
  },
];

export default function Galleri() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Keyboard navigation when modal is open
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight")
        setSelectedIndex((prev) =>
          prev === galleryImages.length - 1 ? 0 : prev + 1
        );
      if (e.key === "ArrowLeft")
        setSelectedIndex((prev) =>
          prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex]);

  const breadcrumbs = [
    { name: "Hem", path: "/" },
    { name: "Galleri", path: "/galleri" },
  ];

  const imageGalleryData = galleryImages.map((img) => ({
    url: img.src,
    caption: img.title,
    alt: img.alt || img.title,
    width: img.width || 1920,
    height: img.height || 1080,
  }));

  return (
    <Layout
      title="Galleri - Kontorsrum & Lokaler | DG97 Kontorshotell Stockholm"
      description="Se bilder från DG97 Kontorshotell. Moderna kontorsrum, konferensrum och gemensamma ytor i hjärtat av Stockholm på Drottninggatan 97. Boka visning idag!"
      keywords="kontorshotell galleri, kontorsrum bilder stockholm, kontorshotell lokaler, moderna kontorsrum bilder, dg97 bilder, kontorshotell vasastan bilder"
      path="/galleri"
      breadcrumbs={breadcrumbs}
      imageGallery={imageGalleryData}
    >
      {/* Hero Section */}
      <PageHero
        title="Galleri"
        subtitle="Se våra moderna lokaler och inspirerande arbetsmiljö"
      />

      {/* Gallery Grid */}
      <section className="section-container">
        <StaggerReveal staggerDelay={0.08}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <StaggerChild key={image.id}>
                <ScaleReveal>
                  <motion.div
                    className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedIndex(index)}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Gallery Image */}
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      loading={index < 6 ? "eager" : "lazy"}
                    />

                    {/* Hover Overlay with gradient */}
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <motion.span
                        className="text-white font-medium"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Klicka för att förstora
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </ScaleReveal>
              </StaggerChild>
            ))}
          </div>
        </StaggerReveal>
      </section>

      {/* Modal for enlarged image with navigation */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotate: 180, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[80vh]">
                <Image
                  src={galleryImages[selectedIndex].src}
                  alt={galleryImages[selectedIndex].alt}
                  fill
                  sizes="(max-width: 1536px) 100vw, 1536px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Image Info */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-1">
                  {galleryImages[selectedIndex].title}
                </h3>
                <p className="text-white/80">
                  {galleryImages[selectedIndex].alt}
                </p>
              </motion.div>

              {/* Prev / Next controls */}
              <button
                aria-label="Föregående bild"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full p-3 backdrop-blur-md"
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1
                  )
                }
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                aria-label="Nästa bild"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full p-3 backdrop-blur-md"
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <motion.button
                className="absolute top-4 right-4 text-primary-800 hover:text-primary-600 transition-colors"
                onClick={() => setSelectedIndex(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wave Divider */}
      <WaveDivider className="h-32 bg-gray-50" />

      {/* CTA Section */}
      <section className="section-container bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <AnimatedLogoText className="text-5xl mb-6" />
          </ScrollReveal>

          <BlurReveal delay={0.2}>
            <h2 className="heading-2 mb-6">Boka en visning</h2>
          </BlurReveal>

          <FadeIn delay={0.4}>
            <p className="text-lg text-gray-700 mb-10">
              Bilder säger mycket, men ingenting slår att se våra lokaler på
              plats. Boka en visning idag!
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <MagneticButton href="/kontakt">Boka visning</MagneticButton>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
