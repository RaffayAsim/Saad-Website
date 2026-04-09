import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const navItems = ["Monograph", "Advisory", "Portfolio", "Network", "Private Office"];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 3.2 });

    if (logoRef.current) {
      tl.fromTo(
        logoRef.current.querySelectorAll(".logo-char"),
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.04, ease: "power3.out" },
        0,
      );
    }

    if (itemsRef.current) {
      tl.fromTo(
        itemsRef.current.querySelectorAll(".nav-item"),
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power2.out" },
        0.12,
      );
    }

    if (badgeRef.current) {
      tl.fromTo(badgeRef.current, { x: 14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0.2);
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[1000]"
      style={{
        height: "88px",
        background: scrolled ? "hsl(0 0% 4% / 0.52)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
        borderBottom: scrolled ? "1px solid hsl(40 46% 56% / 0.16)" : "1px solid transparent",
        transition: "background 400ms, border-color 400ms, backdrop-filter 400ms",
      }}
    >
      <div className="mx-auto max-w-[1600px] h-full px-8 md:px-12 lg:px-16 flex items-center justify-between">
        <div ref={logoRef} className="flex items-center gap-1.5">
          {"S.B.Z".split("").map((char, i) => (
            <span
              key={i}
              className="logo-char text-[46px] leading-none"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 200,
                color: char === "." ? "hsl(40 46% 56%)" : "hsl(0 0% 94%)",
                letterSpacing: "0.04em",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <div ref={itemsRef} className="hidden lg:flex items-center gap-12">
          {navItems.map((item) => (
            <button
              key={item}
              className="nav-item text-[11px] uppercase tracking-[0.34em] opacity-0"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "hsl(0 0% 70%)",
                transition: "color 260ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "hsl(40 46% 63%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "hsl(0 0% 70%)";
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div ref={badgeRef} className="opacity-0 flex items-center gap-3">
          <div className="hidden md:block w-10 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.75))" }} />
          <span
            className="text-[11px] uppercase tracking-[0.32em]"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "hsl(40 46% 58%)",
              padding: "0.4rem 0.65rem",
              border: "1px solid hsl(40 46% 56% / 0.2)",
              background: "hsl(0 0% 5% / 0.34)",
            }}
          >
            RERA 37460
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
