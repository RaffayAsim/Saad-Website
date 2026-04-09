import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text3D, useTexture } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import saadImage from "@/assets/saad-bin-zain-2.jpg";

gsap.registerPlugin(ScrollTrigger);

type Vec3Tuple = [number, number, number];

const chromaticOffset = new THREE.Vector2(0.00042, 0.00072);
const heroFont = "/fonts/helvetiker_regular.typeface.json";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothRange(min: number, max: number, value: number) {
  const x = clamp01((value - min) / (max - min));
  return x * x * (3 - 2 * x);
}

function createMarbleTexture() {
  if (typeof document === "undefined") {
    return null;
  }

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const baseGradient = context.createLinearGradient(0, 0, size, size);
  baseGradient.addColorStop(0, "#050608");
  baseGradient.addColorStop(0.35, "#101114");
  baseGradient.addColorStop(0.7, "#1a1d21");
  baseGradient.addColorStop(1, "#090a0c");
  context.fillStyle = baseGradient;
  context.fillRect(0, 0, size, size);

  const image = context.createImageData(size, size);
  for (let index = 0; index < image.data.length; index += 4) {
    const noise = 14 + Math.random() * 22;
    const warm = Math.random() * 10;
    image.data[index] = noise + warm * 0.2;
    image.data[index + 1] = noise + warm * 0.15;
    image.data[index + 2] = noise + warm * 0.08;
    image.data[index + 3] = 255;
  }
  context.globalAlpha = 0.4;
  context.putImageData(image, 0, 0);
  context.globalAlpha = 1;

  context.lineCap = "round";
  context.lineJoin = "round";

  for (let layer = 0; layer < 32; layer += 1) {
    context.save();
    context.filter = `blur(${10 + Math.random() * 22}px)`;
    context.strokeStyle = `rgba(186, 178, 165, ${0.035 + Math.random() * 0.05})`;
    context.lineWidth = 18 + Math.random() * 42;
    context.beginPath();
    context.moveTo(-120, Math.random() * size);
    context.bezierCurveTo(
      size * 0.18 + Math.random() * 120,
      Math.random() * size,
      size * 0.62 + Math.random() * 120,
      Math.random() * size,
      size + 120,
      Math.random() * size,
    );
    context.stroke();
    context.restore();
  }

  for (let vein = 0; vein < 90; vein += 1) {
    const startY = Math.random() * size;
    context.save();
    context.filter = `blur(${1 + Math.random() * 3}px)`;
    context.strokeStyle = `rgba(224, 213, 193, ${0.035 + Math.random() * 0.05})`;
    context.lineWidth = 1 + Math.random() * 4;
    context.beginPath();
    context.moveTo(-40, startY);
    let cursorX = -40;
    let cursorY = startY;
    while (cursorX < size + 40) {
      cursorX += 80 + Math.random() * 120;
      cursorY += (Math.random() - 0.5) * 120;
      context.quadraticCurveTo(
        cursorX - 30,
        cursorY + (Math.random() - 0.5) * 70,
        cursorX,
        cursorY,
      );
    }
    context.stroke();
    context.restore();
  }

  const vignette = context.createRadialGradient(size * 0.5, size * 0.5, size * 0.08, size * 0.5, size * 0.5, size * 0.72);
  vignette.addColorStop(0, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.28)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.2, 1.2);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const marbleVertex = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const marbleFragment = `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec3 uLightPos;
  uniform float uProgress;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.05 + vec2(9.17, 4.31);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float flowA = fbm(uv * vec2(6.5, 3.2) + vec2(uTime * 0.01, -uTime * 0.007));
    float flowB = fbm(uv * vec2(10.5, 2.8) - vec2(uTime * 0.006, uTime * 0.012));
    vec2 warpedUv = uv * 1.18 + vec2((flowA - 0.5) * 0.06, (flowB - 0.5) * 0.045);
    vec3 marbleSample = texture2D(uMap, warpedUv).rgb;

    float veinMask = smoothstep(0.18, 0.62, marbleSample.r + flowA * 0.24);
    float microVeins = smoothstep(0.52, 0.84, flowB + marbleSample.g * 0.15);

    vec3 obsidian = vec3(0.02, 0.021, 0.024);
    vec3 charcoal = vec3(0.07, 0.075, 0.082);
    vec3 warmStone = vec3(0.23, 0.22, 0.21);
    vec3 glint = vec3(0.83, 0.73, 0.52);

    vec3 color = mix(obsidian, charcoal, marbleSample.r * 0.95 + flowA * 0.08);
    color = mix(color, warmStone, veinMask * 0.22 + microVeins * 0.06);

    float lightDistance = length(vWorldPosition - uLightPos);
    float lightSweep = exp(-lightDistance * lightDistance * 0.46);
    float shimmer = lightSweep * veinMask * microVeins * (0.65 + 0.35 * sin(uTime * 1.5 + flowB * 8.0 + vWorldPosition.x * 1.3));

    color += glint * shimmer * 0.34;
    color += glint * veinMask * 0.035;
    color = mix(color, color * 1.07, uProgress * 0.08);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const portraitVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portraitFragment = `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float grayscale = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float edgeFade = smoothstep(0.02, 0.18, vUv.x) * smoothstep(0.02, 0.18, 1.0 - vUv.x);
    edgeFade *= smoothstep(0.03, 0.2, vUv.y) * smoothstep(0.03, 0.2, 1.0 - vUv.y);

    vec3 etched = mix(vec3(0.15, 0.17, 0.19), vec3(0.95, 0.97, 0.99), grayscale);
    float alpha = (0.025 + grayscale * 0.17) * edgeFade * uOpacity;

    gl_FragColor = vec4(etched, alpha);
  }
`;

function MouseLights({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef(new THREE.Object3D());

  useFrame(() => {
    if (!spotRef.current) {
      return;
    }

    const targetX = mouse.current.x * 3.9;
    const targetY = 1.7 + mouse.current.y * 2.3;

    spotRef.current.position.x += (targetX - spotRef.current.position.x) * 0.08;
    spotRef.current.position.y += (targetY - spotRef.current.position.y) * 0.08;
    spotRef.current.position.z = 4.95;

    targetRef.current.position.x += (mouse.current.x * 2.35 - targetRef.current.position.x) * 0.08;
    targetRef.current.position.y += (mouse.current.y * 1.45 - targetRef.current.position.y) * 0.08;
    targetRef.current.position.z = -2.2;

    spotRef.current.target = targetRef.current;
    targetRef.current.updateMatrixWorld();
  });

  return (
    <>
      <primitive object={targetRef.current} />
      <spotLight
        ref={spotRef}
        position={[0, 1.7, 4.95]}
        intensity={4.9}
        angle={0.32}
        penumbra={0.95}
        decay={1.2}
        distance={19}
        color="#f7e2bb"
      />
      <pointLight position={[-4.8, 2.8, 0.8]} intensity={0.8} color="#dde5ff" distance={15} />
      <pointLight position={[4.6, -0.75, 2.8]} intensity={1.25} color="#efc88a" distance={16} />
    </>
  );
}

function MarbleMonument({
  mouse,
  progress,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  progress: MutableRefObject<number>;
}) {
  const marbleTexture = useMemo(() => createMarbleTexture(), []);
  const uniforms = useMemo(
    () => ({
      uMap: { value: marbleTexture },
      uTime: { value: 0 },
      uLightPos: { value: new THREE.Vector3(0, 1.5, 3.2) },
      uProgress: { value: 0 },
    }),
    [marbleTexture],
  );

  useEffect(() => {
    if (!marbleTexture) {
      return undefined;
    }

    marbleTexture.anisotropy = 8;
    marbleTexture.needsUpdate = true;
    return () => {
      marbleTexture.dispose();
    };
  }, [marbleTexture]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value += (progress.current - uniforms.uProgress.value) * 0.06;
    uniforms.uLightPos.value.lerp(
      new THREE.Vector3(mouse.current.x * 4.7, 1.7 + mouse.current.y * 2.35, 3.0),
      0.08,
    );
  });

  return (
    <group position={[0, -0.55, -2.85]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]} receiveShadow>
        <planeGeometry args={[24, 16, 1, 1]} />
        <shaderMaterial vertexShader={marbleVertex} fragmentShader={marbleFragment} uniforms={uniforms} />
      </mesh>

      <mesh position={[0, 1.48, -3.55]} receiveShadow>
        <planeGeometry args={[24, 8.8, 1, 1]} />
        <shaderMaterial vertexShader={marbleVertex} fragmentShader={marbleFragment} uniforms={uniforms} />
      </mesh>

      <mesh position={[-8.15, 0.28, -1.1]} rotation={[0, Math.PI / 2.18, 0]} receiveShadow>
        <planeGeometry args={[10.4, 8.2, 1, 1]} />
        <shaderMaterial vertexShader={marbleVertex} fragmentShader={marbleFragment} uniforms={uniforms} />
      </mesh>
    </group>
  );
}

function PortraitCore({ progress }: { progress: MutableRefObject<number> }) {
  const texture = useTexture(saadImage);
  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uOpacity: { value: 0.76 },
    }),
    [texture],
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(() => {
    const targetOpacity = 0.78 - smoothRange(0.58, 1, progress.current) * 0.18;
    uniforms.uOpacity.value += (targetOpacity - uniforms.uOpacity.value) * 0.08;
  });

  return (
    <group>
      <mesh position={[0, 0, 0.045]} renderOrder={3}>
        <planeGeometry args={[1.58, 3.28]} />
        <shaderMaterial
          vertexShader={portraitVertex}
          fragmentShader={portraitFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.045]} rotation={[0, Math.PI, 0]} renderOrder={3}>
        <planeGeometry args={[1.58, 3.28]} />
        <shaderMaterial
          vertexShader={portraitVertex}
          fragmentShader={portraitFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, 0]} renderOrder={2}>
        <planeGeometry args={[1.82, 3.52]} />
        <meshBasicMaterial color="#eef1f5" transparent opacity={0.028} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GlassSlab({
  mouse,
  progress,
  intro,
  position,
  rotation,
  size,
  floatOffset,
  mouseShift,
  portrait,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  progress: MutableRefObject<number>;
  intro: MutableRefObject<number>;
  position: Vec3Tuple;
  rotation: Vec3Tuple;
  size: Vec3Tuple;
  floatOffset: number;
  mouseShift: number;
  portrait?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const basePosition = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const reveal = smoothRange(0, 0.75, intro.current);
    const drift = Math.sin(state.clock.elapsedTime * 0.48 + floatOffset) * 0.075;
    const depthDrift = Math.cos(state.clock.elapsedTime * 0.36 + floatOffset) * 0.05;

    const targetX = basePosition.x + mouse.current.x * mouseShift;
    const targetY = basePosition.y + drift + mouse.current.y * mouseShift * 0.32 - progress.current * 0.22;
    const targetZ = basePosition.z + depthDrift;

    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.08;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.08;
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.08;

    groupRef.current.rotation.x +=
      (rotation[0] + mouse.current.y * 0.085 + Math.sin(state.clock.elapsedTime * 0.42 + floatOffset) * 0.018 - groupRef.current.rotation.x) *
      0.08;
    groupRef.current.rotation.y +=
      (rotation[1] + mouse.current.x * 0.13 + Math.cos(state.clock.elapsedTime * 0.34 + floatOffset) * 0.03 - progress.current * 0.045 - groupRef.current.rotation.y) *
      0.08;

    groupRef.current.scale.setScalar(0.84 + reveal * 0.16);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.05}
          ior={1.55}
          thickness={10}
          attenuationColor="#ffffff"
          attenuationDistance={1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0.03}
          reflectivity={1}
          envMapIntensity={1.5}
          transparent
          opacity={0.97}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh scale={[1.012, 1.012, 1.04]}>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#f8efe1" transparent opacity={0.04} depthWrite={false} />
      </mesh>

      {portrait ? <PortraitCore progress={progress} /> : null}
    </group>
  );
}

function AtriumTypography({
  mouse,
  intro,
  progress,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  intro: MutableRefObject<number>;
  progress: MutableRefObject<number>;
}) {
  const titleGroupRef = useRef<THREE.Group>(null);
  const metaGroupRef = useRef<THREE.Group>(null);
  const titleMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const accentMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const metaMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const reveal = smoothRange(0, 0.7, intro.current);
    const fade = 1 - smoothRange(0.7, 1, progress.current) * 0.3;
    const titleOpacity = reveal * fade;

    if (titleGroupRef.current) {
      titleGroupRef.current.position.x = -4.55 + mouse.current.x * 0.16;
      titleGroupRef.current.position.y = 1.08 + mouse.current.y * 0.12 - progress.current * 0.22;
      titleGroupRef.current.rotation.y = mouse.current.x * 0.06;
      titleGroupRef.current.rotation.x = mouse.current.y * 0.03;
      titleGroupRef.current.position.z = -0.12 + 0.02 * Math.sin(state.clock.elapsedTime * 0.7);
    }

    if (metaGroupRef.current) {
      metaGroupRef.current.position.x = 1.95 + mouse.current.x * 0.08;
      metaGroupRef.current.position.y = -2.18 + mouse.current.y * 0.04 - progress.current * 0.12;
      metaGroupRef.current.rotation.y = -0.18 + mouse.current.x * 0.035;
    }

    if (titleMaterialRef.current) {
      titleMaterialRef.current.opacity = titleOpacity * 0.92;
    }

    if (accentMaterialRef.current) {
      accentMaterialRef.current.opacity = titleOpacity * 0.74;
      accentMaterialRef.current.emissiveIntensity = 0.08 + reveal * 0.18;
    }

    if (metaMaterialRef.current) {
      metaMaterialRef.current.opacity = titleOpacity * 0.8;
    }
  });

  return (
    <>
      <group ref={titleGroupRef} position={[-4.55, 1.08, -0.12]} rotation={[0.01, -0.04, 0]}>
        <Text3D font={heroFont} size={0.5} height={0.035} curveSegments={10} bevelEnabled={false} position={[0, 0.72, -0.42]}>
          {"S A A D"}
          <meshStandardMaterial
            ref={titleMaterialRef}
            color="#f4efe8"
            transparent
            opacity={0}
            roughness={0.18}
            metalness={0.06}
          />
        </Text3D>

        <Text3D font={heroFont} size={0.43} height={0.03} curveSegments={10} bevelEnabled={false} position={[0.06, 0, 0.26]}>
          {"B I N  Z A I N"}
          <meshStandardMaterial
            ref={accentMaterialRef}
            color="#ece5d9"
            emissive="#f5e4bd"
            transparent
            opacity={0}
            roughness={0.22}
            metalness={0.05}
          />
        </Text3D>
      </group>

      <group ref={metaGroupRef} position={[1.95, -2.18, 0.92]} rotation={[0, -0.18, 0]}>
        <Text3D font={heroFont} size={0.09} height={0.012} curveSegments={8} bevelEnabled={false} position={[0, 0.18, 0]}>
          {"20 YEARS OF PRECISION"}
          <meshStandardMaterial
            ref={metaMaterialRef}
            color="#d6b884"
            transparent
            opacity={0}
            roughness={0.28}
            metalness={0.08}
          />
        </Text3D>

        <Text3D font={heroFont} size={0.072} height={0.01} curveSegments={8} bevelEnabled={false} position={[0, -0.04, 0.06]}>
          {"DUBAI - LONDON - NETHERLANDS"}
          <meshStandardMaterial color="#bba57d" transparent opacity={0.64} roughness={0.3} metalness={0.06} />
        </Text3D>
      </group>
    </>
  );
}

function GlassAtriumScene({
  mouse,
  progress,
  intro,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  progress: MutableRefObject<number>;
  intro: MutableRefObject<number>;
}) {
  const slabs = useMemo(
    () => [
      {
        position: [-1.52, 0.56, -1.15] as Vec3Tuple,
        rotation: [0.04, -0.24, 0.01] as Vec3Tuple,
        size: [0.88, 4.8, 0.13] as Vec3Tuple,
        floatOffset: 0.3,
        mouseShift: 0.16,
      },
      {
        position: [0.06, 1.42, -0.52] as Vec3Tuple,
        rotation: [0.08, 0.14, -0.02] as Vec3Tuple,
        size: [2.18, 1.02, 0.12] as Vec3Tuple,
        floatOffset: 1.1,
        mouseShift: 0.12,
      },
      {
        position: [1.5, 0.15, 0.38] as Vec3Tuple,
        rotation: [0.02, -0.12, 0] as Vec3Tuple,
        size: [2.18, 5, 0.42] as Vec3Tuple,
        floatOffset: 0.8,
        mouseShift: 0.2,
        portrait: true,
      },
      {
        position: [0.02, -0.36, 1.08] as Vec3Tuple,
        rotation: [-0.04, 0.18, 0.02] as Vec3Tuple,
        size: [1.02, 4.25, 0.11] as Vec3Tuple,
        floatOffset: 1.8,
        mouseShift: 0.18,
      },
      {
        position: [2.58, -0.24, -0.48] as Vec3Tuple,
        rotation: [0.05, 0.22, -0.03] as Vec3Tuple,
        size: [1.1, 3.9, 0.1] as Vec3Tuple,
        floatOffset: 2.3,
        mouseShift: 0.14,
      },
      {
        position: [-0.8, -1.08, 0.88] as Vec3Tuple,
        rotation: [-0.08, -0.18, 0.04] as Vec3Tuple,
        size: [1.52, 2.02, 0.1] as Vec3Tuple,
        floatOffset: 2.9,
        mouseShift: 0.1,
      },
    ],
    [],
  );

  return (
    <>
      <fogExp2 attach="fog" args={["#050505", 0.11]} />
      <ambientLight intensity={0.16} />
      <directionalLight position={[-4.2, 5.6, 3.8]} intensity={1.2} color="#fff7ec" />

      <Environment preset="apartment" blur={0.8} />
      <MouseLights mouse={mouse} />
      <MarbleMonument mouse={mouse} progress={progress} />
      <AtriumTypography mouse={mouse} intro={intro} progress={progress} />

      {slabs.map((slab, index) => (
        <GlassSlab
          key={`${slab.position.join("-")}-${index}`}
          mouse={mouse}
          progress={progress}
          intro={intro}
          position={slab.position}
          rotation={slab.rotation}
          size={slab.size}
          floatOffset={slab.floatOffset}
          mouseShift={slab.mouseShift}
          portrait={slab.portrait}
        />
      ))}

      <EffectComposer>
        <Bloom intensity={0.2} luminanceThreshold={0.88} luminanceSmoothing={0.28} mipmapBlur />
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation
          modulationOffset={0.76}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);
  const introRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current = {
        x: THREE.MathUtils.clamp(x, -1, 1),
        y: THREE.MathUtils.clamp(y, -1, 1),
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
    if (!section) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (canvasRef.current) {
        timeline.fromTo(
          canvasRef.current,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1.6 },
          0,
        );
      }

      if (badgeRef.current) {
        timeline.fromTo(
          badgeRef.current,
          { opacity: 0, y: -18 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.2,
        );
      }

      if (infoRef.current) {
        timeline.fromTo(
          infoRef.current.children,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          0.35,
        );
      }

      timeline.to(introRef, { current: 1, duration: 1.9 }, 0.1);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=145%",
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;

          if (infoRef.current) {
            gsap.set(infoRef.current, {
              y: self.progress * -54,
              opacity: 1 - self.progress * 0.34,
            });
          }

          if (badgeRef.current) {
            gsap.set(badgeRef.current, {
              y: self.progress * -16,
              opacity: 1 - self.progress * 0.2,
            });
          }

          if (canvasRef.current) {
            gsap.set(canvasRef.current, {
              scale: 1 + self.progress * 0.025,
            });
          }

          if (lineRef.current) {
            lineRef.current.style.transform = `scaleX(${0.38 + self.progress * 0.62})`;
            lineRef.current.style.opacity = `${0.18 + self.progress * 0.74}`;
          }
        },
      });

      return () => {
        timeline.kill();
        trigger.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-[#030303]" data-section="hero">
      <div ref={canvasRef} className="absolute inset-0 z-[1] opacity-0">
        <Canvas
          shadows
          camera={{ position: [0.12, 0.32, 7.1], fov: 34 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl, scene }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.02;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.setClearColor("#040404", 1);
            scene.background = new THREE.Color("#040404");
          }}
        >
          <Suspense fallback={null}>
            <GlassAtriumScene mouse={mouseRef} progress={progressRef} intro={introRef} />
          </Suspense>
        </Canvas>
      </div>

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, rgba(194, 150, 86, 0.16) 0%, transparent 20%), radial-gradient(circle at 25% 72%, rgba(165, 136, 88, 0.12) 0%, transparent 26%), linear-gradient(90deg, rgba(4, 4, 4, 0.94) 0%, rgba(4, 4, 4, 0.56) 28%, rgba(4, 4, 4, 0.18) 54%, rgba(4, 4, 4, 0.86) 100%), linear-gradient(180deg, rgba(4, 4, 4, 0.9) 0%, transparent 22%, transparent 78%, rgba(4, 4, 4, 0.96) 100%)",
        }}
      />

      <div className="relative z-10 min-h-screen">
        <h1 className="sr-only">Saad Bin Zain luxury real estate advisory</h1>

        <div
          ref={badgeRef}
          className="absolute right-6 top-28 rounded-full border px-4 py-2 text-[10px] uppercase md:right-10 lg:right-16"
          style={{
            borderColor: "rgba(212, 182, 125, 0.32)",
            background: "rgba(10, 10, 10, 0.42)",
            color: "rgba(222, 197, 145, 0.9)",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.42em",
            backdropFilter: "blur(20px)",
            opacity: 0,
          }}
        >
          RERA 37460
        </div>

        <div
          ref={infoRef}
          className="absolute bottom-10 left-6 right-6 max-w-[34rem] md:bottom-14 md:left-10 lg:bottom-16 lg:left-16"
        >
          <p
            className="text-[10px] uppercase md:text-[11px]"
            style={{
              color: "rgba(214, 186, 132, 0.84)",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.58em",
              opacity: 0,
            }}
          >
            Glass Atrium | Refractive Precision
          </p>

          <p
            className="mt-4 text-[1.05rem] leading-relaxed md:text-[1.18rem]"
            style={{
              color: "rgba(238, 234, 226, 0.88)",
              fontFamily: "'Cormorant Garamond', serif",
              opacity: 0,
            }}
          >
            A crystal-weight editorial hero built around private-office real estate advisory: thick glass, living stone, and a portrait embedded as if carved inside the material itself.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {["Prime Retail", "Commercial Assets", "Private Office"].map((item) => (
              <span
                key={item}
                className="rounded-full border px-4 py-2 text-[10px] uppercase md:text-[11px]"
                style={{
                  borderColor: "rgba(212, 182, 125, 0.22)",
                  background: "rgba(10, 10, 10, 0.28)",
                  color: "rgba(214, 186, 132, 0.88)",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.34em",
                  backdropFilter: "blur(18px)",
                  opacity: 0,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 h-px overflow-hidden pointer-events-none">
        <div
          ref={lineRef}
          className="h-full origin-center"
          style={{
            transform: "scaleX(0.38)",
            opacity: 0.18,
            background: "linear-gradient(90deg, transparent, rgba(212, 182, 125, 0.95), transparent)",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
