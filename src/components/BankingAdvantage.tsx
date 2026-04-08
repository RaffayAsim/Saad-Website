import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BankingAdvantage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Title reveal
    if (titleRef.current) {
      gsap.from(titleRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
    }

    // Asymmetric parallax — left moves faster, right moves slower (depth)
    gsap.from(leftRef.current, {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 60%", end: "center center", scrub: 1 },
    });
    gsap.from(rightRef.current, {
      x: 80,
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 55%", end: "center center", scrub: 1.8 },
    });

    // Depth parallax on scroll
    gsap.to(leftRef.current, {
      y: -30,
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
    });
    gsap.to(rightRef.current, {
      y: -15, // Slower = appears further back
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5 },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const glassCard =
    "backdrop-blur-[20px] bg-[hsl(0_0%_8%/0.6)] border border-[hsl(40_46%_56%/0.3)] rounded-sm";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-charcoal-deep overflow-hidden py-24"
    >
      <div className="container mx-auto px-6">
        <div ref={titleRef} className="mb-20 max-w-2xl">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-4">
            The Competitive Edge
          </p>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-light text-gallery leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            Beyond Brokerage:
            <br />
            <span className="gold-text-gradient">Financial Architecture</span>
          </h2>
        </div>

        {/* Asymmetric layout */}
        <div className="relative grid md:grid-cols-12 gap-6 md:gap-0">
          {/* Left card — Real Estate — foreground */}
          <div
            ref={leftRef}
            className={`${glassCard} p-8 md:p-12 lg:p-16 md:col-span-7 relative z-10`}
          >
            <div className="w-12 h-px gold-gradient mb-8" />
            <h3
              className="text-2xl md:text-3xl text-gallery font-light mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Real Estate Savvy
            </h3>
            <ul className="space-y-4 font-sans text-sm text-muted-foreground leading-relaxed">
              {[
                "Senior Consultant at Savills & Cushman & Wakefield",
                "Specialty in Global Luxury Retail & Commercial Leasing",
                "RERA Certified Broker — ID 37460",
                "Off-market luxury retail deal access",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right card — Banking — behind, offset */}
          <div
            ref={rightRef}
            className={`${glassCard} p-8 md:p-12 lg:p-16 md:col-span-6 md:-ml-12 md:mt-16 relative z-0`}
          >
            <div className="w-12 h-px gold-gradient mb-8" />
            <h3
              className="text-2xl md:text-3xl text-gallery font-light mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Banking Precision
            </h3>
            <ul className="space-y-4 font-sans text-sm text-muted-foreground leading-relaxed">
              {[
                "7 Years in Private Banking at ABN AMRO",
                "Wealth Management & Service Compliance",
                "Financial Architecture for High-Net-Worth Clients",
                "A one-stop-shop approach for the global 1%",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankingAdvantage;
