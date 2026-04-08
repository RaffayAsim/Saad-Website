import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import GoldFluidScene from "./GoldFluidScene";
import saadImage from "@/assets/saad-bin-zain-2.jpg";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const textGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const tick = () => {
      if (textGroupRef.current) {
        gsap.to(textGroupRef.current, {
          rotateY: mouseRef.current.x * 6,
          rotateX: -mouseRef.current.y * 4,
          duration: 0.8,
          ease: "power2.out",
        });
      }
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "hsl(0 0% 4%)" }}
      data-section="hero"
    >
      <GoldFluidScene />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{
        background: "radial-gradient(ellipse at center, transparent 15%, hsl(0 0% 4%) 80%)",
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6" style={{ perspective: "1200px" }}>
        {/* Portrait with glow rings */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mb-12"
        >
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden" style={{
            border: "2px solid hsl(40 46% 56% / 0.4)",
            boxShadow: "0 0 80px hsl(40 46% 56% / 0.15), 0 0 200px hsl(40 46% 56% / 0.05)",
          }}>
            <img src={saadImage} alt="Saad Bin Zain" className="w-full h-full object-cover object-top" />
          </div>
          <div className="absolute -inset-4 rounded-full border animate-[spin_40s_linear_infinite]" style={{ borderColor: "hsl(40 46% 56% / 0.1)" }} />
          <div className="absolute -inset-8 rounded-full border animate-[spin_60s_linear_infinite_reverse]" style={{ borderColor: "hsl(40 46% 56% / 0.05)" }} />
          <div className="absolute -inset-12 rounded-full border animate-[spin_90s_linear_infinite]" style={{ borderColor: "hsl(40 46% 56% / 0.03)" }} />
        </motion.div>

        {/* 3D Tilting Text */}
        <div ref={textGroupRef} style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="h-[2px] gold-gradient mx-auto mb-10 overflow-hidden"
          />

          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="text-6xl md:text-8xl lg:text-[10rem] tracking-[0.2em] text-gallery leading-none mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 200,
              textShadow: "0 0 100px hsl(40 46% 56% / 0.12)",
            }}
          >
            SAAD BIN ZAIN
          </motion.h1>

          <motion.p
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            className="text-xl md:text-3xl lg:text-4xl gold-text-gradient tracking-[0.25em] mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            20 Years of Precision
          </motion.p>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
            className="font-sans text-sm md:text-lg text-muted-foreground tracking-[0.3em] uppercase"
          >
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ height: [20, 50, 20] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px gold-gradient"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
