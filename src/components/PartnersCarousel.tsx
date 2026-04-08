import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: "Savills", subtitle: "Global Real Estate", depth: 0 },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence", depth: 1 },
  { name: "ABN AMRO", subtitle: "Private Banking", depth: 2 },
  { name: "RERA Dubai", subtitle: "Regulatory Authority", depth: 0.5 },
  { name: "Savills", subtitle: "Global Real Estate", depth: 1.5 },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence", depth: 0.3 },
];

const PartnersCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Parallax at different speeds based on depth
    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      const depth = partners[i % partners.length].depth;
      gsap.to(el, {
        y: -40 * (1 + depth * 0.5),
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1 + depth,
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-background overflow-hidden"
      data-section="partners"
    >
      {/* Ambient lighting */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, hsl(40 46% 56% / 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.p
        className="font-sans text-xs tracking-[0.5em] uppercase text-gold text-center mb-20"
        initial={{ y: 30, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        Global Retail Partners
      </motion.p>

      {/* 3D Floating Logos Grid */}
      <div className="max-w-6xl mx-auto px-6" style={{ perspective: "1200px" }}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {partners.map((p, i) => {
            const depthScale = 1 - p.depth * 0.08;
            const blur = p.depth * 1.5;

            return (
              <motion.div
                key={i}
                ref={(el) => { itemsRef.current[i] = el; }}
                className="group relative"
                initial={{ y: 60 + p.depth * 20, opacity: 0, scale: depthScale }}
                animate={
                  isInView
                    ? { y: 0, opacity: 1, scale: depthScale }
                    : {}
                }
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1 * i,
                }}
                style={{
                  filter: `blur(${blur}px)`,
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${-p.depth * 60}px)`,
                }}
                data-cursor="View"
              >
                <div className="backdrop-blur-[16px] bg-[hsl(0_0%_8%/0.5)] border border-[hsl(40_46%_56%/0.15)] rounded-sm p-8 md:p-12 text-center transition-all duration-700 group-hover:border-gold/50 group-hover:shadow-[0_0_40px_hsl(40_46%_56%/0.15)]">
                  <span
                    className="text-2xl md:text-3xl lg:text-4xl text-gallery/50 font-light tracking-wide transition-all duration-700 group-hover:text-gold group-hover:drop-shadow-[0_0_30px_hsl(40_46%_56%/0.5)]"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      filter: "grayscale(100%)",
                      transition: "filter 0.7s, color 0.7s",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.filter = "grayscale(0%)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.filter = "grayscale(100%)";
                    }}
                  >
                    {p.name}
                  </span>
                  <span className="block font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mt-4 group-hover:text-gold/60 transition-colors duration-500">
                    {p.subtitle}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="w-20 h-px gold-gradient mx-auto mt-20" />
    </section>
  );
};

export default PartnersCarousel;
