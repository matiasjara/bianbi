import { Hero } from "@/kitchencare/components/home/Hero";
import { TrustStrip } from "@/kitchencare/components/home/TrustStrip";
import { ProblemSection } from "@/kitchencare/components/home/ProblemSection";
import { ServicesGrid } from "@/kitchencare/components/home/ServicesGrid";
import { StandardSection } from "@/kitchencare/components/home/StandardSection";
import { HowItWorksSection } from "@/kitchencare/components/home/HowItWorksSection";
import { PlusSection } from "@/kitchencare/components/home/PlusSection";
import { MaintenanceSection } from "@/kitchencare/components/home/MaintenanceSection";
import { ExpertiseSection } from "@/kitchencare/components/home/ExpertiseSection";
import { BusinessSection } from "@/kitchencare/components/home/BusinessSection";
import { CtaSection } from "@/kitchencare/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <ServicesGrid />
      <StandardSection />
      <HowItWorksSection />
      <PlusSection />
      <MaintenanceSection />
      <ExpertiseSection />
      <BusinessSection />
      <CtaSection />
    </>
  );
}
