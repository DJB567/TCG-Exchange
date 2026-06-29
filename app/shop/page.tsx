import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop — Coming Soon | TCG Exchange",
  description:
    "The TCG Exchange online store is coming soon — singles, sealed product and collector's items. For now, visit us in San Antonio.",
};

export default function ShopPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      {/* neon-street backdrop */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/frames/desktop/frame-0030.webp')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/75 via-bg/85 to-bg"
        aria-hidden
      />

      <Link
        href="/"
        className="mono-label absolute left-6 top-6 text-text-dim transition-colors hover:text-text"
      >
        ← TCG Exchange
      </Link>

      <p className="mono-label mb-5 text-tcg-red">The Shop</p>
      <h1 className="font-display text-5xl leading-[1.02] text-text sm:text-7xl">
        Coming soon.
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-text-dim">
        We&apos;re building our online store — singles, sealed product and
        collector&apos;s items, shippable straight to your door. Until then, come
        trade with us in San Antonio.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-outline">
          ← Back home
        </Link>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Follow for the drop
        </a>
      </div>
    </main>
  );
}
