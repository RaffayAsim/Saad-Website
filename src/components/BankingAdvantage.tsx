import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------- 3D Tilt Card with Inner Glow ---------- */
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
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const rotateX = ((y - 50) / 50) * -12 * depth;
    const rotateY = ((x - 50) / 50) * 12 * depth;
    setGlow({ x, y });

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1200,
    });
  };

  const handleLeave = () => {
    setIsHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transformStyle: "preserve-3d",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        background: "hsl(0 0% 5% / 0.65)",
        border: "1px solid hsl(40 46% 56% / 0.2)",
        borderRadius: "2px",
        boxShadow: isHovered
          ? "0 30px 80px hsl(40 46% 56% / 0.12), 0 0 1px hsl(40 46% 56% / 0.4), inset 0 1px 0 hsl(40 46% 56% / 0.1)"
          : "0 10px 40px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(40 46% 56% / 0.05)",
        transition: "box-shadow 0.6s ease",
      }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleLeave}
      data-cursor="Explore"
    >
      {/* Mouse-following inner glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${glow.x}% ${glow.y}%, hsl(40 46% 56% / 0.15) 0%, transparent 50%)`,
        }}
      />
      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(40 46% 56% / ${isHovered ? 0.5 : 0.15}), transparent)`,
          transition: "background 0.6s",
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
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Parallax depths
    gsap.to(leftRef.current, {
      y: -60,
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 },
    });
    gsap.to(rightRef.current, {
      y: -25,
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 2.5 },
    });

    // Title reveal with character split
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const listItems = (items: string[]) =>
    items.map((item, i) => (
      <motion.li
        key={item}
        className="flex items-start gap-4"
        initial={{ x: -30, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="w-2.5 h-2.5 rounded-full mt-2 shrink-0" style={{
          background: "linear-gradient(135deg, hsl(40 46% 56%), hsl(40 50% 70%))",
          boxShadow: "0 0 16px hsl(40 46% 56% / 0.5), 0 0 4px hsl(40 46% 56% / 0.8)",
        }} />
        <span className="text-base md:text-lg leading-relaxed">{item}</span>
      </motion.li>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden py-32 md:py-40"
      style={{ background: "linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 0% 6%) 50%, hsl(0 0% 4%) 100%)" }}
      data-section="advantage"
    >
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none" style={{
        background: "radial-gradient(circle, hsl(40 46% 56% / 0.06) 0%, transparent 60%)",
        filter: "blur(100px)",
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
        background: "radial-gradient(circle, hsl(40 46% 30% / 0.04) 0%, transparent 60%)",
        filter: "blur(80px)",
      }} />

      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Title */}
        <div ref={titleRef} className="mb-20 md:mb-28 max-w-4xl">
          <motion.p
            className="font-sans text-xs tracking-[0.5em] uppercase mb-8"
            style={{ color: "hsl(40 46% 56%)" }}
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1 }}
          >
            The Competitive Edge
          </motion.p>
          <h2
            className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-gallery"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            Beyond Brokerage:
            <br />
            <span className="gold-text-gradient">Financial Architecture</span>
          </h2>
        </div>

        {/* Asymmetric Card Layout — proper contained grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6" style={{ perspective: "1500px" }}>
          {/* Left card — foreground, larger */}
          <motion.div
            ref={leftRef}
            className="lg:col-span-7 relative z-10"
            initial={{ x: -80, opacity: 0, rotateY: 8 }}
            animate={isInView ? { x: 0, opacity: 1, rotateY: 0 } : {}}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <TiltCard className="p-8 md:p-12 lg:p-16" depth={1.2}>
              <div className="w-20 h-[2px] gold-gradient mb-10" />
              <h3
                className="text-3xl md:text-5xl text-gallery mb-10"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
              >
                Real Estate Savvy
              </h3>
              <ul className="space-y-6 font-sans text-muted-foreground">
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
            className="lg:col-span-6 lg:-ml-8 lg:mt-24 relative z-0"
            initial={{ x: 80, opacity: 0, rotateY: -8 }}
            animate={isInView ? { x: 0, opacity: 1, rotateY: 0 } : {}}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            <TiltCard className="p-8 md:p-12 lg:p-16" depth={0.6}>
              <div className="w-20 h-[2px] gold-gradient mb-10" />
              <h3
                className="text-3xl md:text-5xl text-gallery mb-10"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
              >
                Banking Precision
              </h3>
              <ul className="space-y-6 font-sans text-muted-foreground">
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
