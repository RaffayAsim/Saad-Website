import { useEffect, useRef } from "react";
import gsap from "gsap";

const partners = [
  { name: "Savills", subtitle: "Global Real Estate" },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence" },
  { name: "ABN AMRO", subtitle: "Private Banking" },
  { name: "Savills", subtitle: "Global Real Estate" },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence" },
  { name: "ABN AMRO", subtitle: "Private Banking" },
];

const PartnersCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;
    gsap.to(track, {
      x: -totalWidth,
      duration: 25,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold text-center mb-12">
        Global Retail Partners
      </p>

      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div ref={trackRef} className="flex gap-0 whitespace-nowrap">
          {partners.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 md:w-96 px-8 py-12 border-r border-border/20 flex flex-col items-center justify-center"
            >
              <span className="font-serif text-2xl md:text-3xl text-gallery font-light tracking-wide">
                {p.name}
              </span>
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mt-3">
                {p.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative line */}
      <div className="w-16 h-px gold-gradient mx-auto mt-16" />
    </section>
  );
};

export default PartnersCarousel;
