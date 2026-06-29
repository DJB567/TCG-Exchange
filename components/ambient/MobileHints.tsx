"use client";

import { useEffect, useState } from "react";

/**
 * Touch-only stand-ins for the desktop cursor labels (which don't exist on a
 * phone). Pinned to the bottom of the hero:
 *  • closed ball  → pulsing dot + "Tap to explore"
 *  • world video  → bobbing scroll capsule + "Scroll to explore" (fades on scroll)
 * Driven by the same `tcg:phase` / `tcg:scrolled` events as the cursor.
 */
export function MobileHints() {
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<"closed" | "opening" | "world">("closed");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // only on touch / no-hover devices — desktop uses the cursor labels
    if (window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const onPhase = (e: Event) => {
      const p = (e as CustomEvent).detail?.phase;
      if (!p) return;
      setPhase(p);
      if (p !== "world") setScrolled(false);
    };
    const onScrolled = () => setScrolled(true);
    window.addEventListener("tcg:phase", onPhase as EventListener);
    window.addEventListener("tcg:scrolled", onScrolled);
    return () => {
      window.removeEventListener("tcg:phase", onPhase as EventListener);
      window.removeEventListener("tcg:scrolled", onScrolled);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div className="mhint" data-show={phase === "closed"} aria-hidden>
        <svg
          className="mhint__chevron"
          viewBox="0 0 24 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="2,12 12,3 22,12" />
        </svg>
        <span className="mhint__label">Tap to explore</span>
      </div>
      <div
        className="mhint"
        data-show={phase === "world" && !scrolled}
        aria-hidden
      >
        <span className="mhint__line" />
        <span className="mhint__label">Scroll to explore</span>
      </div>
    </>
  );
}
