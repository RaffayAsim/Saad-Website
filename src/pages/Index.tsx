import { useEffect, useCallback, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import TwoDecadesSection from "@/components/TwoDecadesSection";
import BankingAdvantage from "@/components/BankingAdvantage";
import PartnersCarousel from "@/components/PartnersCarousel";
import FooterSection from "@/components/FooterSection";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoadingComplete = useCallback(() => setLoaded(true), []);

  // Lenis smooth scroll + GSAP ScrollTrigger integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.25,
      easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
      smoothWheel: true,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-background">
      <LoadingScreen onComplete={handleLoadingComplete} />
      <CustomCursor />
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
