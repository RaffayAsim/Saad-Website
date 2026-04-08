import { useEffect, useRef } from "react";
import gsap from "gsap";
import GoldParticles from "./GoldParticles";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(lineRef.current, { scaleX: 0, duration: 1.2, ease: "power3.inOut" })
      .from(headingRef.current, { y: 60, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
      .from(subRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-charcoal-deep overflow-hidden"
    >
      <GoldParticles />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 6%) 100%)",
          zIndex: 2,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          ref={lineRef}
          className="w-24 h-px gold-gradient mx-auto mb-8 origin-center"
        />
        <h1
          ref={headingRef}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-gallery leading-tight mb-6"
        >
          Saad Bin Zain
          <span className="block text-2xl md:text-3xl lg:text-4xl gold-text-gradient mt-4 tracking-[0.2em] font-light">
            20 Years of Precision
          </span>
        </h1>
        <p
          ref={subRef}
          className="font-sans text-sm md:text-base text-muted-foreground tracking-[0.3em] uppercase"
        >
          Private Banking &bull; Global Retail Real Estate &bull; Dubai
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
          <div className="w-px h-12 gold-gradient animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
