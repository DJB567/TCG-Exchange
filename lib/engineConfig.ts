/**
 * Scroll-video engine tunables. Tweak these to change feel — see README.
 */
export const ENGINE = {
  /** Total scroll runway for the pinned canvas (world only), in viewport
   *  heights. The Pokéball intro is click-triggered, not scrolled, so this
   *  covers just the world + content. */
  scrollHeightVh: 650,

  /** Duration (ms) of the click-to-open animation: ball → opens → portal →
   *  lands in the world. Scroll is locked until it finishes. */
  INTRO_OPEN_MS: 2000,

  /** Duration (ms) of the smooth snap that eases the page to a section after a
   *  scroll flick. Lower = snappier, higher = more languid. */
  SNAP_MS: 650,

  /** Strength of the dusk overlay (`.video-scrim`) over the hero footage, 0–1.
   *  A little darkening keeps the bold beat words legible over the neon video. */
  SCRIM_OPACITY: 0.3,

  /** Resolution of the dwell-remap lookup table. Higher = smoother remap. */
  REMAP_N: 2000,
  /** Std-dev of each dwell "well" in progress units. Wider = longer slow zone. */
  DWELL_WIDTH: 0.045,
  /** Strength of the slow-down at each dwell center. Higher = scroll stops harder.
   *  0 = no dwell, video scrolls perfectly uniform (restore to 3.5 to bring the
   *  "pause on each beat word" effect back). */
  DWELL_PEAK: 0,

  /** Frame easing — lower = glassier glide, higher = snappier. 1.0 = no extra
   *  smoothing: the frame locks 1:1 to the (Lenis-smoothed) scroll, exactly like
   *  the content sections. Lower it (e.g. 0.3) to add a glassier trail back. */
  LERP_FACTOR: 1,

  /** Below this width we load the lighter mobile frame set. */
  MOBILE_BREAKPOINT: 768,
  /** Cap device-pixel-ratio so retina phones don't over-render the canvas. */
  DPR_CAP: 2,

  /** Mobile only: max number of decoded frames held in memory at once. When
   *  finite, the engine keeps a sliding window around the playhead and frees
   *  the rest so iOS Safari can't OOM-crash — at the cost of some scroll
   *  choppiness when a fast flick outruns the window. Set to Infinity to
   *  preload every frame like desktop (smoothest, but uses ~620 MB at the
   *  1280×720 set — only safe if the device can hold the whole sequence).
   *  TESTING: Infinity to check if the 1280×720 shrink alone avoids the crash. */
  MOBILE_MAX_DECODED: Infinity as number,
  /** Frames to prefetch ahead of / behind the mobile playhead each tick. */
  MOBILE_WINDOW_AHEAD: 16,
  MOBILE_WINDOW_BEHIND: 6,

  /** How many evenly-spaced frames to load before hiding the loader. */
  CRITICAL_FRAMES: 16,
  /** How many frames to fetch per background batch after critical frames. */
  BATCH_SIZE: 6,
} as const;

/**
 * Scroll-progress centers where the video "almost stops" so each text section
 * has reading time. These align 1:1 with the six overlay show-positions.
 */
export const SHOW_POSITIONS = [0.16, 0.5, 0.85] as const;

export type SectionMeta = {
  id: string;
  label: string; // chapter-nav label
  showAt: number;
  hideAt: number;
  /** anchor of the overlay content within the viewport */
  anchor:
    | "lower-left"
    | "center-left"
    | "center"
    | "lower-center"
    | "upper-left";
  /** which accent the tint wash leans toward while this section is active */
  tint: "red" | "green";
};

/**
 * The six narrative sections. showAt/hideAt are raw-scroll-progress windows;
 * the engine fades each overlay in/out across a small margin inside them.
 */
// Three bold "beats" that fade over the hero video as it plays (Terminal-style
// statements). The real content lives in normal page sections below the hero.
export const SECTIONS: SectionMeta[] = [
  { id: "beat1", label: "Enter", showAt: 0.04, hideAt: 0.32, anchor: "center", tint: "red" },
  { id: "beat2", label: "Trade", showAt: 0.4, hideAt: 0.64, anchor: "center", tint: "green" },
  { id: "beat3", label: "Hub", showAt: 0.72, hideAt: 1.001, anchor: "lower-center", tint: "red" },
];

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** 4-digit zero-padded frame URL, e.g. /frames/desktop/frame-0007.webp */
export function frameUrl(dir: "desktop" | "mobile", index: number): string {
  return `/frames/${dir}/frame-${String(index).padStart(4, "0")}.webp`;
}
