import type { Metadata } from "next";
import { Outfit, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/packages/sound-engine";
import { AmbientBackground } from "@/packages/ui";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ALMOST — Experience everything. Own nothing.",
  description:
    "An AI-powered experiential sanctuary where you can simulate luxury, travel, and quiet escapes without buying, booking, or owning anything.",
  keywords: ["almost", "zero-cart", "dream-trip", "escape", "simulation", "delight"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${playfair.variable} ${spaceMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-[#06070a] text-zinc-100 selection:bg-amber-400 selection:text-black antialiased relative">
        <SoundProvider>
          <AmbientBackground />
          <div className="relative z-10 flex-1 flex flex-col">{children}</div>
        </SoundProvider>
      </body>
    </html>
  );
}
