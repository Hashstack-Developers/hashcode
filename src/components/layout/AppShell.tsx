"use client";

import { LenisProvider } from "@/components/layout/LenisProvider";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { CuteBot } from "@/components/layout/CuteBot";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <CuteBot />
      <LenisProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </LenisProvider>
    </>
  );
}
