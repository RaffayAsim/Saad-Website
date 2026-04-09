import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Reflector, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type SlideId = "dna" | "geometry" | "scale" | "blend";

type Slide = {
  id: SlideId;
  eyebrow: string;
  title: string;
  stat: string;
  unit: string;
  body: string;
  note: string;
  markers: string[];
};

const MONO_FONT = "'IBM Plex Mono', 'SFMono-Regular', 'Cascadia Code', 'Fira Code', monospace";
const SERIF_FONT = "'Playfair Display', serif";

const slides: Slide[] = [
  {
    id: "dna",
    eyebrow: "Institutional DNA",
    title: "7 Years inside ABN AMRO shaped the discipline behind every advisory decision.",
    stat: "7",
    unit: "YEARS AT ABN AMRO",
    body:
      "Private banking taught structure, discretion, and sequence. That logic still governs how opportunities are filtered, framed, and executed for high-value clients.",
    note: "Behind the glass: a wireframe vault door, representing security, governance, and controlled access.",
    markers: ["Institutional trust", "Cross-border discipline", "Private wealth rigor"],
  },
  {
    id: "geometry",
    eyebrow: "Market Geometry",
    title: "50+ landmark deals built a sharper understanding of value, positioning, and market rhythm.",
    stat: "50+",
    unit: "LANDMARK DEALS",
    body:
      "Retail and commercial transactions are not treated as isolated wins. They are read as systems of movement, pricing, timing, and portfolio shape.",
    note: "Behind the glass: a skyline cluster emerging from the tablet surface like a market map becoming physical form.",
    markers: ["Retail intelligence", "Prime asset selection", "Long-horizon thinking"],
  },
  {
    id: "scale",
    eyebrow: "Sovereign Scale",
    title: "$2B+ in relationship value creates access, leverage, and conversations that rarely reach the open market.",
    stat: "$2B+",
    unit: "MANAGED & CONNECTED",
    body:
      "Serious advisory depends on the quality of the network around it. Capital flow, counterparties, and timing become more powerful when the ecosystem is already in place.",
    note: "Behind the glass: a gold fluid current moving across the tablet, translating capital into motion.",
    markers: ["Elite network", "Off-market reach", "Institutional counterparties"],
  },
  {
    id: "blend",
    eyebrow: "Rare Blend",
    title: "Finance logic and real estate instinct converge into one signature advisory lens.",
    stat: "S.B.Z",
    unit: "SIGNATURE METHOD",
    body:
      "At the final phase, the monograph leaves metrics behind and resolves into identity: an approach built from analytical precision, market fluency, and trust at the highest level.",
    note: "The tablet fractures into light and reforms as S.B.Z, turning strategic advantage into a signature mark.",
    markers: ["Dual-sector mastery", "Luxury judgment", "Identity as infrastructure"],
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(min: number, max: number, value: number) {
  const t = THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

function LaserGrid({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const result: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let x = -22; x <= 22; x += 2) {
      result.push([new THREE.Vector3(x, -3.2, -24), new THREE.Vector3(x, -3.2, 18)]);
    }
    for (let z = -24; z <= 18; z += 2) {
      result.push([new THREE.Vector3(-22, -3.2, z), new THREE.Vector3(22, -3.2, z)]);
    }
    return result;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.z = (state.clock.elapsedTime * 1.8) % 2;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {lines.map(([start, end], index) => (
        <Line
          key={index}
          points={[start, end]}
          color="#b98d41"
          transparent
          opacity={0.18 + progress * 0.08}
          lineWidth={0.6}
        />
      ))}
    </group>
  );
}

function VaultDoor({ amount }: { amount: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.02 * amount;
    groupRef.current.position.z = lerp(-0.4, 0.2, amount);
  });

  const ringPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let index = 0; index <= 96; index += 1) {
      const angle = (index / 96) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0));
    }
    return points;
  }, []);

  const spokes = useMemo(
    () => [
      [new THREE.Vector3(-0.9, 0, 0), new THREE.Vector3(0.9, 0, 0)],
      [new THREE.Vector3(0, -0.9, 0), new THREE.Vector3(0, 0.9, 0)],
      [new THREE.Vector3(-0.62, -0.62, 0), new THREE.Vector3(0.62, 0.62, 0)],
      [new THREE.Vector3(-0.62, 0.62, 0), new THREE.Vector3(0.62, -0.62, 0)],
    ],
    [],
  );

  return (
    <group ref={groupRef} position={[0, 0, -0.45]} scale={amount}>
      <Line points={ringPoints} color="#d7b16e" transparent opacity={0.8} lineWidth={1} />
      <Line points={[new THREE.Vector3(-1.45, 0, 0), new THREE.Vector3(-1.05, 0, 0)]} color="#d7b16e" transparent opacity={0.65} lineWidth={1} />
      <Line points={[new THREE.Vector3(1.05, 0, 0), new THREE.Vector3(1.45, 0, 0)]} color="#d7b16e" transparent opacity={0.65} lineWidth={1} />
      {spokes.map((points, index) => (
        <Line key={index} points={points} color="#d7b16e" transparent opacity={0.72} lineWidth={1} />
      ))}
    </group>
  );
}

function SkylineCluster({ amount }: { amount: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const heights = [1.8, 2.6, 1.5, 3.1, 2.1, 2.8];
  const positions = [-1.6, -1, -0.25, 0.45, 1.05, 1.65];

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    groupRef.current.position.y = -0.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, -0.5]} scale={amount}>
      {heights.map((height, index) => (
        <mesh key={index} position={[positions[index], height / 2 - 1.25, 0]}>
          <boxGeometry args={[0.28 + (index % 2) * 0.14, height, 0.28]} />
          <meshStandardMaterial
            color="#c59a59"
            emissive="#9c6f2a"
            emissiveIntensity={0.35}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function GoldFlow({ amount }: { amount: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const points = useMemo(
    () =>
      Array.from({ length: 80 }, (_, index) => {
        const x = THREE.MathUtils.mapLinear(index, 0, 79, -2.2, 2.2);
        return new THREE.Vector3(x, Math.sin(index * 0.24) * 0.18, 0);
      }),
    [],
  );

  useFrame((state) => {
    if (!lineRef.current) return;
    const position = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let index = 0; index < position.count; index += 1) {
      const x = THREE.MathUtils.mapLinear(index, 0, position.count - 1, -2.2, 2.2);
      position.setY(index, Math.sin(index * 0.18 + state.clock.elapsedTime * 2.6) * 0.22);
      position.setZ(index, Math.cos(x * 2 + state.clock.elapsedTime * 1.4) * 0.08);
    }
    position.needsUpdate = true;
    lineRef.current.position.z = -0.34;
    lineRef.current.scale.setScalar(amount);
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((point) => [point.x, point.y, point.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#d4a657" transparent opacity={0.85} />
    </line>
  );
}

function ParticleLogo({ amount }: { amount: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 520;

  const data = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const targets = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 8;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 4;

      const t = index / particleCount;
      let x = 0;
      let y = 0;

      if (t < 0.33) {
        const local = t / 0.33;
        const angle = local * Math.PI * 1.6 + 0.3;
        x = -1.5 + Math.sin(angle) * 0.65;
        y = Math.cos(angle) * 0.95;
      } else if (t < 0.66) {
        const local = (t - 0.33) / 0.33;
        const angle = local * Math.PI * 1.8 + 0.2;
        x = 0.1 + Math.sin(angle) * 0.66;
        y = Math.cos(angle) * 0.96;
      } else {
        const local = (t - 0.66) / 0.34;
        if (local < 0.35) {
          x = 1.7 - local * 1.6;
          y = 0.95;
        } else if (local < 0.65) {
          x = 1.14 + Math.sin((local - 0.35) / 0.3 * Math.PI) * 0.52;
          y = 0.12;
        } else {
          x = 1.7 - (local - 0.65) / 0.35 * 1.6;
          y = -0.95;
        }
      }

      targets[index * 3] = x;
      targets[index * 3 + 1] = y;
      targets[index * 3 + 2] = 0;
    }

    return { positions, targets };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const position = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let index = 0; index < particleCount; index += 1) {
      const base = index * 3;
      const startX = data.positions[base];
      const startY = data.positions[base + 1];
      const startZ = data.positions[base + 2];
      const targetX = data.targets[base];
      const targetY = data.targets[base + 1];
      const targetZ = data.targets[base + 2];
      const drift = (1 - amount) * 0.45;
      position.setX(index, lerp(startX + Math.sin(index + state.clock.elapsedTime) * drift, targetX, amount));
      position.setY(index, lerp(startY + Math.cos(index * 0.7 + state.clock.elapsedTime * 1.4) * drift, targetY, amount));
      position.setZ(index, lerp(startZ, targetZ, amount));
    }
    position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, 0, -0.12]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.positions} count={particleCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#e7c47b" size={0.055} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

function TabletScene({ progress }: { progress: number }) {
  const tabletRef = useRef<THREE.Group>(null);
  const edgeRef = useRef<THREE.Mesh>(null);

  const dnaAmount = 1 - smoothstep(0.22, 0.4, progress);
  const geometryAmount = smoothstep(0.2, 0.42, progress) * (1 - smoothstep(0.48, 0.68, progress));
  const scaleAmount = smoothstep(0.5, 0.74, progress) * (1 - smoothstep(0.78, 0.92, progress));
  const blendAmount = smoothstep(0.82, 1, progress);

  useFrame((state) => {
    if (!tabletRef.current) return;
    tabletRef.current.rotation.x = THREE.MathUtils.lerp(tabletRef.current.rotation.x, -0.22 + progress * 0.1, 0.05);
    tabletRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
    tabletRef.current.position.y = 0.4 + Math.sin(state.clock.elapsedTime * 0.65) * 0.08;
    if (edgeRef.current) {
      const material = edgeRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.35 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08 + blendAmount * 0.3;
    }
  });

  return (
    <>
      <color attach="background" args={["#040404"]} />
      <fog attach="fog" args={["#050505", 8, 28]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 6, 6]} intensity={1.2} color="#f2d29a" />
      <pointLight position={[-5, 2, 6]} intensity={2.2} color="#b8873d" />
      <pointLight position={[0, -1, -2]} intensity={1.4} color="#7d5a28" />

      <LaserGrid progress={progress} />

      <Reflector
        resolution={512}
        args={[30, 18]}
        mirror={0.45}
        mixStrength={0.8}
        blur={[300, 60]}
        minDepthThreshold={0.8}
        maxDepthThreshold={1.3}
        color="#18120a"
        position={[0, -3.35, -1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
        <group ref={tabletRef} position={[0, 0.35, 0]}>
          <mesh ref={edgeRef} position={[0, 0, -0.02]}>
            <boxGeometry args={[5.45, 3.3, 0.18]} />
            <meshStandardMaterial color="#b98d41" emissive="#8a6022" emissiveIntensity={0.4} metalness={0.95} roughness={0.2} />
          </mesh>

          <RoundedBox args={[5.25, 3.08, 0.12]} radius={0.15} smoothness={6}>
            <meshPhysicalMaterial
              color="#f5ead7"
              transparent
              opacity={0.22}
              transmission={0.95}
              roughness={0.05}
              thickness={0.6}
              ior={1.2}
              metalness={0.08}
              reflectivity={0.65}
              attenuationDistance={1.5}
              attenuationColor="#f0c477"
            />
          </RoundedBox>

          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[4.92, 2.76]} />
            <meshBasicMaterial color="#0b0b0b" transparent opacity={0.42} />
          </mesh>

          <VaultDoor amount={dnaAmount} />
          <SkylineCluster amount={geometryAmount} />
          <GoldFlow amount={scaleAmount} />
          <ParticleLogo amount={blendAmount} />
        </group>
      </Float>
    </>
  );
}

const BankingAdvantage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabletCopyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const activeIndex = Math.min(slides.length - 1, Math.floor(progress * slides.length));
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const children = Array.from(headerRef.current.children);
        gsap.fromTo(
          children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%" },
          },
        );
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tabletCopyRef.current) return;
    const children = Array.from(tabletCopyRef.current.children);
    gsap.fromTo(
      children,
      { opacity: 0, y: 20, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
        stagger: 0.05,
        ease: "power3.out",
      },
    );
  }, [activeSlide]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: "420vh",
        background:
          "radial-gradient(circle at 50% 20%, hsl(40 28% 10% / 0.18), transparent 28%), linear-gradient(180deg, hsl(0 0% 2%) 0%, hsl(0 0% 3%) 40%, hsl(0 0% 2%) 100%)",
      }}
      data-section="banking-advantage"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "linear-gradient(90deg, transparent 0%, hsl(40 46% 56% / 0.035) 48%, transparent 52%, transparent 100%)" }}
      />

      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0.4, 7.8], fov: 32 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }}>
            <TabletScene progress={progress} />
          </Canvas>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1000px] flex-col justify-between px-6 pb-10 pt-10 md:px-10 md:pb-12 md:pt-12">
          <div ref={headerRef} className="max-w-[540px]">
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.6em]"
              style={{ fontFamily: MONO_FONT, color: "hsl(40 46% 56%)" }}
            >
              Strategic Edge
            </p>
            <h2
              className="text-4xl leading-[0.92] md:text-6xl lg:text-[5.2rem]"
              style={{ fontFamily: SERIF_FONT, fontWeight: 200, color: "hsl(0 0% 95%)" }}
            >
              Glass
              <br />
              <span className="gold-text-gradient">Monograph</span>
            </h2>
            <p
              className="mt-5 max-w-md text-sm leading-relaxed md:text-base"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(0 0% 64%)" }}
            >
              A single monolithic tablet replaces the old list layout. Scroll to move through institutional depth, market geometry, sovereign-scale access, and the final signature blend.
            </p>
          </div>

          <div className="pointer-events-none relative mx-auto flex w-full max-w-[1000px] justify-center">
            <div
              className="pointer-events-auto relative w-full max-w-[860px] rounded-[40px] border px-6 py-6 md:px-10 md:py-8"
              style={{
                marginTop: "12vh",
                background: "linear-gradient(180deg, hsl(0 0% 7% / 0.22), hsl(0 0% 4% / 0.18))",
                borderColor: "hsl(40 46% 56% / 0.18)",
                boxShadow: "0 26px 90px hsl(0 0% 0% / 0.28), inset 0 1px 0 hsl(40 46% 56% / 0.12)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="mb-5 flex items-start justify-between gap-5">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.38em]"
                    style={{ fontFamily: MONO_FONT, color: "hsl(40 46% 56%)" }}
                  >
                    {activeSlide.eyebrow}
                  </p>
                </div>
                <div
                  className="rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.32em]"
                  style={{
                    fontFamily: MONO_FONT,
                    color: "hsl(40 46% 56%)",
                    borderColor: "hsl(40 46% 56% / 0.18)",
                    background: "hsl(40 46% 56% / 0.05)",
                  }}
                >
                  {String(activeIndex + 1).padStart(2, "0")} / {slides.length.toString().padStart(2, "0")}
                </div>
              </div>

              <div ref={tabletCopyRef} key={activeSlide.id} className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:gap-10">
                <div>
                  <h3
                    className="max-w-[520px] text-2xl leading-[1.04] md:text-[2.65rem]"
                    style={{ fontFamily: SERIF_FONT, fontWeight: 200, color: "hsl(0 0% 96%)" }}
                  >
                    {activeSlide.title}
                  </h3>
                  <p
                    className="mt-5 max-w-[520px] text-base leading-relaxed"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(0 0% 74%)" }}
                  >
                    {activeSlide.body}
                  </p>
                  <p
                    className="mt-5 max-w-[560px] rounded-[18px] border px-4 py-4 text-sm leading-relaxed"
                    style={{
                      fontFamily: MONO_FONT,
                      color: "hsl(0 0% 72%)",
                      borderColor: "hsl(40 46% 56% / 0.12)",
                      background: "hsl(40 46% 56% / 0.04)",
                    }}
                  >
                    {activeSlide.note}
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-5">
                  <div>
                    <div
                      className="text-5xl leading-none md:text-[4.5rem]"
                      style={{ fontFamily: SERIF_FONT, fontWeight: 200, color: "hsl(40 58% 72%)" }}
                    >
                      {activeSlide.stat}
                    </div>
                    <div
                      className="mt-2 text-[10px] uppercase tracking-[0.34em]"
                      style={{ fontFamily: MONO_FONT, color: "hsl(40 46% 56%)" }}
                    >
                      {activeSlide.unit}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {activeSlide.markers.map((marker) => (
                      <div
                        key={marker}
                        className="rounded-[16px] border px-4 py-3"
                        style={{
                          borderColor: "hsl(40 46% 56% / 0.12)",
                          background: "hsl(0 0% 100% / 0.02)",
                        }}
                      >
                        <p
                          className="text-[10px] uppercase tracking-[0.25em]"
                          style={{ fontFamily: MONO_FONT, color: "hsl(40 46% 56%)" }}
                        >
                          Marker
                        </p>
                        <p
                          className="mt-2 text-sm leading-relaxed"
                          style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(0 0% 82%)" }}
                        >
                          {marker}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[1000px]">
            <div className="grid gap-3 md:grid-cols-4">
              {slides.map((slide, index) => {
                const active = index === activeIndex;
                return (
                  <div
                    key={slide.id}
                    className="rounded-[16px] border px-4 py-3"
                    style={{
                      borderColor: active ? "hsl(40 46% 56% / 0.28)" : "hsl(0 0% 100% / 0.08)",
                      background: active
                        ? "linear-gradient(180deg, hsl(40 46% 56% / 0.1), hsl(0 0% 7% / 0.5))"
                        : "linear-gradient(180deg, hsl(0 0% 7% / 0.5), hsl(0 0% 5% / 0.4))",
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.3em]"
                      style={{ fontFamily: MONO_FONT, color: "hsl(40 46% 56%)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ fontFamily: SERIF_FONT, color: "hsl(0 0% 88%)" }}>
                      {slide.eyebrow}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankingAdvantage;
