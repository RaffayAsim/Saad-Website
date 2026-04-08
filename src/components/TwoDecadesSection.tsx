import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TwoDecadesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const yearEl = yearRef.current;
    if (!section || !yearEl) return;

    // Animate year counter from 2005 to 2026
    const counter = { value: 2005 };
    gsap.to(counter, {
      value: 2026,
      duration: 2,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1,
      },
      onUpdate: () => {
        yearEl.textContent = Math.round(counter.value).toString();
      },
    });

    // Fade in overlay content
    gsap.from(overlayRef.current, {
      y: 80,
      opacity: 0,
      scrollTrigger: {
        trigger: section,
        start: "top 40%",
        end: "center center",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
    >
      {/* Giant background year */}
      <span
        ref={yearRef}
        className="absolute font-serif text-[20vw] md:text-[25vw] font-bold leading-none select-none pointer-events-none"
        style={{
          WebkitTextStroke: "1px hsl(var(--gold) / 0.15)",
          color: "transparent",
          zIndex: 0,
        }}
      >
        2005
      </span>

      {/* Overlay content */}
      <div
        ref={overlayRef}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-6">
          Two Decades of Excellence
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-gallery leading-tight mb-8">
          From Private Banking
          <br />
          <span className="gold-text-gradient">to Global Real Estate</span>
        </h2>
        <p className="font-sans text-muted-foreground leading-relaxed max-w-xl mx-auto text-sm md:text-base">
          Leveraging a legacy of private banking to engineer high-yield retail
          opportunities. Where financial rigor meets Dubai's most exclusive real
          estate.
        </p>

        <div className="flex justify-center gap-12 md:gap-20 mt-12">
          {[
            { value: "20+", label: "Years Experience" },
            { value: "ABN", label: "AMRO Legacy" },
            { value: "37460", label: "RERA ID" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl md:text-4xl gold-text-gradient font-light">
                {stat.value}
              </div>
              <div className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TwoDecadesSection;
