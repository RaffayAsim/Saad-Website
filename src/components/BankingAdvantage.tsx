import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------- 3D Tilt Card ---------- */
const TiltCard = ({
  children,
  className = "",
  depth = 1,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const rotateX = ((y - 50) / 50) * -8 * depth;
    const rotateY = ((x - 50) / 50) * 8 * depth;
    setGlow({ x, y });

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative backdrop-blur-[20px] bg-[hsl(0_0%_6%/0.7)] border border-[hsl(40_46%_56%/0.25)] rounded-sm overflow-hidden ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      data-cursor="Explore"
    >
      {/* Inner glow following mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, hsl(40 46% 56% / 0.12) 0%, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
};

const BankingAdvantage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Depth parallax
    gsap.to(leftRef.current, {
      y: -50,
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
    });
    gsap.to(rightRef.current, {
      y: -20,
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 2 },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const listItems = (items: string[]) =>
    items.map((item) => (
      <li key={item} className="flex items-start gap-4">
        <span className="w-2 h-2 rounded-full bg-gold mt-2.5 shrink-0 shadow-[0_0_12px_hsl(40_46%_56%/0.5)]" />
        <span>{item}</span>
      </li>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-charcoal-deep overflow-hidden py-32"
      data-section="advantage"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(40 46% 56% / 0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container mx-auto px-6">
        {/* Title */}
        <motion.div
          className="mb-24 max-w-3xl"
          initial={{ y: 80, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-sans text-xs tracking-[0.5em] uppercase text-gold mb-6">
            The Competitive Edge
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-light text-gallery leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            Beyond Brokerage:
            <br />
            <span className="gold-text-gradient">Financial Architecture</span>
          </h2>
        </motion.div>

        {/* Asymmetric 3D Tilt Cards */}
        <div className="relative grid md:grid-cols-12 gap-8 md:gap-0" style={{ perspective: "1500px" }}>
          {/* Left card — foreground */}
          <motion.div
            ref={leftRef}
            className="md:col-span-7 relative z-10"
            initial={{ x: -120, opacity: 0, rotateY: 15 }}
            animate={isInView ? { x: 0, opacity: 1, rotateY: 0 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <TiltCard className="p-10 md:p-14 lg:p-16" depth={1.2}>
              <div className="w-16 h-px gold-gradient mb-10" />
              <h3
                className="text-3xl md:text-4xl text-gallery font-light mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Real Estate Savvy
              </h3>
              <ul className="space-y-5 font-sans text-base text-muted-foreground leading-relaxed">
                {listItems([
                  "Senior Consultant at Savills & Cushman & Wakefield",
                  "Specialty in Global Luxury Retail & Commercial Leasing",
                  "RERA Certified Broker — ID 37460",
                  "Off-market luxury retail deal access",
                ])}
              </ul>
            </TiltCard>
          </motion.div>

          {/* Right card — behind, offset, moves slower */}
          <motion.div
            ref={rightRef}
            className="md:col-span-6 md:-ml-16 md:mt-20 relative z-0"
            initial={{ x: 120, opacity: 0, rotateY: -15 }}
            animate={isInView ? { x: 0, opacity: 1, rotateY: 0 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <TiltCard className="p-10 md:p-14 lg:p-16" depth={0.6}>
              <div className="w-16 h-px gold-gradient mb-10" />
              <h3
                className="text-3xl md:text-4xl text-gallery font-light mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Banking Precision
              </h3>
              <ul className="space-y-5 font-sans text-base text-muted-foreground leading-relaxed">
                {listItems([
                  "7 Years in Private Banking at ABN AMRO",
                  "Wealth Management & Service Compliance",
                  "Financial Architecture for High-Net-Worth Clients",
                  "A one-stop-shop approach for the global 1%",
                ])}
              </ul>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BankingAdvantage;
