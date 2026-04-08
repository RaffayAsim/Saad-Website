import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------- Reactive Gold Marble Plane ---------- */
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  // simplex noise
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}
  float noise(vec3 p){
    vec3 a=floor(p);vec3 d=p-a;d=d*d*(3.-2.*d);
    vec4 b=a.xxyy+vec4(0,1,0,1);
    vec4 k1=perm(b.xyxy);vec4 k2=perm(k1.xyxy+b.zzww);
    vec4 c=k2+a.zzzz;vec4 k3=perm(c);vec4 k4=perm(c+1.);
    vec4 o1=fract(k3*(1./41.));vec4 o2=fract(k4*(1./41.));
    vec4 o3=o2*d.z+o1*(1.-d.z);
    vec2 o4=o3.yw*d.x+o3.xz*(1.-d.x);
    return o4.y*d.y+o4.x*(1.-d.y);
  }

  void main(){
    vUv = uv;
    vec3 pos = position;

    float mouseInfluence = 1.0 - smoothstep(0.0, 0.6, distance(uv, uMouse * 0.5 + 0.5));
    float n = noise(vec3(pos.xy * 2.0, uTime * 0.3)) * 0.35;
    n += noise(vec3(pos.xy * 4.0, uTime * 0.5)) * 0.15;
    n += mouseInfluence * 0.25;

    pos.z += n;
    vElevation = n;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main(){
    // Gold marble tones
    vec3 deep = vec3(0.12, 0.10, 0.06);
    vec3 gold = vec3(0.77, 0.63, 0.35);
    vec3 bright = vec3(0.95, 0.85, 0.55);

    float t = smoothstep(-0.1, 0.5, vElevation);
    vec3 color = mix(deep, gold, t);
    color = mix(color, bright, smoothstep(0.35, 0.55, vElevation));

    // Subtle vignette
    float vig = 1.0 - smoothstep(0.3, 1.0, distance(vUv, vec2(0.5)));
    color *= 0.5 + vig * 0.5;

    gl_FragColor = vec4(color, 0.85);
  }
`;

function FluidPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.lerp(
      new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
      0.05
    );
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -1.5, -2]}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ---------- Floating golden geometric shapes ---------- */
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.05 + mouseRef.current.x * 0.3;
    groupRef.current.rotation.x = mouseRef.current.y * 0.15;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.3 + i * 1.5) * 0.4;
      child.rotation.x = t * 0.1 * (i % 2 === 0 ? 1 : -1);
      child.rotation.z = t * 0.08 * (i % 3 === 0 ? 1 : -1);
    });
  });

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#C5A059",
        metalness: 0.9,
        roughness: 0.2,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      }),
    []
  );

  return (
    <group ref={groupRef}>
      <mesh position={[-3, 1, -1]} material={goldMaterial}>
        <torusGeometry args={[0.6, 0.15, 16, 32]} />
      </mesh>
      <mesh position={[3.5, 0.5, -2]} material={goldMaterial}>
        <octahedronGeometry args={[0.5, 0]} />
      </mesh>
      <mesh position={[1, -0.5, -3]} material={goldMaterial}>
        <icosahedronGeometry args={[0.4, 0]} />
      </mesh>
      <mesh position={[-2, -1, -2.5]} material={goldMaterial}>
        <torusKnotGeometry args={[0.3, 0.08, 64, 8]} />
      </mesh>
    </group>
  );
}

/* ---------- Gold dust particles ---------- */
const PARTICLE_COUNT = 400;
function GoldDust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.2 + i) * 0.001;
      arr[i * 3] += Math.cos(t * 0.15 + i * 0.5) * 0.0008;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#C5A059"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ---------- Scene ---------- */
const GoldFluidScene = () => (
  <div className="absolute inset-0" style={{ zIndex: 1 }}>
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#C5A059" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#8B6914" />
      <FluidPlane />
      <FloatingShapes />
      <GoldDust />
    </Canvas>
  </div>
);

export default GoldFluidScene;
