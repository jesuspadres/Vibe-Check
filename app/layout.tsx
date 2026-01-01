import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe Check | Brand Voice Auditor",
  description:
    "A thoughtful analysis of your brand's linguistic consistency across platforms.",
  keywords: ["brand audit", "voice analysis", "tone consistency", "brand identity"],
  authors: [{ name: "Vibe Check Studio" }],
  openGraph: {
    title: "Vibe Check | Brand Voice Auditor",
    description: "A thoughtful analysis of your brand's linguistic consistency across platforms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50">
        {/* Subtle paper texture overlay */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.02] z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Main content */}
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}