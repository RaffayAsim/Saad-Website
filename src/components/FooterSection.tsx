import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <footer
      ref={ref}
      className="relative py-32 md:py-40"
      style={{
        background: "linear-gradient(180deg, hsl(0 0% 4%), hsl(0 0% 3%))",
        borderTop: "1px solid hsl(40 46% 56% / 0.08)",
      }}
      data-section="footer"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none" style={{
        background: "radial-gradient(ellipse, hsl(40 46% 56% / 0.04) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="text-4xl md:text-6xl tracking-[0.25em] text-gallery mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            Saad Bin Zain
          </div>
          <p className="font-sans text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-12">
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </p>
          <div className="w-20 h-[2px] gold-gradient mx-auto mb-12" />
          <p className="font-sans text-xs text-muted-foreground/40 tracking-wider mb-2">
            RERA Broker ID — 37460 &bull; Dubai, United Arab Emirates
          </p>
          <p className="font-sans text-[10px] text-muted-foreground/25 tracking-wider">
            &copy; {new Date().getFullYear()} Saad Bin Zain. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
