import { LOCATIONS, SITE } from "@/lib/site";
import type { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-2 border-t border-white/10 py-3.5">
      <span className="mono-label shrink-0">{label}</span>
      <span className="min-w-0 flex-1 translate-y-[-3px] border-b border-dotted border-white/15" />
      <span className="shrink-0 text-right text-sm text-text">{children}</span>
    </div>
  );
}

/** 05 — Pull up: warm closing invite + a clean contact block. */
export function CtaSection() {
  return (
    <>
      <SectionHeader
        index="05"
        kicker="Pull up"
        accent="red"
        title="Come say hi."
        lede="Cashing out, trading up, or just here to crack a pack and meet some people — there's a seat at the table for you. Stop by either shop, or follow along for restocks, events and deals."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <a
              href={LOCATIONS[0].mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full justify-center whitespace-nowrap !px-3 !text-[13px] sm:w-auto sm:!px-[1.6rem] sm:!text-[0.95rem]"
            >
              Get Directions
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full justify-center whitespace-nowrap !px-3 !text-[13px] sm:w-auto sm:!px-[1.6rem] sm:!text-[0.95rem]"
            >
              Follow on Instagram
            </a>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-text-dim">
            New to all this? Don&apos;t sweat it — send us a message or just walk
            in. We&apos;re collectors too, and we love helping people get started.
          </p>
        </div>

        <div className="lg:col-span-5">
          <MetaRow label="Phone">
            <a
              href={SITE.phoneHref}
              className="text-text transition-colors hover:text-tcg-red"
            >
              {SITE.phone}
            </a>
          </MetaRow>
          <MetaRow label="Email">
            <a
              href={`mailto:${SITE.email}`}
              className="text-text transition-colors hover:text-tcg-red"
            >
              {SITE.email}
            </a>
          </MetaRow>
          <MetaRow label="Social">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text transition-colors hover:text-tcg-red"
            >
              Instagram
            </a>
            <span className="text-text-dim"> · </span>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text transition-colors hover:text-tcg-red"
            >
              Facebook
            </a>
          </MetaRow>
          <MetaRow label="Hours">{SITE.hours}</MetaRow>
          <div className="border-t border-white/10" />
        </div>
      </div>
    </>
  );
}
