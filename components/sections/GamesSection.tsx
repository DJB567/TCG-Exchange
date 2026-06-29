import { GAMES } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";

/** 02 — What we carry: an editorial index list of the games we stock. */
export function GamesSection() {
  return (
    <>
      <SectionHeader
        index="02"
        kicker="What we carry"
        accent="red"
        title="Every game at the table."
        lede="Singles, sealed product, packs and graded cards — from vintage favorites to the latest set. Whatever you play, there's a spot for you here."
      />

      <div className="mt-12 sm:mt-16">
        {GAMES.map((g, i) => (
          <div
            key={g.name}
            className="group grid cursor-default gap-1.5 border-t border-white/10 py-6 transition-colors hover:bg-white/[0.02] sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-7"
          >
            <div className="flex items-baseline gap-4 sm:col-span-5">
              <span className="font-mono text-xs text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl text-text transition-colors group-hover:text-tcg-red sm:text-2xl">
                {g.name}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-text-dim sm:col-span-6 sm:text-base">
              {g.descriptor}
            </p>
            <span
              className="hidden text-tcg-red opacity-0 transition-opacity group-hover:opacity-100 sm:col-span-1 sm:block sm:text-right"
              aria-hidden
            >
              →
            </span>
          </div>
        ))}
        <div className="border-t border-white/10" />
      </div>
    </>
  );
}
