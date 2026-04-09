import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

/* ── 3D Constellation Network ── */
function ConstellationNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodeCount = 6;

  const nodePositions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const r = 2.5 + Math.sin(i * 1.5) * 0.8;
      arr.push([Math.cos(angle) * r, Math.sin(angle) * r * 0.6, Math.sin(i * 2) * 1.5]);
    }
    return arr;
  }, []);

  const lineGeo = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const a = nodePositions[i];
        const b = nodePositions[j];
        const dist = Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
        if (dist < 5) {
          positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    return geo;
  }, [nodePositions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Lines */}
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#C5A059" transparent opacity={0.08} />
      </lineSegments>
      {/* Nodes */}
      {nodePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#C5A059" emissive="#C5A059" emissiveIntensity={0.5} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#C5A059" transparent opacity={0.04} />
          </mesh>
          {/* Orbit ring */}
          <mesh rotation={[Math.PI / 2, 0, i * 0.7]}>
            <torusGeometry args={[0.4, 0.003, 8, 32]} />
            <meshBasicMaterial color="#C5A059" transparent opacity={0.06} />
          </mesh>
        </group>
      ))}
      {/* Dust around */}
      <NetworkDust />
    </group>
  );
}

function NetworkDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#C5A059" size={0.015} transparent opacity={0.35}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function NetworkScene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 3, 4]} intensity={0.4} color="#C5A059" />
      <pointLight position={[-4, -2, 3]} intensity={0.25} color="#F5E6C8" />
      <ConstellationNetwork />
    </>
  );
}

/* ── Partners data ── */
const partners = [
  {
    name: "Savills",
    role: "Senior Consultant — Luxury Retail Advisory",
    year: "2019",
    detail: "Global real estate advisory firm. Instrumental in premium retail placements across Dubai's prime corridors including DIFC and Downtown.",
    stat: "50+",
    statLabel: "Brand Placements",
  },
  {
    name: "Cushman & Wakefield",
    role: "Senior Consultant — UAE & MENA",
    year: "2017",
    detail: "Advisory on flagship retail and F&B leasing. Specialising in luxury segment with a tenant-first commercial strategy.",
    stat: "30+",
    statLabel: "Flagship Deals",
  },
  {
    name: "ABN AMRO\u00A0Bank",
    role: "Private Banking — Wealth Management",
    year: "2010",
    detail: "Managed bespoke portfolios for ultra-high-net-worth clients, bridging private banking with property investment advisory.",
    stat: "7",
    statLabel: "Years in Banking",
  },
  {
    name: "RERA\u00A0Dubai",
    role: "Licensed Broker — ID 37460",
    year: "2016",
    detail: "Fully certified under the Real Estate Regulatory Agency. Compliant practice across off-plan, secondary, and commercial markets.",
    stat: "100%",
    statLabel: "Compliance Record",
  },
];

/* ── Partner Row ── */
const PartnerRow = ({ partner, index, isActive, onToggle }: {
  partner: typeof partners[0]; index: number; isActive: boolean; onToggle: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isActive) {
      gsap.to(contentRef.current, { height: "auto", opacity: 1, duration: 0.6, ease: "power3.out" });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
    }
  }, [isActive]);

  return (
    <div
      ref={rowRef}
      className="partner-row border-b"
      style={{ borderColor: "hsl(0 0% 10%)" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-7 md:py-10 cursor-pointer group text-left"
      >
        <div className="flex items-center gap-6 md:gap-10">
          <span className="text-[10px] tracking-[0.4em]" style={{
            fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 25%)",
          }}>0{index + 1}</span>
          <h3 className="text-2xl md:text-4xl lg:text-5xl transition-colors duration-300" style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 200,
            color: isActive ? "hsl(40 46% 56%)" : "hsl(0 0% 40%)",
          }}>{partner.name}</h3>
        </div>
        <div className="flex items-center gap-6 md:gap-10">
          <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase" style={{
            fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 25%)",
          }}>{partner.year}</span>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="block w-5 h-px bg-white/30" />
            <span className="absolute block w-px h-5 bg-white/30 transition-transform duration-300" style={{
              transform: isActive ? "scaleY(0)" : "scaleY(1)",
            }} />
          </div>
        </div>
      </button>

      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="pb-8 md:pb-12 pl-12 md:pl-24 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <p className="text-[10px] tracking-[0.5em] uppercase mb-3" style={{
              fontFamily: "'Inter', sans-serif", color: "hsl(40 46% 56%)",
            }}>{partner.role}</p>
            <p className="text-sm md:text-base leading-relaxed max-w-xl" style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              color: "hsl(0 0% 50%)", letterSpacing: "0.02em",
            }}>{partner.detail}</p>
          </div>
          <div className="text-right">
            <span className="text-5xl md:text-7xl block" style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 200,
              background: "linear-gradient(180deg, hsl(40 46% 70%), hsl(40 46% 40%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>{partner.stat}</span>
            <span className="text-[9px] tracking-[0.4em] uppercase" style={{
              fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 30%)",
            }}>{partner.statLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Section ── */
const PartnersCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const kids = Array.from(headerRef.current.children);
        gsap.fromTo(kids, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%" },
        });
      }

      const rows = section.querySelectorAll(".partner-row");
      gsap.fromTo(rows, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 55%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 4%) 50%, hsl(0 0% 3%))" }}
      data-section="partners"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} style={{ background: "transparent" }}>
          <Suspense fallback={null}><NetworkScene /></Suspense>
        </Canvas>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{
        background: "radial-gradient(ellipse at center, transparent 15%, hsl(0 0% 3% / 0.75) 65%)",
      }} />

      <div className="container mx-auto px-6 md:px-16 max-w-[1400px] relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase mb-6" style={{
              fontFamily: "'Inter', sans-serif", color: "hsl(40 46% 56%)",
            }}>Strategic Alliances</p>
            <h2 className="text-4xl md:text-6xl lg:text-8xl leading-[0.95]" style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 200, color: "hsl(0 0% 95%)",
            }}>
              Trusted<br /><span className="gold-text-gradient">Network</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed" style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            color: "hsl(0 0% 40%)", letterSpacing: "0.03em",
          }}>
            A curated ecosystem of global institutions and regulatory bodies that anchor every transaction.
          </p>
        </div>

        {/* Accordion */}
        <div className="border-t" style={{ borderColor: "hsl(0 0% 10%)" }}>
          {partners.map((p, i) => (
            <PartnerRow
              key={p.name}
              partner={p}
              index={i}
              isActive={activeIndex === i}
              onToggle={() => setActiveIndex(activeIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;

