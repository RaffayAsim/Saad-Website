import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TwoDecadesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });

  useEffect(() => {
    const section = sectionRef.current;
    const yearEl = yearRef.current;
    if (!section || !yearEl) return;

    // Year counter 2005 → 2026
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

    // 3D fly-through zoom on year text
    gsap.fromTo(
      yearEl,
      { scale: 0.8, rotateX: 10 },
      {
        scale: 1.5,
        rotateX: 0,
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: 1.5,
        },
      }
    );

    // Staggered content reveal
    if (contentRef.current) {
      gsap.from(Array.from(contentRef.current.children), {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 40%",
          end: "center center",
          scrub: 1,
        },
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
      data-section="decades"
    >
      {/* Cinematic gradient animation replacing video */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, hsl(40 46% 20% / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, hsl(40 46% 30% / 0.1) 0%, transparent 40%),
            linear-gradient(180deg, hsl(0 0% 6%) 0%, hsl(0 0% 10%) 50%, hsl(0 0% 6%) 100%)
          `,
        }}
      />

      {/* Giant background year with gradient clip */}
      <span
        ref={yearRef}
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(200px, 28vw, 600px)",
          fontWeight: 200,
          lineHeight: 1,
          WebkitTextStroke: "2px hsl(40 46% 56% / 0.15)",
          color: "transparent",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(135deg, hsl(40 46% 56% / 0.08), hsl(40 46% 30% / 0.04), hsl(40 46% 56% / 0.08))",
          backgroundSize: "200% 200%",
          animation: "shimmerBg 8s ease infinite",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          transformStyle: "preserve-3d",
          perspective: "800px",
        }}
      >
        2005
      </span>

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.p
          className="font-sans text-xs tracking-[0.5em] uppercase text-gold mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Two Decades of Excellence
        </motion.p>

        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-light text-gallery leading-tight mb-10"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
        >
          From Private Banking
          <br />
          <span className="gold-text-gradient">to Global Real Estate</span>
        </h2>

        <p className="font-sans text-muted-foreground leading-relaxed max-w-2xl mx-auto text-base md:text-lg">
          Leveraging a legacy of private banking to engineer high-yield retail
          opportunities. Where financial rigor meets Dubai's most exclusive real
          estate.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-16 md:gap-24 mt-16">
          {[
            { value: "20+", label: "Years Experience" },
            { value: "ABN", label: "AMRO Legacy" },
            { value: "37460", label: "RERA ID" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
            >
              <div
                className="text-4xl md:text-5xl gold-text-gradient font-light"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </div>
              <div className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground mt-3">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TwoDecadesSection;
