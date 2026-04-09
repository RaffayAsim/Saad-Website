import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });

      // Counter 0 → 100
      const counter = { value: 0 };
      tl.to(counter, {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counter.value)
              .toString()
              .padStart(3, "0");
          }
        },
      }, 0);

      // Gold line expands from center
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.5, ease: "power4.inOut" },
        0,
      );

      // Text characters reveal
      if (textContainerRef.current) {
        const chars = textContainerRef.current.querySelectorAll(".load-char");
        tl.fromTo(
          chars,
          { y: 100, opacity: 0, rotateX: -90 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            stagger: 0.04,
            ease: "back.out(1.7)",
          },
          0.8,
        );
      }

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        1.8,
      );

      // Exit — slide up
      tl.to(
        containerRef.current,
        { yPercent: -100, duration: 1.2, ease: "power4.inOut" },
        "+=0.4",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const text = "SAAD BIN ZAIN";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "hsl(0 0% 2%)" }}
    >
      {/* Counter */}
      <div className="absolute top-8 right-12 flex items-baseline gap-1">
        <span
          ref={counterRef}
          className="font-sans text-sm tracking-[0.3em]"
          style={{ color: "hsl(40 46% 56% / 0.5)" }}
        >
          000
        </span>
        <span
          className="font-sans text-xs tracking-[0.3em]"
          style={{ color: "hsl(40 46% 56% / 0.3)" }}
        >
          %
        </span>
      </div>

      {/* Corner decorative lines */}
      <div className="absolute top-8 left-12 w-12 h-px" style={{ background: "hsl(40 46% 56% / 0.15)" }} />
      <div className="absolute top-8 left-12 w-px h-12" style={{ background: "hsl(40 46% 56% / 0.15)" }} />
      <div className="absolute bottom-8 right-12 w-12 h-px" style={{ background: "hsl(40 46% 56% / 0.15)" }} />
      <div className="absolute bottom-8 right-12 w-px h-12" style={{ background: "hsl(40 46% 56% / 0.15)" }} />

      {/* Main text */}
      <div
        ref={textContainerRef}
        className="overflow-hidden mb-6"
        style={{ perspective: "600px" }}
      >
        <div className="flex">
          {text.split("").map((char, i) => (
            <span
              key={i}
              className="load-char inline-block"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 200,
                fontSize: "clamp(2rem, 6vw, 5rem)",
                letterSpacing: "0.3em",
                color: "hsl(0 0% 95%)",
                width: char === " " ? "0.4em" : "auto",
                transformOrigin: "bottom center",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* Gold line */}
      <div
        ref={lineRef}
        className="h-px"
        style={{
          width: "6rem",
          background:
            "linear-gradient(90deg, transparent, hsl(40 46% 56%), transparent)",
          transformOrigin: "center",
        }}
      />

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mt-6 font-sans text-[10px] tracking-[0.6em] uppercase opacity-0"
        style={{ color: "hsl(40 46% 56% / 0.4)" }}
      >
        The Monograph
      </p>
    </div>
  );
};

export default LoadingScreen;
