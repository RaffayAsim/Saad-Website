import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Cinematic light sweep across footer
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { x: "-100%" },
          {
            x: "200%",
            duration: 4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 80%" },
          }
        );
      }
    }, ref.current);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={ref}
      className="relative py-28 md:py-40 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, hsl(40 46% 15% / 0.08) 0%, transparent 60%),
          linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 2%))
        `,
      }}
      data-section="footer"
    >
      {/* Top border with sweep */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent 5%, hsl(40 46% 56% / 0.1) 50%, transparent 95%)",
      }} />
      <div ref={lineRef} className="absolute top-0 h-px w-[30%]" style={{
        background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.4), transparent)",
      }} />

      {/* Gold ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none" style={{
        background: "radial-gradient(ellipse, hsl(40 46% 56% / 0.03) 0%, transparent 70%)",
        filter: "blur(80px)",
      }} />

      <div className="container mx-auto px-6 md:px-16 max-w-[1200px] text-center relative z-10">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Name */}
          <div
            className="text-3xl md:text-5xl lg:text-6xl tracking-[0.3em] text-gallery mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 200,
              textShadow: "0 0 60px hsl(40 46% 56% / 0.1)",
            }}
          >
            Saad Bin Zain
          </div>

          {/* Tagline */}
          <p className="font-sans text-xs md:text-sm tracking-[0.35em] uppercase text-muted-foreground mb-10">
            Private Banking &bull; Global Retail Real Estate &bull; Dubai
          </p>

          {/* Divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "5rem" } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-px gold-gradient mx-auto mb-10 overflow-hidden"
          />

          {/* Contact links */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { label: "Advisory", cursor: "Enter" },
              { label: "Portfolio", cursor: "View" },
              { label: "Private Office", cursor: "Enter" },
            ].map((item) => (
              <motion.button
                key={item.label}
                className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-gold transition-colors duration-700 relative group"
                data-cursor={item.cursor}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px gold-gradient transition-all duration-500 group-hover:w-full" />
              </motion.button>
            ))}
          </div>

          {/* Details */}
          <p className="font-sans text-[10px] text-muted-foreground/40 tracking-[0.2em] mb-2">
            RERA Broker ID — 37460 &bull; Dubai, United Arab Emirates
          </p>
          <p className="font-sans text-[9px] text-muted-foreground/20 tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Saad Bin Zain. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
