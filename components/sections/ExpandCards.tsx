"use client";

import { useState } from "react";

/**
 * Expand image gallery (adapted from a 21st.dev component). Same accordion on
 * both: one card expanded, the rest shrunk to spines. Desktop drives it on
 * hover; mobile (no hover) drives it on tap — the shrunk spines signal there's
 * more to open. Light "gallery wall" inside the dark Events section.
 *
 * Per-game artwork (square 1:1, ~1400px) lives in /public/gallery. Games are
 * interleaved so no two neighbors share a franchise.
 */
const IMAGES = [
  { src: "/gallery/pokemon-1.webp", alt: "Pokémon — Pikachu and Charizard" },
  { src: "/gallery/magic-1.webp", alt: "Magic: The Gathering — planeswalker" },
  { src: "/gallery/onepiece-1.webp", alt: "One Piece — the Straw Hat crew" },
  { src: "/gallery/yugioh.webp", alt: "Yu-Gi-Oh! — Dark Magician" },
  { src: "/gallery/pokemon-2.webp", alt: "Pokémon — booster pack opening" },
  { src: "/gallery/magic-2.webp", alt: "Magic: The Gathering — dragons" },
  { src: "/gallery/onepiece-2.webp", alt: "One Piece — Luffy" },
];

export function ExpandCards() {
  const [expanded, setExpanded] = useState(3);

  return (
    <div className="mt-14 rounded-3xl bg-[#f3f2ee] p-3 sm:mt-20 sm:p-5">
      {/* desktop: expand-on-hover row */}
      <div className="hidden w-full items-stretch justify-center gap-1.5 lg:flex">
        {IMAGES.map((img, idx) => (
          <div
            key={idx}
            role="button"
            tabIndex={0}
            aria-label={img.alt}
            className="relative h-80 cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ease-in-out"
            style={{ width: expanded === idx ? "22rem" : "4.5rem" }}
            onMouseEnter={() => setExpanded(idx)}
            onFocus={() => setExpanded(idx)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* mobile/tablet: tap-driven accordion (mirrors the desktop hover effect).
          The tapped card grows (flex-grow 6) and the rest collapse to spines
          (flex-grow 1), so it's obvious there are more cards to open. */}
      <div className="flex items-stretch gap-1.5 lg:hidden">
        {IMAGES.map((img, idx) => {
          const open = expanded === idx;
          return (
            <button
              key={idx}
              type="button"
              aria-label={img.alt}
              aria-expanded={open}
              onClick={() => setExpanded(idx)}
              className={`relative h-56 min-w-0 overflow-hidden rounded-2xl transition-all duration-500 ease-in-out ${
                open ? "flex-[6_1_0%]" : "flex-[1_1_0%]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
