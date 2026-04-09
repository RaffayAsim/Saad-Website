import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import saadPortrait from "../assets/saad-bin-zain-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_GUARD = 80;
const SILK_WIDTH = 13.2;
const SILK_HEIGHT = 7.8;
const SEGMENTS = 128;

function ease(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

function createThreadMapTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(212, 171, 103, 0.9)";
  context.lineWidth = 2.4;
  context.shadowColor = "rgba(212, 171, 103, 0.45)";
  context.shadowBlur = 14;

  const routes = [
    [
      [0.18, 0.22],
      [0.24, 0.28],
      [0.31, 0.34],
      [0.38, 0.39],
      [0.46, 0.42],
      [0.54, 0.42],
    ],
    [
      [0.38, 0.39],
      [0.42, 0.46],
      [0.45, 0.55],
      [0.49, 0.67],
      [0.51, 0.8],
    ],
    [
      [0.54, 0.42],
      [0.61, 0.39],
      [0.69, 0.37],
      [0.76, 0.35],
      [0.84, 0.34],
    ],
    [
      [0.62, 0.34],
      [0.66, 0.28],
      [0.69, 0.23],
      [0.72, 0.18],
      [0.76, 0.16],
    ],
  ];

  routes.forEach((route) => {
    context.beginPath();
    route.forEach(([x, y], index) => {
      const px = x * canvas.width;
      const py = y * canvas.height;
      if (index === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    });
    context.stroke();
  });

  const hubs = [
    [0.31, 0.34],
    [0.38, 0.39],
    [0.46, 0.42],
    [0.54, 0.42],
    [0.69, 0.37],
    [0.76, 0.16],
  ];

  hubs.forEach(([x, y]) => {
    const px = x * canvas.width;
    const py = y * canvas.height;
    const isDubaiCluster = Math.abs(x - 0.46) < 0.09 && Math.abs(y - 0.42) < 0.08;
    const radius = isDubaiCluster ? 28 : 18;
    const gradient = context.createRadialGradient(px, py, 0, px, py, radius);
    gradient.addColorStop(0, "rgba(255, 236, 188, 0.95)");
    gradient.addColorStop(0.3, isDubaiCluster ? "rgba(233, 192, 116, 0.92)" : "rgba(212, 171, 103, 0.8)");
    gradient.addColorStop(1, "rgba(212, 171, 103, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(px, py, radius, 0, Math.PI * 2);
    context.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  return texture;
}

function createGlobalRouteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 900;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = "rgba(0,0,0,0)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const coastline = [
    [210, 180], [260, 238], [360, 306], [510, 366], [690, 390], [870, 385], [1050, 360], [1240, 320], [1410, 284],
  ];
  const corridorRoutes = [
    [[300, 300], [420, 330], [560, 354], [720, 362], [860, 352]],
    [[560, 354], [620, 418], [675, 502], [728, 620], [760, 748]],
    [[860, 352], [970, 325], [1090, 298], [1205, 254], [1315, 224]],
    [[420, 330], [360, 260], [318, 214], [282, 178], [250, 152]],
    [[120, 252], [220, 278], [320, 312], [420, 330]],
    [[870, 352], [980, 410], [1092, 504], [1180, 632], [1240, 808]],
    [[1040, 170], [1130, 224], [1220, 272], [1320, 314], [1450, 336]],
    [[520, 180], [640, 224], [760, 258], [892, 286], [1022, 308]],
    [[170, 508], [280, 476], [402, 448], [548, 430], [690, 420]],
  ];

  context.strokeStyle = "rgba(190, 151, 86, 0.16)";
  context.lineWidth = 3;
  context.beginPath();
  coastline.forEach(([x, y], index) => {
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.stroke();

  corridorRoutes.forEach((arc, index) => {
    context.strokeStyle = index === 0 ? "rgba(233, 190, 112, 0.34)" : index < 4 ? "rgba(214, 171, 103, 0.24)" : "rgba(214, 171, 103, 0.16)";
    context.lineWidth = index === 0 ? 2.8 : index < 4 ? 2.1 : 1.5;
    context.beginPath();
    arc.forEach(([x, y], pointIndex) => {
      if (pointIndex === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  });

  const hubs = [
    [420, 330, false],
    [560, 354, false],
    [700, 366, true],
    [860, 352, false],
    [1250, 222, false],
    [748, 620, false],
    [262, 182, false],
    [980, 502, false],
    [1450, 336, false],
    [166, 500, false],
  ] as const;

  context.font = "500 24px Inter";
  hubs.forEach(([x, y, isDubai]) => {
    const radius = isDubai ? 60 : 26;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(255,232,186,0.95)");
    gradient.addColorStop(0.35, isDubai ? "rgba(236,196,118,0.9)" : "rgba(212,171,103,0.72)");
    gradient.addColorStop(1, "rgba(212,171,103,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function GoldDust({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 260;
    const buffer = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      buffer[index * 3] = (Math.random() - 0.5) * 16;
      buffer[index * 3 + 1] = (Math.random() - 0.5) * 9;
      buffer[index * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    return buffer;
  }, []);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.position.x = ease(ref.current.position.x, mouse.current.x * 0.18, 0.03);
    ref.current.position.y = ease(ref.current.position.y, mouse.current.y * 0.12, 0.03);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#bf9554"
        size={0.022}
        transparent
        opacity={0.38}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function BackgroundScene({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const mapTexture = useMemo(() => createGlobalRouteTexture(), []);
  const mapRef = useRef<THREE.Mesh>(null);
  const routeRef = useRef<THREE.Line>(null);
  const activeCityRef = useRef<THREE.Mesh>(null);
  const districtAnchors = useMemo(
    () => [
      { name: "Downtown", world: new THREE.Vector3(-3.05, 1.02, -2.6), pointer: new THREE.Vector2(-0.42, 0.28) },
      { name: "DIFC", world: new THREE.Vector3(-1.7, 0.78, -2.6), pointer: new THREE.Vector2(-0.2, 0.2) },
      { name: "Dubai", world: new THREE.Vector3(0.25, 0.58, -2.6), pointer: new THREE.Vector2(0.02, 0.16) },
      { name: "Marina", world: new THREE.Vector3(3.3, 0.46, -2.6), pointer: new THREE.Vector2(0.46, 0.14) },
      { name: "Palm", world: new THREE.Vector3(5.55, 2.02, -2.6), pointer: new THREE.Vector2(0.78, 0.58) },
      { name: "Creek", world: new THREE.Vector3(0.85, -2.16, -2.6), pointer: new THREE.Vector2(0.12, -0.42) },
      { name: "Jumeirah", world: new THREE.Vector3(-5.1, 1.92, -2.6), pointer: new THREE.Vector2(-0.8, 0.64) },
      { name: "City Walk", world: new THREE.Vector3(-3.72, 1.14, -2.6), pointer: new THREE.Vector2(-0.52, 0.3) },
      { name: "Satwa", world: new THREE.Vector3(-4.58, 0.34, -2.6), pointer: new THREE.Vector2(-0.68, 0.12) },
      { name: "Zaabeel", world: new THREE.Vector3(-2.62, -0.18, -2.6), pointer: new THREE.Vector2(-0.34, -0.02) },
      { name: "Meydan", world: new THREE.Vector3(-1.52, -1.34, -2.6), pointer: new THREE.Vector2(-0.18, -0.28) },
      { name: "Dubai Design District", world: new THREE.Vector3(-0.48, -1.88, -2.6), pointer: new THREE.Vector2(-0.02, -0.38) },
      { name: "Bluewaters", world: new THREE.Vector3(4.62, 0.96, -2.6), pointer: new THREE.Vector2(0.66, 0.28) },
      { name: "Dubai Hills", world: new THREE.Vector3(4.98, -0.82, -2.6), pointer: new THREE.Vector2(0.72, -0.08) },
      { name: "Al Wasl", world: new THREE.Vector3(-1.08, -0.18, -2.6), pointer: new THREE.Vector2(-0.08, -0.04) },
      { name: "Expo City", world: new THREE.Vector3(6.08, -1.98, -2.6), pointer: new THREE.Vector2(0.88, -0.5) },
    ],
    [],
  );

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = ease(lightRef.current.position.x, mouse.current.x * 2.8, 0.04);
      lightRef.current.position.y = ease(lightRef.current.position.y, mouse.current.y * 1.8, 0.04);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.08;
      ringRef.current.position.x = ease(ringRef.current.position.x, mouse.current.x * 0.45, 0.03);
      ringRef.current.position.y = ease(ringRef.current.position.y, mouse.current.y * 0.3, 0.03);
    }

    if (mapRef.current) {
      mapRef.current.position.x = ease(mapRef.current.position.x, 0.2 + mouse.current.x * 0.22, 0.025);
      mapRef.current.position.y = ease(mapRef.current.position.y, -0.12 + mouse.current.y * 0.14, 0.025);
      mapRef.current.rotation.z = ease(mapRef.current.rotation.z, mouse.current.x * -0.024, 0.02);
    }

    if (routeRef.current && activeCityRef.current) {
      const nearest = districtAnchors.reduce(
        (best, city) => {
          const distance = city.pointer.distanceTo(new THREE.Vector2(mouse.current.x, mouse.current.y));
          if (distance < best.distance) {
            return { city, distance };
          }
          return best;
        },
        { city: districtAnchors[2], distance: Number.POSITIVE_INFINITY },
      );

      const shouldShow = nearest.city.name !== "Dubai" && nearest.distance < 0.38;
      const routeGeometry = routeRef.current.geometry as THREE.BufferGeometry;
      const positions = routeGeometry.attributes.position.array as Float32Array;
      const start = districtAnchors[2].world;
      const end = nearest.city.world;

      const control = new THREE.Vector3((start.x + end.x) * 0.5, Math.max(start.y, end.y) + 0.7, -2.35);
      const curve = new THREE.QuadraticBezierCurve3(start, control, end);
      const points = curve.getPoints(32);
      points.forEach((point, index) => {
        positions[index * 3] = point.x;
        positions[index * 3 + 1] = point.y;
        positions[index * 3 + 2] = point.z;
      });
      routeGeometry.attributes.position.needsUpdate = true;

      routeRef.current.visible = shouldShow;
      activeCityRef.current.visible = shouldShow;
      if (shouldShow) {
        activeCityRef.current.position.copy(end);
        activeCityRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3.5) * 0.08);
      }
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#030303", 0.16]} />
      <ambientLight intensity={0.14} />
      <pointLight ref={lightRef} position={[0.2, 0.3, 2.4]} intensity={0.4} distance={8} color="#d3a860" />
      <directionalLight position={[-3.5, 2.8, 1.5]} intensity={0.12} color="#9a8f7a" />

      <mesh position={[0, -0.1, -3.8]}>
        <planeGeometry args={[18, 11]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      <mesh ref={mapRef} position={[0.2, -0.12, -2.7]}>
        <planeGeometry args={[16.8, 8.8]} />
        <meshBasicMaterial map={mapTexture} transparent opacity={0.52} toneMapped={false} depthWrite={false} />
      </mesh>

      <line ref={routeRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={new Float32Array(33 * 3)} count={33} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#d7ae67" transparent opacity={0.6} />
      </line>

      <mesh ref={activeCityRef} visible={false}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#f0cd8a" transparent opacity={0.85} />
      </mesh>

      <mesh ref={ringRef} position={[1.8, -0.8, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.1, 0.035, 24, 140]} />
        <meshStandardMaterial color="#8c6a3c" emissive="#6f4e24" emissiveIntensity={0.3} transparent opacity={0.28} />
      </mesh>

      <mesh position={[-3.8, 2.3, -2.9]} rotation={[0, 0, 0.1]}>
        <planeGeometry args={[3.6, 8.6]} />
        <meshBasicMaterial color="#080808" transparent opacity={0.72} />
      </mesh>

      <GoldDust mouse={mouse} />
    </>
  );
}

function SilkMesh({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  const threadMap = useMemo(() => createThreadMapTexture(), []);

  const simulation = useMemo(() => {
    const vertexCount = (SEGMENTS + 1) * (SEGMENTS + 1);
    return {
      base: new Float32Array(vertexCount * 3),
      current: new Float32Array(vertexCount * 3),
      velocity: new Float32Array(vertexCount * 3),
      seeded: false,
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uThreadMap: { value: threadMap },
      uMouseUv: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseLight: { value: new THREE.Vector3(0, 0, 4) },
    }),
    [threadMap],
  );

  useEffect(() => {
    const geometry = geometryRef.current;
    if (!geometry || simulation.seeded) {
      return;
    }

    const position = geometry.attributes.position.array as Float32Array;
    simulation.base.set(position);
    simulation.current.set(position);
    simulation.seeded = true;
  }, [simulation]);

  useFrame((state) => {
    const geometry = geometryRef.current;
    const material = materialRef.current;

    if (!geometry || !material || !simulation.seeded) {
      return;
    }

    const position = geometry.attributes.position as THREE.BufferAttribute;
    const array = position.array as Float32Array;
    const mouseX = mouse.current.x * (SILK_WIDTH * 0.24);
    const mouseY = mouse.current.y * (SILK_HEIGHT * 0.28);
    const radius = 1.46;

    for (let row = 0; row <= SEGMENTS; row += 1) {
      for (let column = 0; column <= SEGMENTS; column += 1) {
        const index = row * (SEGMENTS + 1) + column;
        const cursor = index * 3;

        const baseX = simulation.base[cursor];
        const baseY = simulation.base[cursor + 1];
        const baseZ = simulation.base[cursor + 2];

        let x = simulation.current[cursor];
        let y = simulation.current[cursor + 1];
        let z = simulation.current[cursor + 2];

        let averageZ = z;
        let neighborCount = 0;

        if (column > 0) {
          averageZ += simulation.current[cursor - 1];
          neighborCount += 1;
        }
        if (column < SEGMENTS) {
          averageZ += simulation.current[cursor + 5];
          neighborCount += 1;
        }
        if (row > 0) {
          averageZ += simulation.current[cursor - (SEGMENTS + 1) * 3 + 2];
          neighborCount += 1;
        }
        if (row < SEGMENTS) {
          averageZ += simulation.current[cursor + (SEGMENTS + 1) * 3 + 2];
          neighborCount += 1;
        }

        averageZ /= neighborCount + 1;

        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / radius);
        const force = influence * influence;
        const directionX = distance > 0.0001 ? dx / distance : 0;
        const directionY = distance > 0.0001 ? dy / distance : 0;
        const wave = Math.sin(state.clock.elapsedTime * 0.52 + baseX * 1.2 + baseY * 0.7) * 0.0022;

        simulation.velocity[cursor] += (baseX - x) * 0.012 + directionX * force * 0.01;
        simulation.velocity[cursor + 1] += (baseY - y) * 0.012 + directionY * force * 0.01;
        simulation.velocity[cursor + 2] += (averageZ - z) * 0.18 + (baseZ - z) * 0.028 + wave + force * 0.06;

        simulation.velocity[cursor] *= 0.88;
        simulation.velocity[cursor + 1] *= 0.88;
        simulation.velocity[cursor + 2] *= 0.91;

        x += simulation.velocity[cursor];
        y += simulation.velocity[cursor + 1];
        z += simulation.velocity[cursor + 2];

        const edgeLock = row < 2 ? 0.9 : 0;
        if (edgeLock > 0) {
          x = ease(x, baseX, edgeLock);
          y = ease(y, baseY, edgeLock);
          z = ease(z, baseZ, edgeLock);
        }

        simulation.current[cursor] = x;
        simulation.current[cursor + 1] = y;
        simulation.current[cursor + 2] = z;

        array[cursor] = x;
        array[cursor + 1] = y;
        array[cursor + 2] = z;
      }
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouseUv.value.set(mouse.current.x * 0.5 + 0.5, mouse.current.y * 0.5 + 0.5);
    uniforms.uMouseLight.value.set(mouse.current.x * 3.1, mouse.current.y * 2.2, 4.4);
  });

  return (
    <mesh position={[0.9, 0, 0]} rotation={[-0.06, -0.1, -0.025]}>
      <planeGeometry ref={geometryRef} args={[SILK_WIDTH, SILK_HEIGHT, SEGMENTS, SEGMENTS]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormalW;
          varying vec3 vWorldPosition;

          void main() {
            vUv = uv;
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vNormalW = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform sampler2D uThreadMap;
          uniform vec2 uMouseUv;
          uniform vec3 uMouseLight;

          varying vec2 vUv;
          varying vec3 vNormalW;
          varying vec3 vWorldPosition;

          void main() {
            vec3 normal = normalize(vNormalW);
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);
            vec3 lightDir = normalize(uMouseLight - vWorldPosition);

            float diffuse = max(dot(normal, lightDir), 0.0);
            float specular = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 28.0);
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.6);
            float fold = smoothstep(0.12, 0.86, 1.0 - abs(normal.z));
            float reveal = smoothstep(0.34, 0.0, distance(vUv, uMouseUv));

            vec2 driftUv = vUv * 1.08 + vec2(sin(uTime * 0.06) * 0.012, cos(uTime * 0.04) * 0.008);
            float mapSignal = texture2D(uThreadMap, driftUv).r;
            float shimmer = mapSignal * smoothstep(0.16, 0.72, fold + reveal * 0.75) * (0.5 + 0.5 * sin(uTime * 1.1 + vUv.y * 20.0));

            vec3 obsidian = vec3(0.015, 0.016, 0.02);
            vec3 gold = vec3(0.86, 0.68, 0.36);
            vec3 color = obsidian;
            color += gold * specular * 1.2;
            color += gold * diffuse * 0.08;
            color += gold * shimmer * 0.65;
            color += gold * fresnel * 0.12;

            float alpha = 0.78 - reveal * 0.48 + fold * 0.08;
            alpha = clamp(alpha, 0.12, 0.82);

            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function SilkScene({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.04} />
      <SilkMesh mouse={mouse} />
    </>
  );
}

function DubaiDistrictOverlay({ mouse }: { mouse: MutableRefObject<{ x: number; y: number; inside: boolean }> }) {
  const items = useMemo(
    () => [
      { label: "JUMEIRAH", left: "12%", top: "19%", color: "gold" },
      { label: "CITY WALK", left: "20%", top: "26%", color: "white" },
      { label: "SATWA", left: "10%", top: "39%", color: "white" },
      { label: "DOWNTOWN", left: "29%", top: "31%", color: "gold" },
      { label: "DIFC", left: "38%", top: "37%", color: "white" },
      { label: "ZAABEEL", left: "21%", top: "56%", color: "white" },
      { label: "MEYDAN", left: "27%", top: "73%", color: "white" },
      { label: "DUBAI DESIGN DISTRICT", left: "36%", top: "81%", color: "white" },
      { label: "AL WASL", left: "43%", top: "52%", color: "gold" },
      { label: "BUSINESS BAY", left: "49%", top: "45%", color: "gold" },
      { label: "DUBAI", left: "60%", top: "34%", color: "gold" },
      { label: "DUBAI MARINA", left: "79%", top: "36%", color: "white" },
      { label: "BLUEWATERS", left: "71%", top: "28%", color: "white" },
      { label: "DUBAI HILLS", left: "77%", top: "49%", color: "white" },
      { label: "PALM JUMEIRAH", left: "83%", top: "13%", color: "gold" },
      { label: "CREEK HARBOUR", left: "56%", top: "74%", color: "white" },
      { label: "EMIRATES HILLS", left: "85%", top: "57%", color: "white" },
      { label: "EXPO CITY", left: "85%", top: "78%", color: "gold" },
      { label: "25.2048 N 55.2708 E", left: "7%", top: "10%", color: "white" },
      { label: "24.7136 N 46.6753 E", left: "8%", top: "86%", color: "white" },
      { label: "51.5072 N 0.1276 W", left: "86%", top: "9%", color: "white" },
      { label: "1.3521 N 103.8198 E", left: "84%", top: "88%", color: "white" },
      { label: "TRACE VECTOR 07", left: "70%", top: "16%", color: "gold" },
      { label: "COORD GRID A3", left: "14%", top: "67%", color: "white" },
    ],
    [],
  );
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const charRefs = useRef<Array<Array<HTMLSpanElement | null>>>([]);

  useEffect(() => {
    const itemSetters = itemRefs.current.map((element, index) => {
      const colorValue = items[index]?.color === "gold" ? "#C5A059" : "#F5F3EE";
      return element
        ? {
            opacity: gsap.quickTo(element, "opacity", { duration: 0.22, ease: "power2.out" }),
            y: gsap.quickTo(element, "y", { duration: 0.26, ease: "back.out(1.8)" }),
            color: colorValue,
          }
        : null;
    });

    const dotSetters = dotRefs.current.map((element) =>
      element
        ? {
            scale: gsap.quickTo(element, "scale", { duration: 0.24, ease: "back.out(2.1)" }),
            opacity: gsap.quickTo(element, "opacity", { duration: 0.2, ease: "power2.out" }),
          }
        : null,
    );

    const characterSetters = charRefs.current.map((characters) =>
      characters.map((character) =>
        character
          ? {
              scale: gsap.quickTo(character, "scale", { duration: 0.26, ease: "back.out(2.4)" }),
              y: gsap.quickTo(character, "y", { duration: 0.24, ease: "back.out(2)" }),
            }
          : null,
      ),
    );

    let frameId = 0;

    const tick = () => {
      const pointer = mouse.current;

      itemRefs.current.forEach((element, index) => {
        if (!element) {
          return;
        }

        const dot = dotRefs.current[index];
        const pointRect = dot?.getBoundingClientRect() ?? element.getBoundingClientRect();
        const pointX = pointRect.left + pointRect.width / 2;
        const pointY = pointRect.top + pointRect.height / 2;
        const pointDistance = pointer.inside ? Math.hypot(pointer.x - pointX, pointer.y - pointY) : Number.POSITIVE_INFINITY;
        const activation = pointer.inside ? THREE.MathUtils.clamp(1 - pointDistance / 150, 0, 1) : 0;
        const baseColor = items[index].color === "gold" ? "rgba(197,160,89,0.18)" : "rgba(245,243,238,0.16)";

        if (itemSetters[index]) {
          itemSetters[index]?.opacity(0.1 + activation * 0.9);
          itemSetters[index]?.y((1 - activation) * 2.5);
          gsap.to(element, {
            color: activation > 0.04 ? itemSetters[index]?.color : baseColor,
            duration: 0.18,
            ease: "power2.out",
            overwrite: true,
          });
        }

        if (dotSetters[index]) {
          dotSetters[index]?.scale(0.7 + activation * 1.15);
          dotSetters[index]?.opacity(0.12 + activation * 0.88);
        }

        characterSetters[index]?.forEach((setter, charIndex) => {
          const character = charRefs.current[index]?.[charIndex];
          if (!setter || !character) {
            return;
          }

          const rect = character.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;
          const charDistance = pointer.inside ? Math.hypot(pointer.x - charX, pointer.y - charY) : Number.POSITIVE_INFINITY;
          const charActivation = activation * THREE.MathUtils.clamp(1 - charDistance / 110, 0, 1);
          setter.scale(0.92 + activation * 0.12 + charActivation * 0.82);
          setter.y(-(activation * 1.2 + charActivation * 4.6));
        });
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [items, mouse]);

  return (
    <div className="pointer-events-none absolute bottom-0 left-[3%] z-[6] hidden lg:block" style={{ top: `${NAVBAR_GUARD}px`, width: "62%" }} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="district-route" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(214,184,132,0)" />
            <stop offset="28%" stopColor="rgba(214,184,132,0.24)" />
            <stop offset="62%" stopColor="rgba(236,196,118,0.52)" />
            <stop offset="100%" stopColor="rgba(214,184,132,0.22)" />
          </linearGradient>
        </defs>
        <path d="M8 22 C 14 26, 22 30, 31 36 S 42 43, 50 44" fill="none" stroke="url(#district-route)" strokeWidth="0.18" />
        <path d="M50 44 C 59 42, 67 39, 78 35 S 88 29, 96 12" fill="none" stroke="url(#district-route)" strokeWidth="0.18" />
        <path d="M31 36 C 37 44, 43 57, 54 74" fill="none" stroke="rgba(214,184,132,0.18)" strokeWidth="0.14" />
        <path d="M2 46 C 12 44, 20 42, 31 40 S 44 38, 50 38" fill="none" stroke="rgba(214,184,132,0.12)" strokeWidth="0.12" />
        <path d="M50 38 C 62 37, 72 35, 84 32 S 93 28, 99 24" fill="none" stroke="rgba(214,184,132,0.12)" strokeWidth="0.12" />
        <path d="M66 28 C 72 36, 78 46, 86 58 S 92 70, 98 84" fill="none" stroke="rgba(214,184,132,0.1)" strokeWidth="0.1" />
        <path d="M28 16 C 34 20, 42 24, 54 27 S 72 30, 86 32" fill="none" stroke="rgba(214,184,132,0.08)" strokeWidth="0.1" />
        <path d="M6 32 C 12 35, 18 37, 25 39 S 32 42, 39 44" fill="none" stroke="rgba(214,184,132,0.12)" strokeWidth="0.1" />
        <path d="M10 56 C 18 56, 24 55, 31 54 S 39 52, 46 49" fill="none" stroke="rgba(214,184,132,0.12)" strokeWidth="0.1" />
        <path d="M18 72 C 25 70, 32 67, 40 63 S 48 57, 54 50" fill="none" stroke="rgba(214,184,132,0.1)" strokeWidth="0.1" />
        <path d="M25 84 C 32 82, 39 78, 46 72 S 54 64, 59 56" fill="none" stroke="rgba(214,184,132,0.08)" strokeWidth="0.08" />
        <circle cx="50" cy="44" r="0.86" fill="rgba(236,196,118,0.84)" />
        <circle cx="31" cy="36" r="0.3" fill="rgba(214,184,132,0.46)" />
        <circle cx="39" cy="43" r="0.28" fill="rgba(214,184,132,0.42)" />
        <circle cx="78" cy="35" r="0.32" fill="rgba(214,184,132,0.42)" />
        <circle cx="54" cy="74" r="0.24" fill="rgba(214,184,132,0.28)" />
        <circle cx="22" cy="26" r="0.22" fill="rgba(214,184,132,0.26)" />
        <circle cx="12" cy="39" r="0.2" fill="rgba(214,184,132,0.18)" />
        <circle cx="24" cy="55" r="0.22" fill="rgba(214,184,132,0.2)" />
        <circle cx="30" cy="72" r="0.22" fill="rgba(214,184,132,0.18)" />
        <circle cx="40" cy="81" r="0.18" fill="rgba(214,184,132,0.16)" />
        <circle cx="67" cy="29" r="0.24" fill="rgba(214,184,132,0.28)" />
        <circle cx="82" cy="50" r="0.22" fill="rgba(214,184,132,0.22)" />
        <circle cx="95" cy="79" r="0.18" fill="rgba(214,184,132,0.18)" />
      </svg>

      {items.map((item, index) => (
        <div
          key={item.label}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          className="absolute uppercase"
          style={{
            left: item.left,
            top: item.top,
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.3rem",
            color: item.color === "gold" ? "rgba(197,160,89,0.22)" : "rgba(245,243,238,0.18)",
            opacity: 0.12,
            whiteSpace: "nowrap",
            willChange: "transform, opacity",
            textShadow: item.color === "gold" ? "0 0 18px rgba(197,160,89,0.12)" : "0 0 18px rgba(245,243,238,0.08)",
          }}
        >
          <span
            ref={(element) => {
              dotRefs.current[index] = element;
            }}
            className="absolute left-[-14px] top-[6px] h-[4px] w-[4px] rounded-full"
            style={{
              background: item.color === "gold" ? "#C5A059" : "#F5F3EE",
              opacity: 0.18,
              willChange: "transform, opacity",
              boxShadow: item.color === "gold" ? "0 0 12px rgba(197,160,89,0.34)" : "0 0 12px rgba(245,243,238,0.26)",
            }}
          />
          {Array.from(item.label).map((character, charIndex) => (
            <span
              key={`${item.label}-${charIndex}`}
              ref={(element) => {
                if (!charRefs.current[index]) {
                  charRefs.current[index] = [];
                }
                charRefs.current[index][charIndex] = element;
              }}
              style={{
                display: "inline-block",
                marginRight: character === " " ? "0.32rem" : 0,
                transform: "scale(0.92) translateY(0px)",
                transformOrigin: "50% 50%",
                willChange: "transform",
              }}
            >
              {character === " " ? "\u00A0" : character}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const silkRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseScreenRef = useRef({ x: 0, y: 0, inside: false });

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
      mouseScreenRef.current = { x: event.clientX, y: event.clientY, inside: true };
    };

    const onLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
      mouseScreenRef.current = { x: 0, y: 0, inside: false };
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
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          opacity: 0,
          y: 26,
          duration: 0.95,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.08,
        });
      }

      if (backgroundRef.current) {
        gsap.from(backgroundRef.current, {
          opacity: 0,
          scale: 1.04,
          duration: 1.3,
          ease: "power3.out",
        });
      }

      if (silkRef.current) {
        gsap.from(silkRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.14,
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (backgroundRef.current) {
            gsap.set(backgroundRef.current, {
              opacity: 1 - self.progress * 0.65,
              scale: 1 - self.progress * 0.06,
            });
          }

          if (silkRef.current) {
            gsap.set(silkRef.current, {
              opacity: 1 - self.progress * 0.72,
              scale: 1 - self.progress * 0.08,
              transformOrigin: "68% 48%",
            });
          }

          if (textRef.current) {
            gsap.set(textRef.current, { y: self.progress * -18, opacity: 1 - self.progress * 0.18 });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        background:
          "radial-gradient(circle at 22% 28%, rgba(167,126,66,0.1), transparent 24%), radial-gradient(circle at 78% 22%, rgba(167,126,66,0.1), transparent 20%), linear-gradient(180deg, #020202 0%, #050505 58%, #030303 100%)",
      }}
      data-section="hero"
    >
      <div className="hero-wrapper relative overflow-hidden" style={{ height: "100vh", overflow: "hidden" }}>
        <div ref={backgroundRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-0" style={{ top: `${NAVBAR_GUARD}px` }}>
          <Canvas
            className="pointer-events-none"
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false }}
            camera={{ position: [0, 0, 5.5], fov: 38 }}
            onCreated={({ gl, scene }) => {
              gl.toneMapping = THREE.CineonToneMapping;
              gl.toneMappingExposure = 0.92;
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.setClearColor("#030303", 1);
              scene.background = new THREE.Color("#030303");
            }}
          >
            <BackgroundScene mouse={mouseRef} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-[linear-gradient(90deg,rgba(3,3,3,0.4)_0%,rgba(3,3,3,0.12)_28%,rgba(3,3,3,0.08)_54%,rgba(3,3,3,0.52)_100%)]" style={{ top: `${NAVBAR_GUARD}px` }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-[linear-gradient(180deg,rgba(3,3,3,0.22)_0%,rgba(3,3,3,0.08)_16%,rgba(3,3,3,0.12)_68%,rgba(3,3,3,0.88)_100%)]" style={{ top: `${NAVBAR_GUARD}px` }} />

        <div className="relative z-10 mx-auto h-full max-w-[1320px] px-8 md:px-12 lg:px-16" style={{ paddingTop: `${NAVBAR_GUARD}px`, boxSizing: "border-box" }}>
          <div className="grid h-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hidden h-full lg:block" />
            <div className="flex justify-end">
              <div
                ref={textRef}
                className="relative w-full max-w-[34rem] overflow-hidden rounded-[30px] border p-7 md:p-8"
                style={{
                  zIndex: 10,
                  borderColor: "rgba(208,171,110,0.16)",
                  background: "linear-gradient(180deg, rgba(10,10,10,0.42), rgba(8,8,8,0.2))",
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 26px 70px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 70% 28%, rgba(208,171,110,0.14), transparent 32%)" }} />
                <div className="relative z-[1] flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <span className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(208,171,110,0), rgba(208,171,110,0.78))" }} />
                    <p
                      className="text-[0.74rem] uppercase"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: "rgba(208,171,110,0.9)",
                        letterSpacing: "0.32rem",
                      }}
                    >
                      Dubai private advisory
                    </p>
                  </div>

                  <div className="grid grid-cols-[128px_1fr] items-center gap-5 md:grid-cols-[148px_1fr]">
                    <div className="relative overflow-hidden rounded-[24px] border" style={{ borderColor: "rgba(208,171,110,0.16)" }}>
                      <img
                        src={saadPortrait}
                        alt="Saad Bin Zain"
                        className="h-[180px] w-full object-cover object-center md:h-[208px]"
                        style={{ filter: "grayscale(1) contrast(1.12) brightness(0.88)" }}
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(197,160,89,0.08), rgba(197,160,89,0.18)), linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.42))", mixBlendMode: "screen" }} />
                    </div>

                    <div>
                      <h1
                        className="text-[clamp(2.4rem,4.8vw,4.35rem)] uppercase text-white"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 100,
                          lineHeight: 0.9,
                          letterSpacing: "0.16rem",
                          textShadow: "0 14px 36px rgba(0,0,0,0.28)",
                        }}
                      >
                        <span className="block">Saad</span>
                        <span className="block">Bin Zain</span>
                      </h1>
                      <p
                        className="mt-3 text-[0.78rem] uppercase"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: "rgba(208,171,110,0.9)",
                          letterSpacing: "0.28rem",
                        }}
                      >
                        Luxury command across Dubai
                      </p>
                    </div>
                  </div>

                  <p
                    className="max-w-[29rem] text-[clamp(1rem,1.18vw,1.08rem)] leading-[1.85] text-white/74"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      textShadow: "0 8px 22px rgba(0,0,0,0.22)",
                    }}
                  >
                    Personal portfolio presence shaped through market intelligence, cross-border introductions, and a highly selective approach to Dubai&apos;s luxury real estate corridors.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {["Prime Retail", "Private Office", "Cross-Border Access"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border px-5 py-[0.82rem] text-[0.68rem] uppercase"
                        style={{
                          borderColor: "rgba(208,171,110,0.24)",
                          background: "linear-gradient(180deg, rgba(14,14,14,0.34), rgba(7,7,7,0.18))",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 14px 28px rgba(0,0,0,0.14)",
                          backdropFilter: "blur(10px)",
                          color: "rgba(208,171,110,0.92)",
                          fontFamily: "'Inter', sans-serif",
                          letterSpacing: "0.26rem",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DubaiDistrictOverlay mouse={mouseScreenRef} />

        <div ref={silkRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-[3]" style={{ top: `${NAVBAR_GUARD}px` }}>
          <Canvas
            className="pointer-events-none"
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, 6.5], fov: 34 }}
            onCreated={({ gl, scene }) => {
              gl.toneMapping = THREE.CineonToneMapping;
              gl.toneMappingExposure = 0.88;
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.setClearAlpha(0);
              scene.background = null;
            }}
          >
            <SilkScene mouse={mouseRef} />
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
