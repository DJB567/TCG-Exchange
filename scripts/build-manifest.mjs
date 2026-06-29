// Regenerates public/frames/manifest.json from the committed WebP frame sets.
// Run after re-extracting frames: `node scripts/build-manifest.mjs`
import fs from "node:fs";
import path from "node:path";

// How many leading frames belong to the Pokéball intro, before the scrollable
// world/content frames begin. 2K from the original sources: intro.mp4 (0–1.71s
// @24fps, ending on the white flash peak) + a 6-frame fade-from-white bridge,
// then world.mp4 (0–8.0s @11fps). The flash masks the camera change — no ghost.
const INTRO_FRAMES = 48;

const root = path.resolve(import.meta.dirname, "..");
const dDir = path.join(root, "public/frames/desktop");
const mDir = path.join(root, "public/frames/mobile");

const list = (dir) =>
  fs.readdirSync(dir).filter((f) => f.endsWith(".webp")).sort();
const sum = (dir, files) =>
  files.reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);

const d = list(dDir);
const m = list(mDir);

if (d.length === 0) throw new Error("No desktop frames found — extract first.");
if (d.length !== m.length) {
  console.warn(`⚠ frame count mismatch: desktop ${d.length}, mobile ${m.length}`);
}

const manifest = {
  frameCount: d.length,
  scrollHeightVh: 650,
  introFrames: INTRO_FRAMES,
  desktopBytes: sum(dDir, d),
  mobileBytes: sum(mDir, m),
  framePattern: "frame-%04d.webp",
  firstIndex: 1,
};

fs.writeFileSync(
  path.join(root, "public/frames/manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

// Budget reflects the chosen max-quality 2K set capped at ~40 MB. (Mobile uses
// the same set for now; a lighter mobile pass will lower the mobile budget.)
const DESKTOP_BUDGET = 40;
const MOBILE_BUDGET = 40;
const mb = (b) => (b / 1048576).toFixed(2);
console.log(manifest);
console.log(
  `desktop ${mb(manifest.desktopBytes)} MB (budget ${DESKTOP_BUDGET}) · mobile ${mb(manifest.mobileBytes)} MB (budget ${MOBILE_BUDGET})`,
);
if (manifest.desktopBytes > DESKTOP_BUDGET * 1048576)
  console.warn(`⚠ desktop over ${DESKTOP_BUDGET} MB budget`);
if (manifest.mobileBytes > MOBILE_BUDGET * 1048576)
  console.warn(`⚠ mobile over ${MOBILE_BUDGET} MB budget`);
