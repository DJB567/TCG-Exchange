import { SectionHeader } from "./SectionHeader";

/** 01 — How it works: three friendly, no-pressure process steps. */
const STEPS = [
  {
    n: "01",
    title: "Bring it in",
    body: "A single, a binder, or a whole collection — there's no minimum and no appointment. Not sure what you've got? That's okay; that's exactly what we're here for.",
  },
  {
    n: "02",
    title: "We make a fair offer",
    body: "We price every card against the real market and walk you through each number out loud — no pressure, no rush. Ask us anything; there are no silly questions here.",
  },
  {
    n: "03",
    title: "Cash or trade",
    body: "Take the cash, or put it toward the cards you've been after. Whatever works best for you — and there's never any pressure to decide today.",
  },
];

export function ExchangeSection() {
  return (
    <>
      <SectionHeader
        index="01"
        kicker="How it works"
        accent="green"
        tone="light"
        title="Bring it in. Walk out ahead."
        lede="Selling or trading your cards should feel easy and friendly. Here's exactly how it goes, start to finish — no surprises."
      />

      <div className="mt-12 sm:mt-16">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="grid gap-3 border-t py-7 sm:grid-cols-12 sm:gap-8 sm:py-9"
            style={{ borderColor: "var(--sec-edge)" }}
          >
            <div className="sm:col-span-4">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-2xl text-tcg-green sm:text-3xl">
                  {s.n}
                </span>
                <h3
                  className="font-display text-xl sm:text-2xl"
                  style={{ color: "var(--sec-text)" }}
                >
                  {s.title}
                </h3>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed sm:col-span-8 sm:text-base"
              style={{ color: "var(--sec-dim)" }}
            >
              {s.body}
            </p>
          </div>
        ))}
        <div className="border-t" style={{ borderColor: "var(--sec-edge)" }} />
      </div>
    </>
  );
}
