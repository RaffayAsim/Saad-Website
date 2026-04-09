import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

/* ── 3D Crystal Diamond ── */
function CrystalDiamond() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.2;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    groupRef.current.position.x += (mouseRef.current.x * 0.8 - groupRef.current.position.x) * 0.02;
    groupRef.current.position.y += (mouseRef.current.y * 0.5 - groupRef.current.position.y) * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* Inner solid crystal */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh scale={1.8}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#C5A059"
            roughness={0.15}
            metalness={0.95}
            distort={0.15}
            speed={2}
            transparent
            opacity={0.12}
          />
        </mesh>
      </Float>
      {/* Outer wireframe */}
      <mesh scale={2.4}>
        <octahedronGeometry args={[1, 1]} />
        <meshBasicMaterial wireframe color="#C5A059" transparent opacity={0.06} />
      </mesh>
      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3, 0.005, 16, 80]} />
        <meshBasicMaterial color="#C5A059" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ── Floating dust particles ── */
function DustField() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#C5A059" size={0.02} transparent opacity={0.4} sizeAttenuation
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function EdgeScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#C5A059" />
      <pointLight position={[-3, -2, 2]} intensity={0.3} color="#F5E6C8" />
      <CrystalDiamond />
      <DustField />
    </>
  );
}

/* ── Service Card ── */
const ServiceCard = ({
  num,
  title,
  subtitle,
  points,
  metric,
  metricLabel,
}: {
  num: string;
  title: string;
  subtitle: string;
  points: string[];
  metric: string;
  metricLabel: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
    gsap.to(cardRef.current, {
      rotateY: (((e.clientX - rect.left) / rect.width) - 0.5) * 12,
      rotateX: -(((e.clientY - rect.top) / rect.height) - 0.5) * 8,
      duration: 0.4, ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    }
  };

  return (
    <div style={{ perspective: "1200px" }} className="edge-card">
      <div
        ref={cardRef}
        className="relative p-8 md:p-10 lg:p-12 rounded-xl overflow-hidden cursor-default"
        style={{
          transformStyle: "preserve-3d",
          background: "hsl(0 0% 4% / 0.8)",
          backdropFilter: "blur(30px)",
          border: `1px solid ${hovered ? "hsl(40 46% 56% / 0.25)" : "hsl(0 0% 10%)"}`,
          boxShadow: hovered ? "0 30px 80px hsl(0 0% 0% / 0.5), 0 0 40px hsl(40 46% 56% / 0.05)" : "0 10px 40px hsl(0 0% 0% / 0.3)",
          transition: "box-shadow 0.5s, border-color 0.5s",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow follow */}
        <div className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-500" style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(40 46% 56% / 0.08), transparent 50%)`,
        }} />
        {/* Top shimmer */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{
          background: hovered ? "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.3), transparent)" : "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.06), transparent)",
          transition: "background 0.5s",
        }} />

        <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-[10px] tracking-[0.5em] uppercase block mb-3" style={{
                fontFamily: "'Inter', sans-serif", color: "hsl(40 46% 56%)",
              }}>{subtitle}</span>
              <h3 className="text-2xl md:text-3xl lg:text-4xl" style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 200,
                color: "hsl(0 0% 95%)", whiteSpace: "pre-line",
              }}>{title}</h3>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 200,
              fontSize: "clamp(4rem, 6vw, 6rem)", lineHeight: 0.8,
              color: "hsl(40 46% 56% / 0.06)",
            }}>{num}</span>
          </div>

          {/* Divider */}
          <div className="h-px mb-8" style={{
            background: "linear-gradient(90deg, hsl(40 46% 56% / 0.2), transparent)",
          }} />

          {/* Points */}
          <ul className="space-y-4 mb-10">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-4 text-sm md:text-base" style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
                color: "hsl(0 0% 55%)", letterSpacing: "0.02em",
              }}>
                <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                  background: "hsl(40 46% 56%)", boxShadow: "0 0 8px hsl(40 46% 56% / 0.3)",
                }} />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          {/* Bottom metric */}
          <div className="flex items-end gap-4">
            <span className="text-4xl md:text-6xl" style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 200,
              background: "linear-gradient(180deg, hsl(40 46% 70%), hsl(40 46% 45%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>{metric}</span>
            <span className="text-[10px] tracking-[0.4em] uppercase pb-2" style={{
              fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 35%)",
            }}>{metricLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Section ── */
const BankingAdvantage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const children = Array.from(headerRef.current.children);
        gsap.fromTo(children, { y: 80, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.4, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%" },
        });
      }

      const cards = section.querySelectorAll(".edge-card");
      gsap.fromTo(cards, { y: 100, opacity: 0, rotateY: -10 }, {
        y: 0, opacity: 1, rotateY: 0, duration: 1.4, stagger: 0.2, ease: "power3.out",
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
      data-section="advantage"
    >
      {/* 3D Background — full width */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} style={{ background: "transparent" }}>
          <Suspense fallback={null}><EdgeScene /></Suspense>
        </Canvas>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{
        background: "radial-gradient(ellipse at center, transparent 20%, hsl(0 0% 3% / 0.7) 70%)",
      }} />

      <div className="container mx-auto px-6 md:px-16 max-w-[1400px] relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-20 md:mb-28">
          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase mb-6" style={{
            fontFamily: "'Inter', sans-serif", color: "hsl(40 46% 56%)",
          }}>The Competitive Edge</p>
          <h2 className="text-4xl md:text-6xl lg:text-8xl leading-[0.95]" style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 200, color: "hsl(0 0% 95%)",
          }}>
            Where Finance
            <br /><span className="gold-text-gradient">Meets Real Estate</span>
          </h2>
          <p className="mt-6 md:mt-8 max-w-2xl text-sm md:text-base leading-relaxed" style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            color: "hsl(0 0% 45%)", letterSpacing: "0.03em",
          }}>
            Two decades of dual expertise — private banking precision fused with luxury property mastery to architect wealth for the global elite.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <ServiceCard
            num="01"
            title={"Luxury Retail\nReal Estate"}
            subtitle="Global Advisory"
            points={[
              "Senior Consultant at Savills & Cushman & Wakefield",
              "Off-market luxury retail & prime commercial leasing",
              "Strategic positioning for fashion houses & global brands",
              "RERA Certified Broker — ID 37460",
            ]}
            metric="20+"
            metricLabel="Years in Real Estate"
          />
          <ServiceCard
            num="02"
            title={"Private Banking\n& Wealth"}
            subtitle="Financial Architecture"
            points={[
              "7 years at ABN AMRO Private Banking",
              "Bespoke wealth management for UHNW clients",
              "Service compliance & financial structuring",
              "One-stop approach for the global elite",
            ]}
            metric="$2B+"
            metricLabel="Portfolio Managed"
          />
        </div>
      </div>
    </section>
  );
};

export default BankingAdvantage;

