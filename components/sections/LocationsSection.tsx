import { LOCATIONS, SITE } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";

function DottedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="mono-label shrink-0">{label}</span>
      <span className="min-w-0 flex-1 translate-y-[-3px] border-b border-dotted border-white/15" />
      <span className="shrink-0 text-right text-sm text-text">{value}</span>
    </div>
  );
}

/** 04 — Find us: the two San Antonio shops, side by side. */
export function LocationsSection() {
  return (
    <>
      <SectionHeader
        index="04"
        kicker="Find us"
        accent="red"
        title="Two shops. One city."
        lede="Whichever side of town you're on, there's a friendly counter ready to deal — and a table to sit down and play at."
      />

      <div className="mt-12 grid gap-10 sm:mt-16 md:grid-cols-2 md:gap-0">
        {LOCATIONS.map((loc, i) => (
          <div
            key={loc.key}
            className={`border-t border-white/10 pt-8 ${
              i === 1 ? "md:border-l md:border-white/10 md:pl-12" : "md:pr-12"
            }`}
          >
            <h3 className="font-display text-2xl text-text sm:text-3xl">
              {loc.name}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-dim">
              {loc.blurb}
            </p>

            <p className="mt-5 text-base text-text">{loc.address}</p>
            <p className="text-sm text-text-dim">{loc.cityLine}</p>
            {loc.note ? (
              <p className="mt-2 text-sm font-medium text-tcg-green">
                {loc.note}
              </p>
            ) : null}

            <div className="mt-6 space-y-3">
              <DottedRow label="Hours" value={SITE.hours} />
              <DottedRow label="Phone" value={SITE.phone} />
            </div>

            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label mt-6 inline-block text-tcg-red transition-colors hover:text-text"
            >
              Get directions →
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
