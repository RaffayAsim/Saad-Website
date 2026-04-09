import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import saadPortrait from "../assets/saad-bin-zain-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_GUARD = 88;

function ease(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

function createGlobalRouteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 1080;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = "rgba(223, 183, 103, 0.34)";
  context.shadowBlur = 20;

  const coastline = [
    [160, 208],
    [250, 290],
    [386, 372],
    [566, 434],
    [772, 456],
    [982, 442],
    [1188, 400],
    [1420, 332],
    [1628, 284],
  ];

  const routes = [
    [[86, 430], [230, 402], [398, 384], [564, 372], [742, 364], [928, 362]],
    [[112, 252], [250, 296], [410, 340], [582, 374], [764, 392]],
    [[188, 666], [338, 646], [506, 604], [680, 536], [842, 468]],
    [[320, 812], [454, 766], [590, 696], [720, 604], [862, 502]],
    [[598, 226], [760, 264], [930, 304], [1118, 328], [1328, 336]],
    [[930, 362], [1104, 342], [1284, 304], [1458, 236], [1652, 92]],
    [[928, 362], [1080, 430], [1216, 542], [1338, 680], [1456, 844]],
    [[1184, 186], [1292, 238], [1404, 292], [1536, 338], [1714, 376]],
    [[470, 194], [606, 258], [748, 314], [908, 346], [1076, 364]],
    [[146, 526], [318, 520], [488, 494], [658, 454], [840, 414]],
  ];

  context.strokeStyle = "rgba(184, 144, 77, 0.22)";
  context.lineWidth = 3.2;
  context.beginPath();
  coastline.forEach(([x, y], index) => {
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.stroke();

  routes.forEach((route, index) => {
    context.strokeStyle = index < 3 ? "rgba(233, 190, 112, 0.38)" : index < 7 ? "rgba(214, 171, 103, 0.25)" : "rgba(214, 171, 103, 0.16)";
    context.lineWidth = index < 3 ? 2.5 : index < 7 ? 1.85 : 1.25;
    context.beginPath();
    route.forEach(([x, y], pointIndex) => {
      if (pointIndex === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  });

  const hubs = [
    [572, 374, 26, false],
    [748, 392, 30, false],
    [928, 362, 72, true],
    [1284, 304, 26, false],
    [1452, 236, 22, false],
    [856, 500, 24, false],
    [320, 520, 24, false],
    [506, 604, 24, false],
    [166, 252, 20, false],
    [1456, 844, 18, false],
  ] as const;

  hubs.forEach(([x, y, radius, isPrimary]) => {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius * 1.8);
    gradient.addColorStop(0, isPrimary ? "rgba(255,239,201,0.96)" : "rgba(243,214,158,0.8)");
    gradient.addColorStop(0.26, isPrimary ? "rgba(236,196,118,0.88)" : "rgba(214,171,103,0.58)");
    gradient.addColorStop(1, "rgba(214,171,103,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius * 1.8, 0, Math.PI * 2);
    context.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createSatelliteGridTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 1080;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(202, 178, 132, 0.08)";
  context.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += 78) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }

  for (let y = 0; y <= canvas.height; y += 78) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  context.strokeStyle = "rgba(202, 178, 132, 0.06)";
  context.lineWidth = 0.8;
  const diagonals = [
    [0, 144, 640, 0],
    [1200, 0, 1800, 460],
    [0, 880, 820, 500],
    [1320, 1080, 1800, 680],
  ];

  diagonals.forEach(([x1, y1, x2, y2]) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  });

  context.fillStyle = "rgba(226, 196, 142, 0.16)";
  context.font = "500 14px Inter";
  [
    [78, 84, "SAT-01"],
    [1480, 108, "ARC-22"],
    [96, 980, "GRID-07"],
    [1512, 992, "D-TRACE"],
  ].forEach(([x, y, label]) => {
    context.fillText(label as string, x as number, y as number);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function GoldDust({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 220;
    const buffer = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      buffer[index * 3] = (Math.random() - 0.5) * 18;
      buffer[index * 3 + 1] = (Math.random() - 0.5) * 10;
      buffer[index * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    return buffer;
  }, []);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    ref.current.position.x = ease(ref.current.position.x, mouse.current.x * 0.18, 0.03);
    ref.current.position.y = ease(ref.current.position.y, mouse.current.y * 0.14, 0.03);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#d3a860" size={0.026} transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function BackgroundScene({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const mapRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const routeRef = useRef<THREE.Line>(null);
  const activeHubRef = useRef<THREE.Mesh>(null);
  const mapTexture = useMemo(() => createGlobalRouteTexture(), []);
  const gridTexture = useMemo(() => createSatelliteGridTexture(), []);
  const anchors = useMemo(
    () => [
      { name: "Dubai", world: new THREE.Vector3(0.18, 0.34, -2.5), pointer: new THREE.Vector2(0.02, 0.1) },
      { name: "Jumeirah", world: new THREE.Vector3(-4.3, 0.52, -2.5), pointer: new THREE.Vector2(-0.58, 0.08) },
      { name: "Downtown", world: new THREE.Vector3(-1.8, 0.38, -2.5), pointer: new THREE.Vector2(-0.22, 0.04) },
      { name: "DIFC", world: new THREE.Vector3(-0.86, 0.28, -2.5), pointer: new THREE.Vector2(-0.1, 0.02) },
      { name: "Palm", world: new THREE.Vector3(4.1, 1.06, -2.5), pointer: new THREE.Vector2(0.52, 0.22) },
      { name: "Creek", world: new THREE.Vector3(-0.92, -1.56, -2.5), pointer: new THREE.Vector2(-0.16, -0.28) },
      { name: "Expo", world: new THREE.Vector3(5.3, -2.12, -2.5), pointer: new THREE.Vector2(0.74, -0.42) },
    ],
    [],
  );

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = ease(lightRef.current.position.x, mouse.current.x * 3.2, 0.04);
      lightRef.current.position.y = ease(lightRef.current.position.y, mouse.current.y * 2.2, 0.04);
    }

    if (mapRef.current) {
      mapRef.current.position.x = ease(mapRef.current.position.x, mouse.current.x * 0.24, 0.025);
      mapRef.current.position.y = ease(mapRef.current.position.y, -0.16 + mouse.current.y * 0.16, 0.025);
      mapRef.current.rotation.z = ease(mapRef.current.rotation.z, mouse.current.x * -0.018, 0.02);
    }

    if (gridRef.current) {
      gridRef.current.position.x = ease(gridRef.current.position.x, mouse.current.x * 0.08, 0.02);
      gridRef.current.position.y = ease(gridRef.current.position.y, mouse.current.y * 0.06, 0.02);
    }

    if (routeRef.current && activeHubRef.current) {
      const pointer = new THREE.Vector2(mouse.current.x, mouse.current.y);
      const nearest = anchors.reduce(
        (best, anchor) => {
          const distance = anchor.pointer.distanceTo(pointer);
          if (distance < best.distance) {
            return { anchor, distance };
          }
          return best;
        },
        { anchor: anchors[0], distance: Number.POSITIVE_INFINITY },
      );

      const shouldShow = nearest.anchor.name !== "Dubai" && nearest.distance < 0.3;
      const geometry = routeRef.current.geometry as THREE.BufferGeometry;
      const positions = geometry.attributes.position.array as Float32Array;
      const start = anchors[0].world;
      const end = nearest.anchor.world;
      const control = new THREE.Vector3((start.x + end.x) * 0.5, Math.max(start.y, end.y) + 0.8, -2.2);
      const curve = new THREE.QuadraticBezierCurve3(start, control, end);
      const points = curve.getPoints(32);

      points.forEach((point, index) => {
        positions[index * 3] = point.x;
        positions[index * 3 + 1] = point.y;
        positions[index * 3 + 2] = point.z;
      });
      geometry.attributes.position.needsUpdate = true;

      routeRef.current.visible = shouldShow;
      activeHubRef.current.visible = shouldShow;
      if (shouldShow) {
        activeHubRef.current.position.copy(end);
        activeHubRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4.2) * 0.08);
      }
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#040303", 0.14]} />
      <ambientLight intensity={0.22} />
      <pointLight ref={lightRef} position={[0.4, 0.2, 2.6]} intensity={0.56} distance={9} color="#d7b06d" />
      <directionalLight position={[-4, 2.6, 1.2]} intensity={0.14} color="#a28f72" />

      <mesh position={[0, -0.08, -4.1]}>
        <planeGeometry args={[19.4, 11.6]} />
        <meshBasicMaterial color="#050404" />
      </mesh>

      <mesh ref={gridRef} position={[0, -0.1, -3.3]}>
        <planeGeometry args={[20.4, 12.2]} />
        <meshBasicMaterial map={gridTexture} transparent opacity={0.12} toneMapped={false} depthWrite={false} />
      </mesh>

      <mesh ref={mapRef} position={[0, -0.16, -2.7]}>
        <planeGeometry args={[14.3, 8.3]} />
        <meshBasicMaterial map={mapTexture} transparent opacity={0.72} toneMapped={false} depthWrite={false} />
      </mesh>

      <line ref={routeRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={new Float32Array(33 * 3)} count={33} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#e0bb72" transparent opacity={0.74} />
      </line>

      <mesh ref={activeHubRef} visible={false}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#f2d392" transparent opacity={0.9} />
      </mesh>

      <GoldDust mouse={mouse} />
    </>
  );
}

function FrostedMonolith({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const causticMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.customProgramCacheKey = () => "frosted-monolith-v2";
    materialRef.current.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uMouse = { value: new THREE.Vector2(0.5, 0.5) };

      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec2 vGlassUv;")
        .replace("#include <uv_vertex>", "#include <uv_vertex>\nvGlassUv = uv;");

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec2 vGlassUv;\nuniform float uTime;\nuniform vec2 uMouse;\nfloat hash(vec2 point) { return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123); }\nfloat noise(vec2 point) { vec2 i = floor(point); vec2 f = fract(point); float a = hash(i); float b = hash(i + vec2(1.0, 0.0)); float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y; }",
        )
        .replace(
          "vec4 diffuseColor = vec4( diffuse, opacity );",
          "vec4 diffuseColor = vec4( diffuse, opacity );\nfloat frostNoise = noise(vGlassUv * 18.0 + uTime * 0.035);\nfloat mouseGlow = 1.0 - smoothstep(0.0, 0.52, distance(vGlassUv, uMouse));\ndiffuseColor.a *= mix(0.52, 0.82, frostNoise);\ndiffuseColor.rgb += vec3(0.07, 0.055, 0.028) * mouseGlow * 0.26;",
        )
        .replace(
          "#include <dithering_fragment>",
          "float edgeRim = smoothstep(0.0, 0.16, vGlassUv.x) * smoothstep(0.0, 0.16, 1.0 - vGlassUv.x) * smoothstep(0.0, 0.16, vGlassUv.y) * smoothstep(0.0, 0.16, 1.0 - vGlassUv.y);\ngl_FragColor.rgb += vec3(0.22, 0.18, 0.1) * (1.0 - edgeRim) * 0.08;\n#include <dithering_fragment>",
        );

      materialRef.current!.userData.shader = shader;
    };
    materialRef.current.needsUpdate = true;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = ease(groupRef.current.rotation.y, mouse.current.x * 0.1, 0.04);
      groupRef.current.rotation.x = ease(groupRef.current.rotation.x, mouse.current.y * -0.08, 0.04);
    }

    const compiled = materialRef.current?.userData.shader as THREE.Shader | undefined;
    if (compiled) {
      compiled.uniforms.uTime.value = state.clock.elapsedTime;
      compiled.uniforms.uMouse.value.set(mouse.current.x * 0.25 + 0.5, mouse.current.y * 0.25 + 0.5);
    }

    if (causticMaterialRef.current) {
      causticMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      causticMaterialRef.current.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0.12, -0.02, -0.16]}>
        <planeGeometry args={[7.4, 5.8]} />
        <shaderMaterial
          ref={causticMaterialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) } }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec2 uMouse;
            varying vec2 vUv;

            float band(vec2 uv, float offset) {
              return smoothstep(0.0, 0.24, 1.0 - abs(uv.y - 0.5 - sin(uv.x * 5.8 + uTime * 0.5 + offset) * 0.08));
            }

            void main() {
              vec2 uv = vUv;
              uv.x += uMouse.x * 0.06;
              uv.y += uMouse.y * 0.04;
              float streakA = band(uv, 0.0);
              float streakB = band(vec2(uv.x * 1.12, uv.y + 0.08), 1.6);
              float focus = 1.0 - smoothstep(0.14, 0.78, distance(uv, vec2(0.56 + uMouse.x * 0.05, 0.48 - uMouse.y * 0.04)));
              vec3 color = vec3(0.91, 0.74, 0.42) * (streakA * 0.12 + streakB * 0.09 + focus * 0.1);
              gl_FragColor = vec4(color, (streakA + streakB + focus) * 0.22);
            }
          `}
        />
      </mesh>

      <mesh>
        <boxGeometry args={[6.88, 5.56, 0.1, 16, 16, 2]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#f5eedb"
          transparent
          opacity={0.22}
          transmission={0.9}
          ior={1.4}
          thickness={0.18}
          roughness={0.72}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.28}
          reflectivity={0.58}
        />
      </mesh>

      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[6.62, 5.3]} />
        <meshBasicMaterial color="#f5eedb" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function MonolithScene({ mouse }: { mouse: MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.56} />
      <pointLight position={[2.2, 1.6, 2.8]} intensity={1.6} color="#f5d9a0" />
      <pointLight position={[-2.1, -1.2, 1.4]} intensity={0.48} color="#c79b53" />
      <FrostedMonolith mouse={mouse} />
    </>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const monolithRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
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
    const monolith = monolithRef.current;
    if (!section || !monolith) {
      return undefined;
    }

    const shards = Array.from(monolith.querySelectorAll<HTMLElement>(".glass-shard"));

    const ctx = gsap.context(() => {
      if (backgroundRef.current) {
        gsap.from(backgroundRef.current, { opacity: 0, scale: 1.06, duration: 1.3, ease: "power3.out" });
      }

      gsap.from(monolith, { opacity: 0, y: 34, scale: 0.96, duration: 1.15, ease: "power3.out", delay: 0.08 });

      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          opacity: 0,
          y: 24,
          duration: 0.95,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.18,
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const dissolve = THREE.MathUtils.clamp((progress - 0.18) / 0.82, 0, 1);

          if (backgroundRef.current) {
            gsap.set(backgroundRef.current, {
              opacity: 1 - progress * 0.34,
              scale: 1 - progress * 0.04,
            });
          }

          gsap.set(monolith, {
            y: progress * -22,
            scale: 1 - progress * 0.05,
            opacity: 1 - progress * 0.12,
          });

          if (contentRef.current) {
            gsap.set(contentRef.current, {
              y: progress * -18,
              opacity: 1 - dissolve * 0.86,
            });
          }

          if (portraitRef.current) {
            gsap.set(portraitRef.current, {
              x: dissolve * 18,
              opacity: 1 - dissolve * 0.92,
              scale: 1 - dissolve * 0.04,
            });
          }

          shards.forEach((shard, index) => {
            const spread = index - (shards.length - 1) / 2;
            gsap.set(shard, {
              y: dissolve * (160 + index * 24),
              x: dissolve * spread * -12,
              rotation: dissolve * spread * 6,
              opacity: 0.16 + dissolve * 0.44,
              scaleY: 1 + dissolve * 1.5,
            });
          });

          if (timelineRef.current) {
            gsap.set(timelineRef.current, {
              opacity: dissolve,
              scaleY: dissolve,
              transformOrigin: "top center",
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
      className="relative"
      style={{
        background:
          "radial-gradient(circle at 22% 28%, rgba(167,126,66,0.08), transparent 22%), radial-gradient(circle at 78% 24%, rgba(167,126,66,0.08), transparent 18%), linear-gradient(180deg, #020202 0%, #050404 54%, #030303 100%)",
      }}
      data-section="hero"
    >
      <div className="hero-wrapper relative overflow-hidden" style={{ height: "100vh" }}>
        <div ref={backgroundRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-0" style={{ top: `${NAVBAR_GUARD}px` }}>
          <Canvas
            className="pointer-events-none"
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false }}
            camera={{ position: [0, 0, 5.7], fov: 36 }}
            onCreated={({ gl, scene }) => {
              gl.toneMapping = THREE.CineonToneMapping;
              gl.toneMappingExposure = 0.98;
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.setClearColor("#030202", 1);
              scene.background = new THREE.Color("#030202");
            }}
          >
            <BackgroundScene mouse={mouseRef} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]" style={{ top: `${NAVBAR_GUARD}px`, background: "linear-gradient(90deg, rgba(3,3,3,0.48) 0%, rgba(3,3,3,0.18) 32%, rgba(3,3,3,0.08) 60%, rgba(3,3,3,0.24) 100%)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]" style={{ top: `${NAVBAR_GUARD}px`, background: "linear-gradient(180deg, rgba(3,3,3,0.2) 0%, rgba(3,3,3,0.04) 24%, rgba(3,3,3,0.14) 76%, rgba(3,3,3,0.82) 100%)" }} />

        <div
          ref={monolithRef}
          className="absolute z-[2] overflow-hidden rounded-[34px]"
          style={{
            left: "clamp(2rem, 5vw, 5rem)",
            top: `calc(${NAVBAR_GUARD}px + 7vh)`,
            width: "min(60vw, 980px)",
            height: "min(68vh, 640px)",
            border: "1px solid rgba(245, 238, 219, 0.16)",
            background: "linear-gradient(180deg, rgba(245,238,219,0.05), rgba(255,255,255,0.02))",
            boxShadow: "0 26px 70px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[34px]">
            <Canvas
              className="pointer-events-none"
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
              camera={{ position: [0, 0, 6.4], fov: 34 }}
              onCreated={({ gl, scene }) => {
                gl.toneMapping = THREE.CineonToneMapping;
                gl.toneMappingExposure = 0.9;
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.setClearAlpha(0);
                scene.background = null;
              }}
            >
              <MonolithScene mouse={mouseRef} />
            </Canvas>
          </div>

          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="glass-shard pointer-events-none absolute bottom-[-6%] top-[10%] z-[1] rounded-full"
              style={{
                left: `${14 + index * 14}%`,
                width: index === 2 ? "7%" : "4.8%",
                background: "linear-gradient(180deg, rgba(245,238,219,0.1), rgba(245,238,219,0.02))",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
                filter: "blur(0.8px)",
                opacity: 0.14,
              }}
            />
          ))}

          <div ref={contentRef} className="relative z-[3] grid h-full grid-cols-[1.7fr_0.95fr] gap-8 p-8 md:p-10 lg:p-12">
            <div className="flex flex-col justify-between pr-2">
              <div>
                <div className="flex items-center gap-4">
                  <span className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(216,182,117,0), rgba(216,182,117,0.9))" }} />
                  <p
                    className="text-[clamp(0.76rem,0.9vw,0.92rem)] uppercase"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(220, 187, 123, 0.92)",
                      letterSpacing: "0.34rem",
                    }}
                  >
                    Sovereign-grade real estate advisory
                  </p>
                </div>

                <h1
                  className="mt-8 uppercase"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    fontSize: "clamp(3.4rem, 6.2vw, 6.25rem)",
                    lineHeight: 0.88,
                    letterSpacing: "1.2rem",
                    color: "#F5EEDB",
                    WebkitTextStroke: "1px rgba(189, 144, 74, 0.72)",
                    textShadow: "0 18px 36px rgba(0,0,0,0.28)",
                  }}
                >
                  <span className="block">Luxury</span>
                  <span className="block">Command</span>
                </h1>

                <p
                  className="mt-7 max-w-[29rem] text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.85]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "rgba(245, 238, 219, 0.76)",
                    textShadow: "0 12px 26px rgba(0,0,0,0.22)",
                  }}
                >
                  Private market intelligence across Dubai&apos;s prime corridors, structured through discreet introductions, high-value positioning, and institutional-grade judgment.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-3">
                  {["Prime Retail", "Private Office", "Cross-Border Access"].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border px-5 py-[0.86rem] text-[0.68rem] uppercase"
                      style={{
                        borderColor: "rgba(214, 181, 118, 0.22)",
                        background: "linear-gradient(180deg, rgba(10,10,10,0.28), rgba(10,10,10,0.14))",
                        color: "rgba(220, 187, 123, 0.92)",
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: "0.26rem",
                        backdropFilter: "blur(10px)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-4">
                  <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(214,181,118,0.28), rgba(214,181,118,0))" }} />
                  <p
                    className="text-[0.68rem] uppercase"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(214, 181, 118, 0.72)",
                      letterSpacing: "0.22rem",
                    }}
                  >
                    Dubai map intelligence layer
                  </p>
                </div>
              </div>
            </div>

            <div ref={portraitRef} className="relative flex items-end justify-end">
              <div
                className="absolute inset-[8%] rounded-[28px]"
                style={{
                  border: "1px solid rgba(245, 238, 219, 0.14)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              />
              <div className="absolute inset-[8%] overflow-hidden rounded-[28px]">
                <img
                  src={saadPortrait}
                  alt="Saad Bin Zain"
                  className="h-full w-full object-cover object-center"
                  style={{
                    filter: "grayscale(1) contrast(1.18) brightness(0.78)",
                    mixBlendMode: "screen",
                    opacity: 0.92,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(214,181,118,0.06), rgba(214,181,118,0.18)), radial-gradient(circle at 42% 28%, rgba(214,181,118,0.28), transparent 44%), linear-gradient(90deg, rgba(5,5,5,0.06) 0%, rgba(5,5,5,0.42) 100%)",
                    mixBlendMode: "screen",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-[42%]" style={{ background: "linear-gradient(180deg, rgba(3,3,3,0), rgba(3,3,3,0.84))" }} />
              </div>

              <div className="absolute bottom-[12%] left-[16%] right-[12%] z-[2]">
                <p
                  className="text-[0.7rem] uppercase"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "rgba(220, 187, 123, 0.76)",
                    letterSpacing: "0.22rem",
                  }}
                >
                  Saad Bin Zain
                </p>
                <p
                  className="mt-2 text-[0.96rem] leading-[1.6]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "rgba(245, 238, 219, 0.8)",
                  }}
                >
                  Market authority shaped through luxury retail strategy, private advisory, and two decades of Dubai execution.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={timelineRef}
          className="pointer-events-none absolute z-[3]"
          style={{
            left: "clamp(19rem, 34vw, 34rem)",
            top: `calc(${NAVBAR_GUARD}px + 69vh)`,
            width: "2px",
            height: "34vh",
            opacity: 0,
            background: "linear-gradient(180deg, rgba(214,181,118,0.46), rgba(214,181,118,0.02))",
            boxShadow: "0 0 24px rgba(214,181,118,0.18)",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
