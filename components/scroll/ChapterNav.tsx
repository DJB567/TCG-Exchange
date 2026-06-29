"use client";

import { forwardRef } from "react";
import type { SectionMeta } from "@/lib/engineConfig";

type Props = { sections: SectionMeta[] };

/**
 * Fixed right-side dot navigation. The engine toggles each dot's
 * data-active attribute and fills [data-navline] as the page scrolls.
 * Clicking a dot scrolls to that section's dwell center.
 */
export const ChapterNav = forwardRef<HTMLDivElement, Props>(
  function ChapterNav({ sections }, ref) {
    const goTo = (meta: SectionMeta) => {
      const stage = document.querySelector<HTMLElement>("[data-stage]");
      if (!stage) return;
      const center = meta.showAt + (meta.hideAt - meta.showAt) / 2;
      const span = stage.offsetHeight - window.innerHeight;
      const top = stage.offsetTop + center * span;
      window.scrollTo({ top, behavior: "smooth" });
    };

    return (
      <div
        ref={ref}
        className="pointer-events-none fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-4 sm:flex md:right-6"
      >
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/12">
          <div
            data-navline
            className="absolute left-0 top-0 w-full bg-tcg-red/70"
            style={{ height: "0%" }}
          />
        </div>
        {sections.map((s) => (
          <button
            key={s.id}
            data-dot
            data-active="false"
            onClick={() => goTo(s)}
            aria-label={`Go to ${s.label}`}
            className="group pointer-events-auto relative z-10 grid h-3 w-3 place-items-center"
          >
            <span className="block h-2 w-2 rounded-full bg-white/30 transition-all duration-300 group-data-[active=true]:scale-125 group-data-[active=true]:bg-tcg-red group-data-[active=true]:shadow-[0_0_12px_var(--tcg-red-glow)] group-hover:bg-white/70" />
          </button>
        ))}
      </div>
    );
  },
);
