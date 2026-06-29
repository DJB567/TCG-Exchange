/**
 * Single source of truth for all business content. Verify hours/contact
 * before launch — pulled from the brief on 2026-06-25.
 */

export const SITE = {
  name: "TCG Exchange",
  tagline: "Your local trading card hub.",
  city: "San Antonio, TX",
  phone: "(210) 289-5893",
  phoneHref: "tel:+12102895893",
  email: "tcgexchangesatx@gmail.com",
  instagram: "https://www.instagram.com/tcginsatx",
  facebook: "https://www.facebook.com/p/TCG-Exchange-100090027339242/",
  hours: "Sun–Fri 12pm–8pm · Sat 11am–8pm",
} as const;

export type Location = {
  key: "rigsby" | "babcock";
  name: string;
  address: string;
  cityLine: string;
  blurb: string;
  note?: string;
  mapsUrl: string;
};

export const LOCATIONS: Location[] = [
  {
    key: "rigsby",
    name: "Rigsby Ave",
    address: "1851 Rigsby Ave",
    cityLine: "San Antonio, TX 78210",
    blurb: "Our east-side shop — full inventory, buy counter and event tables.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=1851+Rigsby+Ave+San+Antonio+TX+78210",
  },
  {
    key: "babcock",
    name: "Babcock Rd",
    address: "6423 Babcock Rd #104",
    cityLine: "San Antonio, TX 78249",
    blurb: "Our north-west spot — singles, sealed and a place to sit and play.",
    note: "Inside BesTea Café — grab boba while you trade.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=6423+Babcock+Rd+%23104+San+Antonio+TX+78249",
  },
];

export type Game = {
  name: string;
  descriptor: string;
};

export const GAMES: Game[] = [
  {
    name: "Pokémon",
    descriptor:
      "Singles, sealed boxes, ETBs, packs and graded slabs — vintage to the newest set.",
  },
  {
    name: "Magic: The Gathering",
    descriptor:
      "Standard staples to Commander gems, bulk rares to chase cards.",
  },
  {
    name: "One Piece",
    descriptor:
      "The fastest-growing table in the shop — singles and sealed, freshly stocked.",
  },
  {
    name: "Yu-Gi-Oh!",
    descriptor:
      "Meta decks, tournament staples and classic collector cards.",
  },
  {
    name: "& more",
    descriptor:
      "Other TCGs, supplies, sleeves and deck boxes — if people play it, ask us.",
  },
];

/** Friendly labels for event games/locations. */
export const GAME_LABEL: Record<string, string> = {
  pokemon: "Pokémon",
  magic: "Magic: The Gathering",
  onepiece: "One Piece",
  yugioh: "Yu-Gi-Oh!",
  other: "More",
};

export const LOCATION_LABEL: Record<string, string> = {
  rigsby: "Rigsby Ave",
  babcock: "Babcock Rd",
};
