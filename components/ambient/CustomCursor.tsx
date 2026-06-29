"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop industrial cursor: a small dot + trailing ring (no arrow), that grows
 * and glows red over interactive elements. A label trails the cursor reading
 * "Click to explore" on the closed Poké Ball and "Scroll to explore" once the
 * hero video takes over — both fade away after the first scroll. Driven by the
 * hero engine via `tcg:phase` / `tcg:scrolled` window events. Hidden on touch.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return; // touch → native

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("has-custom-cursor");

    let phase = "closed";
    let scrolled = false;
    const span = label.querySelector("span");
    const refreshLabel = () => {
      let text = "";
      if (phase === "closed") text = "Click to explore";
      else if (phase === "world" && !scrolled) text = "Scroll to explore";
      if (span) span.textContent = text;
      label.dataset.show = text ? "true" : "false";
    };
    refreshLabel();

    const onPhase = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.phase) phase = d.phase;
      refreshLabel();
    };
    const onScrolled = () => {
      scrolled = true;
      refreshLabel();
    };
    window.addEventListener("tcg:phase", onPhase as EventListener);
    window.addEventListener("tcg:scrolled", onScrolled);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      label.style.transform = `translate(${mx}px, ${my}px)`;
      const t = e.target;
      const hot = t instanceof Element ? t.closest("a, button, [data-cursor]") : null;
      ring.dataset.hot = hot ? "true" : "false";
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("tcg:phase", onPhase as EventListener);
      window.removeEventListener("tcg:scrolled", onScrolled);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} aria-hidden className="cursor-ring" style={{ opacity: 0 }} />
      <div ref={labelRef} aria-hidden className="cursor-label" data-show="false">
        <span />
      </div>
    </>
  );
}
