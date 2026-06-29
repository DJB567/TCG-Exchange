export type EventGame = "pokemon" | "magic" | "onepiece" | "yugioh" | "other";
export type EventKind = "tournament" | "meetup";

export interface TcgEvent {
  id: string;
  game: EventGame;
  title: string;
  kind: EventKind;
  startsAt: string; // ISO 8601
  location: "rigsby" | "babcock";
  entryFee?: number | null; // USD, null = free
  format?: string | null; // e.g. "Standard", "Draft"
  signupUrl?: string | null;
}
