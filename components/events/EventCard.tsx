import type { TcgEvent } from "@/types/event";
import { GAME_LABEL, LOCATION_LABEL } from "@/lib/site";

const fmtDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "America/Chicago",
});
const fmtTime = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago",
});

export function EventCard({ event }: { event: TcgEvent }) {
  const date = new Date(event.startsAt);
  const fee =
    event.entryFee == null ? "FREE" : `$${event.entryFee.toFixed(0)} ENTRY`;

  return (
    <article className="glass flex flex-col gap-2 rounded-xl p-3.5 text-left sm:gap-3 sm:p-5">
      <div className="flex items-center justify-between gap-1.5">
        <span className="mono-label rounded-full border border-tcg-red/40 px-2 py-1 leading-tight text-tcg-red !text-[9px] !tracking-[0.08em]">
          {GAME_LABEL[event.game]}
        </span>
        <span className="mono-label shrink-0 whitespace-nowrap !text-[9px] !tracking-[0.08em]">
          {event.kind}
        </span>
      </div>

      <h3 className="font-display text-sm leading-tight text-text sm:text-lg">
        {event.title}
      </h3>

      <dl className="mt-auto space-y-1.5 text-xs text-text sm:text-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <dt className="mono-label">When</dt>
          <dd className="sm:text-right">
            {fmtDate.format(date)} · {fmtTime.format(date)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <dt className="mono-label">Where</dt>
          <dd>{LOCATION_LABEL[event.location]}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <dt className="mono-label">Entry</dt>
          <dd
            className={`font-mono text-xs tracking-wider ${
              event.entryFee == null ? "text-tcg-green" : "text-text"
            }`}
          >
            {fee}
            {event.format ? (
              <span className="text-text-dim"> · {event.format}</span>
            ) : null}
          </dd>
        </div>
      </dl>

      {event.signupUrl ? (
        <a
          href={event.signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-label mt-1 inline-block !text-[10px] text-tcg-red transition-colors hover:text-text"
        >
          Sign up →
        </a>
      ) : null}
    </article>
  );
}
