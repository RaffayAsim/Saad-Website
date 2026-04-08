import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ---------- Reactive Gold Marble Plane ---------- */
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

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
    float mouseInfluence = 1.0 - smoothstep(0.0, 0.7, distance(uv, uMouse * 0.5 + 0.5));
    float n = noise(vec3(pos.xy * 1.8, uTime * 0.2)) * 0.5;
    n += noise(vec3(pos.xy * 3.5, uTime * 0.35)) * 0.25;
    n += mouseInfluence * 0.4;
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
    vec3 deep = vec3(0.06, 0.05, 0.02);
    vec3 gold = vec3(0.77, 0.63, 0.35);
    vec3 bright = vec3(0.95, 0.85, 0.55);
    vec3 warm = vec3(0.55, 0.40, 0.18);

    float t = smoothstep(-0.15, 0.55, vElevation);
    vec3 color = mix(deep, warm, t * 0.6);
    color = mix(color, gold, smoothstep(0.2, 0.5, vElevation));
    color = mix(color, bright, smoothstep(0.45, 0.7, vElevation));

    float vig = 1.0 - smoothstep(0.2, 1.1, distance(vUv, vec2(0.5)));
    color *= 0.4 + vig * 0.6;

    float shimmer = sin(vUv.x * 40.0 + uTime * 2.0) * 0.5 + 0.5;
    shimmer *= smoothstep(0.4, 0.65, vElevation);
    color += bright * shimmer * 0.08;

    gl_FragColor = vec4(color, 0.9);
  }
`;

function FluidPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

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
      0.04
    );
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.8, 0, 0]} position={[0, -2, -2.5]}>
      <planeGeometry args={[14, 14, 160, 160]} />
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

/* ---------- Floating golden geometries ---------- */
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
    groupRef.current.rotation.y = t * 0.03 + mouseRef.current.x * 0.2;
    groupRef.current.rotation.x = mouseRef.current.y * 0.1;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.25 + i * 2.0) * 0.5;
      child.rotation.x = t * 0.08 * (i % 2 === 0 ? 1 : -1);
      child.rotation.z = t * 0.06 * (i % 3 === 0 ? 1 : -1);
    });
  });

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C5A059",
    metalness: 0.95,
    roughness: 0.15,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  }), []);

  const solidGoldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C5A059",
    metalness: 0.95,
    roughness: 0.1,
    transparent: true,
    opacity: 0.15,
  }), []);

  return (
    <group ref={groupRef}>
      <mesh position={[-4, 1.5, -2]} material={goldMat}>
        <torusGeometry args={[0.8, 0.2, 16, 48]} />
      </mesh>
      <mesh position={[4.5, 0.8, -3]} material={goldMat}>
        <octahedronGeometry args={[0.7, 0]} />
      </mesh>
      <mesh position={[1.5, -0.8, -4]} material={solidGoldMat}>
        <icosahedronGeometry args={[0.5, 1]} />
      </mesh>
      <mesh position={[-2.5, -1.2, -3]} material={goldMat}>
        <torusKnotGeometry args={[0.4, 0.1, 80, 12]} />
      </mesh>
      <mesh position={[3, 2, -5]} material={solidGoldMat}>
        <dodecahedronGeometry args={[0.6, 0]} />
      </mesh>
      <mesh position={[-1, 2.5, -4]} material={goldMat}>
        <ringGeometry args={[0.3, 0.6, 6]} />
      </mesh>
    </group>
  );
}

/* ---------- Enhanced Gold Dust ---------- */
const PARTICLE_COUNT = 600;
function GoldDust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const sizes = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i] = Math.random() * 0.06 + 0.02;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const posArr = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArr[i * 3 + 1] += Math.sin(t * 0.15 + i * 0.7) * 0.002;
      posArr[i * 3] += Math.cos(t * 0.1 + i * 0.3) * 0.001;
      posArr[i * 3 + 2] += Math.sin(t * 0.08 + i * 1.1) * 0.0005;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#D4AF5A"
        transparent
        opacity={0.7}
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
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#C5A059" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#8B6914" />
      <pointLight position={[0, 3, 2]} intensity={0.3} color="#D4AF5A" />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={1} intensity={0.5} color="#C5A059" />
      <FluidPlane />
      <FloatingShapes />
      <GoldDust />
    </Canvas>
  </div>
);

export default GoldFluidScene;
