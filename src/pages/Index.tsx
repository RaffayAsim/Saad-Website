import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TwoDecadesSection from "@/components/TwoDecadesSection";
import BankingAdvantage from "@/components/BankingAdvantage";
import PartnersCarousel from "@/components/PartnersCarousel";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-background">
      <Navigation />
      <HeroSection />
      <TwoDecadesSection />
      <BankingAdvantage />
      <PartnersCarousel />
      <FooterSection />
    </div>
  );
};

export default Index;
