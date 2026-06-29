"use client";

import Image from "next/image";

export function Loader({ pct, done }: { pct: number; done: boolean }) {
  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-[opacity,filter] duration-700 ease-out ${
        done ? "pointer-events-none opacity-0 blur-lg" : "opacity-100 blur-0"
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-8">
        <Image
          src="/brand/tcg-exchange-logo.png"
          alt="TCG Exchange"
          width={200}
          height={200}
          priority
          className="h-auto w-[150px] sm:w-[180px]"
        />
        <div className="font-display text-xs tracking-[0.5em] text-text-dim">
          LOADING
        </div>
        <div className="h-[3px] w-[220px] overflow-hidden rounded-full bg-white/10 sm:w-[280px]">
          <div
            className="h-full rounded-full transition-[width] duration-200 ease-out"
            style={{
              width: `${pct}%`,
              backgroundImage:
                "linear-gradient(90deg, var(--tcg-red), var(--tcg-green))",
              backgroundSize: "280px 100%",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
        <div className="mono-label !text-[10px] !tracking-[0.3em] text-text-dim">
          {pct}%
        </div>
      </div>
    </div>
  );
}
