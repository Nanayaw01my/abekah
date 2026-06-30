import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsSection } from "@/components/home/StatsSection";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustSection />
      <FeaturedProperties />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <CTASection />
    </main>
  );
}
