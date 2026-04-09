import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_GUARD = 80;
const SILK_WIDTH = 8.6;
const SILK_HEIGHT = 5.4;
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
      [0.12, 0.68],
      [0.18, 0.6],
      [0.24, 0.58],
      [0.28, 0.52],
      [0.34, 0.48],
      [0.4, 0.42],
    ],
    [
      [0.54, 0.28],
      [0.58, 0.3],
      [0.62, 0.36],
      [0.66, 0.4],
      [0.72, 0.44],
      [0.76, 0.5],
    ],
    [
      [0.26, 0.76],
      [0.33, 0.72],
      [0.41, 0.7],
      [0.48, 0.73],
      [0.54, 0.78],
      [0.61, 0.8],
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
    [0.37, 0.47],
    [0.63, 0.37],
    [0.53, 0.77],
  ];

  hubs.forEach(([x, y]) => {
    const px = x * canvas.width;
    const py = y * canvas.height;
    const gradient = context.createRadialGradient(px, py, 0, px, py, 18);
    gradient.addColorStop(0, "rgba(255, 236, 188, 0.95)");
    gradient.addColorStop(0.3, "rgba(212, 171, 103, 0.8)");
    gradient.addColorStop(1, "rgba(212, 171, 103, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(px, py, 18, 0, Math.PI * 2);
    context.fill();
  });

  context.fillStyle = "rgba(212, 171, 103, 0.8)";
  context.font = "500 30px Inter";
  context.fillText("DUBAI", canvas.width * 0.27, canvas.height * 0.43);
  context.fillText("LONDON", canvas.width * 0.59, canvas.height * 0.33);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
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
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#030303", 0.16]} />
      <ambientLight intensity={0.14} />
      <pointLight ref={lightRef} position={[0.2, 0.3, 2.4]} intensity={0.4} distance={8} color="#d3a860" />
      <directionalLight position={[-3.5, 2.8, 1.5]} intensity={0.12} color="#9a8f7a" />

      <mesh position={[0, 0, -3.8]}>
        <planeGeometry args={[16, 10]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      <mesh ref={ringRef} position={[2.2, -0.7, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.035, 24, 140]} />
        <meshStandardMaterial color="#8c6a3c" emissive="#6f4e24" emissiveIntensity={0.3} transparent opacity={0.42} />
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
    const radius = 1.22;

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
    <mesh position={[1.1, 0.05, 0]} rotation={[-0.08, -0.22, -0.04]}>
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

            float alpha = 0.9 - reveal * 0.58 + fold * 0.06;
            alpha = clamp(alpha, 0.22, 0.94);

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

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const silkRef = useRef<HTMLDivElement>(null);
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
        <div ref={backgroundRef} className="pointer-events-none absolute inset-0 z-0">
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

        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(3,3,3,0.78)_0%,rgba(3,3,3,0.42)_42%,rgba(3,3,3,0.26)_66%,rgba(3,3,3,0.58)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(3,3,3,0.72)_0%,rgba(3,3,3,0.18)_34%,rgba(3,3,3,0.12)_72%,rgba(3,3,3,0.88)_100%)]" />

        <div className="relative z-10 mx-auto h-full max-w-[1200px]" style={{ paddingLeft: "10%", paddingTop: `${NAVBAR_GUARD}px`, boxSizing: "border-box" }}>
          <div className="flex h-full flex-col justify-center">
            <div ref={textRef} className="relative max-w-[42rem]" style={{ zIndex: 10 }}>
              <p
                className="text-[clamp(0.82rem,1vw,0.95rem)]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "rgba(208,171,110,0.92)",
                  letterSpacing: "0.28rem",
                  textTransform: "uppercase",
                }}
              >
                Sovereign-grade real estate advisory.
              </p>
              <h1
                className="mt-6 text-white"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 100,
                  fontSize: "clamp(3rem, 6.5vw, 6.4rem)",
                  letterSpacing: "clamp(0.5rem, 1.8vw, 1.5rem)",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                }}
              >
                <span className="block">Luxury</span>
                <span className="block">Command</span>
              </h1>
              <p className="mt-6 max-w-[27rem] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.7] text-white/72" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Strategic placement across Dubai, London, and private cross-border mandates, shaped with discretion, timing, and institutional-grade judgment.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Prime Retail", "Private Office", "Cross-Border Access"].map((item) => (
                  <button
                    key={item}
                    className="rounded-full border px-4 py-2 text-[0.7rem] uppercase transition-colors"
                    style={{
                      borderColor: "rgba(208,171,110,0.22)",
                      background: "rgba(8,8,8,0.16)",
                      color: "rgba(208,171,110,0.9)",
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: "0.24rem",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={silkRef} className="pointer-events-none absolute inset-0 z-20">
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