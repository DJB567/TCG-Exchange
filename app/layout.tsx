import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

// Display font (headlines + hero beats)
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TCG Exchange — Your local trading card hub | San Antonio",
  description:
    "Buy, sell, and trade Pokémon, Magic: The Gathering, One Piece, Yu-Gi-Oh! and more. Two San Antonio locations. Singles, sealed, packs, tournaments and meetups.",
  metadataBase: new URL("https://tcgexchange.example"),
  openGraph: {
    title: "TCG Exchange — Your local trading card hub",
    description:
      "Buy · Sell · Trade — Pokémon, Magic, One Piece, Yu-Gi-Oh! & more. Two locations in San Antonio, TX.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} ${outfit.variable}`}
    >
      <body className="bg-bg text-text">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
