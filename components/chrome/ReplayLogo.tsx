"use client";

import Image from "next/image";

/** Event the ScrollStage listens for to re-close the Pokéball and replay the
 *  click-to-open intro. */
export const REPLAY_INTRO_EVENT = "tcg:replay-intro";

/**
 * The TCG Exchange logo, used in the top bar and footer. Clicking it scrolls to
 * the top and replays the Pokéball intro (the page "goes home" to the closed
 * ball, which the visitor clicks to open again).
 */
export function ReplayLogo({ className }: { className?: string }) {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "auto" });
    window.dispatchEvent(new CustomEvent(REPLAY_INTRO_EVENT));
  };

  return (
    <a
      href="#top"
      aria-label="TCG Exchange — back to start"
      onClick={onClick}
      className="block"
    >
      <Image
        src="/brand/tcg-exchange-logo.png"
        alt="TCG Exchange"
        width={160}
        height={160}
        priority
        className={className}
      />
    </a>
  );
}
