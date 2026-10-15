import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Pillars } from "@/components/landing/Pillars";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ChiefSection } from "@/components/landing/ChiefSection";
import { Evening } from "@/components/landing/Evening";
import { Privacy } from "@/components/landing/Privacy";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Atlas — Your Calm Command Center",
  description:
    "Bring your tasks, calendar, files, goals, and AI assistance into one focused workspace with Atlas.",
};

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-indigo focus:px-3 focus:py-2 focus:text-[13px] focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main-content">
        <Hero />
        <Problem />
        <Pillars />
        <HowItWorks />
        <ChiefSection />
        <Evening />
        <Privacy />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
