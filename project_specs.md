# TCG Exchange — Project Specs v2 (Full Redesign)

> The blueprint for the redesign. Nothing gets built until you approve it.
> Plain-English summary first, detail below.

---

## Plain-English summary

We're rebuilding the TCG Exchange site into a **dark, industrial, neon** website that
feels like a **real multi-page site** *and* opens with a **cinematic scroll experience** —
"best of both worlds," with the smooth, premium flow of **terminal-industries.com**.

You land on a gritty **industrial Poké Ball** with the words **"Click to explore"**
trailing your cursor. You click, the ball opens, and a **neon-street → into-the-shop**
video plays as you scroll (frame by frame, buttery smooth). The cursor now says
**"Scroll to explore,"** a clean **menu bar fades in**, and once you start scrolling the
words melt into a **circular industrial cursor** for the rest of the site. A few **bold
words** appear over the video — no heavy content yet. After the video, the page keeps
scrolling **down into the real content sections**, then it behaves like a normal
multi-page site via the menu.

---

## 1. Goals & inspiration

- **Best of both worlds:** cinematic scroll-hero (like our current build) **+** full
  traditional multi-page website.
- **Reference:** [terminal-industries.com](https://terminal-industries.com) — for its
  **structure, sticky minimal menu, stacked content sections, and especially its smooth
  premium scroll**. We adapt that *structure/flow* to our **dark industrial/neon** look
  (Terminal is light; we are dark).
- **Smoothness is a first-class requirement** — buttery, inertia-based smooth scrolling.

## 2. Visual theme

- **Dark industrial + neon.** Weathered metal, concrete, brick, fog, wet-asphalt
  reflections; neon accents in the brand red/green (and warm signage glow).
- Keep brand accents: `--tcg-red #E5232A`, `--tcg-green #3DB52E`; introduce dark
  industrial base tones (near-black charcoals, gunmetal) + neon glow treatments.
- Typography: bold technical sans for headlines (Archivo/Anton-class), clean body (Inter),
  Space Mono for labels — same family as today, re-skinned darker/grittier.

## 3. The home page experience (the centerpiece — Phase 1)

A single scrolling home page in this order:

1. **Industrial Poké Ball intro** (`tcg ball 2.mp4`, ~3s) — click-to-open, like today.
   - Custom cursor shows **"Click to explore"** trailing the pointer.
   - Click the ball → it opens → hands off into the hero video.
2. **Neon hero video** (the upscaled 2K street→shop→checkout clip) — **scroll-driven**,
   frame-by-frame on a canvas, smooth.
   - On hand-off: cursor switches to **"Scroll to explore,"** and the **menu bar fades
     in**. The instant the user scrolls, the trailing words **fade out** and the cursor
     becomes a **circular industrial cursor** (no arrow) for the rest of the site.
   - **Only a few bold words/phrases** appear over the video (Terminal-style statements),
     timed to the scroll — no detailed content here.
3. **Content sections scroll in below the video** (Terminal-inspired layout, dark
   industrial). Proposed sections:
   - **Brand statement** — one big, bold line about what TCG Exchange is.
   - **Buy · Sell · Trade** — the core service, three-pillar layout.
   - **Games we carry** — Pokémon, Magic, One Piece, Yu-Gi-Oh! & more, feature grid
     (numbered, Terminal-style).
   - **Why TCG Exchange** — value props / stats (fair offers, real collectors, 2 shops).
   - **Events** — preview of upcoming tournaments/meetups (+ link to Events page).
   - **Locations** — the two San Antonio shops.
   - **Community / testimonial** — social proof.
   - **CTA + footer** — visit us / follow / contact, multi-column footer.

All copy is **written fresh, top-designer quality** (real business facts kept).

## 4. Custom cursor (desktop)

- **State A — ball/landing:** small circular cursor + trailing label **"Click to
  explore."**
- **State B — hero video (after click), before scroll:** label **"Scroll to explore."**
- **State C — after first scroll → rest of site:** label fades out; a **circular
  industrial cursor** (ring/dot, neon-tinted, expands over links/buttons). Never an arrow.
- Hidden on touch devices (normal touch behavior).

## 5. Menu / navigation (Terminal-style)

- **Sticky, minimal top bar**, fades in when the hero video takes over. Logo left; a few
  primary tabs; a prominent CTA on the right.
- **Proposed tabs:** `About` · `Events` · `Locations` · `Shop ↗` · CTA: `Visit Us` /
  `Contact`. (Logo = home. "Shop ↗" links out to the future WordPress subdomain.)
- Tabs link to dedicated pages (Phase 2) and/or scroll to home sections.

## 6. Pages (multi-page)

- **Home** (Phase 1) — the cinematic experience + content sections above.
- **About, Events, Locations, Contact** — dedicated pages (Phase 2), dark industrial,
  reusing the design system. Events keeps the dynamic-ready data layer (Supabase-swap).
- **Shop** — a built-in **"Coming Soon"** page (`/shop`) in our dark-industrial style
  (with a Higgsfield-designed hero). The menu's **Shop** tab links here for now; we
  re-point it to the real WordPress store/subdomain once it's built.

## 7. Tech & smoothness

- **Next.js (App Router) + TypeScript + Tailwind** (existing project, redesigned).
- **Smooth scrolling:** add an inertia smooth-scroll layer (e.g. **Lenis**) so the whole
  site has Terminal's buttery feel, synced with the canvas hero engine.
- Reuse + adapt the **frame-extraction scroll engine** for the hero video; reuse the
  events data layer. Reduced-motion respected. Vercel-deployable, clean build.
- New assets: industrial Poké Ball intro video + 2K neon hero video → stitched/extracted
  to frames like today.

## 8. Phasing

- **Phase 1 (now):** the full **home experience** — ball intro, neon hero scroll, custom
  cursor, fade-in menu, bold word overlays, and the home content sections + footer.
- **Phase 2:** the dedicated pages (About, Events, Locations, Contact) + Shop link.

## 9. What "done" looks like (Phase 1)

- Buttery smooth scroll end-to-end; 60fps hero; no jank.
- Ball → click → opens → neon hero scroll → content sections, all seamless.
- Cursor states A→B→C work; menu fades in correctly; reduced-motion fallback.
- Dark industrial/neon design is cohesive and premium; all-new copy.
- Responsive 360px → ultrawide; clean Vercel build, no console errors.

## 10. Resolved decisions (approved)

1. **Menu tabs:** `About · Events · Locations · Shop · Contact` (Shop → built-in
   Coming-Soon page for now).
2. **Hero:** industrial Poké Ball intro **first** (it opens into the neon street), then
   the 2K neon street → shop → checkout clip as the scroll hero. Stitched at the
   neon-street seam.
3. **Smooth scroll:** add **Lenis**. ✅ (retuned to lerp-based glide for extra smoothness)
4. **Bold hero words:** I draft them. ✅

---

# v3 — Content sections: bespoke Terminal-style redesign

> Replaces the reused "glass card" sections below the hero with a cohesive,
> editorial, Terminal-style content system. New layouts + all-new copy.

## A. Design language (shared system)

- **Full-bleed dark sections** separated by **thin hairline rules** (`border-edge`),
  not boxes-on-a-page. Generous vertical rhythm (py ~28–40).
- **Numbered section index:** every section opens with a mono kicker like
  `01 / HOW IT WORKS`, a big left-aligned display headline, and an optional lede —
  laid out on a 12-col grid (label left, content right on desktop; stacked on mobile).
- **Editorial, asymmetric, left-aligned.** Big type, lots of negative space, one
  accent used sparingly (green = value/exchange, red = events/locations/CTA).
- **No glass cards.** Replace with **hairline-separated index rows** (number · title ·
  descriptor) that reveal an accent + arrow on hover. Data shown as **dotted-leader rows**.
- New shared components: `SectionShell` (hairline + grid), `SectionHeader`
  (index/kicker/title/lede), `IndexRow` (numbered list row).

## B. Section-by-section (layout + new copy)

**00 — Manifesto** (replaces BrandStatement)
- Layout: full-width, big left-aligned statement, index `00`, hairline under.
- Copy — headline: *"We turn collections into currency."*
  Lede: *"Buy, sell, and trade with people who know exactly what your cards are
  worth. No lowballs, no games — just real numbers and a fair shake, every time."*

**01 — How it works** (replaces ExchangeSection) · accent green
- Layout: three big **numbered process rows** (01/02/03), hairline-separated, index
  number in the margin, step title + body.
- Kicker: `01 / HOW IT WORKS` · Headline: *"Bring it in. Walk out ahead."*
  - **01 Bring it in** — *"A single, a binder, or a whole collection. Pull up to the
    counter — no appointment, no pressure."*
  - **02 We make the offer** — *"Every card priced in front of you against live market
    data. We walk you through every number, out loud."*
  - **03 Cash or trade** — *"Take the cash, or roll it straight into the cards you've
    been chasing. Your call, every time."*

**02 — What we carry** (replaces GamesSection) · accent red
- Layout: **index table** — rows of `## · Game · descriptor`, hairline-separated,
  hover reveals accent + `→`.
- Kicker: `02 / WHAT WE CARRY` · Headline: *"Every table. Every format."*
  Lede: *"Singles, sealed, packs and slabs — vintage grails to the newest set."*
  (Rows pulled from existing GAMES data: Pokémon, Magic, One Piece, Yu-Gi-Oh!, & more.)

**03 — Events** (re-skin EventsSection into the system) · accent red
- Layout: **agenda rows** — date block (mono) · title · game/location tags · detail.
- Kicker: `03 / IN THE SHOP` · Headline: *"There's always something on."*
  Lede: *"Tournaments, league nights and release events across both shops."*

**04 — Find us** (replaces LocationsSection) · accent red
- Layout: **two-location split**, big address type, **dotted-leader data rows**
  (Hours / Phone), `Get directions →`.
- Kicker: `04 / FIND US` · Headline: *"Two shops. One city."*
  Lede: *"Whichever side of town you're on, there's a counter ready to deal — and a
  table to play at."* (Rigsby Ave + Babcock Rd, from LOCATIONS data.)

**05 — Pull up** (replaces CtaSection) · accent red
- Layout: big closing headline + **contact data block** (phone/email/socials as
  dotted rows) + two CTA buttons.
- Kicker: `05 / PULL UP` · Headline: *"Come trade with us."*
  Lede: *"Cashing out, trading up, or just here to crack packs — there's a seat at the
  table. Stop in at either shop, or follow along for restocks, events and deals."*
  CTAs: `Get directions` (primary) · `Follow on Instagram` (outline).

## C. Scope of this pass

- Rebuild the six content components above into the new system; keep the cinematic
  hero, cursor, menu, Lenis, and `/shop` page as-is.
- All business facts (hours, addresses, phone, games, events) stay sourced from
  `lib/site.ts` + the events data layer — only layout + prose change.
- Mobile-first responsive; clean typecheck + build; no console errors.
