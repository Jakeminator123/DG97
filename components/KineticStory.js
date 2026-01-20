import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Interactive story block for the homepage.
 * - Cheap animations: transform/opacity only
 * - Reacts to scroll + pointer (desktop only)
 * - Disabled on reduced motion / mobile (via useReducedMotion)
 */
export default function KineticStory() {
  const rootRef = useRef(null);
  const glowRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || shouldReduceMotion) return;

    if (!("IntersectionObserver" in window)) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { rootMargin: "200px" }
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow || shouldReduceMotion || !isActive) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const setToCenter = () => {
      const rect = root.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      targetX = centerX - 160;
      targetY = centerY - 160;
    };

    setToCenter();

    const tick = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.12;
      currentY += dy * 0.12;
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      // Stop the rAF loop once we're close enough to the target.
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        raf = 0;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const requestTick = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e) => {
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      targetX = x - 160;
      targetY = y - 160;
      requestTick();
    };

    const onPointerLeave = () => {
      setToCenter();
      requestTick();
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave, { passive: true });
    requestTick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [isActive, shouldReduceMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || shouldReduceMotion || !isActive) return;

    let raf = 0;

    const update = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progressRaw = (vh - rect.top) / (vh + rect.height);
      const progress = Math.max(0, Math.min(1, progressRaw));
      root.style.setProperty("--scroll", String(progress));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isActive, shouldReduceMotion]);

  return (
    <section className="section-container bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white relative overflow-hidden">
      <div
        ref={rootRef}
        className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden p-8 sm:p-10 md:p-12"
        style={{
          // Default to avoid undefined vars before JS runs
          ["--scroll"]: 0,
        }}
      >
        {/* Pointer + scroll reactive glow (transform only) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            ref={glowRef}
            className="absolute w-80 h-80 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 35%, transparent 70%)",
              willChange: shouldReduceMotion ? "auto" : "transform",
              transform: "translate3d(0,0,0)",
            }}
          />

          {/* Scroll progress line */}
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/10">
            <div className="progress-line h-full bg-gradient-to-r from-secondary-400 via-accent-400 to-primary-300" />
          </div>
        </div>

        {/* SEO note: keep core copy as plain HTML (h2/p/li) so it's indexable and not hidden by reveal animations */}
        <div className="relative z-10">
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-primary-100/80 mb-4">
            DG97 • kontorshotell • vasastan
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            Det ska kännas enkelt att gå till kontoret.
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-white/90 text-base sm:text-lg leading-relaxed space-y-4">
              <p>
                DG97 är ett{" "}
                <span className="font-semibold text-white">personligt</span>{" "}
                kontorshotell mitt i Stockholm, skapat för team som vill ha
                fokus – men också{" "}
                <span className="font-semibold text-white">energi</span> från
                ett levande community.
              </p>
              <p>
                Scrolla vidare: den lilla linjen längst ner visar hur “långt in”
                du är i sektionen – och ljuset följer din mus (desktop).
              </p>
            </div>

            <ul className="text-white/90 text-base sm:text-lg space-y-4">
              <li className="flex gap-3">
                <span className="mt-1 inline-block w-2 h-2 rounded-full bg-accent-400" />
                <span>
                  <strong className="text-white">Allt inkluderat</strong> – från
                  kaffe till snabbt internet.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block w-2 h-2 rounded-full bg-secondary-400" />
                <span>
                  <strong className="text-white">Flexibla avtal</strong> – väx
                  upp eller ner utan krångel.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block w-2 h-2 rounded-full bg-primary-300" />
                <span>
                  <strong className="text-white">Community</strong> – frukost,
                  AW och spontana samarbeten.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <style jsx>{`
          .progress-line {
            transform: scaleX(var(--scroll));
            transform-origin: left;
            will-change: transform;
          }
        `}</style>
      </div>
    </section>
  );
}


