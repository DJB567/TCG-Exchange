import type { SectionMeta } from "@/lib/engineConfig";

type Anchor = SectionMeta["anchor"];

// Base (mobile-first) alignment classes.
const ANCHOR: Record<Anchor, string> = {
  "lower-left": "items-end justify-start text-left",
  "center-left": "items-center justify-start text-left",
  center: "items-center justify-center text-center",
  "lower-center": "items-end justify-center text-center",
  "upper-left": "items-start justify-start text-left",
};

// Desktop (sm+) overrides — kept as literal strings so Tailwind detects them.
const ANCHOR_SM: Record<Anchor, string> = {
  "lower-left": "sm:items-end sm:justify-start sm:text-left",
  "center-left": "sm:items-center sm:justify-start sm:text-left",
  center: "sm:items-center sm:justify-center sm:text-center",
  "lower-center": "sm:items-end sm:justify-center sm:text-center",
  "upper-left": "sm:items-start sm:justify-start sm:text-left",
};

// Where the soft text pad sits, matched to where each section's copy is anchored.
const PAD_POS: Record<Anchor, string> = {
  "lower-left": "30% 66%",
  "center-left": "32% 50%",
  center: "50% 50%",
  "lower-center": "50% 66%",
  "upper-left": "30% 36%",
};

const pad = (pos: string) =>
  `radial-gradient(58% 56% at ${pos}, rgba(7,12,26,0.62) 0%, rgba(7,12,26,0.3) 42%, rgba(7,12,26,0) 72%)`;

type Props = {
  id: SectionMeta["id"];
  anchor: Anchor;
  /** optional override for phones; falls back to `anchor` when omitted */
  anchorMobile?: Anchor;
  children: React.ReactNode;
};

/**
 * A single scroll overlay. The engine targets it by data-overlay-id and drives
 * its opacity. No backdrop scrim — the copy carries its own legibility via a
 * dark text-shadow (see `.overlay` text rules) so the world video stays clear.
 * `anchorMobile` lets a beat sit differently on phones vs desktop.
 */
export function Overlay({ id, anchor, anchorMobile, children }: Props) {
  const mobile = anchorMobile ?? anchor;
  return (
    <div data-overlay-id={id} className="overlay pointer-events-none">
      {/* soft, localized pad behind just the text — matched to the copy position
          at each breakpoint so it backs the text, not empty space */}
      <div
        className="pointer-events-none absolute inset-0 sm:hidden"
        aria-hidden
        style={{ background: pad(PAD_POS[mobile]) }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        aria-hidden
        style={{ background: pad(PAD_POS[anchor]) }}
      />
      <div
        className={`absolute inset-0 flex ${ANCHOR[mobile]} ${ANCHOR_SM[anchor]} px-5 pb-10 pt-[84px] sm:px-10 sm:pb-20 sm:pt-24 md:px-16 lg:px-24`}
      >
        <div className="pointer-events-auto w-full max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
