/**
 * A full-bleed image "breather" between content sections (Terminal-style).
 * Reuses an existing 2K hero frame, with a subtle parallax (fixed attachment)
 * and a short overlaid line. Lifts over the previous panel like the others.
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
  return (
    <section className="panel-top overflow-hidden">
      <div
        className="relative flex h-[58vh] min-h-[360px] items-center justify-center bg-cover bg-fixed bg-center px-6 text-center"
        style={{ backgroundImage: `url('${image}')` }}
      >
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
