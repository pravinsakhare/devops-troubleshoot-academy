"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  FeaturesSection,
  PlatformOverviewSection,
  LearningPathsSection,
  TestimonialsSection,
  StatsSection,
  ToolsSection,
  CTASection,
  TrustIndicatorsSection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a]">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Indicators */}
      <TrustIndicatorsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Platform Overview */}
      <PlatformOverviewSection />

      {/* Learning Paths */}
      <LearningPathsSection />

      {/* Tools Section */}
      <ToolsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <CTASection />

      <Footer />
    </div>
  );
}