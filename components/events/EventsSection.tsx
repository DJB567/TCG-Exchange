import { getEvents } from "@/lib/events";
import { SITE, GAME_LABEL, LOCATION_LABEL } from "@/lib/site";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ExpandCards } from "@/components/sections/ExpandCards";

const fmtDay = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "America/Chicago",
});
const fmtDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "America/Chicago",
});
const fmtTime = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago",
});

/** 03 — In the shop: upcoming events as a clean agenda list. */
export async function EventsSection() {
  const events = await getEvents();

  return (
    <>
      <SectionHeader
        index="03"
        kicker="In the shop"
        accent="red"
        title="There's always something on."
        lede="Tournaments, league nights and casual meetups across both shops — grinders and first-timers alike. New to a game? Come learn; our regulars love to teach."
      />

      {events.length > 0 ? (
        <div className="mt-12 sm:mt-16">
          {events.map((e) => {
            const d = new Date(e.startsAt);
            const free = e.entryFee == null;
            const fee = free ? "FREE" : `$${e.entryFee!.toFixed(0)}`;
            return (
              <div
                key={e.id}
                className="grid gap-2 border-t border-white/10 py-6 sm:grid-cols-12 sm:items-center sm:gap-6 sm:py-7"
              >
                <div className="flex items-baseline gap-3 sm:col-span-3">
                  <span className="font-mono text-sm text-tcg-red">
                    {fmtDay.format(d)}
                  </span>
                  <span className="font-display text-lg text-text sm:text-xl">
                    {fmtDate.format(d)}
                  </span>
                  <span className="font-mono text-xs text-text-dim">
                    {fmtTime.format(d)}
                  </span>
                </div>

                <div className="sm:col-span-5">
                  <h3 className="font-display text-lg text-text sm:text-xl">
                    {e.title}
                  </h3>
                  <p className="mono-label mt-1">
                    {GAME_LABEL[e.game]} · {LOCATION_LABEL[e.location]}
                    {e.format ? ` · ${e.format}` : ""}
                  </p>
                </div>

                <div className="sm:col-span-2 sm:text-right">
                  <span
                    className={`font-mono text-sm tracking-wider ${
                      free ? "text-tcg-green" : "text-text"
                    }`}
                  >
                    {fee}
                  </span>
                </div>

                <div className="sm:col-span-2 sm:text-right">
                  {e.signupUrl ? (
                    <a
                      href={e.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono-label text-tcg-red transition-colors hover:text-text"
                    >
                      Sign up →
                    </a>
                  ) : (
                    <span className="mono-label text-text-dim">Walk in</span>
                  )}
                </div>
              </div>
            );
          })}
          <div className="border-t border-white/10" />
        </div>
      ) : (
        <p className="mt-10 text-text-dim">
          New events drop on our socials — follow along.
        </p>
      )}

      <ExpandCards />

      <p className="mt-8 text-sm text-text-dim">
        More events posted on{" "}
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tcg-red transition-colors hover:text-text"
        >
          Instagram
        </a>{" "}
        and{" "}
        <a
          href={SITE.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tcg-red transition-colors hover:text-text"
        >
          Facebook
        </a>
        .
      </p>
    </>
  );
}
