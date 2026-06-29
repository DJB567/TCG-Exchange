import { AnimatedWordmark } from "./AnimatedWordmark";

const STATS = [
  { label: "Locations", value: "2" },
  { label: "Games", value: "4+" },
  { label: "We do", value: "Buy · Sell · Trade" },
  { label: "Where", value: "San Antonio, TX" },
];

export function Hero() {
  return (
    <div>
      <span
        className="font-display block leading-[0.92] text-text"
        style={{ fontSize: "clamp(44px, 6vw, 84px)" }}
      >
        <AnimatedWordmark text="TCG EXCHANGE" />
      </span>

      <p className="mt-4 text-lg font-light text-text sm:text-xl">
        Your local trading card hub.
      </p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-text/85 sm:text-base">
        Two San Antonio shops where collectors buy, sell and trade Pokémon,
        Magic, One Piece, Yu-Gi-Oh! &amp; more — from a single card to a whole
        collection.
      </p>

      <div className="glass mt-7 inline-flex flex-wrap gap-x-6 gap-y-3 rounded-xl px-5 py-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-1 ${
              i > 0 ? "sm:border-l sm:border-white/10 sm:pl-6" : ""
            }`}
          >
            <span className="mono-label">{s.label}</span>
            <span className="font-display text-sm text-text">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
