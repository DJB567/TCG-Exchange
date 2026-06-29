"use client";

import { useEffect, useRef } from "react";

/**
 * A full-bleed image "breather" between content sections (Terminal-style).
 * Reuses an existing 2K hero frame with a scroll-driven parallax. We move a real
 * <img> (taller than the band) on scroll instead of `background-attachment:
 * fixed`, because iOS Safari doesn't support fixed backgrounds — so the
 * scroll-through now works on mobile and desktop alike.
 */
export function PhotoBand({
  image = "/frames/desktop/frame-0049.webp",
  kicker = "San Antonio",
  line = "Come see us in person.",
}: {
  image?: string;
  kicker?: string;
  line?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const SHIFT = 70; // px of parallax travel (img has 20% overscan each side)
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      // -1 when the band sits just below the viewport, +1 just above, 0 centered
      const prog = (center - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, prog));
      img.style.transform = `translate3d(0, ${(-clamped * SHIFT).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="panel-top relative overflow-hidden">
      <div className="relative flex h-[58vh] min-h-[360px] items-center justify-center px-6 text-center">
        {/* parallax image — taller than the band so it can travel without gaps */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={image}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 top-[-20%] h-[140%] w-full object-cover will-change-transform"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,9,12,0.5) 0%, rgba(8,9,12,0.18) 40%, rgba(8,9,12,0.78) 100%)",
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="mono-label mb-3 text-white/70">{kicker}</p>
          <p className="font-display text-3xl leading-[1.06] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] sm:text-5xl">
            {line}
          </p>
        </div>
      </div>
    </section>
  );
}
