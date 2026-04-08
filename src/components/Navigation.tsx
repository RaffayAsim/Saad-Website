import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setHidden(y > lastY && y > 400);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <motion.nav
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: scrolled ? "blur(30px) saturate(1.5)" : "none",
        background: scrolled
          ? "linear-gradient(180deg, hsl(0 0% 4% / 0.9), hsl(0 0% 4% / 0.7))"
          : "transparent",
        borderBottom: scrolled ? "1px solid hsl(40 46% 56% / 0.08)" : "none",
        transition: "background 0.6s, border 0.6s",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-8 md:px-16 py-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl tracking-[0.3em] text-gallery"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
        >
          S<span className="text-gold">.</span>B<span className="text-gold">.</span>Z
        </motion.div>

        {/* Nav Items */}
        <div className="hidden lg:flex items-center gap-12">
          {["Monograph", "Advisory", "Portfolio", "Network", "Private Office"].map(
            (item, i) => (
              <motion.button
                key={item}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-gold transition-all duration-700 relative group"
                data-cursor="Enter"
              >
                {item}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] gold-gradient transition-all duration-700 group-hover:w-full" />
              </motion.button>
            )
          )}
        </div>

        {/* RERA Badge */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-[1px] gold-gradient hidden md:block" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-gold font-sans">
            RERA 37460
          </span>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
