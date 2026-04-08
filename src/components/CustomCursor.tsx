import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 700 });
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("[data-cursor]");
      if (interactive) {
        setHoverLabel(interactive.getAttribute("data-cursor") || "Enter");
      } else {
        setHoverLabel(null);
      }
    };

    const leave = () => setIsVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleHover);
    window.addEventListener("mouseout", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleHover);
      window.removeEventListener("mouseout", leave);
    };
  }, [cursorX, cursorY]);

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          className="flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60"
          animate={{
            width: hoverLabel ? 100 : 40,
            height: hoverLabel ? 100 : 40,
            opacity: isVisible ? 1 : 0,
            backgroundColor: hoverLabel
              ? "hsl(40 46% 56% / 0.15)"
              : "transparent",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {hoverLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-gold text-[10px] tracking-[0.2em] uppercase font-sans font-medium"
            >
              {hoverLabel}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: cursorX, y: cursorY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
          animate={{
            width: hoverLabel ? 6 : 8,
            height: hoverLabel ? 6 : 8,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 500 }}
        />
      </motion.div>
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
};

export default CustomCursor;
