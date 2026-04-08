import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BankingAdvantage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.from(leftRef.current, {
      x: -60,
      opacity: 0,
      scrollTrigger: { trigger: section, start: "top 60%", end: "center center", scrub: 1 },
    });
    gsap.from(rightRef.current, {
      x: 60,
      opacity: 0,
      scrollTrigger: { trigger: section, start: "top 60%", end: "center center", scrub: 1 },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-charcoal-deep overflow-hidden"
    >
      <div className="container mx-auto px-6 py-24">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold text-center mb-4">
          The Competitive Edge
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-gallery text-center mb-16 leading-tight">
          Beyond Brokerage:
          <br />
          <span className="gold-text-gradient">Financial Architecture</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-px bg-border/10">
          {/* Left: Real Estate */}
          <div
            ref={leftRef}
            className="bg-background p-8 md:p-12 lg:p-16 flex flex-col justify-center"
          >
            <div className="w-12 h-px gold-gradient mb-8" />
            <h3 className="font-serif text-2xl md:text-3xl text-gallery font-light mb-6">
              Real Estate Savvy
            </h3>
            <ul className="space-y-4 font-sans text-sm text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                Senior Consultant at Savills & Cushman & Wakefield
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                Specialty in Global Luxury Retail & Commercial Leasing
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                RERA Certified Broker — ID 37460
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                Off-market luxury retail deal access
              </li>
            </ul>
          </div>

          {/* Right: Banking */}
          <div
            ref={rightRef}
            className="bg-secondary p-8 md:p-12 lg:p-16 flex flex-col justify-center"
          >
            <div className="w-12 h-px gold-gradient mb-8" />
            <h3 className="font-serif text-2xl md:text-3xl text-gallery font-light mb-6">
              Banking Precision
            </h3>
            <ul className="space-y-4 font-sans text-sm text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                7 Years in Private Banking at ABN AMRO
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                Wealth Management & Service Compliance
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                Financial Architecture for High-Net-Worth Clients
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                A one-stop-shop approach for the global 1%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankingAdvantage;
