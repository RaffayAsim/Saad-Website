import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[hsl(0_0%_4%/0.85)] backdrop-blur-xl border-b border-gold/10"
          : ""
      }`}
    >
      <div className="container mx-auto px-8 py-5 flex items-center justify-between">
        <div
          className="text-xl tracking-[0.2em] text-gallery font-light"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          S<span className="text-gold">.</span>B<span className="text-gold">.</span>Z
        </div>
        <div className="hidden md:flex items-center gap-10">
          {["Monograph", "Advisory", "Portfolio", "Network", "Private Office"].map(
            (item, i) => (
              <motion.button
                key={item}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8 + i * 0.1 }}
                className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground hover:text-gold transition-colors duration-500 relative group"
                data-cursor="Enter"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-500 group-hover:w-full" />
              </motion.button>
            )
          )}
        </div>
        <div
          className="text-[11px] tracking-[0.25em] uppercase text-gold font-sans"
        >
          RERA 37460
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
