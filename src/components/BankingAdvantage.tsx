import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* -- Typography -- */
const MONO = "'IBM Plex Mono','SFMono-Regular',monospace";
const SERIF = "'Playfair Display',serif";
const BODY = "'Cormorant Garamond',serif";

/* -- Phase data -- */
interface Phase {
  eyebrow: string;
  stat: string;
  unit: string;
  title: string;
  body: string;
}

const PHASES: Phase[] = [
  {
    eyebrow: "INSTITUTIONAL RIGOR",
    stat: "7",
    unit: "Years in Private Banking",
    title: "Banking Pedigree",
    body: "Seven years inside ABN AMRO forged a discipline of structure, discretion, and institutional rigor � the foundation that still governs every advisory decision.",
  },
  {
    eyebrow: "MARKET GEOMETRY",
    stat: "50+",
    unit: "Landmark Deals � $2B+",
    title: "Market Instinct",
    body: "Fifty landmark transactions across global real estate built an instinct for value, rhythm, and off-market access that shapes every position taken.",
  },
  {
    eyebrow: "RERA CERTIFIED",
    stat: "37460",
    unit: "Official RERA Seal",
    title: "Clearance",
    body: "Government-sealed clearance completes the credential � precision, authority, and trust fused into a single licence to operate at the highest tier of Dubai real estate.",
  },
];

/* -------------------------------------------
   BankingAdvantage � scroll-pinned, pure CSS/GSAP
   Three phases revealed on scroll, giant stat
   numbers as the visual hero, gold timeline.
   ------------------------------------------- */

const BankingAdvantage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const SCROLL_END = IS_TOUCH ? "+=200%" : "+=300%";

      /* Pin the viewport */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: SCROLL_END,
        pin: pin,
        pinSpacing: true,
      });

      /* Timeline track fill */
      if (timelineTrackRef.current) {
        gsap.fromTo(
          timelineTrackRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: SCROLL_END,
              scrub: 1,
            },
          },
        );
      }

      /* Phase reveals */
      const phases = section.querySelectorAll<HTMLElement>(".ba-phase");
      phases.forEach((phase, i) => {
        const els = phase.querySelectorAll<HTMLElement>(".ba-r");
        const bigNum = phase.querySelector<HTMLElement>(".ba-big");
        const dot = phase.querySelector<HTMLElement>(".ba-dot");

        // Set initial state
        gsap.set(els, { opacity: 0, y: 60 });
        if (bigNum) gsap.set(bigNum, { opacity: 0, scale: 0.7, rotateX: 40 });
        if (dot) gsap.set(dot, { scale: 0 });

        const enterStart = i * 33.33;
        const enterEnd = enterStart + 14;
        const exitStart = enterStart + 26;
        const exitEnd = enterStart + 33;

        // Enter
        const enterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `top+=${enterStart}% top`,
            end: `top+=${enterEnd}% top`,
            scrub: 1,
          },
        });

        if (dot) enterTl.to(dot, { scale: 1, duration: 0.2, ease: "back.out(2)" }, 0);
        if (bigNum)
          enterTl.to(
            bigNum,
            { opacity: 1, scale: 1, rotateX: 0, duration: 0.6, ease: "power3.out" },
            0,
          );
        enterTl.to(
          els,
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" },
          0.1,
        );

        // Exit (except last)
        if (i < PHASES.length - 1) {
          const exitTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: `top+=${exitStart}% top`,
              end: `top+=${exitEnd}% top`,
              scrub: 1,
            },
          });

          if (bigNum)
            exitTl.to(
              bigNum,
              { opacity: 0, scale: 1.15, rotateX: -20, duration: 0.5, ease: "power2.in" },
              0,
            );
          exitTl.to(
            els,
            { opacity: 0, y: -40, stagger: 0.04, duration: 0.4, ease: "power2.in" },
            0.05,
          );
          if (dot) exitTl.to(dot, { scale: 0, duration: 0.3 }, 0);
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" data-section="banking-advantage">
      <div
        ref={pinRef}
        className="relative h-screen overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, hsl(40 30% 10% / 0.2) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, hsl(40 40% 12% / 0.12) 0%, transparent 45%),
            linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 4.5%) 50%, hsl(0 0% 3%) 100%)
          `,
        }}
      >
        {/* Ambient gold particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: IS_TOUCH ? 10 : 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 2.5 + 0.5}px`,
                height: `${Math.random() * 2.5 + 0.5}px`,
                background: `hsl(40 46% 56% / ${Math.random() * 0.25 + 0.05})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${6 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* Subtle horizontal accent lines */}
        <div
          className="absolute left-0 top-[35%] w-full h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 8%, hsl(40 46% 56% / 0.06) 35%, hsl(40 46% 56% / 0.1) 50%, hsl(40 46% 56% / 0.06) 65%, transparent 92%)",
          }}
        />
        <div
          className="absolute left-0 top-[65%] w-full h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 8%, hsl(40 46% 56% / 0.04) 35%, hsl(40 46% 56% / 0.07) 50%, hsl(40 46% 56% / 0.04) 65%, transparent 92%)",
          }}
        />

        {/* ── Arabian Pillar — LEFT (hidden on small screens) ── */}
        <div
          className="absolute pointer-events-none hidden md:flex"
          style={{
            left: "clamp(20px, 3.5vw, 56px)",
            top: "28px",
            bottom: "28px",
            width: "clamp(32px, 3.5vw, 52px)",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ▲ Crown — pointed Islamic arch + crescent */}
          <svg viewBox="0 0 52 60" style={{ width: "100%", height: "60px", flexShrink: 0 }}>
            {/* Outer pointed arch */}
            <path d="M4,60 L4,30 Q4,6 26,2 Q48,6 48,30 L48,60" fill="none" stroke="hsl(40 46% 56% / 0.35)" strokeWidth="1" />
            {/* Inner pointed arch */}
            <path d="M10,60 L10,32 Q10,12 26,8 Q42,12 42,32 L42,60" fill="none" stroke="hsl(40 46% 56% / 0.2)" strokeWidth="0.7" />
            {/* Crescent at apex */}
            <circle cx="26" cy="10" r="4" fill="none" stroke="hsl(40 50% 65% / 0.5)" strokeWidth="0.8" />
            <circle cx="27.5" cy="9" r="3" fill="hsl(0 0% 3%)" stroke="none" />
            {/* Star motif */}
            <polygon points="26,18 27.2,21 30.5,21 27.8,23 28.8,26 26,24 23.2,26 24.2,23 21.5,21 24.8,21" fill="hsl(40 50% 65% / 0.3)" stroke="hsl(40 46% 56% / 0.4)" strokeWidth="0.5" />
            {/* Geometric diamond pattern inside arch */}
            <rect x="22" y="32" width="8" height="8" rx="0" fill="none" stroke="hsl(40 46% 56% / 0.15)" strokeWidth="0.5" transform="rotate(45 26 36)" />
            <rect x="22" y="42" width="8" height="8" rx="0" fill="none" stroke="hsl(40 46% 56% / 0.12)" strokeWidth="0.5" transform="rotate(45 26 46)" />
            {/* Horizontal tier lines */}
            <line x1="6" y1="56" x2="46" y2="56" stroke="hsl(40 46% 56% / 0.3)" strokeWidth="0.8" />
            <line x1="8" y1="52" x2="44" y2="52" stroke="hsl(40 46% 56% / 0.2)" strokeWidth="0.6" />
          </svg>

          {/* ▮ Shaft — fluted with Islamic geometric repeating pattern */}
          <div style={{
            flex: 1,
            width: "100%",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(90deg, hsl(40 46% 56% / 0.02) 0%, hsl(40 46% 56% / 0.07) 25%, hsl(40 50% 60% / 0.1) 50%, hsl(40 46% 56% / 0.07) 75%, hsl(40 46% 56% / 0.02) 100%)",
            borderLeft: "1px solid hsl(40 46% 56% / 0.1)",
            borderRight: "1px solid hsl(40 46% 56% / 0.1)",
          }}>
            {/* Centre groove (brighter) */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", transform: "translateX(-50%)", background: "linear-gradient(180deg, hsl(40 46% 56% / 0.08) 0%, hsl(40 50% 65% / 0.2) 50%, hsl(40 46% 56% / 0.08) 100%)" }} />
            {/* Side grooves */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "25%", width: "1px", background: "hsl(40 46% 56% / 0.08)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "75%", width: "1px", background: "hsl(40 46% 56% / 0.08)" }} />
            {/* Repeating diamond lattice (Islamic geometric) */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }} preserveAspectRatio="none">
              <defs>
                <pattern id="islamicL" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
                  <rect x="18" y="18" width="16" height="16" fill="none" stroke="hsl(40 46% 56%)" strokeWidth="0.6" transform="rotate(45 26 26)" />
                  <circle cx="26" cy="26" r="2" fill="none" stroke="hsl(40 46% 56%)" strokeWidth="0.5" />
                  <line x1="26" y1="0" x2="26" y2="52" stroke="hsl(40 46% 56%)" strokeWidth="0.3" />
                  <line x1="0" y1="26" x2="52" y2="26" stroke="hsl(40 46% 56%)" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#islamicL)" />
            </svg>
            {/* Shimmer */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 0%, hsl(40 50% 65% / 0.18) 48%, hsl(40 55% 70% / 0.28) 50%, hsl(40 50% 65% / 0.18) 52%, transparent 100%)",
              backgroundSize: "100% 200%",
              animation: "pillarShimmer 6s ease-in-out infinite",
            }} />
            {/* Scroll-driven gold fill */}
            <div
              ref={timelineTrackRef}
              className="absolute inset-x-0 top-0 bottom-0 origin-top"
              style={{
                background: "linear-gradient(180deg, hsl(40 50% 65% / 0.25) 0%, hsl(40 46% 56% / 0.15) 50%, hsl(40 42% 50% / 0.05) 100%)",
                boxShadow: "0 0 10px hsl(40 46% 56% / 0.15)",
              }}
            />
          </div>

          {/* ▼ Base — stepped pedestal with geometric motif */}
          <svg viewBox="0 0 52 50" style={{ width: "100%", height: "50px", flexShrink: 0 }}>
            {/* Stepped base tiers */}
            <rect x="8" y="0" width="36" height="3" rx="0.5" fill="hsl(40 46% 56% / 0.15)" stroke="hsl(40 46% 56% / 0.3)" strokeWidth="0.6" />
            <rect x="4" y="5" width="44" height="4" rx="0.5" fill="hsl(40 46% 56% / 0.1)" stroke="hsl(40 46% 56% / 0.25)" strokeWidth="0.6" />
            <rect x="0" y="11" width="52" height="5" rx="0.5" fill="hsl(40 46% 56% / 0.08)" stroke="hsl(40 46% 56% / 0.2)" strokeWidth="0.6" />
            {/* Bottom plinth with diamond */}
            <rect x="0" y="18" width="52" height="32" rx="1" fill="hsl(40 46% 56% / 0.04)" stroke="hsl(40 46% 56% / 0.15)" strokeWidth="0.6" />
            <rect x="18" y="26" width="16" height="16" fill="none" stroke="hsl(40 46% 56% / 0.2)" strokeWidth="0.6" transform="rotate(45 26 34)" />
            <circle cx="26" cy="34" r="3" fill="none" stroke="hsl(40 50% 65% / 0.25)" strokeWidth="0.6" />
            {/* Accent lines */}
            <line x1="6" y1="22" x2="46" y2="22" stroke="hsl(40 46% 56% / 0.15)" strokeWidth="0.5" />
            <line x1="6" y1="46" x2="46" y2="46" stroke="hsl(40 46% 56% / 0.15)" strokeWidth="0.5" />
          </svg>
        </div>

        {/* ── Arabian Pillar — RIGHT (hidden on small screens) ── */}
        <div
          className="absolute pointer-events-none hidden md:flex"
          style={{
            right: "clamp(20px, 3.5vw, 56px)",
            top: "28px",
            bottom: "28px",
            width: "clamp(32px, 3.5vw, 52px)",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ▲ Crown */}
          <svg viewBox="0 0 52 60" style={{ width: "100%", height: "60px", flexShrink: 0 }}>
            <path d="M4,60 L4,30 Q4,6 26,2 Q48,6 48,30 L48,60" fill="none" stroke="hsl(40 46% 56% / 0.35)" strokeWidth="1" />
            <path d="M10,60 L10,32 Q10,12 26,8 Q42,12 42,32 L42,60" fill="none" stroke="hsl(40 46% 56% / 0.2)" strokeWidth="0.7" />
            <circle cx="26" cy="10" r="4" fill="none" stroke="hsl(40 50% 65% / 0.5)" strokeWidth="0.8" />
            <circle cx="27.5" cy="9" r="3" fill="hsl(0 0% 3%)" stroke="none" />
            <polygon points="26,18 27.2,21 30.5,21 27.8,23 28.8,26 26,24 23.2,26 24.2,23 21.5,21 24.8,21" fill="hsl(40 50% 65% / 0.3)" stroke="hsl(40 46% 56% / 0.4)" strokeWidth="0.5" />
            <rect x="22" y="32" width="8" height="8" rx="0" fill="none" stroke="hsl(40 46% 56% / 0.15)" strokeWidth="0.5" transform="rotate(45 26 36)" />
            <rect x="22" y="42" width="8" height="8" rx="0" fill="none" stroke="hsl(40 46% 56% / 0.12)" strokeWidth="0.5" transform="rotate(45 26 46)" />
            <line x1="6" y1="56" x2="46" y2="56" stroke="hsl(40 46% 56% / 0.3)" strokeWidth="0.8" />
            <line x1="8" y1="52" x2="44" y2="52" stroke="hsl(40 46% 56% / 0.2)" strokeWidth="0.6" />
          </svg>
          {/* ▮ Shaft */}
          <div style={{
            flex: 1,
            width: "100%",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(90deg, hsl(40 46% 56% / 0.02) 0%, hsl(40 46% 56% / 0.07) 25%, hsl(40 50% 60% / 0.1) 50%, hsl(40 46% 56% / 0.07) 75%, hsl(40 46% 56% / 0.02) 100%)",
            borderLeft: "1px solid hsl(40 46% 56% / 0.1)",
            borderRight: "1px solid hsl(40 46% 56% / 0.1)",
          }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", transform: "translateX(-50%)", background: "linear-gradient(180deg, hsl(40 46% 56% / 0.08) 0%, hsl(40 50% 65% / 0.2) 50%, hsl(40 46% 56% / 0.08) 100%)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "25%", width: "1px", background: "hsl(40 46% 56% / 0.08)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "75%", width: "1px", background: "hsl(40 46% 56% / 0.08)" }} />
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }} preserveAspectRatio="none">
              <defs>
                <pattern id="islamicR" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
                  <rect x="18" y="18" width="16" height="16" fill="none" stroke="hsl(40 46% 56%)" strokeWidth="0.6" transform="rotate(45 26 26)" />
                  <circle cx="26" cy="26" r="2" fill="none" stroke="hsl(40 46% 56%)" strokeWidth="0.5" />
                  <line x1="26" y1="0" x2="26" y2="52" stroke="hsl(40 46% 56%)" strokeWidth="0.3" />
                  <line x1="0" y1="26" x2="52" y2="26" stroke="hsl(40 46% 56%)" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#islamicR)" />
            </svg>
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 0%, hsl(40 50% 65% / 0.18) 48%, hsl(40 55% 70% / 0.28) 50%, hsl(40 50% 65% / 0.18) 52%, transparent 100%)",
              backgroundSize: "100% 200%",
              animation: "pillarShimmer 6s ease-in-out infinite",
              animationDelay: "3s",
            }} />
          </div>
          {/* ▼ Base */}
          <svg viewBox="0 0 52 50" style={{ width: "100%", height: "50px", flexShrink: 0 }}>
            <rect x="8" y="0" width="36" height="3" rx="0.5" fill="hsl(40 46% 56% / 0.15)" stroke="hsl(40 46% 56% / 0.3)" strokeWidth="0.6" />
            <rect x="4" y="5" width="44" height="4" rx="0.5" fill="hsl(40 46% 56% / 0.1)" stroke="hsl(40 46% 56% / 0.25)" strokeWidth="0.6" />
            <rect x="0" y="11" width="52" height="5" rx="0.5" fill="hsl(40 46% 56% / 0.08)" stroke="hsl(40 46% 56% / 0.2)" strokeWidth="0.6" />
            <rect x="0" y="18" width="52" height="32" rx="1" fill="hsl(40 46% 56% / 0.04)" stroke="hsl(40 46% 56% / 0.15)" strokeWidth="0.6" />
            <rect x="18" y="26" width="16" height="16" fill="none" stroke="hsl(40 46% 56% / 0.2)" strokeWidth="0.6" transform="rotate(45 26 34)" />
            <circle cx="26" cy="34" r="3" fill="none" stroke="hsl(40 50% 65% / 0.25)" strokeWidth="0.6" />
            <line x1="6" y1="22" x2="46" y2="22" stroke="hsl(40 46% 56% / 0.15)" strokeWidth="0.5" />
            <line x1="6" y1="46" x2="46" y2="46" stroke="hsl(40 46% 56% / 0.15)" strokeWidth="0.5" />
          </svg>
        </div>

        {/* -- Section header + Phase cards in one flex column -- */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 lg:px-14 z-10 md:ml-[clamp(48px,8vw,110px)]"
        >
          {/* Header — fixed at top of the centered block */}
          <div className="mb-10">
            <p
              className="text-[10px] uppercase tracking-[0.6em]"
              style={{ fontFamily: MONO, color: "hsl(40 46% 56%)" }}
            >
              The Credential
            </p>
            <h2
              className="mt-2 text-[1.8rem] leading-[1.1] md:text-[2.4rem] lg:text-[2.8rem]"
              style={{
                fontFamily: SERIF,
                fontWeight: 200,
                color: "hsl(0 0% 95%)",
              }}
            >
              Built to{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, hsl(40 50% 65%) 0%, hsl(40 46% 56%) 50%, hsl(40 42% 50%) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Last
              </span>
            </h2>
          </div>

          {/* Phase cards — stacked below heading */}
          <div className="relative w-full max-w-5xl" style={{ perspective: "1200px" }}>
            {PHASES.map((phase, i) => (
              <div
                key={i}
                className="ba-phase"
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  inset: i === 0 ? undefined : 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(24px, 5vw, 80px)",
                  flexWrap: "wrap",
                }}
              >
                {/* Phase number indicator */}
                <div
                  className="ba-dot absolute -left-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "hsl(40 46% 56% / 0.08)",
                    border: "1px solid hsl(40 46% 56% / 0.25)",
                    boxShadow: "0 0 12px hsl(40 46% 56% / 0.15)",
                  }}
                >
                  <span style={{ fontFamily: MONO, fontSize: "9px", color: "hsl(40 50% 65%)", letterSpacing: "0.05em" }}>{String(i + 1).padStart(2, "0")}</span>
                </div>

                {/* Giant stat number */}
                <div
                  className="ba-big flex-shrink-0"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(4rem, 14vw, 14rem)",
                    fontWeight: 100,
                    lineHeight: 0.85,
                    letterSpacing: "-0.04em",
                    color: "transparent",
                    WebkitTextStroke: "1.5px hsl(40 46% 56% / 0.3)",
                    backgroundImage:
                      "linear-gradient(160deg, hsl(40 50% 65% / 0.2) 0%, hsl(40 46% 56% / 0.08) 50%, hsl(40 50% 65% / 0.18) 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    textShadow: "0 0 60px hsl(40 46% 56% / 0.12)",
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                    userSelect: "none",
                  }}
                >
                  {phase.stat}
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 sm:min-w-[260px] max-w-[460px]">
                  <p
                    className="ba-r text-[10px] uppercase tracking-[0.5em]"
                    style={{ fontFamily: MONO, color: "hsl(40 46% 56%)" }}
                  >
                    {phase.eyebrow}
                  </p>

                  <h3
                    className="ba-r mt-3 text-[1.6rem] md:text-[2rem] leading-[1.1]"
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 300,
                      color: "hsl(0 0% 92%)",
                    }}
                  >
                    {phase.title}
                  </h3>

                  <div
                    className="ba-r mt-2 flex items-center gap-3"
                  >
                    <div
                      className="h-px flex-1 max-w-[40px]"
                      style={{ background: "hsl(40 46% 56% / 0.3)" }}
                    />
                    <span
                      className="text-[10px] uppercase tracking-[0.35em]"
                      style={{ fontFamily: MONO, color: "hsl(40 46% 56% / 0.6)" }}
                    >
                      {phase.unit}
                    </span>
                  </div>

                  <p
                    className="ba-r mt-5 text-[1.05rem] md:text-[1.15rem] leading-[1.7]"
                    style={{ fontFamily: BODY, color: "hsl(0 0% 58%)" }}
                  >
                    {phase.body}
                  </p>

                  <div
                    className="ba-r mt-6 inline-flex items-center gap-2.5 border px-5 py-2.5"
                    style={{
                      borderColor: "hsl(40 46% 56% / 0.12)",
                      background: "hsl(40 46% 56% / 0.03)",
                    }}
                  >
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: "hsl(40 58% 72%)",
                        boxShadow: "0 0 8px hsl(40 58% 72% / 0.5)",
                      }}
                    />
                    <span
                      className="text-[10px] uppercase tracking-[0.3em]"
                      style={{ fontFamily: MONO, color: "hsl(40 46% 56%)" }}
                    >
                      {phase.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corner marks */}
        <div className="pointer-events-none absolute inset-0 z-[5]">
          <div className="absolute left-6 top-6 md:left-10 md:top-10">
            <div className="h-8 w-px" style={{ background: "hsl(40 46% 56% / 0.15)" }} />
            <div className="absolute left-0 top-0 h-px w-8" style={{ background: "hsl(40 46% 56% / 0.15)" }} />
          </div>
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10">
            <div className="h-8 w-px" style={{ background: "hsl(40 46% 56% / 0.15)" }} />
            <div className="absolute bottom-0 right-0 h-px w-8" style={{ background: "hsl(40 46% 56% / 0.15)" }} />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-[5] -translate-x-1/2 text-center">
          <div
            className="mx-auto mb-2 h-6 w-px"
            style={{
              background: "linear-gradient(180deg, transparent, hsl(40 46% 56% / 0.4))",
              animation: "bankingFloat 2s ease-in-out infinite",
            }}
          />
          <p
            className="text-[9px] uppercase tracking-[0.5em]"
            style={{ fontFamily: MONO, color: "hsl(40 46% 56% / 0.35)" }}
          >
            Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
};

export default BankingAdvantage;
