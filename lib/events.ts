import type { TcgEvent } from "@/types/event";

/**
 * Returns upcoming events sorted soonest-first, with past events removed.
 *
 * SWAP POINT — to go live with Supabase, replace the seed return with:
 *
 *   import { createClient } from "@/lib/supabase/server";
 *   const supabase = await createClient();
 *   const { data } = await supabase
 *     .from("events")
 *     .select("*")
 *     .gte("starts_at", new Date().toISOString())
 *     .order("starts_at", { ascending: true });
 *   return (data ?? []).map(rowToEvent); // map snake_case → camelCase
 *
 * The component layer never changes.
 */
export async function getEvents(): Promise<TcgEvent[]> {
  const now = Date.now();
  return SEED_EVENTS.filter((e) => new Date(e.startsAt).getTime() >= now).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

// Realistic placeholders. Times are San Antonio (Central, CDT = -05:00).
const SEED_EVENTS: TcgEvent[] = [
  {
    id: "seed-pokemon-league-cup",
    game: "pokemon",
    title: "Pokémon League Cup",
    kind: "tournament",
    startsAt: "2026-07-05T12:00:00-05:00",
    location: "rigsby",
    entryFee: 10,
    format: "Standard",
    signupUrl: null,
  },
  {
    id: "seed-onepiece-locals",
    game: "onepiece",
    title: "One Piece Weekly Locals",
    kind: "tournament",
    startsAt: "2026-07-11T18:00:00-05:00",
    location: "babcock",
    entryFee: 5,
    format: null,
    signupUrl: null,
  },
  {
    id: "seed-mtg-commander-night",
    game: "magic",
    title: "Commander Night",
    kind: "meetup",
    startsAt: "2026-07-12T17:00:00-05:00",
    location: "rigsby",
    entryFee: null,
    format: "Commander",
    signupUrl: null,
  },
  {
    id: "seed-yugioh-win-a-mat",
    game: "yugioh",
    title: "Yu-Gi-Oh! Win-A-Mat",
    kind: "tournament",
    startsAt: "2026-07-19T13:00:00-05:00",
    location: "babcock",
    entryFee: 15,
    format: "Advanced",
    signupUrl: null,
  },
];
