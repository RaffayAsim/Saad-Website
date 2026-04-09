import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import saadImage from "@/assets/saad-bin-zain-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const aberrationOffset = new THREE.Vector2(0.0002, 0.00032);
const NAVBAR_HEIGHT = 88;

function ease(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

function DustField() {
  const ref = useRef<THREE.Points>(null);
  const points = useMemo(() => {
    const count = 320;
    const buffer = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      buffer[index * 3] = (Math.random() - 0.5) * 12;
      buffer[index * 3 + 1] = (Math.random() - 0.5) * 7;
      buffer[index * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    return buffer;
  }, []);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={points} count={points.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#b89157"
        size={0.023}
        transparent
        opacity={0.28}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AtriumPillars({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Group>(null);
  const pillars = useMemo(
    () => [
      { position: [-2.8, -0.12, -1.3] as [number, number, number], height: 3.7, width: 0.28, depth: 0.28, tone: "stone" as const },
      { position: [-1.9, -0.08, -0.7] as [number, number, number], height: 4.3, width: 0.2, depth: 0.2, tone: "gold" as const },
      { position: [-0.9, -0.2, -1.15] as [number, number, number], height: 3.4, width: 0.34, depth: 0.34, tone: "stone" as const },
      { position: [0.25, -0.18, -1.55] as [number, number, number], height: 4.9, width: 0.18, depth: 0.18, tone: "gold" as const },
      { position: [1.35, -0.12, -0.95] as [number, number, number], height: 3.9, width: 0.28, depth: 0.28, tone: "stone" as const },
      { position: [2.35, -0.08, -0.45] as [number, number, number], height: 4.4, width: 0.22, depth: 0.22, tone: "gold" as const },
    ],
    [],
  );

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = ease(ref.current.rotation.y, mouse.current.x * 0.08, 0.02);
    ref.current.position.x = ease(ref.current.position.x, mouse.current.x * -0.18, 0.02);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
  });

  return (
    <group ref={ref}>
      {pillars.map((pillar) => {
        const isGold = pillar.tone === "gold";
        return (
          <group key={pillar.position.join(":")} position={pillar.position}>
            <mesh castShadow receiveShadow position={[0, pillar.height / 2 - 1.4, 0]}>
              <boxGeometry args={[pillar.width, pillar.height, pillar.depth]} />
              <meshStandardMaterial
                color={isGold ? "#af8444" : "#2a2724"}
                roughness={isGold ? 0.34 : 0.9}
                metalness={isGold ? 0.72 : 0.08}
                emissive={isGold ? "#65451e" : "#111111"}
                emissiveIntensity={isGold ? 0.18 : 0.04}
              />
            </mesh>
            <mesh position={[0, -1.16, 0]} receiveShadow>
              <cylinderGeometry args={[pillar.width * 1.35, pillar.width * 1.55, 0.22, 32]} />
              <meshStandardMaterial color="#111111" roughness={0.82} metalness={0.14} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function LightRibbons() {
  const ref = useRef<THREE.Group>(null);
  const curveA = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.5, -0.4, 1.6),
        new THREE.Vector3(-1.2, -0.15, 0.4),
        new THREE.Vector3(0, 0.15, -0.1),
        new THREE.Vector3(1.35, 0.3, -0.4),
        new THREE.Vector3(2.4, 0.55, -1.25),
      ]),
    [],
  );
  const curveB = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.15, 0.8, -0.8),
        new THREE.Vector3(-0.7, 0.58, -0.35),
        new THREE.Vector3(0.15, 0.1, 0.15),
        new THREE.Vector3(1.15, -0.42, 0.35),
        new THREE.Vector3(2.2, -0.86, 0.72),
      ]),
    [],
  );

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <group ref={ref}>
      <mesh>
        <tubeGeometry args={[curveA, 180, 0.018, 10, false]} />
        <meshStandardMaterial color="#c19a5c" emissive="#7a5425" emissiveIntensity={0.32} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curveB, 180, 0.012, 8, false]} />
        <meshStandardMaterial color="#7d6542" emissive="#6f4c24" emissiveIntensity={0.1} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function AtriumFloor() {
  return (
    <group position={[0, -1.24, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.6, 96]} />
        <meshStandardMaterial color="#0b0b0b" roughness={0.96} metalness={0.06} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.6, 2.8, 96]} />
        <meshStandardMaterial color="#b88d4f" emissive="#7f5828" emissiveIntensity={0.18} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[11, 11]} />
        <meshBasicMaterial color="#050505" transparent opacity={0.94} />
      </mesh>
    </group>
  );
}

function GlassSlabPortrait({
  position,
  rotation,
  scale,
  mouse,
  delay,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  mouse: MutableRefObject<{ x: number; y: number }>;
  delay: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const portraitTexture = useTexture(saadImage);

  useMemo(() => {
    portraitTexture.colorSpace = THREE.SRGBColorSpace;
    portraitTexture.minFilter = THREE.LinearFilter;
    portraitTexture.magFilter = THREE.LinearFilter;
  }, [portraitTexture]);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(time * 0.48 + delay) * 0.06;
    ref.current.rotation.y = rotation[1] + mouse.current.x * 0.12 + Math.cos(time * 0.28 + delay) * 0.04;
    ref.current.rotation.x = rotation[0] + mouse.current.y * 0.05;
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.46, 4.1, 0.26]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.02}
          thickness={2.6}
          ior={1.48}
          clearcoat={1}
          clearcoatRoughness={0.03}
          attenuationColor="#ffffff"
          attenuationDistance={1.9}
          envMapIntensity={0.3}
          transparent
          opacity={0.56}
        />
      </mesh>
      <mesh position={[0, 0, 0.14]}>
        <planeGeometry args={[1.06, 3.22]} />
        <meshBasicMaterial map={useTexture(saadImage)} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.17]}>
        <planeGeometry args={[1.12, 3.3]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.02}
          thickness={0.9}
          ior={1.48}
          clearcoat={1}
          clearcoatRoughness={0.02}
          attenuationColor="#fff7ed"
          attenuationDistance={1.1}
          transparent
          opacity={0.2}
        />
      </mesh>
      <mesh scale={[1.04, 1.02, 1.08]}>
        <boxGeometry args={[1.46, 4.1, 0.26]} />
        <meshBasicMaterial color="#d4ad6b" transparent opacity={0.03} depthWrite={false} />
      </mesh>
    </group>
  );
}

function PortraitTexturePlane() {
  const portraitTexture = useTexture(saadImage);

  useMemo(() => {
    portraitTexture.colorSpace = THREE.SRGBColorSpace;
    portraitTexture.minFilter = THREE.LinearFilter;
    portraitTexture.magFilter = THREE.LinearFilter;
  }, [portraitTexture]);

  return <primitive object={portraitTexture} />;
}

function AtriumScene({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const textParallaxRef = useRef<THREE.Group>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const slabRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textParallaxRef.current) {
      textParallaxRef.current.rotation.y = ease(textParallaxRef.current.rotation.y, mouse.current.x * 0.04, 0.03);
      textParallaxRef.current.position.x = ease(textParallaxRef.current.position.x, mouse.current.x * 0.08, 0.03);
    }

    if (slabRef.current) {
      slabRef.current.rotation.y = ease(slabRef.current.rotation.y, -0.18 + mouse.current.x * 0.08, 0.03);
      slabRef.current.rotation.x = ease(slabRef.current.rotation.x, mouse.current.y * 0.03, 0.03);
      slabRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.04;
    }

    state.camera.position.x = ease(state.camera.position.x, mouse.current.x * 0.14, 0.02);
    state.camera.position.y = ease(state.camera.position.y, 0.08 + mouse.current.y * 0.08, 0.02);
    state.camera.lookAt(0.52, -0.08, 0);

    if (spotlightRef.current) {
      spotlightRef.current.position.x = ease(spotlightRef.current.position.x, 1.1 + mouse.current.x * 1.4, 0.05);
      spotlightRef.current.position.y = ease(spotlightRef.current.position.y, 2.8 + mouse.current.y * 0.65, 0.05);
      spotlightRef.current.target.position.x = ease(spotlightRef.current.target.position.x, 0.9 + mouse.current.x * 0.85, 0.05);
      spotlightRef.current.target.position.y = ease(spotlightRef.current.target.position.y, 0.45 + mouse.current.y * 0.3, 0.05);
      spotlightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#060606", 0.095]} />
      <ambientLight intensity={0.12} />
        <meshBasicMaterial map={portraitTexture} transparent toneMapped={false} />
      <spotLight
        ref={spotlightRef}
        position={[1.1, 2.8, 3.4]}
        intensity={0.78}
        angle={0.3}
        penumbra={1}
        distance={12}
        decay={1.2}
        color="#e6c483"
      />
      <pointLight position={[2.9, 0.85, 1.2]} intensity={0.16} color="#dcb06a" distance={6} />
      <Environment preset="warehouse" blur={0.95} />

      <mesh position={[0, 0.4, -5]}>
        <planeGeometry args={[13, 8]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      <AtriumFloor />
      <EffectComposer>
        <Bloom intensity={0.14} luminanceThreshold={0.9} luminanceSmoothing={0.24} mipmapBlur />
        <ChromaticAberration offset={aberrationOffset} radialModulation modulationOffset={0.8} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const slabShellRef = useRef<HTMLDivElement>(null);
  const stageFadeRef = useRef<HTMLDivElement>(null);
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
      if (textColumnRef.current) {
        gsap.from(textColumnRef.current.children, {
          opacity: 0,
          y: 26,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.08,
        });
      }

      if (slabShellRef.current) {
        gsap.from(slabShellRef.current, {
          opacity: 0,
          scale: 0.94,
          y: 28,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.22,
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (contentRef.current) {
            gsap.set(contentRef.current, { y: self.progress * -36 });
          }

          if (textColumnRef.current) {
            gsap.set(textColumnRef.current, { y: self.progress * -20 });
          }

          if (stageFadeRef.current) {
            gsap.set(stageFadeRef.current, {
              scale: 1 - self.progress * 0.1,
              opacity: 1 - self.progress,
              transformOrigin: "50% 50%",
            });
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
        height: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 18% 30%, rgba(171,129,69,0.14), transparent 26%), radial-gradient(circle at 78% 26%, rgba(171,129,69,0.12), transparent 22%), linear-gradient(180deg, #040404 0%, #050505 56%, #030303 100%)",
      }}
      data-section="hero"
    >
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,0.82)_0%,rgba(4,4,4,0.24)_34%,rgba(4,4,4,0.22)_70%,rgba(4,4,4,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(214,184,132,0.08),transparent_28%)]" />
      </div>

      <div ref={stageFadeRef} className="absolute inset-0 z-[2]">
        <div className="absolute inset-0">
          <Canvas
            shadows
            camera={{ position: [0.16, 0.08, 7.4], fov: 29 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl, scene }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 0.78;
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.setClearColor("#040404", 1);
              scene.background = new THREE.Color("#040404");
            }}
          >
            <AtriumScene mouse={mouseRef} />
          </Canvas>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(4,4,4,0.9)_0%,rgba(4,4,4,0.7)_32%,rgba(4,4,4,0.16)_56%,rgba(4,4,4,0.52)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[4] bg-[linear-gradient(180deg,rgba(4,4,4,0.82)_0%,rgba(4,4,4,0.14)_30%,rgba(4,4,4,0.12)_68%,rgba(4,4,4,0.88)_100%)]" />

      <div ref={contentRef} className="relative z-10 h-full px-6 md:px-10 lg:px-14" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
        <div className="mx-auto grid h-full max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-[60%_40%]">
          <div ref={textColumnRef} className="max-w-[42rem] pt-8 lg:pt-0">
            <p className="text-[clamp(0.7rem,1vw,0.82rem)] uppercase tracking-[0.5em]" style={{ color: "rgba(214,184,132,0.9)", fontFamily: "'Inter', sans-serif" }}>
              SAAD BIN ZAIN
            </p>
            <h1 className="mt-6 text-[clamp(2.7rem,7vw,5.4rem)] leading-[0.9] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
              Immersive luxury command.
            </h1>
            <p className="mt-6 max-w-[32rem] text-[clamp(1rem,1.7vw,1.2rem)] leading-[1.65] text-white/74" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              An architectural atrium of advisory, where landmark retail, office strategy, and private market access are composed with banking discipline and luxury precision.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Prime Retail", "Commercial Offices", "Private Office"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border px-4 py-2 text-[clamp(0.62rem,0.9vw,0.72rem)] uppercase tracking-[0.32em]"
                  style={{
                    borderColor: "rgba(214,184,132,0.2)",
                    background: "rgba(10,10,10,0.24)",
                    color: "rgba(214,184,132,0.88)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid max-w-[30rem] grid-cols-2 gap-6 border-t border-[rgba(214,184,132,0.12)] pt-6">
              <div>
                <div className="text-[clamp(1.8rem,3vw,2.5rem)] gold-text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
                  20+
                </div>
                <p className="mt-1 text-[clamp(0.62rem,0.9vw,0.72rem)] uppercase tracking-[0.28em] text-white/52" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Years of cross-sector advisory
                </p>
              </div>
              <div>
                <div className="text-[clamp(1.8rem,3vw,2.5rem)] gold-text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
                  37460
                </div>
                <p className="mt-1 text-[clamp(0.62rem,0.9vw,0.72rem)] uppercase tracking-[0.28em] text-white/52" style={{ fontFamily: "'Inter', sans-serif" }}>
                  RERA registration
                </p>
              </div>
            </div>
          </div>

          <div className="relative hidden h-full items-center justify-end lg:flex">
            <div ref={slabShellRef} className="relative ml-auto flex w-[30vw] max-w-[360px] min-w-[280px] items-center justify-center" style={{ height: "70vh", maxHeight: "70vh" }}>
              <div className="absolute inset-0 rounded-[2rem] border border-[rgba(214,184,132,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] backdrop-blur-[2px]" />
              <div className="absolute inset-x-8 top-6 h-px bg-[linear-gradient(90deg,transparent,rgba(214,184,132,0.76),transparent)]" />
              <div className="absolute inset-x-8 bottom-6 h-px bg-[linear-gradient(90deg,transparent,rgba(214,184,132,0.42),transparent)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;