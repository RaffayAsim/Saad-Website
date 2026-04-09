import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    interface Star {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
    }
    const stars: Star[] = [];
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.3 + 0.05,
      });
    }

    let raf: number;
    const draw = () => {
      ctx2d.clearRect(0, 0, W(), H());
      for (const s of stars) {
        s.y -= s.speed;
        if (s.y < -5) {
          s.y = H() + 5;
          s.x = Math.random() * W();
        }
        // Glow
        const g = ctx2d.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        g.addColorStop(0, `hsla(40, 46%, 56%, ${s.alpha})`);
        g.addColorStop(1, "hsla(40, 46%, 56%, 0)");
        ctx2d.beginPath();
        ctx2d.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx2d.fillStyle = g;
        ctx2d.fill();
        // Core
        ctx2d.beginPath();
        ctx2d.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx2d.fillStyle = `hsla(40, 50%, 65%, ${s.alpha})`;
        ctx2d.fill();
      }
      // Connecting lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx2d.beginPath();
            ctx2d.moveTo(stars[i].x, stars[i].y);
            ctx2d.lineTo(stars[j].x, stars[j].y);
            ctx2d.strokeStyle = `hsla(40, 46%, 56%, ${(1 - dist / 100) * 0.06})`;
            ctx2d.lineWidth = 0.5;
            ctx2d.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Name text — massive scale reveal
      if (nameRef.current) {
        const chars = nameRef.current.querySelectorAll(".footer-char");
        gsap.fromTo(
          chars,
          { y: 80, opacity: 0, rotateX: -60, scale: 0.6 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.03,
            ease: "back.out(1.5)",
            scrollTrigger: { trigger: ref.current, start: "top 75%" },
          },
        );
      }

      // Content reveal
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 65%" },
          },
        );
      }

      // Divider line expands
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 70%" },
          },
        );
      }

      // Light sweep
      if (sweepRef.current) {
        gsap.fromTo(
          sweepRef.current,
          { x: "-100%" },
          {
            x: "200%",
            duration: 4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 80%" },
          },
        );
      }
    }, ref.current);
    return () => ctx.revert();
  }, []);

  // Magnetic hover on links
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
    },
    [],
  );
  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    },
    [],
  );

  const nameText = "Saad Bin Zain";

  return (
    <footer
      ref={ref}
      className="relative py-28 md:py-40 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, hsl(40 46% 15% / 0.1) 0%, transparent 60%),
          linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 2%))
        `,
      }}
      data-section="footer"
    >
      {/* Constellation canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0, opacity: 0.7 }}
      />

      {/* Top border with sweep */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.1) 50%, transparent 95%)",
        }}
      />
      <div
        ref={sweepRef}
        className="absolute top-0 h-px w-[30%]"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.5), transparent)",
        }}
      />

      {/* Gold ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, hsl(40 46% 56% / 0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container mx-auto px-6 md:px-16 max-w-[1200px] text-center relative z-10">
        {/* Name — split-text reveal */}
        <div
          ref={nameRef}
          className="mb-6 overflow-visible"
          style={{ perspective: "600px" }}
        >
          <div className="flex flex-wrap justify-center">
            {nameText.split("").map((char, i) => (
              <span
                key={i}
                className="footer-char inline-block"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 200,
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  letterSpacing: "0.3em",
                  color: "hsl(0 0% 95%)",
                  textShadow: "0 0 60px hsl(40 46% 56% / 0.1)",
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
          <p className="font-sans text-xs md:text-sm tracking-[0.35em] uppercase text-muted-foreground mb-10">
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </p>

          {/* Divider */}
          <div
            ref={lineRef}
            className="h-px gold-gradient mx-auto mb-10"
            style={{ width: "5rem", transformOrigin: "center" }}
          />

          {/* Links — magnetic hover */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { label: "Advisory", cursor: "Enter" },
              { label: "Portfolio", cursor: "View" },
              { label: "Private Office", cursor: "Enter" },
            ].map((item) => (
              <button
                key={item.label}
                className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-gold transition-colors duration-700 relative group"
                data-cursor={item.cursor}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px gold-gradient transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Details */}
          <p className="font-sans text-[10px] text-muted-foreground/40 tracking-[0.2em] mb-2">
            RERA Broker ID — 37460 &bull; Dubai, United Arab Emirates
          </p>
          <p className="font-sans text-[9px] text-muted-foreground/20 tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Saad Bin Zain. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Bottom gold line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, hsl(40 46% 56% / 0.08) 50%, transparent 90%)",
        }}
      />
    </footer>
  );
};

export default FooterSection;
