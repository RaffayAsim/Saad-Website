import { useState, useEffect } from "react";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-charcoal-deep/90 backdrop-blur-md border-b border-border/10" : ""
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-serif text-lg tracking-[0.15em] text-gallery font-light">
          S<span className="text-gold">.</span>B<span className="text-gold">.</span>Z
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Monograph", "Advisory", "Portfolio", "Network", "Private Office"].map((item) => (
            <button
              key={item}
              className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors duration-300"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="font-sans text-xs tracking-[0.2em] uppercase text-gold">
          RERA 37460
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
