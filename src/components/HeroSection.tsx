import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import saadImage from "@/assets/saad-bin-zain-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const chromaticOffset = new THREE.Vector2(0.0002, 0.00028);

function smoothLerp(current: number, target: number, alpha: number) {
  return current + (target - current) * alpha;
}

function GlassMarker({
  mouse,
  position,
  rotation,
  size,
  floatOffset,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  floatOffset: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + floatOffset) * 0.08;
    ref.current.rotation.x = rotation[0] + mouse.current.y * 0.08 + Math.sin(t * 0.5 + floatOffset) * 0.02;
    ref.current.rotation.y = rotation[1] + mouse.current.x * 0.12 + Math.cos(t * 0.45 + floatOffset) * 0.03;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.06}
          ior={1.52}
          thickness={2.5}
          attenuationColor="#f6f6f6"
          attenuationDistance={3}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={0.3}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh scale={[1.01, 1.01, 1.04]}>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#f3dfb6" transparent opacity={0.03} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OrbitDust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 240;
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      data[index * 3] = (Math.random() - 0.5) * 12;
      data[index * 3 + 1] = Math.random() * 5 - 1.5;
      data[index * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#d7b16a"
        size={0.03}
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GoldRoute() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.6, -0.7, 1.3),
        new THREE.Vector3(-0.6, -0.35, 0.5),
        new THREE.Vector3(0.4, -0.2, -0.15),
        new THREE.Vector3(1.5, -0.05, -0.65),
        new THREE.Vector3(2.2, 0.15, -1.1),
      ]),
    [],
  );

  return (
    <mesh position={[0.35, -0.04, 0.2]} rotation={[0, -0.28, 0]}>
      <tubeGeometry args={[curve, 120, 0.018, 10, false]} />
      <meshStandardMaterial color="#d3ab60" emissive="#9f7330" emissiveIntensity={0.55} />
    </mesh>
  );
}

function RetailPodium() {
  return (
    <group position={[-0.2, -0.6, 0.25]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.65, 1.55]} />
        <meshStandardMaterial color="#161616" roughness={0.76} metalness={0.16} />
      </mesh>
      <mesh position={[0, 0.24, 0.68]}>
        <boxGeometry args={[2.28, 0.06, 0.16]} />
        <meshStandardMaterial color="#c79a52" emissive="#8d6630" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0.1, -0.72]}>
        <boxGeometry args={[2.1, 0.04, 0.04]} />
        <meshStandardMaterial color="#a67a3c" emissive="#5c4320" emissiveIntensity={0.28} />
      </mesh>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[-1.02 + index * 0.26, -0.06, 0.79]}>
          <boxGeometry args={[0.14, 0.26, 0.03]} />
          <meshBasicMaterial color="#d8b169" transparent opacity={0.58} />
        </mesh>
      ))}
    </group>
  );
}

function Tower() {
  const tiers = [
    { y: -0.2, size: [0.82, 2.5, 0.82] as [number, number, number] },
    { y: 1.1, size: [0.68, 2.05, 0.68] as [number, number, number] },
    { y: 2.15, size: [0.52, 1.75, 0.52] as [number, number, number] },
    { y: 3.05, size: [0.36, 1.35, 0.36] as [number, number, number] },
  ];

  return (
    <group position={[1.55, 0.18, -0.78]} rotation={[0, -0.1, 0]}>
      {tiers.map((tier) => (
        <mesh key={tier.y} position={[0, tier.y, 0]} castShadow receiveShadow>
          <boxGeometry args={tier.size} />
          <meshStandardMaterial color="#171717" roughness={0.62} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0.22, 1.75, 0.41]}>
        <boxGeometry args={[0.04, 3.95, 0.03]} />
        <meshStandardMaterial color="#d6ad66" emissive="#8e6630" emissiveIntensity={0.5} />
      </mesh>
      {Array.from({ length: 12 }).map((_, index) => (
        <mesh key={index} position={[0, -0.78 + index * 0.36, 0.43]}>
          <boxGeometry args={[0.46, 0.1, 0.03]} />
          <meshBasicMaterial color="#cfaa68" transparent opacity={0.38} />
        </mesh>
      ))}
    </group>
  );
}

function VillaResidence() {
  return (
    <group position={[-1.65, -0.66, -0.78]} rotation={[0, 0.24, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.45, 0.44, 0.98]} />
        <meshStandardMaterial color="#151515" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[0.3, 0.34, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.66, 0.28, 0.54]} />
        <meshStandardMaterial color="#1b1b1b" roughness={0.8} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.04, 0.52]}>
        <boxGeometry args={[1.1, 0.12, 0.03]} />
        <meshStandardMaterial color="#c89d57" emissive="#7c5725" emissiveIntensity={0.36} />
      </mesh>
    </group>
  );
}

function PropertyScene({
  mouse,
  intro,
  progress,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  intro: MutableRefObject<number>;
  progress: MutableRefObject<number>;
}) {
  const clusterRef = useRef<THREE.Group>(null);
  const heroLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (clusterRef.current) {
      clusterRef.current.rotation.y = smoothLerp(clusterRef.current.rotation.y, -0.42 + mouse.current.x * 0.22, 0.035);
      clusterRef.current.rotation.x = smoothLerp(clusterRef.current.rotation.x, -0.08 + mouse.current.y * 0.06, 0.035);
      clusterRef.current.position.y = smoothLerp(clusterRef.current.position.y, -0.16 + Math.sin(t * 0.45) * 0.03 - progress.current * 0.08, 0.04);
      const reveal = 0.88 + intro.current * 0.12;
      clusterRef.current.scale.setScalar(reveal);
    }

    state.camera.position.x = smoothLerp(state.camera.position.x, 0.35 + mouse.current.x * 0.36, 0.03);
    state.camera.position.y = smoothLerp(state.camera.position.y, 0.18 + mouse.current.y * 0.22, 0.03);
    state.camera.lookAt(0.6, 0.15, -0.2);

    if (heroLightRef.current) {
      heroLightRef.current.position.x = smoothLerp(heroLightRef.current.position.x, 2.6 + mouse.current.x * 1.1, 0.05);
      heroLightRef.current.position.y = smoothLerp(heroLightRef.current.position.y, 4 + mouse.current.y * 0.5, 0.05);
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#050505", 0.065]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[-4, 5.5, 2.5]} intensity={0.65} color="#f7ecd8" />
      <spotLight
        ref={heroLightRef}
        position={[2.6, 4, 3.8]}
        angle={0.34}
        penumbra={0.9}
        intensity={1.5}
        decay={1.25}
        distance={18}
        color="#f5d8a1"
      />
      <pointLight position={[-3.5, 1.8, 1.8]} intensity={0.35} color="#cad4ff" distance={10} />

      <Environment preset="night" blur={0.9} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.6, -1.2, -0.2]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#080808" roughness={0.9} metalness={0.06} />
      </mesh>

      <gridHelper args={[18, 18, 0x6f5832, 0x1a1610]} position={[0.6, -1.18, -0.2]} />

      <mesh position={[1.8, 1.2, -4.4]}>
        <planeGeometry args={[10, 5.8]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      <group ref={clusterRef} position={[1.55, -0.16, 0.15]}>
        <RetailPodium />
        <Tower />
        <VillaResidence />
        <GoldRoute />
        <GlassMarker mouse={mouse} position={[0.25, 0.95, 0.95]} rotation={[0.06, -0.32, 0.02]} size={[0.12, 2.4, 0.9]} floatOffset={0.2} />
        <GlassMarker mouse={mouse} position={[2.25, 0.55, 0.38]} rotation={[-0.03, 0.18, 0.03]} size={[0.14, 2.1, 0.72]} floatOffset={1.6} />
        <GlassMarker mouse={mouse} position={[-1.15, 0.65, 0.35]} rotation={[0.04, -0.18, -0.02]} size={[0.11, 1.8, 0.62]} floatOffset={2.6} />
      </group>

      <OrbitDust />

      <EffectComposer>
        <Bloom intensity={0.16} luminanceThreshold={0.9} luminanceSmoothing={0.22} mipmapBlur />
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation
          modulationOffset={0.82}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const introRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const handleMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
        y: THREE.MathUtils.clamp(-((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1),
      };
    };

    const handleLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    section.addEventListener("mousemove", handleMove, { passive: true });
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (canvasRef.current) {
        timeline.fromTo(canvasRef.current, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.5 }, 0);
      }

      if (ghostRef.current) {
        timeline.fromTo(ghostRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1 }, 0.15);
      }

      if (copyRef.current) {
        timeline.fromTo(
          Array.from(copyRef.current.children),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.08 },
          0.22,
        );
      }

      if (cardsRef.current) {
        timeline.fromTo(
          Array.from(cardsRef.current.children),
          { opacity: 0, x: 26 },
          { opacity: 1, x: 0, duration: 0.9, stagger: 0.1 },
          0.35,
        );
      }

      if (railRef.current) {
        timeline.fromTo(railRef.current, { scaleX: 0.2, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.2 }, 0.3);
      }

      timeline.to(introRef, { current: 1, duration: 1.8 }, 0.1);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=130%",
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;

          if (copyRef.current) {
            gsap.set(copyRef.current, {
              y: self.progress * -32,
              opacity: 1 - self.progress * 0.25,
            });
          }

          if (cardsRef.current) {
            gsap.set(cardsRef.current, {
              y: self.progress * -18,
              opacity: 1 - self.progress * 0.18,
            });
          }

          if (ghostRef.current) {
            gsap.set(ghostRef.current, {
              x: self.progress * -30,
              opacity: 0.22 - self.progress * 0.08,
            });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const statCards = [
    { label: "Prime Retail", value: "Mall Placement" },
    { label: "Commercial Assets", value: "Office Strategy" },
    { label: "Private Office", value: "Capital Advisory" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 18% 18%, hsl(40 46% 18% / 0.12), transparent 32%), radial-gradient(circle at 82% 72%, hsl(40 46% 24% / 0.08), transparent 28%), linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 4%) 36%, hsl(0 0% 3%) 100%)",
      }}
      data-section="hero"
    >
      <div ref={canvasRef} className="absolute inset-0 z-[1] opacity-0">
        <Canvas
          shadows
          camera={{ position: [0.35, 0.18, 8.6], fov: 31 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl, scene }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.82;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.setClearColor("#040404", 1);
            scene.background = new THREE.Color("#040404");
          }}
        >
          <Suspense fallback={null}>
            <PropertyScene mouse={mouseRef} intro={introRef} progress={progressRef} />
          </Suspense>
        </Canvas>
      </div>

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,4,4,0.92) 0%, rgba(4,4,4,0.74) 28%, rgba(4,4,4,0.22) 56%, rgba(4,4,4,0.68) 100%), linear-gradient(180deg, rgba(4,4,4,0.82) 0%, transparent 24%, transparent 72%, rgba(4,4,4,0.9) 100%)",
        }}
      />

      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {Array.from({ length: 36 }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(40 46% 56% / ${0.08 + Math.random() * 0.18})`,
              boxShadow: "0 0 14px hsl(40 46% 56% / 0.18)",
              animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen px-6 md:px-12 lg:px-16">
        <h1 className="sr-only">Saad Bin Zain luxury real estate advisory</h1>

        <div
          ref={ghostRef}
          className="absolute left-0 top-[10%] select-none pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 200,
            fontSize: "clamp(6rem, 16vw, 18rem)",
            lineHeight: 0.88,
            letterSpacing: "0.18em",
            color: "transparent",
            WebkitTextStroke: "1px hsl(40 46% 56% / 0.08)",
            opacity: 0,
          }}
        >
          MONOGRAPH
        </div>

        <div className="grid min-h-screen items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.72fr)]">
          <div className="relative max-w-[760px] pt-28 md:pt-32 lg:pt-36">
            <div ref={copyRef} className="max-w-[640px]">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-16 bg-[linear-gradient(90deg,transparent,rgba(214,184,132,0.9))]" />
                <p
                  className="text-[10px] uppercase tracking-[0.58em] md:text-[11px]"
                  style={{ color: "rgba(214,184,132,0.92)", fontFamily: "'Inter', sans-serif" }}
                >
                  Luxury Real Estate Advisory
                </p>
              </div>

              <div className="mb-8 flex items-center gap-4">
                <div
                  className="relative h-16 w-16 overflow-hidden rounded-full border"
                  style={{ borderColor: "rgba(214,184,132,0.24)" }}
                >
                  <img src={saadImage} alt="Saad Bin Zain" className="h-full w-full object-cover grayscale" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.4))]" />
                </div>
                <div>
                  <div
                    className="text-[11px] uppercase tracking-[0.42em]"
                    style={{ color: "rgba(244,239,232,0.72)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Saad Bin Zain
                  </div>
                  <div
                    className="mt-1 text-[10px] uppercase tracking-[0.34em]"
                    style={{ color: "rgba(214,184,132,0.7)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Dubai | London | Netherlands
                  </div>
                </div>
              </div>

              <h2
                className="text-[clamp(3.8rem,8vw,8rem)] leading-[0.88] text-white"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}
              >
                Prime addresses.
                <br />
                <span className="gold-text-gradient">Retail, office, and landmark assets.</span>
              </h2>

              <p
                className="mt-8 max-w-[36rem] text-[1.02rem] leading-8 md:text-[1.12rem]"
                style={{ color: "rgba(234,230,223,0.82)", fontFamily: "'Cormorant Garamond', serif" }}
              >
                A luxury entrance sequence built around the way Saad advises: mall placement, commercial positioning, and private-office strategy framed as if you are looking over a sculpted architectural model before the deal is made.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  "20 Years of Precision",
                  "Commercial Assets",
                  "Private Retail Networks",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border px-4 py-2 text-[10px] uppercase md:text-[11px]"
                    style={{
                      borderColor: "rgba(214,184,132,0.18)",
                      background: "rgba(10,10,10,0.24)",
                      color: "rgba(214,184,132,0.88)",
                      letterSpacing: "0.32em",
                      fontFamily: "'Inter', sans-serif",
                      backdropFilter: "blur(14px)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              ref={railRef}
              className="mt-12 h-px origin-left"
              style={{
                opacity: 0,
                background: "linear-gradient(90deg, rgba(214,184,132,0.95), rgba(214,184,132,0.12), transparent)",
              }}
            />
          </div>

          <div className="relative flex h-full items-end justify-end pb-12 lg:pb-20">
            <div ref={cardsRef} className="w-full max-w-[420px] space-y-4 lg:mr-2">
              {statCards.map((card, index) => (
                <div
                  key={card.label}
                  className="rounded-[1.75rem] border p-5"
                  style={{
                    opacity: 0,
                    transform: "translateX(16px)",
                    borderColor: "rgba(214,184,132,0.15)",
                    background:
                      index === 0
                        ? "linear-gradient(135deg, rgba(20,18,15,0.82), rgba(10,10,10,0.52))"
                        : "linear-gradient(135deg, rgba(12,12,12,0.74), rgba(8,8,8,0.44))",
                    backdropFilter: "blur(18px)",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
                  }}
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div
                        className="text-[10px] uppercase tracking-[0.4em]"
                        style={{ color: "rgba(214,184,132,0.86)", fontFamily: "'Inter', sans-serif" }}
                      >
                        {card.label}
                      </div>
                      <div
                        className="mt-3 text-2xl text-white"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
                      >
                        {card.value}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full border border-[rgba(214,184,132,0.16)] bg-[rgba(214,184,132,0.04)]" />
                  </div>
                  <div className="mt-6 h-px bg-[linear-gradient(90deg,rgba(214,184,132,0.45),transparent)]" />
                  <p
                    className="mt-4 text-[11px] uppercase tracking-[0.28em]"
                    style={{ color: "rgba(244,239,232,0.58)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Strategic placement. Market fluency. Quiet luxury presentation.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;