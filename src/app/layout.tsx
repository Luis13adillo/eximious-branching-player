import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * Typography is the authoritative brand pairing — Georgia (headings) / Segoe UI
 * (body) — set as CSS custom properties in globals.css. Both are system fonts,
 * so there is no web-font loading (and nothing to embed): Segoe UI renders on
 * Windows and falls back cleanly elsewhere.
 */
export const metadata: Metadata = {
  title: "Eximious Academy · Interactive Case Studies",
  description:
    "Premium interactive branching video training for insurance claims and investigation professionals.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
