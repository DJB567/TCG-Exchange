import { ScrollReveal } from "@/components/ambient/ScrollReveal";

/** 00 — Manifesto: the first content panel, lifting over the hero video. */
export function BrandStatement() {
  return (
    <section className="panel-top" style={{ background: "#0c0d11" }}>
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-28 sm:px-10 sm:pb-32 sm:pt-44">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs text-tcg-green">00</span>
          <span className="mono-label">TCG Exchange · San Antonio</span>
        </div>
        <ScrollReveal
          tag="h2"
          text="Cards you love. People who get it."
          className="mt-7 block font-display text-[2rem] leading-[1.08] sm:text-5xl md:text-[3.6rem]"
        />
        <ScrollReveal
          tag="p"
          text="Buy, sell, and trade with collectors who actually know what your cards are worth — and treat you right, whether you're cashing out a grail or just starting your first binder. No pressure, no judgment. Pull up a chair; everybody's welcome at the table."
          className="mt-6 block max-w-2xl text-base leading-relaxed sm:text-xl sm:leading-relaxed"
        />
      </div>
    </section>
  );
}
