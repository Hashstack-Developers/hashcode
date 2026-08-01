"use client";

import { useEffect, useState } from "react";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { CuteBot } from "@/components/layout/CuteBot";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { isMobileViewport } from "@/lib/mobile";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [desktopExtras, setDesktopExtras] = useState(false);

  useEffect(() => {
    setDesktopExtras(!isMobileViewport());
  }, []);

  return (
    <>
      <LoadingScreen />
      {desktopExtras && <CustomCursor />}
      {desktopExtras && <CuteBot />}
      <LenisProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </LenisProvider>
    </>
  );
}
