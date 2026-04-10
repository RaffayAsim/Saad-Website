import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERIF = "'Playfair Display',serif";
const BODY = "'Cormorant Garamond',serif";
const MONO = "'IBM Plex Mono','SFMono-Regular',monospace";
const IS_TOUCH = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%" },
          },
        );
      }

      // Subtitle
      if (subRef.current) {
        gsap.fromTo(
          subRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.2, delay: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%" },
          },
        );
      }

      // Button
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 1, delay: 0.4, ease: "back.out(1.4)",
            scrollTrigger: { trigger: section, start: "top 75%" },
          },
        );
      }

      // Decorative lines expand
      [lineLeftRef.current, lineRightRef.current].forEach((el) => {
        if (!el) return;
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, duration: 1.5, ease: "power4.inOut",
          scrollTrigger: { trigger: section, start: "top 70%" },
        });
      });

      // Glow pulse
      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1,
            duration: 2, ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 80%" },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-14 pb-20 md:pt-20 md:pb-32 lg:pt-28 lg:pb-44 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 22% 34%, hsl(40 46% 22% / 0.08) 0%, transparent 58%),
          radial-gradient(ellipse at 78% 65%, hsl(40 46% 22% / 0.07) 0%, transparent 54%),
          radial-gradient(ellipse at 50% 50%, hsl(40 46% 12% / 0.15) 0%, transparent 60%),
          linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 4%) 50%, hsl(0 0% 3%))
        `,
      }}
    >
      {/* Top border line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.15) 50%, transparent 95%)",
        }}
      />

      {/* Central gold glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, hsl(40 46% 56% / 0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
        {Array.from({ length: IS_TOUCH ? 8 : 14 }).map((_, i) => {
          const size = 1.2 + Math.random() * 1.9;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const dur = 10 + Math.random() * 11;
          const delay = Math.random() * 5;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size, height: size,
                left: `${left}%`, top: `${top}%`,
                background: i % 2 === 0 ? "hsl(40 58% 72%)" : "hsl(40 46% 56% / 0.5)",
                boxShadow: `0 0 ${size * 3.5}px hsl(40 58% 72% / 0.22)`,
                animation: `bankingFloat ${dur}s ${delay}s ease-in-out infinite`,
                opacity: 0.18 + Math.random() * 0.24,
              }}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-6 md:px-16 max-w-[1000px] text-center relative z-10">
        {/* Decorative diamond */}
        <div className="flex justify-center mb-8">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <rect x="12" y="2" width="14.14" height="14.14" rx="1" transform="rotate(45 12 12)"
              fill="none" stroke="hsl(40 50% 65%)" strokeWidth="0.8" opacity="0.6" />
            <rect x="12" y="6" width="7.07" height="7.07" rx="0.5" transform="rotate(45 12 12)"
              fill="hsl(40 50% 65%)" opacity="0.3" />
          </svg>
        </div>

        {/* Eyebrow */}
        <p
          className="text-xs md:text-sm tracking-[0.5em] uppercase mb-8"
          style={{ fontFamily: MONO, color: "hsl(40 50% 65%)" }}
        >
          Begin Your Journey
        </p>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-8"
          style={{ fontFamily: SERIF, fontWeight: 200, color: "hsl(0 0% 95%)" }}
        >
          Your Next Chapter in{" "}
          <span
            style={{
              background: "linear-gradient(180deg, hsl(40 58% 72%), hsl(40 42% 50%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dubai Real Estate
          </span>
        </h2>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12"
          style={{
            fontFamily: BODY, fontWeight: 300,
            color: "hsl(0 0% 60%)", lineHeight: 1.8,
          }}
        >
          Whether you're acquiring a trophy asset or positioning a premium listing,
          every transaction begins with a single conversation.
        </p>

        {/* Decorative lines around button */}
        <div className="flex items-center justify-center gap-6 mb-0">
          <div
            ref={lineLeftRef}
            className="h-px w-16 md:w-24 origin-right"
            style={{ background: "linear-gradient(90deg, transparent, hsl(40 50% 65% / 0.4))" }}
          />

          {/* CTA Button */}
          <button
            ref={btnRef}
            onClick={() => navigate("/contact")}
            className="group relative px-10 py-4 md:px-14 md:py-5 rounded-full cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsl(40 46% 56%), hsl(40 42% 48%))",
              boxShadow: "0 0 40px hsl(40 46% 56% / 0.2), 0 4px 20px hsl(0 0% 0% / 0.3)",
            }}
          >
            {/* Shimmer on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: "linear-gradient(110deg, transparent 30%, hsl(40 60% 80% / 0.3) 50%, transparent 70%)",
              }}
            />
            <span
              className="relative z-10 text-sm md:text-base tracking-[0.3em] uppercase font-medium"
              style={{
                fontFamily: MONO,
                color: "hsl(0 0% 5%)",
                letterSpacing: "0.25em",
              }}
            >
              Get in Touch
            </span>
          </button>

          <div
            ref={lineRightRef}
            className="h-px w-16 md:w-24 origin-left"
            style={{ background: "linear-gradient(90deg, hsl(40 50% 65% / 0.4), transparent)" }}
          />
        </div>

        {/* Sub-action links */}
        <div className="mt-10 flex justify-center gap-10">
          <button
            onClick={() => navigate("/contact?type=buy")}
            className="text-xs tracking-[0.3em] uppercase transition-colors duration-500 hover:text-[hsl(40_50%_65%)] cursor-pointer"
            style={{ fontFamily: MONO, color: "hsl(0 0% 45%)" }}
          >
            Looking to Buy
          </button>
          <div className="w-px h-5 self-center" style={{ background: "hsl(0 0% 20%)" }} />
          <button
            onClick={() => navigate("/contact?type=sell")}
            className="text-xs tracking-[0.3em] uppercase transition-colors duration-500 hover:text-[hsl(40_50%_65%)] cursor-pointer"
            style={{ fontFamily: MONO, color: "hsl(0 0% 45%)" }}
          >
            Looking to Sell
          </button>
        </div>
      </div>

      {/* Bottom border line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.1) 50%, transparent 95%)",
        }}
      />
    </section>
  );
};

export default CTASection;
