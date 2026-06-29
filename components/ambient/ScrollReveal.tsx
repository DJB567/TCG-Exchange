"use client";

import { Fragment, useEffect, useRef } from "react";

/**
 * Terminal-style scroll-linked text reveal: the copy starts faint and a sweep
 * of our brand green fills it word-by-word (reading order) as the element
 * scrolls up through the viewport. Used on section titles + their paragraphs.
 */

// shared scroll loop so every instance updates from one rAF tick
type Updater = () => void;
const updaters = new Set<Updater>();
let ticking = false;
let bound = false;
function tick() {
  ticking = false;
  updaters.forEach((u) => u());
}
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(tick);
}
function ensureBound() {
  if (bound) return;
  bound = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

// Each word travels dim → green (at the moving wavefront) → settled (readable),
// so green sweeps across as a highlight and leaves readable text behind. The
// "dim" and "settled" colors flip for light sections.
const GREEN = [61, 181, 46, 1]; // --tcg-green (the moving highlight)
const TONE = {
  dark: { dim: [243, 244, 244, 0.22], settle: [243, 243, 244, 1] },
  light: { dim: [23, 24, 29, 0.3], settle: [23, 24, 29, 1] },
} as const;
type Tone = keyof typeof TONE;

function lerpC(a: readonly number[], b: readonly number[], k: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
    a[3] + (b[3] - a[3]) * k,
  ];
}
function mix(f: number, tone: Tone) {
  const { dim, settle } = TONE[tone];
  let c: number[];
  if (f <= 0) c = [...dim];
  else if (f >= 1) c = [...settle];
  else if (f < 0.5) c = lerpC(dim, GREEN, f / 0.5);
  else c = lerpC(GREEN, settle, (f - 0.5) / 0.5);
  return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
}
function dimColor(tone: Tone) {
  const d = TONE[tone].dim;
  return `rgba(${d[0]},${d[1]},${d[2]},${d[3]})`;
}

export function ScrollReveal({
  text,
  className,
  tag = "span",
  tone = "dark",
}: {
  text: string;
  className?: string;
  tag?: "h2" | "h3" | "p" | "span";
  tone?: Tone;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    const N = words.length;
    if (!N) return;
    const feather = 4; // how many words transition at once

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.color = mix(1, tone)));
      return;
    }

    let last = -1;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const startY = 0.9 * vh;
      const endY = 0.4 * vh;
      const p = Math.min(1, Math.max(0, (startY - rect.top) / (startY - endY)));
      if (Math.abs(p - last) < 0.0015) return;
      last = p;
      const reach = p * (N + feather);
      for (let i = 0; i < N; i++) {
        const f = Math.min(1, Math.max(0, (reach - i) / feather));
        words[i].style.color = mix(f, tone);
      }
    };

    updaters.add(update);
    ensureBound();
    update();
    return () => {
      updaters.delete(update);
    };
  }, [text, tone]);

  const Tag = tag as "span";
  const parts = text.split(" ");
  return (
    <Tag ref={ref as React.Ref<HTMLSpanElement>} className={className}>
      {parts.map((w, i) => (
        <Fragment key={i}>
          <span data-w style={{ color: dimColor(tone) }}>
            {w}
          </span>
          {i < parts.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
