import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  ToolsSection,
  PricingSection,
  CTASection,
  LearningPathsSection,
  StatsSection,
} from "@/components/sections";

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
