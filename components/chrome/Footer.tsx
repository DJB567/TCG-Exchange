import { LOCATIONS, SITE } from "@/lib/site";
import { ReplayLogo } from "./ReplayLogo";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <ReplayLogo className="h-12 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-text-dim">
              {SITE.tagline}{" "}Buy · Sell · Trade — Pokémon, Magic, One Piece,
              Yu-Gi-Oh! &amp; more in {SITE.city}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {LOCATIONS.map((loc) => (
              <div key={loc.key}>
                <p className="mono-label text-tcg-red">{loc.name}</p>
                <a
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-text transition-colors hover:text-tcg-red"
                >
                  {loc.address}
                  <br />
                  {loc.cityLine}
                </a>
                {loc.note ? (
                  <p className="mt-1 text-xs text-tcg-green">{loc.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="mono-label">{SITE.hours}</span>
            <a
              href={SITE.phoneHref}
              className="text-text transition-colors hover:text-tcg-red"
            >
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="text-text transition-colors hover:text-tcg-red"
            >
              {SITE.email}
            </a>
          </div>
          <div className="mono-label flex items-center gap-4">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-tcg-red"
            >
              Instagram
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-tcg-red"
            >
              Facebook
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-text-dim">
          © {new Date().getFullYear()} {SITE.name}. {SITE.city}.
        </p>
      </div>
    </footer>
  );
}
