/**
 * The signature motif — the logo's rising up-and-to-the-right stroke,
 * abstracted. Draws itself in when its overlay becomes visible (the engine
 * sets data-drawn="true" on this element). Green = "value going up".
 */
export function RisingArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      data-arrow
      data-drawn="false"
      className={`arrow-draw ${className}`}
      viewBox="0 0 200 90"
      fill="none"
      aria-hidden
      style={{ ["--len" as string]: "360" }}
    >
      {/* zig-zag rising line, echoing the logo */}
      <polyline
        points="6,80 46,58 78,68 120,30 158,44 192,10"
        stroke="var(--tcg-green)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* arrowhead */}
      <polyline
        points="170,8 192,10 190,32"
        stroke="var(--tcg-green)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
