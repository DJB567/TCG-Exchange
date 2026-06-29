import { FRAME_MANIFEST } from "@/lib/frames";
import { ScrollStage } from "@/components/scroll/ScrollStage";
import { Overlay } from "@/components/scroll/Overlay";
import { TopBar } from "@/components/chrome/TopBar";
import { Footer } from "@/components/chrome/Footer";
import { CustomCursor } from "@/components/ambient/CustomCursor";
import { MobileHints } from "@/components/ambient/MobileHints";
import { HeroBeat } from "@/components/sections/HeroBeat";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { SectionShell } from "@/components/sections/SectionShell";
import { PhotoBand } from "@/components/sections/PhotoBand";
import { ExchangeSection } from "@/components/sections/ExchangeSection";
import { GamesSection } from "@/components/sections/GamesSection";
import { EventsSection } from "@/components/events/EventsSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <main id="top" className="relative bg-bg">
      <CustomCursor />
      <MobileHints />
      <TopBar />

      {/* HERO — industrial Poké Ball intro → neon scroll video, 3 bold beats */}
      <ScrollStage manifest={FRAME_MANIFEST}>
        <Overlay id="beat1" anchor="center">
          <HeroBeat sub="01 — Welcome in">Enter the Exchange</HeroBeat>
        </Overlay>
        <Overlay id="beat2" anchor="center">
          <HeroBeat sub="02 — The trade floor">Buy · Sell · Trade</HeroBeat>
        </Overlay>
        <Overlay id="beat3" anchor="lower-center" anchorMobile="center">
          <HeroBeat sub="03 — San Antonio">Built for Collectors</HeroBeat>
        </Overlay>
      </ScrollStage>

      {/* CONTENT — Terminal-style stacked panels, alternating light/dark */}
      <BrandStatement />

      <SectionShell id="about" tone="light">
        <ExchangeSection />
      </SectionShell>

      <SectionShell tone="dark2">
        <GamesSection />
      </SectionShell>

      <PhotoBand />

      <SectionShell id="events" tone="dark">
        <EventsSection />
      </SectionShell>

      <SectionShell id="locations" tone="dark2">
        <LocationsSection />
      </SectionShell>

      <SectionShell id="contact" tone="dark">
        <CtaSection />
      </SectionShell>

      <Footer />
    </main>
  );
}
