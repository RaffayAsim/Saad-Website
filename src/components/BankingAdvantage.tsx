import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------- 3D Tilt Card ---------- */
const TiltCard = ({
  children,
  className = "",
  glowColor = "hsl(40 46% 56% / 0.15)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });

    gsap.to(cardRef.current, {
      rotateY: (x - 0.5) * 20,
      rotateX: -(y - 0.5) * 15,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  return (
    <div style={{ perspective: "1000px" }}>
      <div
        ref={cardRef}
        className={`relative overflow-hidden rounded-2xl ${className}`}
        style={{
          transformStyle: "preserve-3d",
          background: "hsl(0 0% 6% / 0.8)",
          backdropFilter: "blur(24px)",
          border: "1px solid hsl(40 46% 56% / 0.15)",
          boxShadow: hovering
            ? "0 30px 80px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(40 46% 56% / 0.1)"
            : "0 10px 40px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(40 46% 56% / 0.05)",
          transition: "box-shadow 0.5s",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor="View"
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl"
          style={{
            opacity: hovering ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${glowColor}, transparent 50%)`,
          }}
        />
        {/* Top shine */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{
          background: hovering
            ? "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.3), transparent)"
            : "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.1), transparent)",
          transition: "background 0.5s",
        }} />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

/* ---------- Main Section ---------- */
const BankingAdvantage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 80,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 60%" },
        });
      }

      if (leftCardRef.current) {
        gsap.fromTo(leftCardRef.current,
          { y: 120, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 55%" },
          }
        );
        gsap.to(leftCardRef.current, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      if (rightCardRef.current) {
        gsap.fromTo(rightCardRef.current,
          { y: 180, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.6,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 55%" },
          }
        );
        gsap.to(rightCardRef.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const listItems = (items: string[]) =>
    items.map((item, i) => (
      <motion.li
        key={item}
        initial={{ x: -30, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-start gap-4 text-sm md:text-base text-muted-foreground leading-relaxed"
      >
        <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 gold-gradient" />
        <span>{item}</span>
      </motion.li>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(40 46% 20% / 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(40 46% 20% / 0.06) 0%, transparent 50%),
          linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 5%) 50%, hsl(0 0% 3%))
        `,
      }}
      data-section="advantage"
    >
      {/* Ambient vertical lines */}
      <div className="absolute left-[15%] top-0 bottom-0 w-px pointer-events-none" style={{ background: "hsl(40 46% 56% / 0.04)" }} />
      <div className="absolute right-[15%] top-0 bottom-0 w-px pointer-events-none" style={{ background: "hsl(40 46% 56% / 0.04)" }} />

      <div className="container mx-auto px-6 md:px-16 max-w-[1400px]">
        {/* Title */}
        <div ref={titleRef} className="mb-20 md:mb-28">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-gold mb-8">
            The Competitive Edge
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl text-gallery leading-[0.95]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            Beyond Brokerage:
            <br />
            <span className="gold-text-gradient">Financial Architecture</span>
          </h2>
        </div>

        {/* Asymmetric Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div ref={leftCardRef} className="lg:col-span-7">
            <TiltCard className="p-8 md:p-12">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    background: "linear-gradient(135deg, hsl(40 46% 56% / 0.15), hsl(40 46% 56% / 0.05))",
                    border: "1px solid hsl(40 46% 56% / 0.2)",
                  }}>
                    <span className="text-gold text-lg">◆</span>
                  </div>
                  <h3
                    className="text-2xl md:text-3xl text-gallery"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
                  >
                    Real Estate Savvy
                  </h3>
                </div>
                <div className="w-16 h-px gold-gradient mb-8" />
              </div>
              <ul className="space-y-5">
                {listItems([
                  "Senior Consultant at Savills & Cushman & Wakefield",
                  "Specialty in Global Luxury Retail & Commercial Leasing",
                  "RERA Certified Broker — ID 37460",
                  "Off-market luxury retail deal access",
                  "Strategic positioning for premium retail spaces",
                ])}
              </ul>
            </TiltCard>
          </div>

          <div ref={rightCardRef} className="lg:col-span-5 lg:mt-24">
            <TiltCard className="p-8 md:p-10" glowColor="hsl(40 46% 56% / 0.12)">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    background: "linear-gradient(135deg, hsl(40 46% 56% / 0.1), hsl(40 46% 56% / 0.03))",
                    border: "1px solid hsl(40 46% 56% / 0.15)",
                  }}>
                    <span className="text-gold text-lg">⬡</span>
                  </div>
                  <h3
                    className="text-2xl md:text-3xl text-gallery"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
                  >
                    Banking Precision
                  </h3>
                </div>
                <div className="w-16 h-px gold-gradient mb-8" />
              </div>
              <ul className="space-y-5">
                {listItems([
                  "7 Years in Private Banking at ABN AMRO",
                  "Wealth Management & Service Compliance",
                  "Financial Architecture for High-Net-Worth Clients",
                  "A one-stop-shop approach for the global 1%",
                ])}
              </ul>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankingAdvantage;
