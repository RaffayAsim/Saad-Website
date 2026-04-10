import { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERIF = "'Playfair Display',serif";
const BODY = "'Cormorant Garamond',serif";
const MONO = "'IBM Plex Mono','SFMono-Regular',monospace";
const IS_TOUCH = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* ── LinkedIn SVG Icon ── */
const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ── Section scroll map (same as navbar) ── */
const NAV_SECTIONS = [
  { label: "Monograph", section: "hero" },
  { label: "Advisory", section: "decades" },
  { label: "Portfolio", section: "banking-advantage" },
  { label: "Network", section: "partners" },
  { label: "Private Office", section: "contact" },
];

const scrollToSection = (sectionId: string, navigate: ReturnType<typeof useNavigate>) => {
  if (sectionId === "contact") {
    navigate("/contact");
    return;
  }
  const el = document.querySelector(`[data-section="${sectionId}"]`);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const FooterSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  // Gold constellation background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx2d.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Star { x: number; y: number; size: number; alpha: number; speed: number; }
    const stars: Star[] = [];
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * W(), y: Math.random() * H(),
        size: Math.random() * 2 + 0.5, alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.25 + 0.05,
      });
    }

    let raf: number;
    const draw = () => {
      ctx2d.clearRect(0, 0, W(), H());
      for (const s of stars) {
        s.y -= s.speed;
        if (s.y < -5) { s.y = H() + 5; s.x = Math.random() * W(); }
        const g = ctx2d.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        g.addColorStop(0, `hsla(40, 46%, 56%, ${s.alpha})`);
        g.addColorStop(1, "hsla(40, 46%, 56%, 0)");
        ctx2d.beginPath();
        ctx2d.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx2d.fillStyle = g;
        ctx2d.fill();
        ctx2d.beginPath();
        ctx2d.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx2d.fillStyle = `hsla(40, 50%, 65%, ${s.alpha})`;
        ctx2d.fill();
      }
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx2d.beginPath();
            ctx2d.moveTo(stars[i].x, stars[i].y);
            ctx2d.lineTo(stars[j].x, stars[j].y);
            ctx2d.strokeStyle = `hsla(40, 46%, 56%, ${(1 - dist / 90) * 0.06})`;
            ctx2d.lineWidth = 0.5;
            ctx2d.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      if (nameRef.current) {
        const chars = nameRef.current.querySelectorAll(".footer-char");
        gsap.fromTo(chars,
          { y: 60, opacity: 0, rotateX: -45, scale: 0.7 },
          { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1, stagger: 0.025, ease: "back.out(1.5)",
            scrollTrigger: { trigger: ref.current, start: "top 80%" } },
        );
      }
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 75%" } },
        );
      }
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power4.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 78%" } },
        );
      }
      if (sweepRef.current) {
        gsap.fromTo(sweepRef.current, { x: "-100%" },
          { x: "200%", duration: 3.5, ease: "power2.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 85%" } },
        );
      }
    }, ref.current);
    return () => ctx.revert();
  }, []);

  // Magnetic hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
  }, []);
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
  }, []);

  const nameText = "Saad Bin Zain";

  return (
    <footer
      ref={ref}
      className="relative pt-16 pb-10 md:pt-20 md:pb-12 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 18% 15%, hsl(40 46% 26% / 0.12) 0%, transparent 55%),
          radial-gradient(ellipse at 82% 10%, hsl(40 46% 24% / 0.1) 0%, transparent 52%),
          radial-gradient(ellipse at 50% 0%, hsl(40 46% 15% / 0.1) 0%, transparent 65%),
          linear-gradient(180deg, hsl(40 46% 5% / 0.18) 0%, transparent 34%),
          linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 2%) 80%, hsl(0 0% 1%))
        `,
      }}
      data-section="footer"
    >
      {/* Pillar-inspired gold ambience */}
      <div
        className="pointer-events-none absolute left-[6%] top-0 h-full w-[20%]"
        style={{
          background: "linear-gradient(180deg, hsl(40 56% 66% / 0.12) 0%, hsl(40 50% 60% / 0.06) 42%, transparent 100%)",
          filter: "blur(10px)",
          opacity: IS_TOUCH ? 0.45 : 0.7,
          zIndex: 0,
        }}
      />
      <div
        className="pointer-events-none absolute right-[8%] top-0 h-full w-[18%]"
        style={{
          background: "linear-gradient(180deg, hsl(40 58% 72% / 0.1) 0%, hsl(40 46% 56% / 0.05) 45%, transparent 100%)",
          filter: "blur(12px)",
          opacity: IS_TOUCH ? 0.35 : 0.62,
          zIndex: 0,
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0, opacity: 0.48 }}
      />

      {/* Top border + sweep */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.15) 50%, transparent 95%)" }} />
      <div ref={sweepRef} className="absolute top-0 h-px w-[30%]"
        style={{ background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.5), transparent)" }} />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] relative z-10">

        {/* Name — split-text reveal */}
        <div ref={nameRef} className="mb-4 overflow-visible text-center" style={{ perspective: "600px" }}>
          <div className="flex flex-wrap justify-center">
            {nameText.split("").map((char, i) => (
              <span
                key={i}
                className="footer-char inline-block"
                style={{
                  fontFamily: SERIF, fontWeight: 200,
                  fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
                  letterSpacing: "0.3em",
                  color: "hsl(0 0% 95%)",
                  textShadow: "0 0 40px hsl(40 46% 56% / 0.1)",
                  width: char === " " ? "0.3em" : "auto",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        <div ref={contentRef}>
          {/* Tagline */}
          <p className="text-center text-[10px] md:text-xs tracking-[0.35em] uppercase mb-6"
            style={{ fontFamily: MONO, color: "hsl(40 50% 65% / 0.6)" }}>
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </p>

          {/* Divider */}
          <div ref={lineRef} className="h-px mx-auto mb-10"
            style={{
              width: "4rem", transformOrigin: "center",
              background: "linear-gradient(90deg, transparent, hsl(40 58% 72%), hsl(40 46% 56%), transparent)",
            }} />

          {/* ── Three-Column Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-10">

            {/* Column 1 — Navigate (same as navbar) */}
            <div className="text-center md:text-left">
              <p className="text-[11px] md:text-xs tracking-[0.34em] uppercase mb-4"
                style={{ fontFamily: MONO, color: "hsl(40 50% 65%)" }}>
                Navigate
              </p>
              <div className="flex flex-col gap-3.5">
                {NAV_SECTIONS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.section, navigate)}
                    className="text-[15px] md:text-[16px] tracking-[0.14em] uppercase transition-colors duration-500 cursor-pointer hover:text-[hsl(40_50%_65%)]"
                    style={{ fontFamily: BODY, color: "hsl(0 0% 68%)", letterSpacing: "0.12em", fontWeight: 500 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2 — Connect (LinkedIn only) */}
            <div className="text-center">
              <p className="text-[11px] md:text-xs tracking-[0.34em] uppercase mb-4"
                style={{ fontFamily: MONO, color: "hsl(40 50% 65%)" }}>
                Connect
              </p>
              <div className="flex flex-col gap-4 items-center">
                <a
                  href="https://www.linkedin.com/in/saadzain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors duration-500 hover:text-[hsl(40_50%_65%)]"
                  style={{ color: "hsl(0 0% 64%)" }}
                >
                  <LinkedInIcon />
                  <span className="text-[15px] md:text-[16px] tracking-[0.08em]" style={{ fontFamily: BODY, fontWeight: 500 }}>
                    LinkedIn
                  </span>
                </a>
              </div>
            </div>

            {/* Column 3 — Credentials */}
            <div className="text-center md:text-right">
              <p className="text-[11px] md:text-xs tracking-[0.34em] uppercase mb-4"
                style={{ fontFamily: MONO, color: "hsl(40 50% 65%)" }}>
                Credentials
              </p>
              <div className="flex flex-col gap-2.5">
                <p className="text-[15px] md:text-[16px]" style={{ fontFamily: BODY, color: "hsl(0 0% 66%)", fontWeight: 500 }}>
                  RERA Licensed Broker
                </p>
                <p className="text-xl" style={{
                  fontFamily: SERIF, fontWeight: 200,
                  background: "linear-gradient(180deg, hsl(40 58% 72%), hsl(40 42% 50%))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  ID 37460
                </p>
                <p className="text-[14px] md:text-[15px]" style={{ fontFamily: BODY, color: "hsl(0 0% 48%)" }}>
                  Dubai, United Arab Emirates
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="h-px mx-auto mb-6"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.1), transparent)",
            }} />

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[10px] tracking-[0.12em]"
              style={{ fontFamily: MONO, color: "hsl(0 0% 32%)" }}>
              &copy; {new Date().getFullYear()} Saad Bin Zain. All Rights Reserved.
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://www.linkedin.com/in/saadzain/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-500 hover:text-[hsl(40_50%_65%)]"
                style={{ color: "hsl(0 0% 38%)" }}
              >
                <LinkedInIcon size={15} />
              </a>
              <div className="w-px h-3" style={{ background: "hsl(0 0% 15%)" }} />
              <p className="text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-center"
                style={{ fontFamily: MONO, color: "hsl(0 0% 38%)" }}>
                Design and Developed by Quantum Arc
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 10%, hsl(40 46% 56% / 0.08) 50%, transparent 90%)" }} />
    </footer>
  );
};

export default FooterSection;
