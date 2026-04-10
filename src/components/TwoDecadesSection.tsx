import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "../hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const interpolate = (start: number, end: number, progress: number) => start + (end - start) * progress;

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
  { year: 2012, label: "Savills", desc: "Senior Consultant — Global Real Estate", pct: 33.3 },
  { year: 2018, label: "Cushman & Wakefield", desc: "Luxury Retail Expansion", pct: 61.9 },
  { year: 2023, label: "Dubai", desc: "Market Leadership — RERA 37460", pct: 85.7 },
  { year: 2026, label: "The Monograph", desc: "Two Decades of Excellence", pct: 100 },
];

const TwoDecadesSection = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const timelineFillRef = useRef<HTMLDivElement>(null);

  const view = isMobile
    ? {
        scrollEnd: "+=340%",
        sectionHeight: "420dvh",
        headingTriggerStart: "top 82%",
        sunBottom: "28%",
        sunRiseY: -88,
        skylineHeight: "42%",
        skylineBottom: "4%",
        particles: 22,
        yearScale: 1.56,
        yearOpacity: 0.18,
        buildingDrift: 4,
        buildWindow: 0.2,
        milestoneWindow: 0.24,
        statsRevealStart: 0.8,
      }
    : {
        scrollEnd: "+=320%",
      sectionHeight: "420vh",
        headingTriggerStart: "top 75%",
        sunBottom: "25%",
        sunRiseY: -120,
        skylineHeight: "45%",
        skylineBottom: "0%",
        particles: 50,
        yearScale: 2.2,
        yearOpacity: 0.25,
        buildingDrift: 8,
        buildWindow: 0.18,
        milestoneWindow: 0.18,
        statsRevealStart: 0.86,
      };

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const SCROLL_END = view.scrollEnd;
      const headingChildren = headingRef.current ? Array.from(headingRef.current.children) : [];
      const buildingEls = skylineRef.current ? Array.from(skylineRef.current.querySelectorAll<HTMLElement>(".building")) : [];
      const milestoneEls = milestonesRef.current ? Array.from(milestonesRef.current.querySelectorAll<HTMLElement>(".milestone")) : [];
      const statEls = statsRef.current ? Array.from(statsRef.current.querySelectorAll<HTMLElement>(".stat-item")) : [];
      const timelineMarkers = timelineFillRef.current?.parentElement?.nextElementSibling
        ? Array.from(timelineFillRef.current.parentElement.nextElementSibling.querySelectorAll<HTMLElement>("span:last-child"))
        : [];
      const powerOut = gsap.parseEase("power3.out");
      const powerInOut = gsap.parseEase("power2.inOut");

      // Heading reveal with character stagger
      if (headingChildren.length) {
        gsap.fromTo(
          headingChildren,
          { y: 100, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.6,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: view.headingTriggerStart },
          },
        );
      }

      gsap.set(buildingEls, { scaleY: 0, opacity: 0, y: 42, transformOrigin: "bottom center" });
      gsap.set(milestoneEls, { opacity: 0, y: 54, scale: 0.82, rotateY: isMobile ? 0 : 18, transformOrigin: "center center" });
      gsap.set(statEls, { opacity: 0, y: 72, rotateX: isMobile ? 0 : -24, rotateZ: isMobile ? 0 : -8, transformOrigin: "center center" });
      if (timelineFillRef.current) gsap.set(timelineFillRef.current, { scaleX: 0.04, opacity: 0.55, transformOrigin: "left center" });

      const updateScene = (progress: number) => {
          const yearProgress = powerInOut(progress);
          const yearValue = Math.round(interpolate(2005, 2026, progress));

          if (yearRef.current) {
            yearRef.current.textContent = yearValue.toString();
            gsap.set(yearRef.current, {
              scale: interpolate(0.48, view.yearScale, yearProgress),
              opacity: interpolate(0.03, view.yearOpacity, progress),
              rotateX: interpolate(42, -12, yearProgress),
              z: interpolate(-180, 100, yearProgress),
              yPercent: interpolate(8, 0, Math.min(progress / 0.22, 1)),
            });
          }

          if (sunRef.current) {
            const sunProgress = clamp01(progress / 0.62);
            const easedSun = powerOut(sunProgress);
            gsap.set(sunRef.current, {
              y: interpolate(150, view.sunRiseY, easedSun),
              opacity: interpolate(0, 1.15, easedSun),
              scale: interpolate(0.6, 1.35, easedSun),
            });
          }

          if (skylineRef.current) {
            gsap.set(skylineRef.current, {
              clipPath: `inset(0 ${Math.max(0, 100 - progress * 102)}% 0 0)`,
            });
          }

          buildingEls.forEach((el, i) => {
            const building = buildings[i];
            if (!building) return;
            const local = clamp01((progress - building.era) / view.buildWindow);
            const eased = powerOut(local);
            const drift = Math.sin((progress + building.era) * Math.PI * 1.25) * view.buildingDrift * eased;
            gsap.set(el, {
              scaleY: eased,
              opacity: interpolate(0.12, 1, eased),
              y: interpolate(42, 0, eased) - drift,
            });
          });

          milestoneEls.forEach((el, i) => {
            const stop = milestones[i] ? milestones[i].pct / 100 : 0;
            const prevStop = i === 0 ? 0 : milestones[i - 1].pct / 100;
            const nextStop = i === milestones.length - 1 ? 1 : milestones[i + 1].pct / 100;
            const segmentStart = i === 0 ? 0 : (prevStop + stop) / 2;
            const segmentEnd = i === milestones.length - 1 ? 1 : (stop + nextStop) / 2;

            let focus = 0;
            if (progress >= segmentStart && progress <= segmentEnd) {
              if (progress <= stop) {
                focus = stop === segmentStart ? 1 : clamp01((progress - segmentStart) / (stop - segmentStart));
              } else {
                focus = stop === segmentEnd ? 1 : clamp01((segmentEnd - progress) / (segmentEnd - stop));
              }
            }

            const eased = powerOut(focus);
            gsap.set(el, {
              opacity: eased,
              y: interpolate(38, 0, eased) - (progress > stop ? (1 - eased) * 14 : 0),
              scale: interpolate(0.82, 1, eased),
              rotateY: isMobile ? 0 : interpolate(18, 0, eased),
            });
          });

          if (timelineFillRef.current) {
            gsap.set(timelineFillRef.current, {
              scaleX: Math.max(0.04, progress),
              opacity: interpolate(0.55, 1, progress),
            });
          }

          timelineMarkers.forEach((marker, i) => {
            const stop = milestones[i]?.pct ? milestones[i].pct / 100 : 0;
            const active = clamp01(1 - Math.abs(progress - stop) / 0.12);
            marker.style.opacity = `${0.45 + active * 0.55}`;
            marker.style.transform = `scale(${0.96 + active * 0.1})`;
          });

          const statsProgress = clamp01((progress - view.statsRevealStart) / (1 - view.statsRevealStart));
          statEls.forEach((el, i) => {
            const local = clamp01((statsProgress - i * 0.14) / 0.46);
            const eased = powerOut(local);
            gsap.set(el, {
              opacity: eased,
              y: interpolate(72, 0, eased),
              rotateX: isMobile ? 0 : interpolate(-24, 0, eased),
              rotateZ: isMobile ? 0 : interpolate(-8, 0, eased),
            });
          });

          if (sweepRef.current) {
            gsap.set(sweepRef.current, {
              x: `${interpolate(-120, 400, progress)}%`,
            });
          }
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateScene(self.progress);
        },
      });

      updateScene(0);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, [isMobile, view.buildWindow, view.buildingDrift, view.headingTriggerStart, view.milestoneWindow, view.scrollEnd, view.statsRevealStart, view.sunRiseY, view.yearOpacity, view.yearScale]);

  return (
    <section ref={sectionRef} className="relative" data-section="decades" style={{ minHeight: view.sectionHeight }}>
      <div
        ref={pinRef}
        className={isMobile ? "sticky top-0 flex h-[100dvh] min-h-[100dvh] items-center justify-center overflow-hidden" : "sticky top-0 flex h-screen items-center justify-center overflow-hidden"}
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, hsl(40 46% 20% / 0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, hsl(40 46% 30% / 0.08) 0%, transparent 45%),
            linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 5%) 30%, hsl(0 0% 7%) 50%, hsl(0 0% 5%) 70%, hsl(0 0% 3%) 100%)
          `,
          overflow: isMobile ? "hidden" : "visible",
        }}
      >
        {/* Gold ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: view.particles }).map((_, i) => (
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
            bottom: view.sunBottom,
            left: isMobile ? "50%" : "45%",
            width: isMobile ? "180px" : "220px",
            height: isMobile ? "180px" : "220px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsl(40 50% 65% / 0.3) 0%, hsl(40 46% 56% / 0.12) 35%, hsl(40 45% 50% / 0.04) 65%, transparent 85%)",
            filter: "blur(45px)",
            zIndex: 0,
            boxShadow: `
              0 0 60px hsl(40 46% 56% / 0.15),
              0 0 120px hsl(40 46% 56% / 0.08),
              inset 0 0 80px hsl(40 50% 65% / 0.2)
            `,
            willChange: "transform, filter",
          }}
        />

        {/* Giant background year with enhanced glow */}
        <span
          ref={yearRef}
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? "clamp(180px, 54vw, 320px)" : "clamp(220px, 40vw, 1000px)",
            fontWeight: 100,
            lineHeight: 1,
            WebkitTextStroke: "1px hsl(40 46% 56% / 0.12)",
            color: "transparent",
            zIndex: 0,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            backgroundImage:
              "linear-gradient(135deg, hsl(40 50% 65% / 0.15), hsl(40 46% 50% / 0.08), hsl(40 50% 65% / 0.15))",
            backgroundSize: "200% 200%",
            animation: "shimmerBg 8s ease infinite",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            transformStyle: "preserve-3d",
            perspective: "1200px",
            willChange: "transform, opacity",
            filter: "drop-shadow(0 0 2px hsl(40 46% 56% / 0.3)) drop-shadow(0 0 8px hsl(40 46% 56% / 0.15))",
            textShadow: `
              0 0 20px hsl(40 46% 56% / 0.2),
              0 0 40px hsl(40 46% 56% / 0.08),
              0 0 60px hsl(40 46% 56% / 0.04)
            `,
          }}
        >
          2005
        </span>

        {/* Dubai Skyline */}
        <div
          ref={skylineRef}
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: view.skylineHeight, bottom: view.skylineBottom, zIndex: 1 }}
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
                background: `linear-gradient(180deg, hsl(40 46% 56% / ${b.lit * 0.4}) 0%, hsl(40 46% 56% / ${b.lit * 0.1}) 60%, hsl(40 46% 56% / ${b.lit * 0.02}) 100%)`,
                borderTop: `2px solid hsl(40 46% 56% / ${b.lit * 0.4})`,
                borderLeft: "1px solid hsl(40 46% 56% / 0.08)",
                borderRight: "1px solid hsl(40 46% 56% / 0.08)",
                boxShadow: `
                  inset 0 1px 4px hsl(40 46% 56% / ${b.lit * 0.2}),
                  0 -2px 8px hsl(40 46% 56% / ${b.lit * 0.15})
                `,
                opacity: 0,
                willChange: "transform, opacity",
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
              "linear-gradient(90deg, transparent 0%, hsl(40 46% 56% / 0.05) 30%, hsl(40 46% 56% / 0.15) 50%, hsl(40 46% 56% / 0.05) 70%, transparent 100%)",
            width: "25%",
            zIndex: 2,
            filter: "blur(2px)",
            willChange: "transform",
          }}
        />

        {/* Content overlay */}
        {isMobile ? (
          <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-5 pt-[4.5rem] text-center sm:px-5">
            <div ref={headingRef} className="mx-auto max-w-[19.75rem] flex-shrink-0 sm:max-w-[21rem]">
              <p
                className="mb-3 font-sans text-[9px] uppercase tracking-[0.32em]"
                style={{ color: "hsl(40 46% 56%)", letterSpacing: "0.26em" }}
              >
                Two Decades of Excellence
              </p>

              <h2
                className="text-[clamp(1.95rem,10.2vw,3.25rem)] text-gallery leading-[0.92]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 100,
                  letterSpacing: "-0.025em",
                  textShadow: `
                    0 2px 4px rgba(0,0,0,0.3),
                    0 8px 16px hsl(40 46% 56% / 0.08)
                  `,
                }}
              >
                From Private
                <br />
                Banking
                <br />
                <span className="gold-text-gradient" style={{
                  background: "linear-gradient(135deg, hsl(40 50% 65%) 0%, hsl(40 46% 56%) 50%, hsl(40 42% 50%) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 8px hsl(40 46% 56% / 0.15))"
                }}>to Global Real Estate</span>
              </h2>
            </div>

            <div ref={milestonesRef} className="relative mt-[4.5vh] h-[10rem] w-full max-w-[20rem] sm:mt-[5.5vh] sm:h-[9.4rem]">
              {milestones.map((m) => (
                <div
                  key={m.year}
                  className="milestone absolute inset-0 flex flex-col items-center justify-center opacity-0"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-px w-10 gold-gradient" />
                    <span
                      className="font-sans text-base font-light tracking-[0.26em]"
                      style={{
                        color: "hsl(40 46% 56%)",
                        textShadow: "0 0 12px hsl(40 46% 56% / 0.2)"
                      }}
                    >
                      {m.year}
                    </span>
                    <div className="h-px w-10 gold-gradient" />
                  </div>
                  <span
                    className="mb-2 text-[1.85rem] leading-none text-gallery"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 200,
                      letterSpacing: "-0.01em",
                      textShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    className="max-w-[17rem] font-sans text-[10px] tracking-[0.08em] text-muted-foreground"
                    style={{ color: "hsl(40 46% 56% / 0.7)", lineHeight: 1.5 }}
                  >
                    {m.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 w-full max-w-[21rem] px-1">
              <div
                className="relative h-px overflow-hidden rounded-full"
                style={{ background: "linear-gradient(90deg, hsl(40 46% 56% / 0.08), hsl(40 46% 56% / 0.22), hsl(40 46% 56% / 0.08))" }}
              >
                <div
                  ref={timelineFillRef}
                  className="absolute inset-y-0 left-0 origin-left rounded-full"
                  style={{
                    width: "100%",
                    transform: "scaleX(0.04)",
                    background: "linear-gradient(90deg, hsl(40 42% 44%), hsl(40 50% 65%), hsl(40 46% 56%))",
                    boxShadow: "0 0 18px hsl(40 46% 56% / 0.35)",
                  }}
                />
              </div>
              <div className="mt-4 flex justify-between gap-2">
                {milestones.map((m) => (
                  <div key={m.year} className="flex flex-col items-center gap-2">
                    <span
                      className="block h-2.5 w-2.5 rounded-full"
                      style={{
                        background: "hsl(40 46% 56%)",
                        boxShadow: "0 0 10px hsl(40 46% 56% / 0.35)",
                      }}
                    />
                    <span
                      className="font-sans text-[8px] uppercase"
                      style={{
                        color: "hsl(40 46% 56% / 0.7)",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {m.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={statsRef}
              className="mt-auto grid w-full max-w-[22rem] grid-cols-3 gap-2 px-2 pb-[4.6rem] pt-5"
              style={{ perspective: "800px" }}
            >
              {[
                { value: "20+", label: "Years Experience" },
                { value: "ABN", label: "AMRO Legacy" },
                { value: "37460", label: "RERA ID" },
              ].map((stat) => (
                <div key={stat.label} className="stat-item relative min-w-0 text-center opacity-0 group">
                  <div
                    className="absolute -inset-6 rounded-3xl opacity-0 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                    style={{
                      background: "radial-gradient(circle, hsl(40 46% 56% / 0.12), transparent 70%)",
                      filter: "blur(8px)",
                    }}
                  />
                  <div
                    className="relative mb-2 gold-text-gradient"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 100,
                      fontSize: stat.value.length >= 5 ? "1.85rem" : stat.value.length >= 3 ? "2.1rem" : "2.35rem",
                      letterSpacing: "-0.02em",
                      textShadow: `
                        0 4px 12px hsl(40 46% 56% / 0.15),
                        0 0 20px hsl(40 46% 56% / 0.1)
                      `,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="relative font-sans text-[7px] uppercase tracking-[0.18em]"
                    style={{
                      color: "hsl(40 46% 56%)",
                      letterSpacing: "0.1em",
                      lineHeight: 1.35,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <div ref={headingRef}>
              <p
                className="mb-8 font-sans text-[10px] uppercase tracking-[0.8em] md:text-xs"
                style={{ color: "hsl(40 46% 56%)", letterSpacing: "0.2em" }}
              >
                Two Decades of Excellence
              </p>

              <h2
                className="mb-8 text-4xl leading-[0.9] text-gallery md:text-6xl lg:text-8xl"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 100,
                  letterSpacing: "-0.02em",
                  textShadow: `
                    0 2px 4px rgba(0,0,0,0.3),
                    0 8px 16px hsl(40 46% 56% / 0.08)
                  `,
                }}
              >
                From Private Banking
                <br />
                <span className="gold-text-gradient" style={{
                  background: "linear-gradient(135deg, hsl(40 50% 65%) 0%, hsl(40 46% 56%) 50%, hsl(40 42% 50%) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 8px hsl(40 46% 56% / 0.15))"
                }}>to Global Real Estate</span>
              </h2>
            </div>

            <div ref={milestonesRef} className="relative mb-16 h-28">
              {milestones.map((m) => (
                <div
                  key={m.year}
                  className="milestone absolute inset-0 flex flex-col items-center justify-center opacity-0"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="w-12 h-px gold-gradient" />
                    <span
                      className="font-sans text-lg font-light tracking-[0.3em] md:text-2xl"
                      style={{
                        color: "hsl(40 46% 56%)",
                        textShadow: "0 0 12px hsl(40 46% 56% / 0.2)"
                      }}
                    >
                      {m.year}
                    </span>
                    <div className="w-12 h-px gold-gradient" />
                  </div>
                  <span
                    className="mb-2 text-2xl text-gallery md:text-3xl"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 200,
                      letterSpacing: "-0.01em",
                      textShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    className="font-sans text-xs tracking-[0.15em] text-muted-foreground md:text-sm"
                    style={{ color: "hsl(40 46% 56% / 0.7)" }}
                  >
                    {m.desc}
                  </span>
                </div>
              ))}
            </div>

            <div
              ref={statsRef}
              className="flex justify-center gap-12 md:gap-24"
              style={{ perspective: "800px" }}
            >
              {[
                { value: "20+", label: "Years Experience" },
                { value: "ABN", label: "AMRO Legacy" },
                { value: "37460", label: "RERA ID" },
              ].map((stat) => (
                <div key={stat.label} className="stat-item relative text-center opacity-0 group">
                  <div
                    className="absolute -inset-6 rounded-3xl opacity-0 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                    style={{
                      background: "radial-gradient(circle, hsl(40 46% 56% / 0.12), transparent 70%)",
                      filter: "blur(8px)",
                    }}
                  />
                  <div
                    className="relative mb-4 text-5xl gold-text-gradient md:text-7xl"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 100,
                      letterSpacing: "-0.02em",
                      textShadow: `
                        0 4px 12px hsl(40 46% 56% / 0.15),
                        0 0 20px hsl(40 46% 56% / 0.1)
                      `,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="relative font-sans text-[10px] uppercase tracking-[0.3em] md:text-xs"
                    style={{
                      color: "hsl(40 46% 56%)",
                      letterSpacing: "0.15em"
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TwoDecadesSection;
