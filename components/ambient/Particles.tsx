/**
 * ~40 slow-drifting warm-white dots — dust in a spotlight.
 * Positions are seeded/deterministic so server and client markup match (no
 * hydration mismatch) and no client effect is needed. Disabled under
 * prefers-reduced-motion via CSS (see globals.css `.particles`).
 */

// mulberry32 — tiny deterministic PRNG so the field is stable across renders.
function makeRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeDots(count: number, seed: number) {
  const rng = makeRng(seed);
  return Array.from({ length: count }, () => ({
    left: `${(rng() * 100).toFixed(3)}%`,
    top: `${(rng() * 100).toFixed(3)}%`,
    size: +(1 + rng() * 2.5).toFixed(2),
    opacity: +(0.05 + rng() * 0.3).toFixed(3),
    duration: +(8 + rng() * 10).toFixed(2),
    delay: +(-rng() * 12).toFixed(2),
  }));
}

export function Particles({
  count = 40,
  seed = 20260625,
}: {
  count?: number;
  seed?: number;
} = {}) {
  const dots = makeDots(count, seed);
  return (
    <div
      className="particles pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#fdf6ec]"
          style={{
            left: d.left,
            top: d.top,
            width: `${d.size}px`,
            height: `${d.size}px`,
            opacity: d.opacity,
            animation: `drift ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
