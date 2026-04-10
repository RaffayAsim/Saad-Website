import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";

const NAV_SECTIONS = [
  { label: "Monograph", section: "hero" },
  { label: "Advisory", section: "decades" },
  { label: "Portfolio", section: "banking-advantage" },
  { label: "Network", section: "partners" },
  { label: "Private Office", section: "contact" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = useCallback((sectionId: string) => {
    setMobileOpen(false);
    if (sectionId === "contact") {
      navigate("/contact");
      return;
    }
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
      return;
    }
    const el = document.querySelector(`[data-section="${sectionId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [navigate, location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Animate mobile drawer
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (mobileOpen) {
      gsap.set(drawer, { display: "flex" });
      gsap.fromTo(drawer, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      const items = drawer.querySelectorAll(".mobile-nav-item");
      gsap.fromTo(items,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.15, ease: "power3.out" },
      );
    } else {
      gsap.to(drawer, { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => gsap.set(drawer, { display: "none" }) });
    }
  }, [mobileOpen]);

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
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[1000]"
        style={{
          height: "88px",
          background: scrolled
            ? "linear-gradient(180deg, hsl(38 18% 7% / 0.82) 0%, hsl(38 14% 5% / 0.72) 100%)"
            : "linear-gradient(180deg, hsl(38 18% 6% / 0.68) 0%, hsl(38 12% 4% / 0.52) 100%)",
          backdropFilter: "blur(24px) saturate(1.4) brightness(0.92)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4) brightness(0.92)",
          borderBottom: scrolled
            ? "1px solid hsl(40 46% 56% / 0.22)"
            : "1px solid hsl(40 46% 56% / 0.12)",
          boxShadow: scrolled
            ? "0 4px 32px hsl(0 0% 0% / 0.45), inset 0 1px 0 hsl(40 46% 56% / 0.08)"
            : "0 2px 20px hsl(0 0% 0% / 0.28), inset 0 1px 0 hsl(40 46% 56% / 0.06)",
          transition: "background 400ms, border-color 400ms, box-shadow 400ms",
        }}
      >
        <div className="mx-auto max-w-[1600px] h-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div ref={logoRef} className="flex items-center gap-1.5">
            {"S.B.Z".split("").map((char, i) => (
              <span
                key={i}
                className="logo-char text-[36px] md:text-[46px] leading-none"
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

          {/* Desktop nav */}
          <div ref={itemsRef} className="hidden lg:flex items-center gap-12">
            {NAV_SECTIONS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.section)}
                className="nav-item text-[13px] uppercase tracking-[0.22em] opacity-0 cursor-pointer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "hsl(0 0% 78%)",
                  fontWeight: 500,
                  transition: "color 260ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "hsl(40 46% 63%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "hsl(0 0% 78%)";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* RERA badge */}
            <div ref={badgeRef} className="opacity-0 flex items-center gap-3">
              <div className="hidden md:block w-10 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.75))" }} />
              <span
                className="hidden sm:inline text-[12px] uppercase tracking-[0.22em]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "hsl(40 46% 58%)",
                  fontWeight: 500,
                  padding: "0.4rem 0.65rem",
                  border: "1px solid hsl(40 46% 56% / 0.2)",
                  background: "hsl(0 0% 5% / 0.34)",
                }}
              >
                RERA 37460
              </span>
            </div>

            {/* Hamburger — visible on mobile only */}
            <button
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] cursor-pointer"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <span
                className="block w-6 h-px transition-all duration-300"
                style={{
                  background: "hsl(40 46% 56%)",
                  transform: mobileOpen ? "translateY(3px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block w-6 h-px transition-all duration-300"
                style={{
                  background: "hsl(40 46% 56%)",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-6 h-px transition-all duration-300"
                style={{
                  background: "hsl(40 46% 56%)",
                  transform: mobileOpen ? "translateY(-3px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Overlay ── */}
      <div
        ref={drawerRef}
        className="fixed inset-0 z-[999] flex-col items-center justify-center gap-10"
        style={{
          display: "none",
          background: "linear-gradient(180deg, hsl(38 18% 5% / 0.97) 0%, hsl(0 0% 2% / 0.98) 100%)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          paddingTop: "100px",
        }}
      >
        {/* Decorative gold line */}
        <div className="h-px w-12 mb-6" style={{ background: "linear-gradient(90deg, transparent, hsl(40 46% 56%), transparent)" }} />

        {NAV_SECTIONS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavClick(item.section)}
            className="mobile-nav-item text-[15px] uppercase tracking-[0.24em] cursor-pointer py-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "hsl(0 0% 80%)",
              fontWeight: 500,
              transition: "color 260ms",
            }}
          >
            {item.label}
          </button>
        ))}

        {/* RERA badge in drawer */}
        <div className="mt-8 flex items-center gap-3">
          <div className="w-8 h-px" style={{ background: "hsl(40 46% 56% / 0.3)" }} />
          <span
            className="text-[12px] uppercase tracking-[0.22em]"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "hsl(40 46% 58%)",
              fontWeight: 500,
              padding: "0.4rem 0.65rem",
              border: "1px solid hsl(40 46% 56% / 0.2)",
              background: "hsl(0 0% 5% / 0.34)",
            }}
          >
            RERA 37460
          </span>
          <div className="w-8 h-px" style={{ background: "hsl(40 46% 56% / 0.3)" }} />
        </div>
      </div>
    </>
  );
};

export default Navigation;
