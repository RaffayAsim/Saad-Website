import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Dubai skyline building data ── */
const buildings = [
  { x: 3, w: 2.5, maxH: 12, era: 0, lit: 0.4 },
  { x: 6, w: 3, maxH: 18, era: 0, lit: 0.3 },
  { x: 10, w: 2, maxH: 22, era: 0, lit: 0.5 },
  { x: 13, w: 4, maxH: 16, era: 0, lit: 0.35 },
  { x: 18, w: 2.5, maxH: 28, era: 0.05, lit: 0.45 },
  { x: 22, w: 1.5, maxH: 42, era: 0.15, lit: 0.5 },
  { x: 25, w: 3, maxH: 32, era: 0.15, lit: 0.4 },
  { x: 29, w: 2, maxH: 50, era: 0.2, lit: 0.6 },
  { x: 32, w: 3.5, maxH: 38, era: 0.2, lit: 0.35 },
  { x: 37, w: 2, maxH: 48, era: 0.25, lit: 0.55 },
  // Burj Khalifa zone
  { x: 42, w: 1, maxH: 90, era: 0.18, lit: 0.7 },
  { x: 44, w: 2.5, maxH: 52, era: 0.22, lit: 0.5 },
  { x: 47, w: 3, maxH: 44, era: 0.28, lit: 0.4 },
  // Mid expansion
  { x: 52, w: 2, maxH: 58, era: 0.4, lit: 0.55 },
  { x: 55, w: 3, maxH: 48, era: 0.4, lit: 0.45 },
  { x: 59, w: 2.5, maxH: 62, era: 0.45, lit: 0.6 },
  { x: 62, w: 1.8, maxH: 68, era: 0.5, lit: 0.5 },
  // Modern towers
  { x: 66, w: 3, maxH: 56, era: 0.6, lit: 0.55 },
  { x: 70, w: 2, maxH: 72, era: 0.6, lit: 0.65 },
  { x: 73, w: 2.5, maxH: 52, era: 0.65, lit: 0.45 },
  { x: 77, w: 1.5, maxH: 78, era: 0.7, lit: 0.6 },
  { x: 80, w: 3, maxH: 42, era: 0.7, lit: 0.4 },
  { x: 84, w: 2, maxH: 35, era: 0.75, lit: 0.35 },
  { x: 87, w: 2.5, maxH: 48, era: 0.8, lit: 0.5 },
  { x: 91, w: 3, maxH: 28, era: 0.85, lit: 0.3 },
  { x: 95, w: 2, maxH: 20, era: 0.85, lit: 0.25 },
];

const milestones = [
  { year: 2005, label: "ABN AMRO", desc: "Private Banking Career Begins", pct: 0 },
  { year: 2012, label: "Savills", desc: "Senior Consultant — Global Real Estate", pct: 25 },
  { year: 2018, label: "Cushman & Wakefield", desc: "Luxury Retail Expansion", pct: 50 },
  { year: 2023, label: "Dubai", desc: "Market Leadership — RERA 37460", pct: 75 },
  { year: 2026, label: "The Monograph", desc: "Two Decades of Excellence", pct: 95 },
];

const TwoDecadesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const SCROLL_END = "+=300%";

      // Pin the inner viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: SCROLL_END,
        pin: pin,
        pinSpacing: true,
      });

      // Year counter 2005 → 2026
      const counter = { value: 2005 };
      gsap.to(counter, {
        value: 2026,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: SCROLL_END,
          scrub: 0.5,
        },
        onUpdate: () => {
          if (yearRef.current) {
            yearRef.current.textContent = Math.round(counter.value).toString();
          }
        },
      });

      // Year text 3D scale + perspective
      if (yearRef.current) {
        gsap.fromTo(
          yearRef.current,
          { scale: 0.4, opacity: 0.03, rotateX: 25 },
          {
            scale: 1.8,
            opacity: 0.18,
            rotateX: -8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: SCROLL_END,
              scrub: 1,
            },
          },
        );
      }

      // Sun / lens flare rises
      if (sunRef.current) {
        gsap.fromTo(
          sunRef.current,
          { y: 100, opacity: 0, scale: 0.5 },
          {
            y: -80,
            opacity: 1,
            scale: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=150%",
              scrub: 1,
            },
          },
        );
      }

      // Buildings grow from ground
      if (skylineRef.current) {
        const buildingEls = skylineRef.current.querySelectorAll(".building");
        buildingEls.forEach((el, i) => {
          const b = buildings[i];
          if (!b) return;
          gsap.fromTo(
            el,
            { scaleY: 0, opacity: 0 },
            {
              scaleY: 1,
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: `top+=${b.era * 80}% top`,
                end: `top+=${(b.era + 0.25) * 80}% top`,
                scrub: 0.3,
              },
            },
          );
        });
      }

      // Heading reveal
      if (headingRef.current) {
        const children = Array.from(headingRef.current.children);
        gsap.fromTo(
          children,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%" },
          },
        );
      }

      // Milestones appear & disappear
      if (milestonesRef.current) {
        const items = milestonesRef.current.querySelectorAll(".milestone");
        items.forEach((item, i) => {
          const m = milestones[i];
          // Enter
          gsap.fromTo(
            item,
            { y: 50, opacity: 0, scale: 0.85 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: `top+=${m.pct}% top`,
                end: `top+=${m.pct + 8}% top`,
                scrub: true,
              },
            },
          );
          // Exit (except last)
          if (i < milestones.length - 1) {
            gsap.to(item, {
              y: -30,
              opacity: 0,
              scrollTrigger: {
                trigger: section,
                start: `top+=${m.pct + 14}% top`,
                end: `top+=${m.pct + 20}% top`,
                scrub: true,
              },
            });
          }
        });
      }

      // Stats fly in at end
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll(".stat-item");
        gsap.fromTo(
          statEls,
          { y: 80, opacity: 0, rotateX: -20 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top+250% top",
              end: "top+280% top",
              scrub: true,
            },
          },
        );
      }

      // Light sweep
      if (sweepRef.current) {
        gsap.fromTo(
          sweepRef.current,
          { x: "-100%" },
          {
            x: "350%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: SCROLL_END,
              scrub: 2,
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" data-section="decades">
      <div
        ref={pinRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, hsl(40 46% 20% / 0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, hsl(40 46% 30% / 0.08) 0%, transparent 45%),
            linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 5%) 30%, hsl(0 0% 7%) 50%, hsl(0 0% 5%) 70%, hsl(0 0% 3%) 100%)
          `,
        }}
      >
        {/* Gold ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                background: `hsl(40 46% 56% / ${Math.random() * 0.4 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                boxShadow: `0 0 ${6 + Math.random() * 10}px hsl(40 46% 56% / 0.3)`,
              }}
            />
          ))}
        </div>

        {/* Horizontal gold lines */}
        <div
          className="absolute left-0 top-1/4 w-full h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.06) 30%, hsl(40 46% 56% / 0.12) 50%, hsl(40 46% 56% / 0.06) 70%, transparent 95%)",
          }}
        />
        <div
          className="absolute left-0 bottom-1/3 w-full h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.04) 30%, hsl(40 46% 56% / 0.08) 50%, hsl(40 46% 56% / 0.04) 70%, transparent 95%)",
          }}
        />

        {/* Sun / lens flare behind skyline */}
        <div
          ref={sunRef}
          className="absolute pointer-events-none"
          style={{
            bottom: "30%",
            left: "42%",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsl(40 50% 60% / 0.25) 0%, hsl(40 46% 56% / 0.08) 40%, transparent 70%)",
            filter: "blur(30px)",
            zIndex: 0,
          }}
        />

        {/* Giant background year */}
        <span
          ref={yearRef}
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(200px, 35vw, 900px)",
            fontWeight: 200,
            lineHeight: 1,
            WebkitTextStroke: "2px hsl(40 46% 56% / 0.08)",
            color: "transparent",
            zIndex: 0,
            backgroundImage:
              "linear-gradient(135deg, hsl(40 46% 56% / 0.06), hsl(40 46% 30% / 0.02), hsl(40 46% 56% / 0.06))",
            backgroundSize: "200% 200%",
            animation: "shimmerBg 6s ease infinite",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            transformStyle: "preserve-3d",
            perspective: "1200px",
            willChange: "transform, opacity",
          }}
        >
          2005
        </span>

        {/* Dubai Skyline */}
        <div
          ref={skylineRef}
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: "45%", zIndex: 1 }}
        >
          {/* Ground glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.25) 50%, transparent 95%)",
              boxShadow: "0 0 20px hsl(40 46% 56% / 0.15)",
            }}
          />

          {/* Buildings */}
          {buildings.map((b, i) => (
            <div
              key={i}
              className="building absolute bottom-0"
              style={{
                left: `${b.x}%`,
                width: `${b.w}%`,
                height: `${b.maxH}%`,
                transformOrigin: "bottom center",
                background: `linear-gradient(180deg, hsl(40 46% 56% / ${b.lit * 0.3}) 0%, hsl(40 46% 56% / ${b.lit * 0.08}) 100%)`,
                borderTop: `1px solid hsl(40 46% 56% / ${b.lit * 0.3})`,
                borderLeft: "1px solid hsl(40 46% 56% / 0.06)",
                borderRight: "1px solid hsl(40 46% 56% / 0.06)",
                opacity: 0,
              }}
            >
              {/* Window grid */}
              <div className="absolute inset-[3px] flex flex-col gap-[2px] overflow-hidden opacity-40">
                {Array.from({ length: Math.max(2, Math.floor(b.maxH / 6)) }).map(
                  (_, j) => (
                    <div key={j} className="flex gap-[2px] flex-1">
                      {Array.from({ length: 2 }).map((_, k) => (
                        <div
                          key={k}
                          className="flex-1 rounded-[1px]"
                          style={{
                            background:
                              Math.random() > 0.35
                                ? `hsl(40 46% 56% / ${0.15 + Math.random() * 0.25})`
                                : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  ),
                )}
              </div>

              {/* Top glow */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{
                  background: "hsl(40 46% 56%)",
                  boxShadow: `0 0 6px hsl(40 46% 56% / ${b.lit * 0.5})`,
                  opacity: b.maxH > 50 ? 1 : 0,
                }}
              />
            </div>
          ))}

          {/* Ground fog */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent, hsl(40 46% 56% / 0.04))",
            }}
          />
        </div>

        {/* Light sweep */}
        <div
          ref={sweepRef}
          className="absolute inset-y-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(40 46% 56% / 0.03) 35%, hsl(40 46% 56% / 0.1) 50%, hsl(40 46% 56% / 0.03) 65%, transparent 100%)",
            width: "20%",
            zIndex: 2,
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div ref={headingRef}>
            <p
              className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase mb-8"
              style={{ color: "hsl(40 46% 56%)" }}
            >
              Two Decades of Excellence
            </p>

            <h2
              className="text-4xl md:text-6xl lg:text-8xl text-gallery leading-[0.9] mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 200,
              }}
            >
              From Private Banking
              <br />
              <span className="gold-text-gradient">to Global Real Estate</span>
            </h2>
          </div>

          {/* Milestones — stacked, absolute */}
          <div ref={milestonesRef} className="relative h-24 mb-12">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="milestone absolute inset-0 flex flex-col items-center justify-center opacity-0"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-px gold-gradient" />
                  <span
                    className="font-sans text-lg md:text-xl tracking-[0.2em]"
                    style={{ color: "hsl(40 46% 56%)" }}
                  >
                    {m.year}
                  </span>
                  <div className="w-8 h-px gold-gradient" />
                </div>
                <span
                  className="text-xl md:text-2xl text-gallery mb-1"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 300,
                  }}
                >
                  {m.label}
                </span>
                <span className="font-sans text-xs text-muted-foreground tracking-[0.15em]">
                  {m.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="flex justify-center gap-8 md:gap-20"
            style={{ perspective: "600px" }}
          >
            {[
              { value: "20+", label: "Years Experience" },
              { value: "ABN", label: "AMRO Legacy" },
              { value: "37460", label: "RERA ID" },
            ].map((stat) => (
              <div key={stat.label} className="stat-item text-center relative group opacity-0">
                <div
                  className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background:
                      "radial-gradient(circle, hsl(40 46% 56% / 0.08), transparent 70%)",
                  }}
                />
                <div
                  className="text-4xl md:text-6xl gold-text-gradient mb-3 relative"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 200,
                  }}
                >
                  {stat.value}
                </div>
                <div className="font-sans text-[9px] md:text-[11px] tracking-[0.35em] uppercase text-muted-foreground relative">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoDecadesSection;
