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

const aberrationOffset = new THREE.Vector2(0.00028, 0.00045);

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
        color="#cba264"
        size={0.023}
        transparent
        opacity={0.38}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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
        <meshStandardMaterial color="#d4ab67" emissive="#8f632c" emissiveIntensity={0.52} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curveB, 180, 0.012, 8, false]} />
        <meshStandardMaterial color="#a57b45" emissive="#7f5c2f" emissiveIntensity={0.2} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function StageDisk() {
  return (
    <group position={[0, -1.22, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[2.65, 2.92, 0.24, 64]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.78} metalness={0.12} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.13, 0]}>
        <torusGeometry args={[2.36, 0.04, 24, 120]} />
        <meshStandardMaterial color="#c59d5c" emissive="#855f2c" emissiveIntensity={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
        <circleGeometry args={[4.8, 96]} />
        <meshBasicMaterial color="#060606" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function GlassPylon({
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
        <boxGeometry args={[0.52, 2.8, 0.34]} />
        <meshPhysicalMaterial
          color="#fdfdfd"
          transmission={1}
          roughness={0.03}
          thickness={3.8}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.04}
          attenuationColor="#ffffff"
          attenuationDistance={2.4}
          envMapIntensity={0.46}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh scale={[1.05, 1.02, 1.04]}>
        <boxGeometry args={[0.52, 2.8, 0.34]} />
        <meshBasicMaterial color="#d6ad6b" transparent opacity={0.035} depthWrite={false} />
      </mesh>
    </group>
  );
}

function PortraitMonolith() {
  const portraitTexture = useTexture(saadImage);

  useMemo(() => {
    portraitTexture.colorSpace = THREE.SRGBColorSpace;
    portraitTexture.minFilter = THREE.LinearFilter;
    portraitTexture.magFilter = THREE.LinearFilter;
  }, [portraitTexture]);

  return (
    <group position={[0, -0.04, 0.15]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.58, 2.72, 0.42]} />
        <meshStandardMaterial color="#111111" roughness={0.68} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.04, 0.222]}>
        <planeGeometry args={[1.24, 2.18]} />
        <meshBasicMaterial map={portraitTexture} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.04, 0.255]}>
        <planeGeometry args={[1.3, 2.24]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.02}
          thickness={1.4}
          ior={1.48}
          clearcoat={1}
          clearcoatRoughness={0.02}
          attenuationColor="#fff7ed"
          attenuationDistance={1.8}
          transparent
          opacity={0.28}
        />
      </mesh>
      <mesh position={[0, 1.52, 0.1]}>
        <boxGeometry args={[1.02, 0.04, 0.16]} />
        <meshStandardMaterial color="#c39a58" emissive="#875f2c" emissiveIntensity={0.38} />
      </mesh>
    </group>
  );
}

function PeripheralBlocks() {
  const blocks = [
    { position: [-1.9, -0.92, -0.86] as [number, number, number], size: [0.92, 0.42, 0.72] as [number, number, number], color: "#151515" },
    { position: [2, -0.84, -1.05] as [number, number, number], size: [1.24, 0.58, 0.9] as [number, number, number], color: "#131313" },
    { position: [-2.3, -0.36, 0.34] as [number, number, number], size: [0.38, 1.45, 0.34] as [number, number, number], color: "#171717" },
    { position: [2.36, -0.12, 0.26] as [number, number, number], size: [0.32, 1.82, 0.32] as [number, number, number], color: "#161616" },
  ];

  return (
    <group>
      {blocks.map((block) => (
        <mesh key={block.position.join(":")} position={block.position} castShadow receiveShadow>
          <boxGeometry args={block.size} />
          <meshStandardMaterial color={block.color} roughness={0.74} metalness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function ViewingRoomScene({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const stageRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (stageRef.current) {
      stageRef.current.rotation.y = ease(stageRef.current.rotation.y, mouse.current.x * 0.2, 0.03);
      stageRef.current.rotation.x = ease(stageRef.current.rotation.x, mouse.current.y * 0.08, 0.03);
      stageRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.04;
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = state.clock.elapsedTime * 0.12;
      haloRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.25;
    }

    state.camera.position.x = ease(state.camera.position.x, mouse.current.x * 0.22, 0.03);
    state.camera.position.y = ease(state.camera.position.y, 0.1 + mouse.current.y * 0.14, 0.03);
    state.camera.lookAt(0, -0.15, 0);
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#050505", 0.1]} />
      <ambientLight intensity={0.16} />
      <spotLight position={[0, 4.4, 3.6]} intensity={1.35} angle={0.34} penumbra={1} color="#f3ddb7" />
      <pointLight position={[-3.2, 1.2, 1.4]} intensity={0.24} color="#a7bbff" distance={10} />
      <pointLight position={[3.2, 1.4, 1.2]} intensity={0.18} color="#f8d7aa" distance={8} />
      <Environment preset="night" blur={0.92} />

      <mesh position={[0, 0.8, -5]}>
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      <mesh ref={haloRef} position={[0, 0.18, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.08, 0.05, 24, 160]} />
        <meshStandardMaterial color="#b98c4a" emissive="#8b632d" emissiveIntensity={0.3} transparent opacity={0.76} />
      </mesh>

      <group ref={stageRef}>
        <StageDisk />
        <PortraitMonolith />
        <PeripheralBlocks />
        <GlassPylon mouse={mouse} position={[-1.2, 0.1, 0.86]} rotation={[0.04, 0.28, -0.01]} scale={[1, 1, 1]} delay={0.2} />
        <GlassPylon mouse={mouse} position={[1.36, 0.04, 0.94]} rotation={[-0.03, -0.24, 0.02]} scale={[0.92, 1.1, 0.92]} delay={1.2} />
        <GlassPylon mouse={mouse} position={[0.02, 0.38, -0.98]} rotation={[0, 0.06, 0]} scale={[0.74, 0.9, 0.74]} delay={2.1} />
      </group>

      <LightRibbons />
      <DustField />

      <EffectComposer>
        <Bloom intensity={0.22} luminanceThreshold={0.86} luminanceSmoothing={0.26} mipmapBlur />
        <ChromaticAberration offset={aberrationOffset} radialModulation modulationOffset={0.8} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const topRailRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stageShellRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);
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
      if (topRailRef.current) {
        gsap.from(topRailRef.current.children, {
          opacity: 0,
          y: -18,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        });
      }

      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.12,
        });
      }

      if (stageShellRef.current) {
        gsap.from(stageShellRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 36,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.18,
        });
      }

      if (editorialRef.current) {
        gsap.from(editorialRef.current.children, {
          opacity: 0,
          y: 22,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.32,
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=110%",
        scrub: 1,
        onUpdate: (self) => {
          if (stageShellRef.current) {
            gsap.set(stageShellRef.current, { y: self.progress * -18 });
          }

          if (titleRef.current) {
            gsap.set(titleRef.current, { y: self.progress * -12 });
          }

          if (editorialRef.current) {
            gsap.set(editorialRef.current, { y: self.progress * -10 });
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
          "radial-gradient(circle at 50% 12%, rgba(170,126,67,0.18), transparent 24%), radial-gradient(circle at 14% 72%, rgba(107,82,43,0.12), transparent 28%), radial-gradient(circle at 84% 68%, rgba(107,82,43,0.12), transparent 26%), linear-gradient(180deg, #040404 0%, #060606 58%, #040404 100%)",
      }}
      data-section="hero"
    >
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,0.82)_0%,rgba(4,4,4,0.24)_34%,rgba(4,4,4,0.22)_70%,rgba(4,4,4,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(214,184,132,0.08),transparent_28%)]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[18%] z-[2] hidden justify-center lg:flex">
        <div
          className="select-none text-center uppercase"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 200,
            letterSpacing: "0.18em",
            fontSize: "clamp(5rem, 12vw, 11rem)",
            lineHeight: 0.84,
            color: "transparent",
            WebkitTextStroke: "1px rgba(214,184,132,0.08)",
          }}
        >
          PRIVATE OFFICE
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1540px] flex-col px-6 pb-8 pt-[108px] md:px-10 lg:px-14 lg:pt-[118px]">
        <div ref={topRailRef} className="grid gap-4 text-[10px] uppercase tracking-[0.34em] text-white/70 md:grid-cols-3 md:text-[11px]" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[rgba(214,184,132,0.8)]" />
            <span className="text-[rgba(214,184,132,0.92)]">Saad Bin Zain</span>
          </div>
          <div className="text-center text-white/55">Prime Retail • Commercial Offices • Private Mandates</div>
          <div className="text-left text-white/55 md:text-right">Dubai • London • Netherlands</div>
        </div>

        <div ref={titleRef} className="relative mt-8 flex flex-col items-center text-center lg:mt-10">
          <p className="max-w-[760px] text-[10px] uppercase tracking-[0.52em] md:text-[11px]" style={{ color: "rgba(214,184,132,0.92)", fontFamily: "'Inter', sans-serif" }}>
            Discreet advisory for landmark space, curated capital, and category-defining addresses
          </p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(3.1rem,6vw,6.8rem)] leading-[0.88] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
            Where exceptional real estate is privately introduced.
          </h1>
        </div>

        <div ref={stageShellRef} className="relative mt-6 min-h-[360px] flex-1 md:min-h-[420px] lg:min-h-[520px]">
          <div className="absolute inset-0 rounded-[2.8rem] border border-[rgba(214,184,132,0.1)] bg-[linear-gradient(180deg,rgba(10,10,10,0.16),rgba(10,10,10,0.02))]" />
          <Canvas
            shadows
            camera={{ position: [0, 0.1, 7.2], fov: 28 }}
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
            <ViewingRoomScene mouse={mouseRef} />
          </Canvas>
          <div className="pointer-events-none absolute inset-0 rounded-[2.8rem] bg-[radial-gradient(circle_at_50%_42%,rgba(214,184,132,0.1),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%,transparent_76%,rgba(0,0,0,0.22)_100%)]" />
        </div>

        <div
          ref={editorialRef}
          className="mt-6 grid gap-6 rounded-[2rem] border border-[rgba(214,184,132,0.12)] bg-[rgba(8,8,8,0.42)] px-5 py-5 backdrop-blur-xl md:grid-cols-[1.3fr_0.9fr_0.9fr] md:px-7 lg:mt-7 lg:px-8"
        >
          <div>
            <p className="max-w-[34rem] text-[1rem] leading-7 text-white/76 md:text-[1.06rem]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Banking precision. Luxury retail fluency. Cross-border judgment. The mandate is not volume. It is placement, timing, and access to the right room before attention becomes public.
            </p>
          </div>

          <div className="border-t border-[rgba(214,184,132,0.1)] pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="text-[2.1rem] gold-text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
              20+
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/52" style={{ fontFamily: "'Inter', sans-serif" }}>
              Years across private banking and real estate
            </p>
          </div>

          <div className="border-t border-[rgba(214,184,132,0.1)] pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="text-[2.1rem] gold-text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 200 }}>
              37460
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/52" style={{ fontFamily: "'Inter', sans-serif" }}>
              RERA registration with international reach
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;