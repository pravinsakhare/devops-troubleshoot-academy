"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { StatsSection } from "@/components/sections/stats";
import { FeaturesSection } from "@/components/sections/features";
import { LearningPathsSection } from "@/components/sections/learning-paths";
import { ToolsSection } from "@/components/sections/tools";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { PricingSection } from "@/components/sections/pricing";
import { CTASection } from "@/components/sections/cta";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <LearningPathsSection />
        <ToolsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
