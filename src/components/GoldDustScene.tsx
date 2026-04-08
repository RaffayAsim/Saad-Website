import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 600;

function GoldDustParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight;
    };
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const { positions, velocities, basePositions, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const base = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 12;
      pos[i3 + 1] = (Math.random() - 0.5) * 8;
      pos[i3 + 2] = (Math.random() - 0.5) * 6;
      base[i3] = pos[i3];
      base[i3 + 1] = pos[i3 + 1];
      base[i3 + 2] = pos[i3 + 2];
      vel[i3] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.001;
      sz[i] = Math.random() * 3 + 1.5;
    }
    return { positions: pos, velocities: vel, basePositions: base, sizes: sz };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const scroll = scrollRef.current;
    const t = state.clock.elapsedTime;

    // On scroll, particles converge toward center
    const convergence = Math.min(scroll * 1.5, 1);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Drift
      arr[i3] += velocities[i3] + Math.sin(t * 0.3 + i) * 0.001;
      arr[i3 + 1] += velocities[i3 + 1] + Math.cos(t * 0.2 + i) * 0.001;
      arr[i3 + 2] += velocities[i3 + 2];

      // Pull toward center on scroll
      const targetX = basePositions[i3] * (1 - convergence) + (Math.sin(i * 0.3) * 2) * convergence;
      const targetY = basePositions[i3 + 1] * (1 - convergence) + (Math.cos(i * 0.5) * 0.8) * convergence;

      arr[i3] += (targetX - arr[i3]) * 0.02;
      arr[i3 + 1] += (targetY - arr[i3 + 1]) * 0.02;

      // Mouse influence
      arr[i3] += mouseRef.current.x * 0.003;
      arr[i3 + 1] += mouseRef.current.y * 0.003;

      // Wrap
      if (arr[i3] > 7) arr[i3] = -7;
      if (arr[i3] < -7) arr[i3] = 7;
      if (arr[i3 + 1] > 5) arr[i3 + 1] = -5;
      if (arr[i3 + 1] < -5) arr[i3 + 1] = 5;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#C5A059"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1);
  });
  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <planeGeometry args={[15, 15]} />
      <meshBasicMaterial
        color="#C5A059"
        transparent
        opacity={0.03}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

const GoldDustScene = () => (
  <div className="absolute inset-0" style={{ zIndex: 1 }}>
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <GoldDustParticles />
      <FloatingGlow />
    </Canvas>
  </div>
);

export default GoldDustScene;
