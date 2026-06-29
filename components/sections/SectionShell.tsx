import type { CSSProperties, ReactNode } from "react";

/**
 * A content section rendered as a Terminal-style "stacked panel": it lifts over
 * the previous section with big rounded top corners (revealing the section
 * behind), and each tone sets its own background + text colors so the page
 * alternates light/dark instead of being one flat black sheet.
 */
const TONES = {
  dark: {
    bg: "#0c0d11",
    text: "#f3f3f4",
    dim: "#8d8f98",
    edge: "rgba(255,255,255,0.10)",
  },
  dark2: {
    bg: "#16181f",
    text: "#f3f3f4",
    dim: "#8d8f98",
    edge: "rgba(255,255,255,0.10)",
  },
  light: {
    bg: "#efeee9",
    text: "#17181d",
    dim: "#5b5d67",
    edge: "rgba(0,0,0,0.12)",
  },
} as const;

export type Tone = keyof typeof TONES;

export function SectionShell({
  id,
  tone = "dark",
  children,
}: {
  id?: string;
  tone?: Tone;
  children: ReactNode;
}) {
  const c = TONES[tone];
  const vars = {
    background: c.bg,
    "--sec-text": c.text,
    "--sec-dim": c.dim,
    "--sec-edge": c.edge,
  } as CSSProperties;
  return (
    <section id={id} data-tone={tone} className="panel-top" style={vars}>
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 sm:px-10 sm:pb-28 sm:pt-32">
        {children}
      </div>
    </section>
  );
}
