import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import TwoDecadesSection from "@/components/TwoDecadesSection";
import BankingAdvantage from "@/components/BankingAdvantage";
import PartnersCarousel from "@/components/PartnersCarousel";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <CustomCursor />
        <Navigation />
        <HeroSection />
        <TwoDecadesSection />
        <BankingAdvantage />
        <PartnersCarousel />
        <FooterSection />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
