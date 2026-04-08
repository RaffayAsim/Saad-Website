import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TwoDecadesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    const section = sectionRef.current;
    const yearEl = yearRef.current;
    if (!section || !yearEl) return;

    const ctx = gsap.context(() => {
      // Year counter 2005 → 2026
      const counter = { value: 2005 };
      gsap.to(counter, {
        value: 2026,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
        },
        onUpdate: () => {
          yearEl.textContent = Math.round(counter.value).toString();
        },
      });

      // 3D fly-through zoom on year
      gsap.fromTo(yearEl,
        { scale: 0.5, opacity: 0.03, rotateX: 30, z: -400 },
        {
          scale: 2.5, opacity: 0.18, rotateX: -5, z: 200,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 2,
          },
        }
      );

      // Content stagger
      if (contentRef.current) {
        gsap.from(Array.from(contentRef.current.children), {
          y: 80,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 45%",
          },
        });
      }

      // Cinematic light sweep
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current,
          { x: "-120%" },
          {
            x: "250%",
            duration: 3.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: section,
              start: "top 50%",
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[130vh] flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 30%, hsl(40 46% 20% / 0.15) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 70%, hsl(40 46% 30% / 0.1) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, hsl(40 46% 15% / 0.08) 0%, transparent 60%),
          linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 6%) 30%, hsl(0 0% 8%) 50%, hsl(0 0% 6%) 70%, hsl(0 0% 3%) 100%)
        `,
      }}
      data-section="decades"
    >
      {/* Gold ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `hsl(40 46% 56% / ${Math.random() * 0.5 + 0.1})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: `0 0 ${6 + Math.random() * 12}px hsl(40 46% 56% / 0.4)`,
            }}
          />
        ))}
      </div>

      {/* Horizontal gold lines for luxury feel */}
      <div className="absolute left-0 top-1/4 w-full h-px pointer-events-none" style={{
        background: "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.06) 30%, hsl(40 46% 56% / 0.12) 50%, hsl(40 46% 56% / 0.06) 70%, transparent 95%)",
      }} />
      <div className="absolute left-0 bottom-1/4 w-full h-px pointer-events-none" style={{
        background: "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.04) 30%, hsl(40 46% 56% / 0.08) 50%, hsl(40 46% 56% / 0.04) 70%, transparent 95%)",
      }} />

      {/* Giant background year */}
      <span
        ref={yearRef}
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(200px, 32vw, 800px)",
          fontWeight: 200,
          lineHeight: 1,
          WebkitTextStroke: "2px hsl(40 46% 56% / 0.1)",
          color: "transparent",
          zIndex: 0,
          backgroundImage: "linear-gradient(135deg, hsl(40 46% 56% / 0.05), hsl(40 46% 30% / 0.02), hsl(40 46% 56% / 0.05))",
          backgroundSize: "200% 200%",
          animation: "shimmerBg 6s ease infinite",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          transformStyle: "preserve-3d",
          perspective: "1200px",
          willChange: "transform, opacity",
        }}
      >
        2005
      </span>

      {/* Light sweep */}
      <div ref={overlayRef} className="absolute inset-y-0 pointer-events-none" style={{
        background: "linear-gradient(90deg, transparent 0%, hsl(40 46% 56% / 0.05) 35%, hsl(40 46% 56% / 0.15) 50%, hsl(40 46% 56% / 0.05) 65%, transparent 100%)",
        width: "35%",
        zIndex: 1,
      }} />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase mb-10"
          style={{ color: "hsl(40 46% 56%)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          Two Decades of Excellence
        </motion.p>

        <h2
          className="text-4xl md:text-6xl lg:text-8xl text-gallery leading-[0.9] mb-10"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
        >
          From Private Banking
          <br />
          <span className="gold-text-gradient">to Global Real Estate</span>
        </h2>

        <p className="font-sans text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm md:text-lg mb-16">
          Leveraging a legacy of private banking to engineer high-yield retail
          opportunities. Where financial rigor meets Dubai's most exclusive real
          estate.
        </p>

        {/* Stats with gold accents */}
        <div className="flex justify-center gap-8 md:gap-20">
          {[
            { value: "20+", label: "Years Experience" },
            { value: "ABN", label: "AMRO Legacy" },
            { value: "37460", label: "RERA ID" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center relative"
              initial={{ y: 60, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute -inset-4 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-700" style={{
                background: "radial-gradient(circle, hsl(40 46% 56% / 0.06), transparent 70%)",
              }} />
              <div
                className="text-4xl md:text-6xl gold-text-gradient mb-3 relative"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
              >
                {stat.value}
              </div>
              <div className="font-sans text-[9px] md:text-[11px] tracking-[0.35em] uppercase text-muted-foreground relative">
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
