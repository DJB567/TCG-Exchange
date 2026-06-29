"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ENGINE,
  SECTIONS,
  clamp,
  frameUrl,
  type SectionMeta,
} from "@/lib/engineConfig";
import type { FrameManifest } from "@/lib/frames";
import { REPLAY_INTRO_EVENT } from "@/components/chrome/ReplayLogo";
import { Loader } from "./Loader";
import { Particles } from "@/components/ambient/Particles";

type FrameImage = ImageBitmap | HTMLImageElement;

/** Intro state machine: closed ball → click → opening animation → world. */
type Phase = "closed" | "opening" | "world";

type Props = {
  manifest: FrameManifest;
  children: React.ReactNode; // the six <Overlay> elements (server-rendered)
};

const TINT: Record<SectionMeta["tint"], string> = {
  red: "rgba(229, 35, 42, 0.05)",
  green: "rgba(61, 181, 46, 0.06)",
};

// gentler than cubic — near-constant playback with a soft settle, so the ball
// open doesn't decelerate hard (= hold/stutter) as it lands on the street.
const easeOutSine = (p: number): number => Math.sin((p * Math.PI) / 2);

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Lock/unlock page scroll while the ball is closed/opening (Lenis-aware). */
function setScrollLock(lock: boolean) {
  const v = lock ? "hidden" : "";
  document.documentElement.style.overflow = v;
  document.body.style.overflow = v;
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (lenis) (lock ? lenis.stop() : lenis.start());
}

/**
 * Snap visibility: a section is fully shown across its entire [showAt, hideAt]
 * window and hidden outside it — no fade, no blur. `subT` is world sub-progress.
 */
function overlayVisible(subT: number, showAt: number, hideAt: number): boolean {
  return subT >= showAt && subT < hideAt;
}

export function ScrollStage({ manifest, children }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRootRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const introParticlesRef = useRef<HTMLDivElement>(null);

  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [phase, setPhaseState] = useState<Phase>("closed");

  const phaseRef = useRef<Phase>("closed");
  const animStartRef = useRef(0);

  // update both the ref (read by the rAF loop) and the state (drives rendering),
  // and broadcast so the cursor + menu can react to the phase.
  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
    window.dispatchEvent(new CustomEvent("tcg:phase", { detail: { phase: p } }));
  }, []);

  // click the ball → play the open animation (or jump straight in if reduced)
  const openBall = () => {
    if (phaseRef.current !== "closed") return;
    if (prefersReducedMotion()) {
      setPhase("world");
      setScrollLock(false);
      return;
    }
    animStartRef.current = performance.now();
    setPhase("opening");
  };

  // logo click (header/footer) → re-close the ball and replay the intro
  const replayIntro = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (prefersReducedMotion()) return;
    animStartRef.current = 0;
    setPhase("closed");
    setScrollLock(true);
  };

  // initial lock + phase, touch detection, and the replay listener
  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase("world");
      setScrollLock(false);
    } else {
      setPhase("closed");
      setScrollLock(true);
    }
    const onReplay = () => replayIntro();
    window.addEventListener(REPLAY_INTRO_EVENT, onReplay);
    return () => {
      window.removeEventListener(REPLAY_INTRO_EVENT, onReplay);
      setScrollLock(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const overlayRoot = overlayRootRef.current;
    if (!canvas || !section || !overlayRoot) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    // crisp downscale/upscale of the 2K frames (esp. on retina)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const reduceMotion = prefersReducedMotion();
    const dir: "desktop" | "mobile" =
      window.innerWidth < ENGINE.MOBILE_BREAKPOINT ? "mobile" : "desktop";

    const total = manifest.frameCount;
    const first = manifest.firstIndex; // 1
    const last = first + total - 1;
    const bitmaps: (FrameImage | undefined)[] = new Array(last + 1);

    // The clip is [ intro frames (ball → opens → lands) | world frames ]. The
    // intro plays on click (timer-driven); the world is dwell-remapped across
    // the whole scroll runway and is where the content sections live.
    const introFrames = manifest.introFrames ?? 0;
    const worldFrames = Math.max(1, total - introFrames);

    let disposed = false;
    let rafId = 0;
    let currentFrame = 0; // 0-based progress along the sequence

    // ---- dwell remap lookup table ---------------------------------------
    // density is LOW near dwell centers so the frame barely advances there.
    const N = ENGINE.REMAP_N;
    const cum = new Float32Array(N);
    {
      let acc = 0;
      for (let i = 0; i < N; i++) {
        const p = i / (N - 1);
        let wells = 0;
        for (const c of SECTIONS.map((s) => s.showAt + (s.hideAt - s.showAt) / 2)) {
          const d = (p - c) / ENGINE.DWELL_WIDTH;
          wells += Math.exp(-0.5 * d * d);
        }
        const speed = 1 / (1 + ENGINE.DWELL_PEAK * wells);
        acc += speed;
        cum[i] = acc;
      }
      const totalAcc = cum[N - 1] || 1;
      for (let i = 0; i < N; i++) cum[i] /= totalAcc;
    }
    const remap = (t: number): number => {
      const x = clamp(t, 0, 1) * (N - 1);
      const i = Math.floor(x);
      const frac = x - i;
      const a = cum[i];
      const b = cum[Math.min(N - 1, i + 1)];
      return a + (b - a) * frac;
    };

    // ---- canvas sizing ---------------------------------------------------
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, ENGINE.DPR_CAP);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      // resizing the canvas resets ctx state — re-apply hi-quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    const nearestLoaded = (idx: number): FrameImage | undefined => {
      const clamped = clamp(idx, first, last);
      if (bitmaps[clamped]) return bitmaps[clamped];
      for (let r = 1; r <= total; r++) {
        if (bitmaps[clamped - r]) return bitmaps[clamped - r];
        if (bitmaps[clamped + r]) return bitmaps[clamped + r];
      }
      return undefined;
    };

    // Portrait crop rules. On a phone a cover-crop only shows a narrow vertical
    // slice of the wide footage, so:
    //  • the closed/opening Pokéball is CONTAINED + centered so the whole ball
    //    is in frame (seamless black letterbox against its black background);
    //  • every other frame (flash → world) covers and stays CENTERED so the view
    //    looks straight down the street at the garage / TCG Exchange sign.
    const PORTRAIT_RATIO = 1.15; // ch/cw above this → treat as portrait
    const PORTRAIT_WORLD_PX = 0.5; // world frames: centered down the street
    const PORTRAIT_BALL_FIT = 0.5; // ball scale vs cover so the whole ball fits

    // The first ~60% of the intro is the ball itself; after it opens the flash
    // takes over and switches to the centered world crop.
    const ballFrames = Math.round(introFrames * 0.6);
    const isBallFrame = (idx: number) => idx < first + ballFrames;

    const drawFrame = (img: FrameImage | undefined, ball = false) => {
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.width;
      const ih = img.height;
      const portrait = ch / cw > PORTRAIT_RATIO;

      if (ball && portrait) {
        // contain the centered ball — whole ball visible, seamless black bars
        const scale = (ch / ih) * PORTRAIT_BALL_FIT;
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
        return;
      }

      // cover-crop; portrait world frames bias left, everything else centered
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const px = portrait && !ball ? PORTRAIT_WORLD_PX : 0.5;
      const x = (cw - dw) * px;
      const y = (ch - dh) / 2;
      ctx.fillStyle = ball ? "#000000" : "#0a1326";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, dw, dh);
    };

    // ---- overlay / chapter / tint updates --------------------------------
    type OverlayHandle = { el: HTMLElement; meta: SectionMeta; arrow?: HTMLElement | null };
    const overlays: OverlayHandle[] = SECTIONS.map((meta) => {
      const el = overlayRoot.querySelector<HTMLElement>(
        `[data-overlay-id="${meta.id}"]`,
      );
      return el
        ? { el, meta, arrow: el.querySelector<HTMLElement>("[data-arrow]") }
        : null;
    }).filter(Boolean) as OverlayHandle[];

    /**
     * Fade the bold hero "beat" words in/out across their scroll windows (via
     * the .overlay CSS transition), tint the active beat, and drive the dusk
     * scrim. Hidden entirely during the Poké Ball intro.
     */
    const applyOverlays = (subT: number, inWorld: boolean) => {
      let activeIdx = -1;
      overlays.forEach((h, i) => {
        const vis =
          inWorld && overlayVisible(subT, h.meta.showAt, h.meta.hideAt);
        h.el.style.opacity = vis ? "1" : "0";
        h.el.style.visibility = vis ? "visible" : "hidden";
        if (vis) activeIdx = i;
      });

      if (tintRef.current) {
        tintRef.current.style.background =
          inWorld && activeIdx >= 0
            ? TINT[overlays[activeIdx].meta.tint]
            : "transparent";
      }
      if (scrimRef.current) {
        scrimRef.current.style.opacity = inWorld
          ? String(ENGINE.SCRIM_OPACITY)
          : "0";
      }
    };

    // ---- frame loading ---------------------------------------------------
    const loadFrame = async (i: number): Promise<void> => {
      if (bitmaps[i] || disposed) return;
      const url = frameUrl(dir, i);
      try {
        if (typeof createImageBitmap === "function") {
          const res = await fetch(url);
          const blob = await res.blob();
          if (disposed) return;
          bitmaps[i] = await createImageBitmap(blob);
        } else {
          bitmaps[i] = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
          });
        }
      } catch {
        /* leave hole; nearestLoaded() covers it so there's never a white flash */
      }
    };

    // ---- reduced-motion path --------------------------------------------
    if (reduceMotion) {
      // no ball gate or animation: sit on a representative world frame and map
      // raw scroll straight to world sub-progress so content still toggles.
      const repIndex = Math.min(
        last,
        first + introFrames + Math.round(worldFrames * 0.06),
      );
      fit();
      loadFrame(repIndex).then(() => {
        if (disposed) return;
        drawFrame(nearestLoaded(repIndex));
        setLoadPct(100);
        setReady(true);
        if (scrimRef.current) {
          scrimRef.current.style.opacity = String(ENGINE.SCRIM_OPACITY);
        }
      });
      const onScrollStatic = () => {
        const rect = section.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const t = span > 0 ? clamp(-rect.top / span, 0, 1) : 0;
        applyOverlays(t, true);
      };
      const onResizeStatic = () => {
        fit();
        drawFrame(nearestLoaded(repIndex));
      };
      onScrollStatic();
      window.addEventListener("scroll", onScrollStatic, { passive: true });
      window.addEventListener("resize", onResizeStatic);
      return () => {
        disposed = true;
        window.removeEventListener("scroll", onScrollStatic);
        window.removeEventListener("resize", onResizeStatic);
      };
    }

    // ---- animated path: progressive load then rAF loop -------------------
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    fit();

    // nudge the prompt when someone tries to scroll past the locked ball
    let lastNudge = 0;
    const nudge = () => {
      if (phaseRef.current !== "closed") return;
      const el = promptRef.current;
      if (!el) return;
      const t = performance.now();
      if (t - lastNudge < 650) return;
      lastNudge = t;
      el.classList.remove("nudge");
      void el.offsetWidth; // restart the animation
      el.classList.add("nudge");
    };
    window.addEventListener("wheel", nudge, { passive: true });
    window.addEventListener("touchmove", nudge, { passive: true });

    // fire once when the visitor first scrolls in the world (fades the cursor
    // label "Scroll to explore" away)
    let scrolledOnce = false;

    const startLoop = () => {
      const tick = (now: number) => {
        if (disposed) return;
        const phase = phaseRef.current;

        if (phase === "world") {
          const rect = section.getBoundingClientRect();
          const span = rect.height - window.innerHeight;
          const t = span > 0 ? clamp(-rect.top / span, 0, 1) : 0;
          if (!scrolledOnce && t > 0.004) {
            scrolledOnce = true;
            window.dispatchEvent(new CustomEvent("tcg:scrolled"));
          }
          const target = introFrames + remap(t) * (worldFrames - 1);
          currentFrame += (target - currentFrame) * ENGINE.LERP_FACTOR;
          const idx = first + Math.round(currentFrame);
          drawFrame(nearestLoaded(idx), isBallFrame(idx));
          applyOverlays(t, true);
          // Fade the dust particles out as we approach + enter the open garage,
          // so they're gone once you're inside the shop. (Tied to the displayed
          // frame, so they fade back in if you scroll back up the street.)
          if (particlesRef.current) {
            const fpos = first + currentFrame;
            const FADE_START = 82;
            const FADE_END = 95;
            const o =
              fpos <= FADE_START
                ? 1
                : fpos >= FADE_END
                  ? 0
                  : 1 - (fpos - FADE_START) / (FADE_END - FADE_START);
            particlesRef.current.style.opacity = o.toFixed(3);
          }
          if (introParticlesRef.current)
            introParticlesRef.current.style.opacity = "0";
        } else if (phase === "opening") {
          const p = clamp(
            (now - animStartRef.current) / ENGINE.INTRO_OPEN_MS,
            0,
            1,
          );
          currentFrame = easeOutSine(p) * Math.max(0, introFrames - 1);
          const idx = first + Math.round(currentFrame);
          drawFrame(nearestLoaded(idx), isBallFrame(idx));
          applyOverlays(0, false);
          if (particlesRef.current) particlesRef.current.style.opacity = "1";
          if (introParticlesRef.current)
            introParticlesRef.current.style.opacity = "1";
          if (p >= 1) {
            setPhase("world");
            setScrollLock(false);
          }
        } else {
          // closed: rest on the first frame (the closed ball)
          currentFrame = 0;
          drawFrame(nearestLoaded(first), true);
          applyOverlays(0, false);
          if (particlesRef.current) particlesRef.current.style.opacity = "1";
          if (introParticlesRef.current)
            introParticlesRef.current.style.opacity = "1";
        }

        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const run = async () => {
      // first paint ASAP — the closed ball
      await loadFrame(first);
      if (disposed) return;
      drawFrame(nearestLoaded(first), true);

      // Load the FULL intro before the ball becomes clickable, so the click-to-
      // open animation is always buttery (these frames play the instant they
      // click). The loader bar reflects this.
      const introList: number[] = [];
      for (let i = first; i < first + introFrames && i <= last; i++) {
        introList.push(i);
      }
      let done = 0;
      for (let i = 0; i < introList.length; i += ENGINE.BATCH_SIZE) {
        if (disposed) return;
        await Promise.all(
          introList.slice(i, i + ENGINE.BATCH_SIZE).map((idx) => loadFrame(idx)),
        );
        done = Math.min(introList.length, i + ENGINE.BATCH_SIZE);
        setLoadPct(Math.round((done / introList.length) * 100));
        drawFrame(nearestLoaded(first), true);
      }
      setReady(true); // ball is now clickable + the prompt shows
      startLoop();

      // Stream the world frames in the background while the visitor reads the
      // prompt and decides to click — so the world is mostly ready by click time
      // (and keeps filling during the open + hero). nearestLoaded() covers any
      // gap, so an early click never flashes white.
      const worldList: number[] = [];
      for (let i = first + introFrames; i <= last; i++) worldList.push(i);
      for (let i = 0; i < worldList.length; i += ENGINE.BATCH_SIZE) {
        if (disposed) return;
        await Promise.all(
          worldList.slice(i, i + ENGINE.BATCH_SIZE).map((idx) => loadFrame(idx)),
        );
      }
    };

    run();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", nudge);
      window.removeEventListener("touchmove", nudge);
      bitmaps.forEach((b) => {
        if (b && "close" in b) (b as ImageBitmap).close();
      });
    };
  }, [manifest]);

  return (
    <>
      <Loader pct={loadPct} done={ready} />
      <section
        ref={sectionRef}
        data-stage
        className="relative"
        style={{ height: `${manifest.scrollHeightVh}vh` }}
        aria-label="TCG Exchange scroll experience"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="block h-full w-full bg-bg"
            aria-hidden="true"
          />
          {/* cinematic mute — hidden during the crisp intro, snaps on in world */}
          <div
            ref={scrimRef}
            className="video-scrim"
            style={{ opacity: 0 }}
            aria-hidden="true"
          />
          <div
            ref={tintRef}
            className="pointer-events-none absolute inset-0 transition-[background] duration-700 ease-out"
            aria-hidden="true"
          />
          <div ref={particlesRef} className="pointer-events-none absolute inset-0">
            <Particles />
          </div>
          {/* extra dust around the Poké Ball intro only — fades out as it opens
              (masked by the flash), leaving the world field unchanged */}
          <div
            ref={introParticlesRef}
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          >
            <Particles count={46} seed={91237} />
          </div>
          <div ref={overlayRootRef} className="absolute inset-0">
            {children}
          </div>

          {/* click beacon over the centered Poké Ball (cursor shows the label) */}
          {ready && phase === "closed" ? (
            <div ref={promptRef} className="intro-overlay">
              <button
                type="button"
                onClick={openBall}
                className="intro-hit"
                aria-label="Open the Poké Ball to explore the site"
              >
                <span className="intro-ring" aria-hidden />
                <span className="intro-ring intro-ring--2" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
