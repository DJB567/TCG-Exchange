"use client";

import { useEffect, useState } from "react";
import { ReplayLogo } from "./ReplayLogo";
import { LOCATIONS, SITE } from "@/lib/site";

const TABS = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Locations", href: "#locations" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "#contact" },
] as const;

/** Terminal-style sticky menu. Hidden during the Poké Ball intro; fades in once
 *  the hero video takes over (driven by `tcg:phase`). Anchor tabs use Lenis. */
export function TopBar() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onPhase = (e: Event) => {
      const p = (e as CustomEvent).detail?.phase;
      if (p) setShown(p === "world");
    };
    window.addEventListener("tcg:phase", onPhase as EventListener);
    return () => window.removeEventListener("tcg:phase", onPhase as EventListener);
  }, []);

  const goTo = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { offset: -104 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-opacity duration-700 sm:px-6 sm:pt-5 ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        {/* floating pill */}
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-bg/55 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150 sm:px-6 sm:py-3">
          <ReplayLogo className="h-9 w-auto sm:h-10" />

          <nav className="hidden items-center gap-8 md:flex">
            {TABS.map((t) => (
              <a
                key={t.label}
                href={t.href}
                onClick={(e) => goTo(e, t.href)}
                className="mono-label !text-[11px] !tracking-[0.2em] text-text-dim transition-colors hover:text-text"
              >
                {t.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={SITE.phoneHref}
              aria-label={`Call ${SITE.phone}`}
              title={`Call ${SITE.phone}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-text-dim transition-colors hover:border-tcg-red hover:text-tcg-red"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </a>
            <a
              href={LOCATIONS[0].mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label hidden rounded-full border border-tcg-red px-4 py-2 !text-[10px] !text-tcg-red transition-colors hover:bg-tcg-red hover:!text-white sm:inline-block"
            >
              Visit Us
            </a>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span
                className={`block h-px w-5 bg-text transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-text transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* mobile dropdown — floating panel below the pill */}
        <div
          className={`mt-2 overflow-hidden rounded-2xl border border-white/10 bg-bg/90 backdrop-blur-xl transition-all duration-300 md:hidden ${
            open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-5 py-1.5">
            {TABS.map((t) => (
              <a
                key={t.label}
                href={t.href}
                onClick={(e) => goTo(e, t.href)}
                className="mono-label border-b border-white/5 py-3 !text-[11px] text-text-dim transition-colors hover:text-text"
              >
                {t.label}
              </a>
            ))}
            <a
              href={LOCATIONS[0].mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label py-3 !text-[11px] text-tcg-red"
            >
              Visit Us →
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
