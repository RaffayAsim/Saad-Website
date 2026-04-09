import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, useTexture } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import saadImage from "@/assets/saad-bin-zain-2.jpg";

gsap.registerPlugin(ScrollTrigger);

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

const waveVertex = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uFlatten;
  varying vec2 vUv;
  varying float vHeight;

  float waveFn(vec2 p, float t) {
    float a = sin(p.x * 1.6 + t * 0.28) * 0.9;
    float b = cos(p.y * 1.2 - t * 0.22) * 0.7;
    float c = sin((p.x + p.y) * 1.1 + t * 0.18) * 0.55;
    return (a + b + c) * 0.55;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float mouseRipple = 1.0 - smoothstep(0.0, 0.42, distance(uv, uMouse * 0.5 + 0.5));
    float wave = waveFn(pos.xz * 0.55, uTime);
    wave += mouseRipple * 0.8;

    float amp = 1.15 * (1.0 - uFlatten);
    pos.y += wave * amp;

    vHeight = wave * (1.0 - uFlatten);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waveFragment = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vHeight;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1., 0.));
    float c = hash(i + vec2(0., 1.));
    float d = hash(i + vec2(1., 1.));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 p = vUv * 8.0;
    p.x += sin(vUv.y * 10.0 + uTime * 0.13) * 0.25;
    p.y += cos(vUv.x * 8.0 - uTime * 0.11) * 0.22;

    float marble = noise(p) * 0.65 + noise(p * 1.9) * 0.35;
    float veins = smoothstep(0.58, 0.9, marble + sin(vUv.x * 16.0 + uTime * 0.18) * 0.08);

    float peak = smoothstep(0.18, 0.95, vHeight + 0.25);
    float valley = 1.0 - peak;

    float dMouse = distance(vUv, uMouse * 0.5 + 0.5);
    float cursorLight = exp(-dMouse * dMouse * 11.5);

    vec3 obsidian = vec3(0.03, 0.035, 0.04);
    vec3 marbleGray = vec3(0.12, 0.13, 0.15);
    vec3 gold = vec3(0.79, 0.65, 0.36);

    vec3 valleyColor = mix(obsidian, marbleGray, veins * 0.45);
    vec3 peakColor = mix(vec3(0.24, 0.19, 0.12), gold, 0.78);

    vec3 color = mix(valleyColor, peakColor, peak);
    color += gold * cursorLight * (0.35 + peak * 0.9);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const dustVertex = `
  attribute float aScale;
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vDepth;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(0.2, vDepth));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const dustFragment = `
  precision highp float;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.06, d);
    float blur = smoothstep(0.5, 0.2, d) * (1.0 - smoothstep(1.5, 8.0, vDepth));

    vec3 gold = vec3(0.773, 0.627, 0.349);
    vec3 color = gold * (core + blur * 0.45);

    gl_FragColor = vec4(color, core * 0.88 + blur * 0.14);
  }
`;

function CursorLight({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef(new THREE.Object3D());

  useFrame(() => {
    if (!spotRef.current) return;

    const tx = mouse.current.x * 7;
    const ty = mouse.current.y * 4;

    spotRef.current.position.x += (tx - spotRef.current.position.x) * 0.08;
    spotRef.current.position.y += (ty + 2.4 - spotRef.current.position.y) * 0.08;
    spotRef.current.position.z = 6.6;

    targetRef.current.position.x += (mouse.current.x * 3.5 - targetRef.current.position.x) * 0.1;
    targetRef.current.position.y += (mouse.current.y * 2.3 - targetRef.current.position.y) * 0.1;
    targetRef.current.position.z = -1.2;

    spotRef.current.target = targetRef.current;
    spotRef.current.target.updateMatrixWorld();
  });

  return (
    <>
      <primitive object={targetRef.current} />
      <spotLight
        ref={spotRef}
        intensity={3.1}
        angle={0.42}
        penumbra={0.95}
        distance={36}
        decay={1.32}
        color="#f4ddaf"
      />
      <pointLight position={[5.5, 1.4, 2.2]} intensity={0.95} color="#f1d59f" distance={9} />
    </>
  );
}

function LiquidGoldWaves({
  mouse,
  progress,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  progress: MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uFlatten: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    if (!matRef.current) return;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.current.x, mouse.current.y), 0.08);
    uniforms.uFlatten.value += (progress.current - uniforms.uFlatten.value) * 0.07;
  });

  return (
    <group position={[0, -2.6, -3.8]} rotation={[-Math.PI / 2.58, 0, 0]}>
      <mesh>
        <planeGeometry args={[34, 24, 220, 220]} />
        <meshStandardMaterial color="#060708" roughness={0.86} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <planeGeometry args={[34, 24, 220, 220]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={waveVertex}
          fragmentShader={waveFragment}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  );
}

function CurlGoldDust({
  mouse,
  progress,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  progress: MutableRefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 5200;

  const velocity = useMemo(() => new Float32Array(count * 3), []);

  const { positions, scales } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 22;
      p[i * 3 + 1] = (Math.random() - 0.5) * 11;
      p[i * 3 + 2] = (Math.random() - 0.5) * 17;
      s[i] = 0.55 + Math.random() * 1.35;
    }

    return { positions: p, scales: s };
  }, []);

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: 0.7 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const arr = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    const t = state.clock.elapsedTime;

    const attractX = mouse.current.x * 4.1;
    const attractY = mouse.current.y * 2.2;

    for (let i = 0; i < count; i++) {
      const px = arr[i * 3];
      const py = arr[i * 3 + 1];
      const pz = arr[i * 3 + 2];

      const fx = Math.sin(py * 0.75 + t * 0.6) - Math.cos(pz * 0.6 - t * 0.5);
      const fy = Math.sin(pz * 0.7 + t * 0.5) - Math.cos(px * 0.62 + t * 0.45);
      const fz = Math.sin(px * 0.68 - t * 0.42) - Math.cos(py * 0.7 - t * 0.48);

      velocity[i * 3] = velocity[i * 3] * 0.95 + fx * 0.0038;
      velocity[i * 3 + 1] = velocity[i * 3 + 1] * 0.95 + fy * 0.0038;
      velocity[i * 3 + 2] = velocity[i * 3 + 2] * 0.95 + fz * 0.0038;

      const dx = attractX - px;
      const dy = attractY - py;
      const dist = Math.max(0.9, Math.sqrt(dx * dx + dy * dy));
      const attraction = Math.min(0.03, 0.06 / dist);

      arr[i * 3] += velocity[i * 3] + dx * attraction * delta * 60;
      arr[i * 3 + 1] += velocity[i * 3 + 1] + dy * attraction * delta * 60;
      arr[i * 3 + 2] += velocity[i * 3 + 2] + progress.current * 0.01;

      if (
        Math.abs(arr[i * 3]) > 12 ||
        Math.abs(arr[i * 3 + 1]) > 7.5 ||
        Math.abs(arr[i * 3 + 2]) > 11
      ) {
        arr[i * 3] = (Math.random() - 0.5) * 22;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 11;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 17;
        velocity[i * 3] = 0;
        velocity[i * 3 + 1] = 0;
        velocity[i * 3 + 2] = 0;
      }
    }

    (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aScale" array={scales} count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
      />
    </points>
  );
}

function VaultDust({ progress }: { progress: MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 700;

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 4.8 + (Math.random() - 0.5) * 2.1;
      pos[i * 3 + 1] = -1.25 + Math.random() * 0.6;
      pos[i * 3 + 2] = 1.2 + (Math.random() - 0.5) * 1.1;
      vel[i * 3] = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 1] = 0.007 + Math.random() * 0.012;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }

    return { pos, vel };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const arr = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;

    const lift = -0.8 + progress.current * 1.85;
    const active = smoothstep(0.04, 0.8, progress.current);

    for (let i = 0; i < count; i++) {
      arr[i * 3] += data.vel[i * 3] * (0.4 + active);
      arr[i * 3 + 1] += data.vel[i * 3 + 1] * (0.5 + active * 2.6);
      arr[i * 3 + 2] += data.vel[i * 3 + 2] * (0.4 + active);

      if (arr[i * 3 + 1] > lift + 2.8) {
        arr[i * 3] = 4.8 + (Math.random() - 0.5) * 2.1;
        arr[i * 3 + 1] = lift - 1.2 + Math.random() * 0.4;
        arr[i * 3 + 2] = 1.2 + (Math.random() - 0.5) * 1.1;
      }
    }

    (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.pos} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#c5a059"
        size={0.04}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function CrystalSlab({
  mouse,
  progress,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  progress: MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(saadImage);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    const vaultY = -0.82 + progress.current * 1.95;
    groupRef.current.position.y += (vaultY - groupRef.current.position.y) * 0.08;
    groupRef.current.rotation.y = mouse.current.x * 0.2 + Math.sin(t * 0.32) * 0.05;
    groupRef.current.rotation.x = -mouse.current.y * 0.12 + Math.cos(t * 0.26) * 0.04;
  });

  return (
    <group ref={groupRef} position={[4.9, -0.82, 1.2]}>
        <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.45, 3.34]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

        <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2.6, 3.52, 0.1]} />
        <meshPhysicalMaterial
          transmission={1.0}
          thickness={0.5}
          ior={1.56}
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          transparent
            opacity={0.22}
          color="#f4eee0"
        />
      </mesh>

        <mesh position={[0, 1.79, 0.1]}>
          <boxGeometry args={[2.72, 0.05, 0.04]} />
          <meshStandardMaterial color="#c5a059" metalness={0.98} roughness={0.1} emissive="#5a431b" emissiveIntensity={0.22} />
        </mesh>
        <mesh position={[0, -1.79, 0.1]}>
          <boxGeometry args={[2.72, 0.05, 0.04]} />
          <meshStandardMaterial color="#c5a059" metalness={0.98} roughness={0.1} emissive="#5a431b" emissiveIntensity={0.22} />
        </mesh>
        <mesh position={[1.36, 0, 0.1]}>
          <boxGeometry args={[0.05, 3.64, 0.04]} />
          <meshStandardMaterial color="#c5a059" metalness={0.98} roughness={0.1} emissive="#5a431b" emissiveIntensity={0.22} />
        </mesh>
        <mesh position={[-1.36, 0, 0.1]}>
          <boxGeometry args={[0.05, 3.64, 0.04]} />
          <meshStandardMaterial color="#c5a059" metalness={0.98} roughness={0.1} emissive="#5a431b" emissiveIntensity={0.22} />
      </mesh>

      <pointLight position={[1.35, 0.8, 1.3]} intensity={1.1} color="#f4ddb0" distance={8} />
      <pointLight position={[-1.2, -0.9, 1.1]} intensity={0.45} color="#d5b06b" distance={6} />
    </group>
  );
}

function Title3D({ progress }: { progress: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = 0.42 + Math.sin(t * 0.25) * 0.04 - progress.current * 0.18;
  });

  return (
    <group ref={groupRef} position={[-6.1, 0.56, 2.1]}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.68}
        height={0.12}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.008}
        curveSegments={12}
      >
        S A A D  B I N  Z A I N
        <meshStandardMaterial color="#e0c790" metalness={0.95} roughness={0.12} emissive="#6b5020" emissiveIntensity={0.35} />
      </Text3D>
    </group>
  );
}

function HeroScene({
  mouse,
  progress,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  progress: MutableRefObject<number>;
}) {
  return (
    <>
      <fogExp2 attach="fog" args={["#050505", 0.07]} />
      <ambientLight intensity={0.22} />

      <CursorLight mouse={mouse} />
      <LiquidGoldWaves mouse={mouse} progress={progress} />
      <CurlGoldDust mouse={mouse} progress={progress} />
      <VaultDust progress={progress} />
      <Title3D progress={progress} />
      <CrystalSlab mouse={mouse} progress={progress} />

      <EffectComposer>
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.022}
          bokehScale={0.9}
          height={720}
        />
      </EffectComposer>
    </>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLHeadingElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({ delay: 3.2 });
    if (canvasRef.current) {
      tl.fromTo(canvasRef.current, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: "power2.out" }, 0);
    }
    if (subRef.current) {
      tl.fromTo(subRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.45);
    }
    if (pillsRef.current) {
      tl.fromTo(
        pillsRef.current.querySelectorAll(".command-ghost"),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" },
        0.58,
      );
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=160%",
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;

        if (lineRef.current) {
          const strength = Math.min(1, self.progress * 1.35);
          lineRef.current.style.transform = `scaleX(${0.4 + strength * 0.65})`;
          lineRef.current.style.opacity = `${0.18 + strength * 0.82}`;
        }
      },
    });

    return () => {
      tl.kill();
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: "hsl(0 0% 2%)" }}
      data-section="hero"
    >
      <div ref={canvasRef} className="absolute inset-0 z-[1] opacity-0">
        <Canvas
          camera={{ position: [0, 0.35, 9.8], fov: 48 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.CineonToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <Suspense fallback={null}>
            <HeroScene mouse={mouseRef} progress={progressRef} />
          </Suspense>
        </Canvas>
      </div>

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 72% 42%, transparent 12%, hsl(0 0% 2% / 0.25) 46%, hsl(0 0% 2% / 0.88) 96%), linear-gradient(180deg, hsl(0 0% 2% / 0.68) 0%, transparent 30%, transparent 78%, hsl(0 0% 2% / 0.92) 100%)",
        }}
      />

      <div className="relative z-10 min-h-screen" style={{ paddingTop: "max(108px, 11vh)" }}>
        <div className="min-h-screen px-6 md:px-10 lg:px-16 flex items-center">
          <div style={{ marginLeft: "15vw", maxWidth: "42vw" }}>
            <p
              className="text-[10px] md:text-xs uppercase mb-5"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "hsl(40 46% 61%)",
                letterSpacing: "0.52em",
              }}
            >
              Dubai, UAE | Global 1% Advisory
            </p>

            <h2
              ref={subRef}
              className="opacity-0"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 300,
                fontSize: "clamp(1.2rem, 3vw, 2.8rem)",
                lineHeight: 1,
                color: "hsl(0 0% 84%)",
              }}
            >
              Immersive Luxury Real Estate Command
            </h2>

            <h1
              ref={headlineRef}
              className="opacity-0 uppercase mt-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 100,
                fontSize: "clamp(2.8rem, 7.2vw, 6.6rem)",
                letterSpacing: "0.62rem",
                lineHeight: 0.92,
                color: "hsl(40 46% 74%)",
                textShadow: "0 12px 40px hsl(0 0% 0% / 0.5)",
              }}
            >
              SAAD BIN ZAIN
            </h1>

            <motion.div
              ref={pillsRef}
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {["Prime Retail", "Commercial Asset", "Private Wealth"].map((item) => (
                <button key={item} className="command-ghost opacity-0">
                  <span>{item}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 h-px pointer-events-none overflow-hidden">
        <div
          ref={lineRef}
          className="h-full origin-center"
          style={{
            transform: "scaleX(0.4)",
            opacity: 0.18,
            background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.95), transparent)",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
