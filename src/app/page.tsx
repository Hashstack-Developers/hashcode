import { Hero } from "@/components/home/Hero";
import { DawnTransition } from "@/components/home/DawnTransition";
import { MacBookStage } from "@/components/home/MacBookStage";
import { PhoneStage } from "@/components/home/PhoneStage";
import { DuskTransition } from "@/components/home/DuskTransition";
import { Stats } from "@/components/home/Stats";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { TechStack } from "@/components/home/TechStack";
import { LaptopGlowStage } from "@/components/home/LaptopGlowStage";
import { WhyUs } from "@/components/home/WhyUs";
import { Portfolio } from "@/components/home/Portfolio";
import { Testimonials } from "@/components/home/Testimonials";
import { Calculator } from "@/components/home/Calculator";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DawnTransition />
      <MacBookStage />
      <PhoneStage />
      <DuskTransition />
      <Stats />
      <ServicesGrid />
      <TechStack />
      <LaptopGlowStage />
      <WhyUs />
      <Portfolio />
      <Testimonials />
      <Calculator />
    </>
  );
}
