import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { StakeholdersSection } from "@/components/sections/StakeholdersSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { StatsSection } from "@/components/sections/StatsSection";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StakeholdersSection />
        <AboutSection />
        <StatsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
