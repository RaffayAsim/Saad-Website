import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import saadImage from "@/assets/saad-bin-zain-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const chromaticOffset = new THREE.Vector2(0.00018, 0.00024);

function damp(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

function GoldParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 220;
    const array = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      array[index * 3] = (Math.random() - 0.5) * 10;
      array[index * 3 + 1] = Math.random() * 4.2 - 1.4;
      array[index * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return array;
  }, []);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#d8af67"
        size={0.024}
        transparent
        opacity={0.46}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlassFin({
  mouse,
  position,
  rotation,
  size,
  drift,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  drift: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.45 + drift) * 0.05;
    ref.current.rotation.x = rotation[0] + mouse.current.y * 0.04;
    ref.current.rotation.y = rotation[1] + mouse.current.x * 0.08 + Math.cos(t * 0.32 + drift) * 0.015;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.05}
          ior={1.52}
          thickness={2.8}
          attenuationColor="#ffffff"
          attenuationDistance={3.2}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={0.34}
          transparent
          opacity={0.76}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh scale={[1.01, 1.01, 1.04]}>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#d7ad63" transparent opacity={0.028} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GoldArc() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.3, -0.64, 0.88),
        new THREE.Vector3(-0.45, -0.36, 0.25),
        new THREE.Vector3(0.42, -0.2, -0.06),
        new THREE.Vector3(1.16, -0.02, -0.28),
        new THREE.Vector3(1.95, 0.18, -0.6),
      ]),
    [],
  );

  return (
    <mesh position={[0.05, -0.04, 0.1]} rotation={[0, -0.16, 0]}>
      <tubeGeometry args={[curve, 140, 0.016, 10, false]} />
      <meshStandardMaterial color="#d7ae64" emissive="#8a612c" emissiveIntensity={0.42} />
    </mesh>
  );
}

function FloorDeck() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.35, -0.94, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#090909" roughness={0.92} metalness={0.04} />
      </mesh>
      <gridHelper args={[12, 12, 0x4e3d22, 0x15100b]} position={[0.35, -0.92, 0]} />
    </>
  );
}

function RetailPodium() {
  return (
    <group position={[-0.2, -0.56, 0.18]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.45, 0.5, 1.18]} />
        <meshStandardMaterial color="#171717" roughness={0.76} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.16, 0.48]}>
        <boxGeometry args={[2.04, 0.04, 0.12]} />
        <meshStandardMaterial color="#c79c57" emissive="#7d5827" emissiveIntensity={0.34} />
      </mesh>
      {Array.from({ length: 7 }).map((_, index) => (
        <mesh key={index} position={[-0.78 + index * 0.24, -0.02, 0.58]}>
          <boxGeometry args={[0.13, 0.18, 0.02]} />
          <meshBasicMaterial color="#d9b16a" transparent opacity={0.44} />
        </mesh>
      ))}
    </group>
  );
}

function OfficeTower() {
  return (
    <group position={[1.18, -0.04, -0.62]} rotation={[0, -0.08, 0]}>
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.64, 2.35, 0.64]} />
        <meshStandardMaterial color="#171717" roughness={0.66} metalness={0.18} />
      </mesh>
      <mesh position={[0, 1.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 1.68, 0.48]} />
        <meshStandardMaterial color="#171717" roughness={0.66} metalness={0.18} />
      </mesh>
      <mesh position={[0.18, 1.02, 0.32]}>
        <boxGeometry args={[0.028, 3.0, 0.028]} />
        <meshStandardMaterial color="#d7ad63" emissive="#8f662f" emissiveIntensity={0.48} />
      </mesh>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[0, -0.64 + index * 0.3, 0.32]}>
          <boxGeometry args={[0.33, 0.07, 0.02]} />
          <meshBasicMaterial color="#cba566" transparent opacity={0.34} />
        </mesh>
      ))}
    </group>
  );
}

function VillaVolume() {
  return (
    <group position={[-1.38, -0.6, -0.52]} rotation={[0, 0.24, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.14, 0.34, 0.8]} />
        <meshStandardMaterial color="#151515" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[0.2, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.19, 0.36]} />
        <meshStandardMaterial color="#191919" roughness={0.8} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.04, 0.4]}>
        <boxGeometry args={[0.88, 0.08, 0.02]} />
        <meshStandardMaterial color="#c59a55" emissive="#7d5828" emissiveIntensity={0.24} />
      </mesh>
    </group>
  );
}

function PropertyScene({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = damp(groupRef.current.rotation.y, -0.26 + mouse.current.x * 0.16, 0.03);
      groupRef.current.rotation.x = damp(groupRef.current.rotation.x, -0.04 + mouse.current.y * 0.045, 0.03);
    }

    state.camera.position.x = damp(state.camera.position.x, 0.06 + mouse.current.x * 0.18, 0.03);
    state.camera.position.y = damp(state.camera.position.y, 0.02 + mouse.current.y * 0.1, 0.03);
    state.camera.lookAt(0.32, 0.02, -0.04);

    if (spotlightRef.current) {
      spotlightRef.current.position.x = damp(spotlightRef.current.position.x, 1.9 + mouse.current.x * 0.7, 0.04);
      spotlightRef.current.position.y = damp(spotlightRef.current.position.y, 3.1 + mouse.current.y * 0.3, 0.04);
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#050505", 0.08]} />
      <ambientLight intensity={0.16} />
      <directionalLight position={[-3.4, 4.2, 1.8]} intensity={0.42} color="#f7ecd9" />
      <spotLight
        ref={spotlightRef}
        position={[1.9, 3.1, 2.7]}
        angle={0.34}
        penumbra={0.95}
        intensity={1.05}
        decay={1.2}
        distance={12}
        color="#efd29a"
      />
      <pointLight position={[-2.5, 1.1, 1.2]} intensity={0.18} color="#dce4ff" distance={7} />

      <Environment preset="warehouse" blur={0.94} />

      <mesh position={[0.7, 0.65, -3.6]}>
        <planeGeometry args={[6.8, 4.1]} />
        <meshBasicMaterial color="#090909" />
      </mesh>

      <FloorDeck />

      <group ref={groupRef} position={[0.62, 0.02, 0.08]}>
        <RetailPodium />
        <OfficeTower />
        <VillaVolume />
        <GoldArc />
        <GlassFin mouse={mouse} position={[0.04, 0.62, 0.56]} rotation={[0.05, -0.18, 0.02]} size={[0.1, 1.7, 0.56]} drift={0.2} />
        <GlassFin mouse={mouse} position={[1.45, 0.36, 0.16]} rotation={[-0.03, 0.16, 0.02]} size={[0.09, 1.5, 0.4]} drift={1.1} />
        <GlassFin mouse={mouse} position={[-0.9, 0.4, 0.18]} rotation={[0.04, -0.12, -0.02]} size={[0.08, 1.22, 0.34]} drift={2.2} />
      </group>

      <GoldParticles />

      <EffectComposer>
        <Bloom intensity={0.1} luminanceThreshold={0.94} luminanceSmoothing={0.2} mipmapBlur />
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation
          modulationOffset={0.84}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const onMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
        y: THREE.MathUtils.clamp(-((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1),
      };
    };

    const onLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    section.addEventListener("mousemove", onMove, { passive: true });
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      if (copyRef.current) {
        gsap.from(copyRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        });
      }

      if (stageRef.current) {
        gsap.from(stageRef.current, {
          opacity: 0,
          y: 28,
          scale: 0.98,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.16,
        });
      }

      if (metaRef.current) {
        gsap.from(metaRef.current.children, {
          y: 14,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.32,
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: 1,
        onUpdate: (self) => {
          if (copyRef.current) {
            gsap.set(copyRef.current, { y: self.progress * -16 });
          }

          if (stageRef.current) {
            gsap.set(stageRef.current, { y: self.progress * -12 });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: "100svh",
        background:
          "radial-gradient(circle at 18% 22%, hsl(40 46% 18% / 0.12), transparent 28%), radial-gradient(circle at 84% 74%, hsl(40 46% 18% / 0.08), transparent 24%), linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 4%) 52%, hsl(0 0% 3%) 100%)",
      }}
      data-section="hero"
    >
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,4,4,0.94)_0%,rgba(4,4,4,0.82)_30%,rgba(4,4,4,0.24)_58%,rgba(4,4,4,0.74)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,0.78)_0%,transparent_24%,transparent_78%,rgba(4,4,4,0.9)_100%)]" />
      </div>

      <div className="pointer-events-none absolute left-[2%] top-[18%] z-[2] hidden select-none xl:block" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200, fontSize: "clamp(4rem,8vw,7rem)", letterSpacing: "0.14em", lineHeight: 0.88, color: "transparent", WebkitTextStroke: "1px hsl(40 46% 56% / 0.06)" }}>
        ADDRESS
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1520px] items-center px-6 pb-10 pt-[116px] md:px-12 lg:px-16 lg:pt-[126px]">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(420px,0.92fr)_minmax(560px,1fr)] lg:gap-16">
          <div ref={copyRef} className="max-w-[660px]">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-16 bg-[linear-gradient(90deg,transparent,rgba(214,184,132,0.92))]" />
              <p className="text-[10px] uppercase tracking-[0.52em] md:text-[11px]" style={{ color: "rgba(214,184,132,0.92)", fontFamily: "'Inter', sans-serif" }}>
                Luxury Real Estate Advisory
              </p>
            </div>

            <h1 className="max-w-[10ch] text-[clamp(3.2rem,6vw,6.2rem)] leading-[0.9] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
              Curating the address before the market sees it.
            </h1>

            <p className="mt-6 max-w-[34rem] text-[1rem] leading-7 md:text-[1.08rem]" style={{ color: "rgba(235,231,224,0.82)", fontFamily: "'Cormorant Garamond', serif" }}>
              Saad Bin Zain works across prime retail, commercial offices, and private mandates with a quiet, high-conviction approach shaped by banking discipline and luxury real-estate execution.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {["Prime Retail", "Commercial Offices", "Private Mandates"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border px-4 py-2 text-[10px] uppercase md:text-[11px]"
                  style={{
                    borderColor: "rgba(214,184,132,0.18)",
                    background: "rgba(10,10,10,0.24)",
                    color: "rgba(214,184,132,0.88)",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.32em",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-4 border-t border-[rgba(214,184,132,0.12)] pt-6">
              {[
                { value: "20+", label: "Years of Precision" },
                { value: "37460", label: "RERA Registered" },
                { value: "3", label: "Dubai, London, Netherlands" },
              ].map((item) => (
                <div key={item.label} className="min-w-[118px]">
                  <div className="text-[clamp(1.8rem,2vw,2.4rem)] gold-text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
                    {item.value}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.24em]" style={{ color: "rgba(244,239,232,0.54)", fontFamily: "'Inter', sans-serif" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={stageRef} className="relative flex items-center justify-center lg:justify-end">
            <div
              className="relative h-[380px] w-full max-w-[820px] overflow-hidden rounded-[2.4rem] border sm:h-[430px] lg:h-[580px]"
              style={{
                borderColor: "rgba(214,184,132,0.14)",
                background: "linear-gradient(180deg, rgba(15,15,15,0.72), rgba(8,8,8,0.42))",
                boxShadow: "0 36px 120px rgba(0,0,0,0.34)",
              }}
            >
              <Canvas
                shadows
                camera={{ position: [0.06, 0.02, 7], fov: 31 }}
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl, scene }) => {
                  gl.toneMapping = THREE.ACESFilmicToneMapping;
                  gl.toneMappingExposure = 0.84;
                  gl.outputColorSpace = THREE.SRGBColorSpace;
                  gl.setClearColor("#040404", 1);
                  scene.background = new THREE.Color("#040404");
                }}
              >
                <PropertyScene mouse={mouseRef} />
              </Canvas>

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_36%,rgba(214,184,132,0.12),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.24))]" />

              <div ref={metaRef} className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                <div className="rounded-[1.3rem] border px-4 py-3 backdrop-blur-xl" style={{ borderColor: "rgba(214,184,132,0.14)", background: "rgba(8,8,8,0.34)" }}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border" style={{ borderColor: "rgba(214,184,132,0.16)" }}>
                      <img src={saadImage} alt="Saad Bin Zain" className="h-full w-full object-cover grayscale" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "rgba(244,239,232,0.84)", fontFamily: "'Inter', sans-serif" }}>
                        Saad Bin Zain
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(214,184,132,0.72)", fontFamily: "'Inter', sans-serif" }}>
                        Dubai | London | Netherlands
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.34em]" style={{ borderColor: "rgba(214,184,132,0.14)", color: "rgba(214,184,132,0.86)", background: "rgba(8,8,8,0.28)", fontFamily: "'Inter', sans-serif" }}>
                  RERA 37460
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;