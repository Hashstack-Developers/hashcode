import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { siteConfig } from "@/data/content";
import "./globals.css";

/** Bold geometric display */
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

/** Clean legible body */
const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Software House`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

/**
 * Unlock scroll only — never remove React-managed DOM (causes removeChild crashes).
 * LoadingScreen listens for hashstack:loader-done / finishes itself.
 */
const LOADER_FAILSAFE = `(function(){var t=setTimeout(function(){try{document.documentElement.classList.remove("overflow-hidden","loader-locked");document.body.style.overflow="";document.body.style.touchAction="";window.dispatchEvent(new Event("hashstack:loader-done"));}catch(e){}},2500);window.addEventListener("hashstack:loader-done",function(){clearTimeout(t);},{once:true});})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="page-shell flex min-h-full flex-col bg-[#141210] text-cream">
        <Script id="hashstack-loader-failsafe" strategy="beforeInteractive">
          {LOADER_FAILSAFE}
        </Script>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
