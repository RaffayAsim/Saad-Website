import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if ("ontouchstart" in window) {
      setIsVisible(false);
      return;
    }

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      if (target) setHoverLabel(target.getAttribute("data-cursor"));
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      if (target) setHoverLabel(null);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: hoverLabel ? 80 : 36,
            height: hoverLabel ? 80 : 36,
            opacity: hoverLabel ? 0.95 : 0.5,
            background: hoverLabel
              ? "radial-gradient(circle, hsl(40 46% 56% / 0.2), hsl(40 46% 56% / 0.05))"
              : "transparent",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-full flex items-center justify-center"
          style={{
            border: `1px solid hsl(40 46% 56% / ${hoverLabel ? 0.5 : 0.25})`,
            backdropFilter: hoverLabel ? "blur(4px)" : "none",
          }}
        >
          {hoverLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[8px] tracking-[0.2em] uppercase font-sans text-gold"
            >
              {hoverLabel}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: hoverLabel ? 4 : 6,
            height: hoverLabel ? 4 : 6,
            opacity: hoverLabel ? 0.8 : 0.9,
          }}
          className="rounded-full"
          style={{ background: "hsl(40 46% 56%)" }}
        />
      </motion.div>

      <style>{`@media (hover: hover) { * { cursor: none !important; } }`}</style>
    </>
  );
};

export default CustomCursor;
