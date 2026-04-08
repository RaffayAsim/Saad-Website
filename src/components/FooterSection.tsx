import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <footer
      ref={ref}
      className="relative bg-[hsl(0_0%_4%)] border-t border-gold/10 py-24"
      data-section="footer"
    >
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="text-3xl md:text-4xl tracking-[0.2em] text-gallery font-light mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
          >
            Saad Bin Zain
          </div>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-muted-foreground mb-10">
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </p>
          <div className="w-16 h-px gold-gradient mx-auto mb-10" />
          <p className="font-sans text-xs text-muted-foreground/50 tracking-wider">
            RERA Broker ID — 37460 &bull; Dubai, United Arab Emirates
          </p>
          <p className="font-sans text-[10px] text-muted-foreground/30 mt-4 tracking-wider">
            &copy; {new Date().getFullYear()} Saad Bin Zain. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
