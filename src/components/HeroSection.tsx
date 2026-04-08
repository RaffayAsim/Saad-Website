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

    // 3D tilt on text
    const tick = () => {
      if (textGroupRef.current) {
        gsap.to(textGroupRef.current, {
          rotateY: mouseRef.current.x * 5,
          rotateX: -mouseRef.current.y * 3,
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
      className="relative h-screen flex items-center justify-center bg-charcoal-deep overflow-hidden"
      data-section="hero"
    >
      <GoldFluidScene />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 20%, hsl(0 0% 4%) 85%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6" style={{ perspective: "1200px" }}>
        {/* Portrait */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mb-10"
        >
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-gold/40 shadow-[0_0_80px_hsl(40_46%_56%/0.2)]">
            <img
              src={saadImage}
              alt="Saad Bin Zain"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute -inset-4 rounded-full border border-gold/10 animate-[spin_40s_linear_infinite]" />
          <div className="absolute -inset-8 rounded-full border border-gold/5 animate-[spin_60s_linear_infinite_reverse]" />
        </motion.div>

        {/* 3D Tilting Text */}
        <div ref={textGroupRef} style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="h-px gold-gradient mx-auto mb-8 overflow-hidden"
          />

          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] text-gallery leading-none mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 200,
              textShadow: "0 0 80px hsl(40 46% 56% / 0.15)",
            }}
          >
            SAAD BIN ZAIN
          </motion.h1>

          <motion.p
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="text-xl md:text-2xl lg:text-3xl gold-text-gradient tracking-[0.25em] font-light mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            20 Years of Precision
          </motion.p>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
            className="font-sans text-sm md:text-base text-muted-foreground tracking-[0.3em] uppercase"
          >
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ height: [20, 48, 20] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px gold-gradient"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
