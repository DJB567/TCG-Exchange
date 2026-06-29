import { ScrollReveal } from "@/components/ambient/ScrollReveal";

/**
 * Shared Terminal-style section header: a mono index + kicker on the left,
 * a big editorial headline + optional lede on the right (12-col grid, stacked
 * on mobile). The headline + lede use the scroll-linked green sweep, which
 * adapts to the section tone (light/dark).
 */
export function SectionHeader({
  index,
  kicker,
  title,
  lede,
  accent = "red",
  tone = "dark",
}: {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
  accent?: "red" | "green";
  tone?: "dark" | "light";
}) {
  const accentText = accent === "green" ? "text-tcg-green" : "text-tcg-red";
  return (
    <div className="grid gap-x-10 gap-y-7 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="flex items-baseline gap-3">
          <span className={`font-mono text-xs ${accentText}`}>{index}</span>
          <span
            className="mono-label"
            style={{ color: "var(--sec-dim, #8d8f98)" }}
          >
            {kicker}
          </span>
        </div>
      </div>
      <div className="lg:col-span-8">
        <ScrollReveal
          tag="h2"
          tone={tone}
          text={title}
          className="font-display text-3xl leading-[1.04] sm:text-5xl md:text-[3.25rem]"
        />
        {lede ? (
          <ScrollReveal
            tag="p"
            tone={tone}
            text={lede}
            className="mt-5 block max-w-2xl text-base leading-relaxed sm:text-lg"
          />
        ) : null}
      </div>
    </div>
  );
}
