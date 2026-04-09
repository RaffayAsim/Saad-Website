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

const chromaticOffset = new THREE.Vector2(0.00014, 0.0002);

function lerp(current: number, target: number, alpha: number) {
  return current + (target - current) * alpha;
}

function DustField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 160;
    const array = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      array[index * 3] = (Math.random() - 0.5) * 9;
      array[index * 3 + 1] = Math.random() * 3.4 - 1.1;
      array[index * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return array;
  }, []);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = state.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#d6ad64"
        size={0.026}
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlassPanel({
  mouse,
  position,
  rotation,
  size,
  offset,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  offset: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.45 + offset) * 0.04;
    ref.current.rotation.x = rotation[0] + mouse.current.y * 0.045;
    ref.current.rotation.y = rotation[1] + mouse.current.x * 0.07 + Math.cos(t * 0.3 + offset) * 0.015;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.05}
          ior={1.52}
          thickness={2.6}
          attenuationColor="#ffffff"
          attenuationDistance={3}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={0.32}
          transparent
          opacity={0.74}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh scale={[1.012, 1.012, 1.04]}>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#d8b069" transparent opacity={0.025} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ModelFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, -0.92, -0.08]} receiveShadow>
        <planeGeometry args={[11.5, 11.5]} />
        <meshStandardMaterial color="#0b0b0b" roughness={0.92} metalness={0.04} />
      </mesh>
      <gridHelper args={[11.5, 11, 0x4f3e23, 0x13100b]} position={[0.3, -0.9, -0.08]} />
    </>
  );
}

function RetailBar() {
  return (
    <group position={[-0.25, -0.53, 0.18]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.35, 0.5, 1.2]} />
        <meshStandardMaterial color="#171717" roughness={0.76} metalness={0.12} />
      </mesh>
      <mesh position={[0.02, 0.16, 0.49]}>
        <boxGeometry args={[2.0, 0.04, 0.12]} />
        <meshStandardMaterial color="#c59a55" emissive="#7d5828" emissiveIntensity={0.35} />
      </mesh>
      {Array.from({ length: 7 }).map((_, index) => (
        <mesh key={index} position={[-0.8 + index * 0.24, -0.01, 0.61]}>
          <boxGeometry args={[0.13, 0.2, 0.02]} />
          <meshBasicMaterial color="#d9b26a" transparent opacity={0.46} />
        </mesh>
      ))}
    </group>
  );
}

function OfficeTower() {
  return (
    <group position={[1.2, -0.02, -0.62]} rotation={[0, -0.08, 0]}>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 2.25, 0.62]} />
        <meshStandardMaterial color="#171717" roughness={0.68} metalness={0.18} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 1.62, 0.48]} />
        <meshStandardMaterial color="#171717" roughness={0.68} metalness={0.18} />
      </mesh>
      <mesh position={[0.16, 0.95, 0.31]}>
        <boxGeometry args={[0.028, 2.9, 0.028]} />
        <meshStandardMaterial color="#d7ac62" emissive="#8f662f" emissiveIntensity={0.48} />
      </mesh>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[0, -0.62 + index * 0.29, 0.31]}>
          <boxGeometry args={[0.31, 0.07, 0.02]} />
          <meshBasicMaterial color="#c9a264" transparent opacity={0.34} />
        </mesh>
      ))}
    </group>
  );
}

function PrivateVilla() {
  return (
    <group position={[-1.45, -0.58, -0.56]} rotation={[0, 0.25, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.34, 0.82]} />
        <meshStandardMaterial color="#141414" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[0.22, 0.22, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.2, 0.38]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.05, 0.42]}>
        <boxGeometry args={[0.9, 0.09, 0.02]} />
        <meshStandardMaterial color="#c59a55" emissive="#7d5828" emissiveIntensity={0.24} />
      </mesh>
    </group>
  );
}

function GoldArc() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.1, -0.58, 0.72),
        new THREE.Vector3(-0.3, -0.32, 0.18),
        new THREE.Vector3(0.5, -0.18, -0.05),
        new THREE.Vector3(1.15, -0.02, -0.22),
        new THREE.Vector3(1.85, 0.14, -0.52),
      ]),
    [],
  );

  return (
    <mesh position={[0.12, -0.02, 0.08]} rotation={[0, -0.14, 0]}>
      <tubeGeometry args={[curve, 120, 0.015, 10, false]} />
      <meshStandardMaterial color="#d8ae63" emissive="#8b612b" emissiveIntensity={0.42} />
    </mesh>
  );
}

function PropertyStage({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, -0.28 + mouse.current.x * 0.14, 0.03);
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, -0.04 + mouse.current.y * 0.045, 0.03);
    }

    state.camera.position.x = lerp(state.camera.position.x, 0.05 + mouse.current.x * 0.22, 0.03);
    state.camera.position.y = lerp(state.camera.position.y, 0.04 + mouse.current.y * 0.12, 0.03);
    state.camera.lookAt(0.35, 0.02, -0.08);

    if (spotRef.current) {
      spotRef.current.position.x = lerp(spotRef.current.position.x, 2 + mouse.current.x * 0.8, 0.04);
      spotRef.current.position.y = lerp(spotRef.current.position.y, 3.2 + mouse.current.y * 0.3, 0.04);
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#050505", 0.08]} />
      <ambientLight intensity={0.16} />
      <directionalLight position={[-3.5, 4.4, 2]} intensity={0.45} color="#f6ead8" />
      <spotLight
        ref={spotRef}
        position={[2, 3.2, 2.8]}
        angle={0.34}
        penumbra={0.95}
        intensity={1.15}
        distance={13}
        decay={1.2}
        color="#f0d39c"
      />
      <pointLight position={[-2.8, 1.3, 1.2]} intensity={0.2} color="#dce4ff" distance={8} />

      <Environment preset="warehouse" blur={0.94} />

      <mesh position={[0.8, 0.65, -3.7]}>
        <planeGeometry args={[7, 4.2]} />
        <meshBasicMaterial color="#090909" />
      </mesh>

      <ModelFloor />

      <group ref={groupRef} position={[0.65, -0.02, 0.1]}>
        <RetailBar />
        <OfficeTower />
        <PrivateVilla />
        <GoldArc />
        <GlassPanel mouse={mouse} position={[0.08, 0.64, 0.56]} rotation={[0.05, -0.2, 0.02]} size={[0.1, 1.75, 0.62]} offset={0.1} />
        <GlassPanel mouse={mouse} position={[1.52, 0.38, 0.15]} rotation={[-0.03, 0.16, 0.02]} size={[0.1, 1.55, 0.44]} offset={1.3} />
        <GlassPanel mouse={mouse} position={[-0.95, 0.42, 0.22]} rotation={[0.04, -0.12, -0.02]} size={[0.08, 1.28, 0.38]} offset={2.1} />
      </group>

      <DustField />

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const stageMetaRef = useRef<HTMLDivElement>(null);
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
          y: 18,
          opacity: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
        });
      }

      if (canvasRef.current) {
        gsap.from(canvasRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 1.2,
          ease: "power3.out",
        });
      }

      if (stageMetaRef.current) {
        gsap.from(stageMetaRef.current.children, {
          y: 12,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.18,
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: 1,
        onUpdate: (self) => {
          if (copyRef.current) {
            gsap.set(copyRef.current, { y: self.progress * -18 });
          }

          if (canvasRef.current) {
            gsap.set(canvasRef.current, { y: self.progress * -14 });
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
          "radial-gradient(circle at 14% 18%, hsl(40 46% 14% / 0.12), transparent 28%), radial-gradient(circle at 82% 78%, hsl(40 46% 18% / 0.08), transparent 24%), linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 4%) 45%, hsl(0 0% 3%) 100%)",
      }}
      data-section="hero"
    >
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,4,4,0.95)_0%,rgba(4,4,4,0.78)_34%,rgba(4,4,4,0.2)_60%,rgba(4,4,4,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,0.8)_0%,transparent_24%,transparent_76%,rgba(4,4,4,0.92)_100%)]" />
      </div>

      <div className="pointer-events-none absolute left-[-1%] top-[16%] z-[2] hidden select-none lg:block" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(4rem,10vw,8rem)", fontWeight: 200, letterSpacing: "0.16em", lineHeight: 0.9, color: "transparent", WebkitTextStroke: "1px hsl(40 46% 56% / 0.06)" }}>
        MONOGRAPH
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] items-center px-6 pb-10 pt-[118px] md:px-12 lg:px-16 lg:pt-[126px]">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(380px,0.9fr)_minmax(520px,1fr)] lg:gap-16">
          <div ref={copyRef} className="max-w-[620px]">
            <div className="mb-5 flex items-center gap-4">
              <div className="h-px w-14 bg-[linear-gradient(90deg,transparent,rgba(214,184,132,0.9))]" />
              <p className="text-[10px] uppercase tracking-[0.52em] md:text-[11px]" style={{ color: "rgba(214,184,132,0.92)", fontFamily: "'Inter', sans-serif" }}>
                Luxury Real Estate Advisory
              </p>
            </div>

            <h1 className="text-[clamp(3rem,6vw,5.9rem)] leading-[0.92] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
              Prime retail,
              <br />
              office placement,
              <br />
              <span className="gold-text-gradient">private-office strategy.</span>
            </h1>

            <p className="mt-6 max-w-[35rem] text-[1rem] leading-7 md:text-[1.08rem]" style={{ color: "rgba(235,231,224,0.82)", fontFamily: "'Cormorant Garamond', serif" }}>
              Saad Bin Zain advises landmark retail, commercial assets, and investor-led property positioning with the calm presentation of a private office and the precision of institutional real estate.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "Prime Retail",
                "Commercial Assets",
                "Private Office",
              ].map((item) => (
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

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { value: "20+", label: "Years of Precision" },
                { value: "37460", label: "RERA Registered" },
                { value: "3", label: "Dubai, London, Netherlands" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.2rem] border px-4 py-4"
                  style={{
                    borderColor: "rgba(214,184,132,0.12)",
                    background: "linear-gradient(135deg, rgba(10,10,10,0.42), rgba(8,8,8,0.16))",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-[clamp(1.7rem,2vw,2.2rem)] gold-text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
                    {item.value}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(244,239,232,0.56)", fontFamily: "'Inter', sans-serif" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div
              ref={canvasRef}
              className="relative h-[360px] w-full max-w-[780px] overflow-hidden rounded-[2rem] border sm:h-[420px] lg:h-[520px]"
              style={{
                borderColor: "rgba(214,184,132,0.14)",
                background: "linear-gradient(180deg, rgba(15,15,15,0.7), rgba(8,8,8,0.4))",
                boxShadow: "0 36px 120px rgba(0,0,0,0.34)",
              }}
            >
              <Canvas
                shadows
                camera={{ position: [0.05, 0.04, 7.2], fov: 31 }}
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
                <PropertyStage mouse={mouseRef} />
              </Canvas>

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(214,184,132,0.1),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.24))]" />

              <div ref={stageMetaRef} className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                <div className="rounded-[1.2rem] border px-4 py-3 backdrop-blur-xl" style={{ borderColor: "rgba(214,184,132,0.14)", background: "rgba(8,8,8,0.34)" }}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border" style={{ borderColor: "rgba(214,184,132,0.16)" }}>
                      <img src={saadImage} alt="Saad Bin Zain" className="h-full w-full object-cover grayscale" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "rgba(244,239,232,0.84)", fontFamily: "'Inter', sans-serif" }}>
                        Saad Bin Zain
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.24em]" style={{ color: "rgba(214,184,132,0.72)", fontFamily: "'Inter', sans-serif" }}>
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