import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: "Savills", subtitle: "Global Real Estate" },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence" },
  { name: "ABN AMRO", subtitle: "Private Banking" },
  { name: "Savills", subtitle: "Global Real Estate" },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence" },
  { name: "ABN AMRO", subtitle: "Private Banking" },
  { name: "Savills", subtitle: "Global Real Estate" },
  { name: "Cushman & Wakefield", subtitle: "Commercial Excellence" },
  { name: "ABN AMRO", subtitle: "Private Banking" },
];

const PartnersCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 3;
    gsap.to(track, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    // Title reveal
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <p
        ref={titleRef}
        className="font-sans text-xs tracking-[0.4em] uppercase text-gold text-center mb-12"
      >
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
              className="group flex-shrink-0 w-80 md:w-96 px-8 py-12 border-r border-border/20 flex flex-col items-center justify-center cursor-pointer transition-all duration-500"
            >
              <span
                className="text-2xl md:text-3xl text-gallery font-light tracking-wide grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-gold group-hover:drop-shadow-[0_0_20px_hsl(40_46%_56%/0.4)] transition-all duration-700"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.name}
              </span>
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mt-3 group-hover:text-gold/70 transition-colors duration-500">
                {p.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-16 h-px gold-gradient mx-auto mt-16" />
    </section>
  );
};

export default PartnersCarousel;
