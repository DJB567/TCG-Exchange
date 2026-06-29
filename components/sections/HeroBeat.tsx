/** A single bold "beat" statement that fades over the hero video as it scrolls. */
export function HeroBeat({
  sub,
  children,
  sizeClass = "text-4xl sm:text-6xl md:text-7xl",
}: {
  sub: string;
  children: React.ReactNode;
  /** override the responsive heading size (e.g. to keep a long beat on one line) */
  sizeClass?: string;
}) {
  return (
    <div className="px-6 text-center">
      <p className="mono-label mb-4 text-tcg-red">{sub}</p>
      <h2
        className={`font-display leading-[1.02] text-white ${sizeClass}`}
      >
        {children}
      </h2>
    </div>
  );
}
