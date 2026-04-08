import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const partners = [
  { name: "Savills", subtitle: "Global Real Estate" },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence" },
  { name: "ABN AMRO", subtitle: "Private Banking" },
  { name: "RERA Dubai", subtitle: "Regulatory Authority" },
];

// Duplicate for seamless loop
const marqueeItems = [...partners, ...partners, ...partners];

const PartnersCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 0% 6%) 50%, hsl(0 0% 4%) 100%)",
      }}
      data-section="partners"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none" style={{
        background: "radial-gradient(ellipse, hsl(40 46% 56% / 0.04) 0%, transparent 60%)",
        filter: "blur(80px)",
      }} />

      <motion.div
        className="text-center mb-20"
        initial={{ y: 40, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
      >
        <p className="font-sans text-xs tracking-[0.5em] uppercase mb-6" style={{ color: "hsl(40 46% 56%)" }}>
          Global Retail Partners
        </p>
        <h2
          className="text-4xl md:text-6xl text-gallery"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
        >
          Trusted by the <span className="gold-text-gradient">Best</span>
        </h2>
      </motion.div>

      {/* Infinite Marquee — Row 1 */}
      <div className="relative mb-6">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10" style={{ background: "linear-gradient(90deg, hsl(0 0% 5%), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10" style={{ background: "linear-gradient(-90deg, hsl(0 0% 5%), transparent)" }} />

        <div className="flex animate-marquee">
          {marqueeItems.map((p, i) => (
            <div
              key={i}
              className="group flex-shrink-0 mx-4 md:mx-6"
              data-cursor="View"
            >
              <div
                className="px-10 md:px-16 py-8 md:py-10 text-center transition-all duration-700"
                style={{
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  background: "hsl(0 0% 6% / 0.5)",
                  border: "1px solid hsl(40 46% 56% / 0.1)",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "hsl(40 46% 56% / 0.4)";
                  el.style.boxShadow = "0 0 60px hsl(40 46% 56% / 0.12), 0 20px 40px hsl(0 0% 0% / 0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "hsl(40 46% 56% / 0.1)";
                  el.style.boxShadow = "none";
                }}
              >
                <span
                  className="block text-2xl md:text-4xl text-gallery/40 tracking-wide transition-all duration-700 group-hover:text-gold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 300,
                    filter: "grayscale(100%)",
                    transition: "filter 0.7s, color 0.7s",
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = "grayscale(0%) drop-shadow(0 0 20px hsl(40 46% 56% / 0.5))"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = "grayscale(100%)"; }}
                >
                  {p.name}
                </span>
                <span className="block font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-3 group-hover:text-gold/50 transition-colors duration-500">
                  {p.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Marquee — Row 2 (reverse) */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10" style={{ background: "linear-gradient(90deg, hsl(0 0% 5%), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10" style={{ background: "linear-gradient(-90deg, hsl(0 0% 5%), transparent)" }} />

        <div className="flex animate-marquee-reverse">
          {marqueeItems.map((p, i) => (
            <div
              key={i}
              className="group flex-shrink-0 mx-4 md:mx-6"
              data-cursor="View"
            >
              <div
                className="px-10 md:px-16 py-8 md:py-10 text-center transition-all duration-700"
                style={{
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  background: "hsl(0 0% 6% / 0.5)",
                  border: "1px solid hsl(40 46% 56% / 0.1)",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "hsl(40 46% 56% / 0.4)";
                  el.style.boxShadow = "0 0 60px hsl(40 46% 56% / 0.12), 0 20px 40px hsl(0 0% 0% / 0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "hsl(40 46% 56% / 0.1)";
                  el.style.boxShadow = "none";
                }}
              >
                <span
                  className="block text-2xl md:text-4xl text-gallery/40 tracking-wide transition-all duration-700 group-hover:text-gold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 300,
                    filter: "grayscale(100%)",
                    transition: "filter 0.7s, color 0.7s",
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = "grayscale(0%) drop-shadow(0 0 20px hsl(40 46% 56% / 0.5))"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = "grayscale(100%)"; }}
                >
                  {p.name}
                </span>
                <span className="block font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-3 group-hover:text-gold/50 transition-colors duration-500">
                  {p.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-24 h-px gold-gradient mx-auto mt-24" />
    </section>
  );
};

export default PartnersCarousel;
