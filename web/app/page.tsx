import HeroSection, { ImpactStatsSection } from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ImpactSection from "@/components/landing/ImpactSection";
import TopNavbar from "@/components/layout/TopNavbar";
import GreenShareFooter from "@/components/layout/GreenShareFooter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar />
      <main className="flex-grow">
        <HeroSection />
        <ImpactStatsSection />
        <HowItWorksSection />
        <ImpactSection />
      </main>
      <GreenShareFooter />
    </div>
  );
}
