import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import GoldFluidScene from "./GoldFluidScene";
import saadImage from "@/assets/saad-bin-zain-2.jpg";

const HeroSection = () => {
  const textGroupRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

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
          rotateY: mouseRef.current.x * 8,
          rotateX: -mouseRef.current.y * 5,
          duration: 1,
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
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "hsl(0 0% 3%)" }}
      data-section="hero"
    >
      <GoldFluidScene />

      {/* Multi-layer vignette for depth */}
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{
        background: "radial-gradient(ellipse at center, transparent 10%, hsl(0 0% 3% / 0.4) 50%, hsl(0 0% 3%) 85%)",
      }} />
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{
        background: "linear-gradient(180deg, hsl(0 0% 3% / 0.6) 0%, transparent 20%, transparent 80%, hsl(0 0% 3%) 100%)",
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-16" style={{ perspective: "1400px" }}>
        {/* Portrait */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative mb-10 md:mb-14"
        >
          {/* Glow behind portrait */}
          <div className="absolute inset-0 rounded-full" style={{
            background: "radial-gradient(circle, hsl(40 46% 56% / 0.2) 0%, transparent 70%)",
            transform: "scale(2.5)",
            filter: "blur(40px)",
          }} />
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden relative" style={{
            border: "2px solid hsl(40 46% 56% / 0.35)",
            boxShadow: "0 0 60px hsl(40 46% 56% / 0.2), 0 0 120px hsl(40 46% 56% / 0.08), inset 0 0 30px hsl(40 46% 56% / 0.1)",
          }}>
            <img src={saadImage} alt="Saad Bin Zain" className="w-full h-full object-cover object-top" />
          </div>
          {/* Orbit rings */}
          <div className="absolute -inset-5 rounded-full border animate-[spin_35s_linear_infinite]" style={{ borderColor: "hsl(40 46% 56% / 0.12)" }} />
          <div className="absolute -inset-10 rounded-full border animate-[spin_55s_linear_infinite_reverse]" style={{ borderColor: "hsl(40 46% 56% / 0.06)" }} />
          <div className="absolute -inset-16 rounded-full border animate-[spin_80s_linear_infinite]" style={{ borderColor: "hsl(40 46% 56% / 0.03)" }} />
        </motion.div>

        {/* 3D Tilting Text */}
        <div ref={textGroupRef} style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="h-[1px] gold-gradient mx-auto mb-8 overflow-hidden"
          />

          <motion.h1
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="text-5xl md:text-7xl lg:text-[9rem] tracking-[0.2em] text-gallery leading-none mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 200,
              textShadow: "0 0 80px hsl(40 46% 56% / 0.15), 0 4px 20px hsl(0 0% 0% / 0.5)",
            }}
          >
            SAAD BIN ZAIN
          </motion.h1>

          <motion.p
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
            className="text-lg md:text-2xl lg:text-3xl gold-text-gradient tracking-[0.3em] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            20 Years of Precision
          </motion.p>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
            className="font-sans text-xs md:text-sm text-muted-foreground tracking-[0.35em] uppercase"
          >
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 3, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="font-sans text-[9px] tracking-[0.5em] uppercase text-muted-foreground">
          Scroll
        </span>
        <motion.div
          animate={{ height: [16, 40, 16] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px gold-gradient"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
