# TCG Exchange — scroll-driven site

A single-page, mobile-first marketing site for **TCG Exchange** (San Antonio).
The hero is a video that plays **frame-by-frame on a `<canvas>` as you scroll**,
with the whole page bleeding into the video's black background.

Built with **Next.js 16 (App Router) + TypeScript + Tailwind v4**. Deploys to Vercel.

---

## Run it locally (plain steps)

1. Install dependencies (one time):
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the address it prints — usually **http://localhost:3000**
   (it picks the next free port, e.g. 3001, if 3000 is busy).

To make the production build (what Vercel runs):
```bash
npm run build && npm start
```

Deploy: push to GitHub and import the repo on [vercel.com](https://vercel.com). No
environment variables are needed — the video frames are committed and served as
static files.

---

## The video / frames

The site does **not** use a `<video>` tag. The source MP4 is pre-sliced into a
numbered **WebP image sequence** that the canvas draws based on scroll position.

- Source videos: `public/video/intro.mp4` (Pokéball → opens → portal → lands in the
  world) and `public/video/world.mp4` (the scrollable world). They are stitched with a
  crossfade into `public/video/hero.mp4`, which is what gets extracted.
- Frames: `public/frames/desktop/` (1920px) and `public/frames/mobile/` (960px)
- `public/frames/manifest.json` — `{ frameCount, scrollHeightVh, introFrames, desktopBytes, mobileBytes }`.
  `introFrames` = how many leading frames are the intro (before the world begins).

Current set: **175 frames** (37 intro + 138 world), desktop ~9.6 MB, mobile ~4.6 MB
(within the 10 MB / 5 MB budget). The longer painterly world is encoded at `cwebp -q 29`
(desktop) / `-q 37` (mobile) to fit budget. Shorter/simpler footage can use a higher
quality. Section positions in `SECTIONS` are spaced evenly so each gets camera motion.

### Re-stitching the intro + world (only if you change a video)

```bash
# crossfade the intro into the world at the intro's tail → hero.mp4
ffmpeg -y -i public/video/intro.mp4 -i public/video/world.mp4 -filter_complex \
  "[0:v]settb=AVTB,fps=24[a];[1:v]settb=AVTB,fps=24[b];[a][b]xfade=transition=fade:duration=0.5:offset=2.54,format=yuv420p[v]" \
  -map "[v]" -an public/video/hero.mp4
```
Then update `INTRO_FRAMES` in `scripts/build-manifest.mjs` (= round(introDuration × fps))
and re-extract below.

### Re-running the extraction (after stitching, or any video change)

1. Make sure the combined clip is at `public/video/hero.mp4`.
2. If your `ffmpeg` was built with WebP support, this one-liner works directly:
   ```bash
   ffmpeg -i public/video/hero.mp4 -vf "fps=12,scale=1920:-1" -q:v 80 public/frames/desktop/frame-%04d.webp
   ffmpeg -i public/video/hero.mp4 -vf "fps=12,scale=960:-1"  -q:v 80 public/frames/mobile/frame-%04d.webp
   ```
   **If you get `Encoder not found`** (this Mac's ffmpeg had no WebP encoder), extract
   PNGs and convert with `cwebp` instead (`brew install webp` provides it):
   ```bash
   rm -rf /tmp/fd /tmp/fm && mkdir -p /tmp/fd /tmp/fm
   ffmpeg -i public/video/hero.mp4 -vf "fps=12,scale=1920:-1" /tmp/fd/frame-%04d.png
   ffmpeg -i public/video/hero.mp4 -vf "fps=12,scale=960:-1"  /tmp/fm/frame-%04d.png
   for f in /tmp/fd/*.png; do cwebp -quiet -q 80 "$f" -o "public/frames/desktop/$(basename "${f%.png}").webp"; done
   for f in /tmp/fm/*.png; do cwebp -quiet -q 80 "$f" -o "public/frames/mobile/$(basename "${f%.png}").webp"; done
   ```
3. Regenerate the manifest:
   ```bash
   node scripts/build-manifest.mjs
   ```
4. **Budget check:** desktop set must stay < 10 MB, mobile < 5 MB. If over, lower
   quality (e.g. `cwebp -q 36`) or drop the frame rate (`fps=10`). The current
   combined footage uses `-q 36` desktop / `-q 45` mobile.

> Commit the new `public/frames/**` so Vercel serves them statically.

---

## Tuning the scroll feel

All engine constants live in **`lib/engineConfig.ts`**:

| Constant          | Default | What it does                                                       |
| ----------------- | ------- | ------------------------------------------------------------------ |
| `scrollHeightVh`  | `650`   | Scroll runway for the world (taller = slower). Intro isn't scroll. |
| `INTRO_OPEN_MS`   | `2000`  | Length of the click-to-open ball animation. Scroll is locked here. |
| `SNAP_MS`         | `650`   | Smooth-snap duration when a scroll flick locks to a section.        |
| `SCRIM_OPACITY`   | `0`     | Dusk overlay strength over the world (0 = off, 1 = full/dark).      |
| `LERP_FACTOR`     | `0.09`  | Frame glide. Lower = smoother/laggier, higher = snappier.          |
| `DWELL_WIDTH`     | `0.045` | Width of each "almost-stops" slow zone at a section.               |
| `DWELL_PEAK`      | `3.5`   | How hard the scroll slows at each section (reading time).          |
| `REMAP_N`         | `2000`  | Resolution of the dwell lookup table.                              |
| `CRITICAL_FRAMES` | `16`    | Frames loaded before the loader hides.                             |
| `DPR_CAP`         | `2`     | Max device-pixel-ratio for the canvas.                             |

**Click-to-open intro & content behaviour:** the page opens on the **closed Pokéball**
with a pulsing "Click to open" prompt; page scroll is **locked**. Clicking the ball plays
the open → portal → land animation (frames `0…introFrames`, `INTRO_OPEN_MS`, scroll
stays locked), then unlocks scroll and **snaps** the dusk scrim + content on. From there
the world is scroll-driven: the whole `scrollHeightVh` maps to the world frames, and each
`SECTIONS` window snaps fully in/out (no fade). Clicking the **logo** (header or footer)
fires a `tcg:replay-intro` event that re-closes the ball and replays. Reduced-motion users
skip the gate entirely and land straight in the world.

**Section snap:** in the world, a scroll flick "follows through" and eases to the next
section (`SNAP_MS`). Desktop wheel advances exactly one section per flick; touch free-scrolls
then settles to the nearest section. Both release into the footer past the last section.
Disabled for reduced-motion.

---

## Events — going live with Supabase later

Events are **not hardcoded**. They come from `getEvents()` in **`lib/events.ts`**,
which today returns local seed data (sorted soonest-first, past events hidden).

To switch to a real database, replace only the seed return in `getEvents()` with a
Supabase query (the swap is documented inline in that file). Component code never
changes. Suggested table:

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  game text not null check (game in ('pokemon','magic','onepiece','yugioh','other')),
  title text not null,
  kind text not null check (kind in ('tournament','meetup')),
  starts_at timestamptz not null,
  location text not null check (location in ('rigsby','babcock')),
  entry_fee numeric,
  format text,
  signup_url text
);
```

---

## Where things live

```
app/
  layout.tsx          fonts (Archivo / Inter / Space Mono), metadata, black bg
  globals.css         brand tokens, glass, scrims, grain, animations
  page.tsx            assembles the page
components/
  scroll/             ScrollStage (engine), Overlay, Loader, ChapterNav
  sections/           Hero, Exchange (+RisingArrow), Games, Locations, CTA
  events/             EventsSection (server), EventCard
  ambient/            Particles, CustomCursor
  chrome/             TopBar, Footer
lib/
  engineConfig.ts     all engine tunables + section config
  events.ts           getEvents() — the Supabase swap point
  site.ts             business content (locations, hours, contact, games)
  frames.ts           typed manifest import
public/
  video/hero.mp4      source clip
  frames/             committed WebP frame sets + manifest.json
  brand/              logo (used in top bar + loader; never recolored)
scripts/
  build-manifest.mjs  regenerates frames/manifest.json
  qa-cdp.mjs          optional: headless QA pass through all sections
```

> **Before launch:** confirm the hours in `lib/site.ts` (Sun–Fri 12–8 · Sat 11–8).
