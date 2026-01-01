import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe Check | Brand Auditor",
  description:
    "Audit your brand's linguistic consistency across platforms. Analyze voice, tone, and persona coherence.",
  keywords: ["brand audit", "voice analysis", "tone consistency", "brand identity"],
  authors: [{ name: "Vibe Check" }],
  openGraph: {
    title: "Vibe Check | Brand Auditor",
    description: "Audit your brand's linguistic consistency across platforms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen bg-zinc-950`}
      >
        {/* Background layers */}
        <div className="fixed inset-0 -z-10">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
          
          {/* Radial gradient accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.08)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.05)_0%,_transparent_50%)]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-30" />
          
          {/* Noise texture */}
          <div className="noise-overlay" />
        </div>

        {/* Main content */}
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
