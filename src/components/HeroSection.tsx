import { useEffect, useRef } from "react";
import gsap from "gsap";
import GoldDustScene from "./GoldDustScene";
import saadImage from "@/assets/saad-bin-zain-2.jpg";

const HeroSection = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from(lineRef.current, { scaleX: 0, duration: 1.4, ease: "power3.inOut" })
      .from(headingRef.current, { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.7")
      .from(subRef.current, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
      .from(imageRef.current, { scale: 0.8, opacity: 0, duration: 1.4, ease: "power3.out" }, "-=0.8");
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-charcoal-deep overflow-hidden">
      <GoldDustScene />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 6%) 100%)",
          zIndex: 2,
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 px-6 max-w-6xl mx-auto">
        {/* Portrait */}
        <div ref={imageRef} className="relative shrink-0">
          <div className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border border-gold/30 shadow-[0_0_60px_hsl(40_46%_56%/0.15)]">
            <img
              src={saadImage}
              alt="Saad Bin Zain"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute -inset-3 rounded-full border border-gold/10 animate-[spin_30s_linear_infinite]" />
        </div>

        {/* Text */}
        <div className="text-center lg:text-left">
          <div
            ref={lineRef}
            className="w-24 h-px gold-gradient mx-auto lg:mx-0 mb-8 origin-left"
          />
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.2em] text-gallery leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            Saad Bin Zain
            <span className="block text-xl md:text-2xl lg:text-3xl gold-text-gradient mt-4 tracking-[0.25em] font-light">
              20 Years of Precision
            </span>
          </h1>
          <p
            ref={subRef}
            className="font-sans text-sm md:text-base text-muted-foreground tracking-[0.3em] uppercase"
          >
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-10">
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
        <div className="w-px h-12 gold-gradient animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSection;
