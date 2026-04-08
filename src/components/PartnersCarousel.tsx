import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: "Savills", subtitle: "Global Real Estate" },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence" },
  { name: "ABN AMRO", subtitle: "Private Banking" },
  { name: "RERA Dubai", subtitle: "Regulatory Authority" },
];

const PartnersCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children);
        cards.forEach((card, i) => {
          const speed = [0.3, 0.6, 0.45, 0.7][i % 4];
          gsap.to(card, {
            y: -60 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        });

        gsap.from(cards, {
          y: 100,
          opacity: 0,
          scale: 0.9,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 60%" },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, hsl(40 46% 20% / 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, hsl(40 46% 20% / 0.05) 0%, transparent 50%),
          linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 5%) 40%, hsl(0 0% 4%) 70%, hsl(0 0% 3%))
        `,
      }}
      data-section="partners"
    >
      <div className="container mx-auto px-6 md:px-16 max-w-[1400px]">
        <motion.div
          className="text-center mb-20 md:mb-28"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-gold mb-8">
            Trusted Network
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl text-gallery leading-[0.95]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            Global Retail
            <br />
            <span className="gold-text-gradient">Partners</span>
          </h2>
        </motion.div>

        {/* 3D Depth Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          style={{ perspective: "1200px" }}
        >
          {partners.map((partner, i) => (
            <PartnerCard key={partner.name} partner={partner} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent 10%, hsl(40 46% 56% / 0.1) 50%, transparent 90%)",
      }} />
    </section>
  );
};

const PartnerCard = ({
  partner,
  index,
}: {
  partner: { name: string; subtitle: string };
  index: number;
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
      rotateY: (x - 0.5) * 15,
      rotateX: -(y - 0.5) * 10,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0, rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  const depthOffsets = [0, 20, -10, 30];

  return (
    <div style={{ perspective: "800px", marginTop: `${depthOffsets[index % 4]}px` }}>
      <div
        ref={cardRef}
        className="relative p-8 md:p-10 rounded-2xl cursor-pointer group"
        style={{
          transformStyle: "preserve-3d",
          background: "hsl(0 0% 5% / 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid hsl(40 46% 56% / 0.1)",
          boxShadow: hovering
            ? "0 30px 60px hsl(0 0% 0% / 0.5), 0 0 40px hsl(40 46% 56% / 0.08)"
            : "0 10px 30px hsl(0 0% 0% / 0.3)",
          transition: "box-shadow 0.5s, border-color 0.5s",
          borderColor: hovering ? "hsl(40 46% 56% / 0.3)" : "hsl(40 46% 56% / 0.1)",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor="View"
      >
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
          style={{
            opacity: hovering ? 1 : 0,
            background: `radial-gradient(400px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(40 46% 56% / 0.12), transparent 50%)`,
          }}
        />

        <div className="w-10 h-10 rounded-lg mb-6 flex items-center justify-center transition-all duration-500" style={{
          background: hovering
            ? "linear-gradient(135deg, hsl(40 46% 56% / 0.2), hsl(40 46% 56% / 0.08))"
            : "hsl(0 0% 10% / 0.5)",
          border: "1px solid hsl(40 46% 56% / 0.12)",
        }}>
          <span className="text-gold text-xs transition-transform duration-500 group-hover:scale-125">✦</span>
        </div>

        <h3
          className="text-xl md:text-2xl text-gallery mb-2 transition-colors duration-500"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 300,
            color: hovering ? "hsl(40 46% 70%)" : undefined,
          }}
        >
          {partner.name}
        </h3>
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          {partner.subtitle}
        </p>

        <div className="absolute bottom-0 left-4 right-4 h-px transition-opacity duration-500" style={{
          background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.2), transparent)",
          opacity: hovering ? 1 : 0,
        }} />
      </div>
    </div>
  );
};

export default PartnersCarousel;
