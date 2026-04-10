import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* ── Typography tokens ── */
const SERIF = "'Playfair Display',serif";
const BODY = "'Cormorant Garamond',serif";
const MONO = "'IBM Plex Mono','SFMono-Regular',monospace";

/* ── Roman numerals ── */
const ROMAN = ["I", "II", "III", "IV"];

/* ── Partners data ── */
const partners = [
  {
    name: "Savills",
    role: "Senior Consultant — Luxury Retail Advisory",
    year: "2019",
    detail:
      "Global real estate advisory firm. Instrumental in premium retail placements across Dubai's prime corridors including DIFC and Downtown.",
    statNum: 50,
    statSuffix: "+",
    statLabel: "Brand Placements",
  },
  {
    name: "Cushman & Wakefield",
    role: "Senior Consultant — UAE & MENA",
    year: "2017",
    detail:
      "Advisory on flagship retail and F&B leasing. Specialising in luxury segment with a tenant-first commercial strategy.",
    statNum: 30,
    statSuffix: "+",
    statLabel: "Flagship Deals",
  },
  {
    name: "ABN AMRO\u00A0Bank",
    role: "Private Banking — Wealth Management",
    year: "2010",
    detail:
      "Managed bespoke portfolios for ultra-high-net-worth clients, bridging private banking with property investment advisory.",
    statNum: 7,
    statSuffix: "",
    statLabel: "Years in Banking",
  },
  {
    name: "RERA\u00A0Dubai",
    role: "Licensed Broker — ID 37460",
    year: "2016",
    detail:
      "Fully certified under the Real Estate Regulatory Agency. Compliant practice across off-plan, secondary, and commercial markets.",
    statNum: 100,
    statSuffix: "%",
    statLabel: "Compliance Record",
  },
];

/* ── Gold Diamond Ornament (SVG) ── */
const DiamondOrnament = ({
  size = 10,
  active = false,
}: {
  size?: number;
  active?: boolean;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 10 10"
    style={{ display: "block", transition: "all 0.5s ease" }}
  >
    <rect
      x="5"
      y="0"
      width="7.07"
      height="7.07"
      rx="1"
      transform="rotate(45 5 5)"
      fill={active ? "hsl(40 55% 70%)" : "hsl(40 50% 60% / 0.6)"}
      style={{ transition: "fill 0.5s ease" }}
    />
  </svg>
);

/* ── Compass Rose SVG Watermark ── */
const CompassRose = () => (
  <svg
    viewBox="0 0 400 400"
    className="pointer-events-none absolute z-[1]"
    style={{
      width: "min(500px, 80vw)",
      height: "min(500px, 80vw)",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 0.035,
    }}
  >
    {/* Outer circle */}
    <circle cx="200" cy="200" r="195" fill="none" stroke="hsl(40 46% 56%)" strokeWidth="0.5" />
    <circle cx="200" cy="200" r="180" fill="none" stroke="hsl(40 46% 56%)" strokeWidth="0.3" />
    {/* Cardinal rays — 32 radiating lines */}
    {Array.from({ length: 32 }).map((_, i) => {
      const angle = (i / 32) * Math.PI * 2 - Math.PI / 2;
      const isCardinal = i % 8 === 0;
      const isMajor = i % 4 === 0;
      const innerR = isCardinal ? 20 : isMajor ? 40 : 60;
      const outerR = isCardinal ? 190 : isMajor ? 170 : 150;
      const sw = isCardinal ? 1.2 : isMajor ? 0.6 : 0.3;
      return (
        <line
          key={i}
          x1={200 + Math.cos(angle) * innerR}
          y1={200 + Math.sin(angle) * innerR}
          x2={200 + Math.cos(angle) * outerR}
          y2={200 + Math.sin(angle) * outerR}
          stroke="hsl(40 46% 56%)"
          strokeWidth={sw}
        />
      );
    })}
    {/* Cardinal diamonds */}
    {[0, 90, 180, 270].map((deg) => (
      <rect
        key={deg}
        x="196"
        y="10"
        width="8"
        height="8"
        rx="1"
        fill="hsl(40 46% 56%)"
        transform={`rotate(${deg + 45} 200 200)`}
        opacity={0.5}
      />
    ))}
    {/* Center ornament */}
    <circle cx="200" cy="200" r="8" fill="none" stroke="hsl(40 46% 56%)" strokeWidth="1" />
    <circle cx="200" cy="200" r="3" fill="hsl(40 46% 56%)" />
  </svg>
);

/* ── Folio Card (enhanced accordion entry) ── */
const FolioCard = ({
  partner,
  index,
  isActive,
  onToggle,
}: {
  partner: (typeof partners)[0];
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) => {
  const expandRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const statBoxRef = useRef<HTMLDivElement>(null);

  /* Expand / collapse with clipPath reveal */
  useEffect(() => {
    const el = expandRef.current;
    if (!el) return;

    if (isActive) {
      // First set height auto to measure
      gsap.set(el, { display: "block", height: "auto" });
      const h = el.offsetHeight;
      gsap.set(el, { height: 0, clipPath: "inset(50% 20% 50% 20%)", opacity: 0 });
      gsap.to(el, {
        height: h,
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      });

      // Stagger inner elements
      const staggerEls = [roleRef.current, descRef.current, statBoxRef.current].filter(Boolean);
      gsap.fromTo(
        staggerEls,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" },
      );

      // Count-up stat number
      if (statRef.current) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: partner.statNum,
          duration: 1.2,
          delay: 0.3,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: () => {
            if (statRef.current) {
              statRef.current.textContent = Math.round(counter.val) + partner.statSuffix;
            }
          },
        });
      }
    } else {
      gsap.to(el, {
        height: 0,
        clipPath: "inset(50% 20% 50% 20%)",
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  }, [isActive, partner.statNum, partner.statSuffix]);

  return (
    <div className="folio-card group relative" style={{ perspective: "800px" }}>
      {/* Gold thread diamond on left edge */}
      <div
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20"
        style={{ width: 16, height: 16 }}
      >
        <DiamondOrnament size={isActive ? 12 : 8} active={isActive} />
      </div>

      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "linear-gradient(90deg, hsl(40 46% 56% / 0.06) 0%, transparent 40%)",
        }}
      />

      {/* Collapsed header button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-8 md:py-12 cursor-pointer text-left md:pl-10 pl-6 pr-4 md:pr-8 transition-all duration-500"
        style={{
          borderBottom: `1px solid ${isActive ? "hsl(40 50% 60% / 0.3)" : "hsl(0 0% 15%)"}`,
        }}
      >
        <div className="flex items-center gap-6 md:gap-10">
          <h3
            className="text-2xl md:text-4xl lg:text-[3.2rem] transition-all duration-500"
            style={{
              fontFamily: SERIF,
              fontWeight: 200,
              color: isActive ? "hsl(40 55% 70%)" : "hsl(0 0% 60%)",
              transform: isActive ? "translateX(4px)" : "translateX(0)",
              letterSpacing: isActive ? "0.02em" : "0",
            }}
          >
            {partner.name}
          </h3>
        </div>

        <div className="flex items-center gap-5 md:gap-10">
          {/* "Since XXXX" badge */}
          <span
            className="hidden md:block text-xs tracking-[0.3em] uppercase transition-colors duration-500"
            style={{
              fontFamily: MONO,
              color: isActive ? "hsl(40 50% 65%)" : "hsl(0 0% 45%)",
            }}
          >
            Since {partner.year}
          </span>

          {/* Roman numeral */}
          <span
            className="text-base md:text-lg tracking-[0.15em] transition-colors duration-500"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              color: isActive ? "hsl(40 55% 70%)" : "hsl(0 0% 40%)",
            }}
          >
            {ROMAN[index]}
          </span>

          {/* Toggle indicator */}
          <div
            className="relative w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300"
            style={{
              borderColor: isActive ? "hsl(40 50% 65% / 0.5)" : "hsl(0 0% 25%)",
              background: isActive ? "hsl(40 46% 56% / 0.1)" : "transparent",
            }}
          >
            <span
              className="block w-3.5 h-px transition-colors duration-300"
              style={{ background: isActive ? "hsl(40 58% 72%)" : "hsl(0 0% 45%)" }}
            />
            <span
              className="absolute block w-px h-3.5 transition-all duration-300"
              style={{
                background: isActive ? "hsl(40 58% 72%)" : "hsl(0 0% 45%)",
                transform: isActive ? "scaleY(0)" : "scaleY(1)",
              }}
            />
          </div>
        </div>
      </button>

      {/* Expanded folio content */}
      <div
        ref={expandRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0, display: "none" }}
      >
        <div
          className="relative md:ml-10 ml-6 mr-4 md:mr-8 my-6 md:my-8 rounded-xl border overflow-hidden"
          style={{
            borderColor: "hsl(40 50% 60% / 0.2)",
            background: "linear-gradient(135deg, hsl(0 0% 7% / 0.95), hsl(0 0% 4% / 0.98))",
          }}
        >
          {/* Diagonal hatching overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: `url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='8' x2='8' y2='0' stroke='%23C5A059' stroke-width='0.3' opacity='0.06'/%3E%3C/svg%3E")`,
              backgroundSize: "8px 8px",
            }}
          />

          {/* Gold pinline border glow */}
          <div
            className="pointer-events-none absolute inset-0 z-0 rounded-xl"
            style={{
              boxShadow: "inset 0 0 30px hsl(40 46% 56% / 0.08), 0 0 40px hsl(40 46% 56% / 0.05)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0">
            {/* Left: Giant stat */}
            <div
              className="flex flex-col items-center justify-center px-8 py-8 md:px-14 md:py-12 md:border-r"
              style={{ borderColor: "hsl(40 50% 60% / 0.15)" }}
            >
              <span
                ref={statRef}
                className="text-6xl md:text-8xl lg:text-[7rem] block leading-none"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 200,
                  background: "linear-gradient(180deg, hsl(40 58% 72%), hsl(40 42% 50%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                0{partner.statSuffix}
              </span>
              <span
                className="text-[9px] tracking-[0.45em] uppercase mt-3 block text-center"
                style={{ fontFamily: MONO, color: "hsl(0 0% 48%)" }}
              >
                {partner.statLabel}
              </span>
            </div>

            {/* Right: Details */}
            <div className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-12 gap-5">
              {/* Role tag */}
              <div ref={roleRef}>
                <span
                  className="inline-block rounded-full border px-4 py-1.5"
                  style={{
                    borderColor: "hsl(40 50% 60% / 0.25)",
                    background: "hsl(40 46% 56% / 0.08)",
                  }}
                >
                  <span
                    className="text-[10px] tracking-[0.35em] uppercase"
                    style={{ fontFamily: MONO, color: "hsl(40 55% 68%)" }}
                  >
                    {partner.role}
                  </span>
                </span>
              </div>

              {/* Description */}
              <p
                ref={descRef}
                className="text-sm md:text-[1.05rem] leading-relaxed max-w-xl"
                style={{
                  fontFamily: BODY,
                  fontWeight: 300,
                  color: "hsl(0 0% 65%)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.8,
                }}
              >
                {partner.detail}
              </p>

              {/* Year badge */}
              <div ref={statBoxRef} className="flex items-center gap-3">
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <rect
                    x="4"
                    y="0"
                    width="5.66"
                    height="5.66"
                    rx="0.5"
                    transform="rotate(45 4 4)"
                    fill="hsl(40 50% 65%)"
                  />
                </svg>
                <span
                  className="text-[10px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: MONO, color: "hsl(0 0% 50%)" }}
                >
                  Partnered since {partner.year}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   Main Section — The Alliance Thread
   ══════════════════════════════════════════ */
const PartnersCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* Header — perspective reveal with stagger */
      if (headerRef.current) {
        const kids = Array.from(headerRef.current.children);
        gsap.fromTo(
          kids,
          { y: 80, opacity: 0, rotateX: -12, scale: 0.95 },
          {
            y: 0, opacity: 1, rotateX: 0, scale: 1,
            duration: 1.4, stagger: 0.15, ease: "back.out(1.2)",
            scrollTrigger: { trigger: section, start: "top 70%" },
          },
        );
      }

      /* Gold thread fill on scroll */
      if (threadRef.current) {
        gsap.fromTo(
          threadRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 1.2,
            },
          },
        );
      }

      /* Folio cards — staggered entrance */
      const cards = section.querySelectorAll(".folio-card");
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0, rotateY: 6, x: -15 },
        {
          y: 0, opacity: 1, rotateY: 0, x: 0,
          duration: 1.1, stagger: 0.12, ease: "back.out(1.3)",
          scrollTrigger: { trigger: section, start: "top 55%" },
        },
      );

      /* Light sweep across section */
      if (sweepRef.current) {
        gsap.fromTo(
          sweepRef.current,
          { xPercent: -120, opacity: 0 },
          {
            xPercent: 400, opacity: 0.5,
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 2 },
          },
        );
      }

      /* Parallax on header */
      if (headerRef.current) {
        gsap.to(headerRef.current, {
          y: -20,
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.4 },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-20 pb-10 md:pt-32 md:pb-14 lg:pt-48 lg:pb-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: "linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 4%) 50%, hsl(0 0% 3%))",
        perspective: "1200px",
      }}
      data-section="partners"
    >
      {/* ── Compass Rose Watermark ── */}
      <CompassRose />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 15%, hsl(0 0% 3% / 0.75) 65%)",
        }}
      />

      {/* Mouse-reactive ambient glow */}
      <div
        className="pointer-events-none absolute z-[2] h-[450px] w-[450px] rounded-full opacity-20 blur-[100px] transition-all duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, hsl(40 58% 52% / 0.3) 0%, transparent 70%)",
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Scroll light sweep */}
      <div
        ref={sweepRef}
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[5%] -skew-x-12 opacity-0"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(40 58% 72% / 0.06), hsl(40 58% 72% / 0.12), hsl(40 58% 72% / 0.06), transparent)",
        }}
      />

      {/* Side accent lines */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[5%] hidden w-px md:block z-[2]"
        style={{ background: "linear-gradient(180deg, transparent, hsl(40 50% 60% / 0.2), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[5%] hidden w-px md:block z-[2]"
        style={{ background: "linear-gradient(180deg, transparent, hsl(40 50% 60% / 0.12), transparent)" }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
        {Array.from({ length: IS_TOUCH ? 6 : 16 }).map((_, i) => {
          const size = 1.5 + Math.random() * 2.5;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const dur = 7 + Math.random() * 12;
          const delay = Math.random() * 6;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
                background: i % 2 === 0 ? "hsl(40 58% 72%)" : "hsl(40 46% 56% / 0.5)",
                boxShadow: `0 0 ${size * 3}px hsl(40 58% 72% / 0.25)`,
                animation: `bankingFloat ${dur}s ${delay}s ease-in-out infinite`,
                opacity: 0.2 + Math.random() * 0.35,
              }}
            />
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-6 md:px-16 max-w-[1400px] relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <p
              className="text-[10px] md:text-xs tracking-[0.6em] uppercase mb-6"
              style={{ fontFamily: MONO, color: "hsl(40 46% 56%)" }}
            >
              Strategic Alliances
            </p>
            <h2
              className="text-4xl md:text-6xl lg:text-8xl leading-[0.95]"
              style={{ fontFamily: SERIF, fontWeight: 200, color: "hsl(0 0% 95%)" }}
            >
              Trusted
              <br />
              <span
                style={{
                  background: "linear-gradient(180deg, hsl(40 58% 72%), hsl(40 42% 50%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Network
              </span>
            </h2>
            <div
              className="mt-6 h-px w-32 md:w-48"
              style={{
                background: "linear-gradient(90deg, hsl(40 58% 72%), hsl(40 46% 56% / 0.3), transparent)",
              }}
            />
          </div>
          <div className="max-w-sm">
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{
                fontFamily: BODY,
                fontWeight: 300,
                color: "hsl(0 0% 60%)",
                letterSpacing: "0.03em",
                lineHeight: 1.75,
              }}
            >
              A curated ecosystem of global institutions and regulatory bodies
              that anchor every transaction.
            </p>
            {/* Summary stats */}
            <div className="mt-5 flex gap-8">
              <div>
                <span
                  className="text-2xl md:text-3xl block"
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 200,
                    background: "linear-gradient(180deg, hsl(40 46% 70%), hsl(40 46% 45%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  4
                </span>
                <span
                  className="text-[11px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: MONO, color: "hsl(0 0% 48%)" }}
                >
                  Key Partners
                </span>
              </div>
              <div className="w-px h-10 self-center" style={{ background: "hsl(0 0% 22%)" }} />
              <div>
                <span
                  className="text-2xl md:text-3xl block"
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 200,
                    background: "linear-gradient(180deg, hsl(40 46% 70%), hsl(40 46% 45%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  15+
                </span>
                <span
                  className="text-[11px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: MONO, color: "hsl(0 0% 48%)" }}
                >
                  Years Combined
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Gold Thread + Folio Cards ── */}
        <div className="relative md:pl-4">
          {/* The Gold Thread — left vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px hidden md:block z-10"
            style={{
              background: "linear-gradient(180deg, transparent, hsl(0 0% 22%), transparent)",
            }}
          >
            {/* Active fill that grows on scroll */}
            <div
              ref={threadRef}
              className="absolute top-0 left-0 w-full h-full origin-top"
              style={{
                background: "linear-gradient(180deg, hsl(40 58% 72%), hsl(40 46% 56%), hsl(40 42% 50% / 0.3))",
                transformOrigin: "top",
              }}
            />
          </div>

          {/* Top diamond */}
          <div className="absolute left-0 -top-1 -translate-x-[calc(50%-0.5px)] hidden md:block z-20">
            <DiamondOrnament size={8} active={false} />
          </div>

          {/* Folio Cards */}
          <div>
            {partners.map((p, i) => (
              <FolioCard
                key={p.name}
                partner={p}
                index={i}
                isActive={activeIndex === i}
                onToggle={() => setActiveIndex(activeIndex === i ? null : i)}
              />
            ))}
          </div>

          {/* Bottom diamond */}
          <div className="absolute left-0 -bottom-1 -translate-x-[calc(50%-0.5px)] hidden md:block z-20">
            <DiamondOrnament size={8} active={false} />
          </div>
        </div>

        {/* ── Bottom Decorative Rule ── */}
        <div className="mt-10 md:mt-14 flex items-center gap-4">
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.12), transparent)" }}
          />
          {/* Center diamond fan ornament */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-px" style={{ background: "hsl(40 46% 56% / 0.2)" }} />
            <svg width="18" height="18" viewBox="0 0 18 18">
              <rect x="9" y="2" width="7.07" height="7.07" rx="0.5" transform="rotate(45 9 9)"
                fill="none" stroke="hsl(40 46% 56%)" strokeWidth="0.6" opacity="0.5" />
              <rect x="9" y="4" width="3.54" height="3.54" rx="0.3" transform="rotate(45 9 9)"
                fill="hsl(40 50% 65%)" opacity="0.4" />
            </svg>
            <span
              className="text-xs tracking-[0.4em] uppercase mx-2"
              style={{ fontFamily: MONO, color: "hsl(0 0% 42%)" }}
            >
              End of Network
            </span>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <rect x="9" y="2" width="7.07" height="7.07" rx="0.5" transform="rotate(45 9 9)"
                fill="none" stroke="hsl(40 46% 56%)" strokeWidth="0.6" opacity="0.5" />
              <rect x="9" y="4" width="3.54" height="3.54" rx="0.3" transform="rotate(45 9 9)"
                fill="hsl(40 50% 65%)" opacity="0.4" />
            </svg>
            <div className="w-8 h-px" style={{ background: "hsl(40 46% 56% / 0.2)" }} />
          </div>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.12), transparent)" }}
          />
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;

