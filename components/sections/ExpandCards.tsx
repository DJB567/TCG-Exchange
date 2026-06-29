"use client";

import { useState } from "react";

/**
 * Expand-on-hover image gallery (adapted from a 21st.dev component). Desktop:
 * hovering a card widens it and shrinks the rest. Mobile: a swipe strip (no
 * hover on touch). Light "gallery wall" inside the dark Events section.
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

      {/* mobile: horizontal swipe strip */}
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 lg:hidden">
        {IMAGES.map((img, idx) => (
          <div
            key={idx}
            className="relative h-56 w-44 shrink-0 snap-center overflow-hidden rounded-2xl"
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
    </div>
  );
}
