"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide buttery smooth scroll. "Heavy glide" — a long, weighty inertia
 * (the Rejouice / Terminal Industries feel). Exposed on window.__lenis so the
 * hero engine can lock/unlock scroll during the intro. Off for reduced-motion.
 */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Lenis governs the whole page; this is what makes the content sections
      // feel buttery. Multiplier kept in Terminal's controlled range (the video
      // trail was fixed at the engine's LERP_FACTOR, not here).
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1.3,
      syncTouch: true,
      touchMultiplier: 1.7,
    });
    window.__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
