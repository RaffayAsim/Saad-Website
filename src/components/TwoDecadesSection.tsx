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
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  useEffect(() => {
    const section = sectionRef.current;
    const yearEl = yearRef.current;
    if (!section || !yearEl) return;

    // Year counter 2005 → 2026
    const counter = { value: 2005 };
    gsap.to(counter, {
      value: 2026,
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

    // 3D zoom-through effect on year
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1.5,
      },
    });
    tl.fromTo(yearEl, 
      { scale: 0.6, opacity: 0.05, rotateX: 20, z: -200 },
      { scale: 2.2, opacity: 0.2, rotateX: 0, z: 100, ease: "power2.inOut" }
    );

    // Content stagger reveal
    if (contentRef.current) {
      gsap.from(Array.from(contentRef.current.children), {
        y: 100,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: "top 45%",
        },
      });
    }

    // Cinematic light sweep
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { x: "-100%" },
        {
          x: "200%",
          duration: 3,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
          },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 25% 40%, hsl(40 46% 20% / 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 75% 60%, hsl(40 46% 30% / 0.08) 0%, transparent 40%),
          linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 0% 8%) 40%, hsl(0 0% 6%) 70%, hsl(0 0% 4%) 100%)
        `,
      }}
      data-section="decades"
    >
      {/* Gold ambient particles (CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: `hsl(40 46% 56% / ${Math.random() * 0.4 + 0.1})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: "0 0 8px hsl(40 46% 56% / 0.3)",
            }}
          />
        ))}
      </div>

      {/* Giant background year */}
      <span
        ref={yearRef}
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(180px, 30vw, 700px)",
          fontWeight: 200,
          lineHeight: 1,
          WebkitTextStroke: "2px hsl(40 46% 56% / 0.12)",
          color: "transparent",
          zIndex: 0,
          backgroundImage: "linear-gradient(135deg, hsl(40 46% 56% / 0.06), hsl(40 46% 30% / 0.03), hsl(40 46% 56% / 0.06))",
          backgroundSize: "200% 200%",
          animation: "shimmerBg 8s ease infinite",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          transformStyle: "preserve-3d",
          perspective: "1000px",
          willChange: "transform",
        }}
      >
        2005
      </span>

      {/* Cinematic light sweep */}
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(90deg, transparent 0%, hsl(40 46% 56% / 0.06) 40%, hsl(40 46% 56% / 0.12) 50%, hsl(40 46% 56% / 0.06) 60%, transparent 100%)",
        width: "40%",
        zIndex: 1,
      }} />

      {/* Content overlay */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          className="font-sans text-xs tracking-[0.5em] uppercase mb-10"
          style={{ color: "hsl(40 46% 56%)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Two Decades of Excellence
        </motion.p>

        <h2
          className="text-5xl md:text-7xl lg:text-8xl text-gallery leading-[0.95] mb-12"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
        >
          From Private Banking
          <br />
          <span className="gold-text-gradient">to Global Real Estate</span>
        </h2>

        <p className="font-sans text-muted-foreground leading-relaxed max-w-2xl mx-auto text-base md:text-xl mb-20">
          Leveraging a legacy of private banking to engineer high-yield retail
          opportunities. Where financial rigor meets Dubai's most exclusive real
          estate.
        </p>

        {/* Stats with gold glow */}
        <div className="flex justify-center gap-12 md:gap-24">
          {[
            { value: "20+", label: "Years Experience" },
            { value: "ABN", label: "AMRO Legacy" },
            { value: "37460", label: "RERA ID" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="text-5xl md:text-6xl gold-text-gradient mb-3"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
              >
                {stat.value}
              </div>
              <div className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground">
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
