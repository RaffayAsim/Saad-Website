import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import saadPortrait from "../assets/saad-bin-zain-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_GUARD = 80;
const IS_TOUCH = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

// ── Dubai Cartographic Map ─────────────────────────────────────────────────
function drawDubaiMap(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const px = (x: number) => x * (w / 1600);
  const py = (y: number) => y * (h / 900);

  // ── Background: deep dark void ──────────────────────────────
  ctx.fillStyle = "#0a0703";
  ctx.fillRect(0, 0, w, h);

  // ── Persian Gulf (sea — top area above coastline) ─────────────
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, py(230));
  ctx.bezierCurveTo(px(1520), py(235), px(1440), py(215), px(1350), py(210));
  ctx.bezierCurveTo(px(1260), py(205), px(1180), py(218), px(1080), py(248));
  ctx.bezierCurveTo(px(990), py(272), px(890), py(295), px(790), py(312));
  ctx.bezierCurveTo(px(690), py(328), px(580), py(345), px(480), py(364));
  ctx.bezierCurveTo(px(380), py(382), px(280), py(405), px(160), py(432));
  ctx.lineTo(0, py(455));
  ctx.closePath();
  const seaGrad = ctx.createLinearGradient(0, 0, 0, py(480));
  seaGrad.addColorStop(0, "rgba(14, 32, 60, 0.88)");
  seaGrad.addColorStop(0.8, "rgba(10, 24, 46, 0.92)");
  seaGrad.addColorStop(1, "rgba(8, 18, 36, 0.94)");
  ctx.fillStyle = seaGrad;
  ctx.fill();

  // ── Coastline stroke ──────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(0, py(455));
  ctx.bezierCurveTo(px(160), py(432), px(280), py(405), px(480), py(364));
  ctx.bezierCurveTo(px(580), py(345), px(690), py(328), px(790), py(312));
  ctx.bezierCurveTo(px(890), py(295), px(990), py(272), px(1080), py(248));
  ctx.bezierCurveTo(px(1180), py(218), px(1260), py(205), px(1350), py(210));
  ctx.bezierCurveTo(px(1440), py(215), px(1520), py(235), w, py(230));
  ctx.strokeStyle = "rgba(192, 152, 64, 0.72)";
  ctx.lineWidth = px(2.5);
  ctx.stroke();

  // ── PALM JUMEIRAH ──────────────────────────────────────────────
  // Located ~(340–420, 160–375) — juts into sea from marina coast
  const palmBaseX = px(375), palmBaseY = py(368);
  const palmTopX = px(375), palmTopY = py(168);
  const frondOX = px(375), frondOY = py(182);

  // Trunk
  ctx.beginPath();
  ctx.moveTo(palmBaseX, palmBaseY);
  ctx.lineTo(palmTopX, palmTopY);
  ctx.strokeStyle = "rgba(192, 152, 64, 0.72)";
  ctx.lineWidth = px(7.5);
  ctx.lineCap = "round";
  ctx.stroke();

  // 17 fronds fanning northward (upward in canvas)
  for (let i = 0; i < 17; i++) {
    const theta = -Math.PI + (i / 16) * Math.PI;
    const fLen = i === 8 ? py(75) : py(55) + Math.abs(i - 8) * py(-1.5);
    const ex = frondOX + Math.cos(theta) * fLen * 1.35;
    const ey = frondOY + Math.sin(theta) * fLen;
    ctx.beginPath();
    ctx.moveTo(frondOX, frondOY);
    ctx.quadraticCurveTo(
      frondOX + Math.cos(theta) * fLen * 0.65,
      frondOY + Math.sin(theta) * fLen * 0.65,
      ex, ey
    );
    ctx.strokeStyle = "rgba(180, 140, 58, 0.52)";
    ctx.lineWidth = px(2.6);
    ctx.stroke();
  }

  // Crescent ring
  ctx.beginPath();
  ctx.arc(frondOX, frondOY - py(6), px(84), 0, Math.PI, true);
  ctx.strokeStyle = "rgba(180, 140, 58, 0.40)";
  ctx.lineWidth = px(4.5);
  ctx.stroke();

  // ── DUBAI MARINA CRESCENT CANAL ───────────────────────────────
  ctx.beginPath();
  ctx.moveTo(px(210), py(548));
  ctx.bezierCurveTo(px(182), py(468), px(178), py(418), px(205), py(388));
  ctx.bezierCurveTo(px(232), py(358), px(278), py(346), px(332), py(352));
  ctx.bezierCurveTo(px(385), py(358), px(428), py(385), px(455), py(425));
  ctx.bezierCurveTo(px(472), py(452), px(474), py(498), px(458), py(545));
  ctx.strokeStyle = "rgba(42, 88, 148, 0.65)";
  ctx.lineWidth = px(5.5);
  ctx.lineCap = "round";
  ctx.stroke();

  // Marina inner fill
  ctx.beginPath();
  ctx.moveTo(px(230), py(535));
  ctx.bezierCurveTo(px(205), py(470), px(202), py(425), px(225), py(398));
  ctx.bezierCurveTo(px(248), py(370), px(288), py(360), px(338), py(366));
  ctx.strokeStyle = "rgba(42, 88, 148, 0.32)";
  ctx.lineWidth = px(3);
  ctx.stroke();

  // ── DUBAI CREEK ──────────────────────────────────────────────
  // Prominent S-curve, x:1030–1140, y:248–490
  ctx.beginPath();
  ctx.moveTo(px(1075), py(248));
  ctx.bezierCurveTo(px(1068), py(285), px(1058), py(318), px(1052), py(352));
  ctx.bezierCurveTo(px(1045), py(382), px(1055), py(410), px(1084), py(438));
  ctx.bezierCurveTo(px(1108), py(460), px(1128), py(466), px(1112), py(490));
  ctx.strokeStyle = "rgba(42, 88, 148, 0.70)";
  ctx.lineWidth = px(10);
  ctx.lineCap = "round";
  ctx.stroke();

  // Creek wide mouth
  ctx.beginPath();
  ctx.moveTo(px(1030), py(248));
  ctx.bezierCurveTo(px(1052), py(237), px(1078), py(242), px(1102), py(255));
  ctx.strokeStyle = "rgba(42, 88, 148, 0.48)";
  ctx.lineWidth = px(18);
  ctx.stroke();

  // ── SHEIKH ZAYED ROAD (E11) — main spine ─────────────────────
  ctx.beginPath();
  ctx.moveTo(0, py(568));
  ctx.bezierCurveTo(px(250), py(548), px(500), py(512), px(720), py(476));
  ctx.bezierCurveTo(px(900), py(450), px(1050), py(422), px(1240), py(386));
  ctx.bezierCurveTo(px(1390), py(358), px(1530), py(330), w, py(316));
  ctx.strokeStyle = "rgba(218, 172, 72, 0.90)";
  ctx.lineWidth = px(5.5);
  ctx.lineCap = "butt";
  ctx.stroke();
  // SZR inner lane
  ctx.beginPath();
  ctx.moveTo(0, py(584));
  ctx.bezierCurveTo(px(250), py(564), px(500), py(528), px(720), py(492));
  ctx.bezierCurveTo(px(900), py(466), px(1050), py(438), px(1240), py(402));
  ctx.bezierCurveTo(px(1390), py(374), px(1530), py(346), w, py(332));
  ctx.strokeStyle = "rgba(218, 172, 72, 0.48)";
  ctx.lineWidth = px(3);
  ctx.stroke();

  // ── AL WASL ROAD ──────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(0, py(492));
  ctx.bezierCurveTo(px(260), py(474), px(520), py(450), px(740), py(418));
  ctx.bezierCurveTo(px(900), py(394), px(1020), py(372), px(1220), py(340));
  ctx.strokeStyle = "rgba(192, 152, 60, 0.52)";
  ctx.lineWidth = px(2.4);
  ctx.stroke();

  // ── JUMEIRAH BEACH ROAD ───────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(0, py(468));
  ctx.bezierCurveTo(px(200), py(450), px(440), py(430), px(640), py(402));
  ctx.bezierCurveTo(px(800), py(380), px(920), py(360), px(1030), py(342));
  ctx.strokeStyle = "rgba(192, 152, 60, 0.38)";
  ctx.lineWidth = px(1.8);
  ctx.stroke();

  // ── BUSINESS BAY CANAL ────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(px(660), py(498));
  ctx.bezierCurveTo(px(694), py(458), px(740), py(425), px(790), py(408));
  ctx.bezierCurveTo(px(832), py(394), px(862), py(393), px(875), py(410));
  ctx.strokeStyle = "rgba(42, 88, 148, 0.58)";
  ctx.lineWidth = px(5);
  ctx.stroke();

  // ── MAJOR CROSS-ROADS ─────────────────────────────────────────
  const crossRoads: [number, number, number, number, number][] = [
    [px(268), py(376), px(262), py(582), 0.22],
    [px(468), py(358), px(460), py(566), 0.20],
    [px(632), py(338), px(622), py(545), 0.19],
    [px(798), py(318), px(786), py(522), 0.20],
    [px(958), py(298), px(944), py(506), 0.18],
    [px(1172), py(268), px(1158), py(474), 0.16],
    [px(1326), py(245), px(1312), py(445), 0.14],
  ];
  crossRoads.forEach(([x1, y1, x2, y2, op]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(192, 152, 60, ${Math.min(op * 1.9, 0.48)})`;
    ctx.lineWidth = px(1.8);
    ctx.stroke();
  });

  // ── FINE STREET GRID (Downtown) ───────────────────────────────
  ctx.strokeStyle = "rgba(192, 152, 60, 0.22)";
  ctx.lineWidth = px(0.55);
  for (let gx = px(745); gx <= px(950); gx += px(13)) {
    ctx.beginPath(); ctx.moveTo(gx, py(312)); ctx.lineTo(gx, py(480)); ctx.stroke();
  }
  for (let gy = py(312); gy <= py(480); gy += py(16)) {
    ctx.beginPath(); ctx.moveTo(px(745), gy); ctx.lineTo(px(950), gy); ctx.stroke();
  }
  // Deira grid
  ctx.strokeStyle = "rgba(192, 152, 60, 0.18)";
  for (let gx = px(1058); gx <= px(1342); gx += px(11)) {
    ctx.beginPath(); ctx.moveTo(gx, py(265)); ctx.lineTo(gx, py(462)); ctx.stroke();
  }
  for (let gy = py(265); gy <= py(462); gy += py(13)) {
    ctx.beginPath(); ctx.moveTo(px(1058), gy); ctx.lineTo(px(1342), gy); ctx.stroke();
  }

  // ── MAP COMPASS ROSE (subtle, top-right) ─────────────────────
  const crx = px(1520), cry = py(80), crr = px(28);
  ctx.strokeStyle = "rgba(192, 152, 60, 0.45)";
  ctx.lineWidth = px(1.2);
  ctx.beginPath(); ctx.moveTo(crx, cry - crr); ctx.lineTo(crx, cry + crr); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(crx - crr, cry); ctx.lineTo(crx + crr, cry); ctx.stroke();
  ctx.font = `${px(14)}px Inter,sans-serif`;
  ctx.fillStyle = "rgba(192, 152, 60, 0.58)";
  ctx.textAlign = "center";
  ctx.fillText("N", crx, cry - crr - px(5));

  // ── TOPOGRAPHIC BACKGROUND GRID ──────────────────────────────
  ctx.strokeStyle = "rgba(180, 140, 60, 0.028)";
  ctx.lineWidth = px(0.5);
  for (let gx = 0; gx < w; gx += px(80)) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
  }
  for (let gy = 0; gy < h; gy += py(80)) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
  }

  // ── EDGE VIGNETTE ─────────────────────────────────────────────
  const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.22, w * 0.5, h * 0.5, h * 0.92);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0, 0, 0, 0.60)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

function DubaiMapBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const { width, height } = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    drawDubaiMap(ctx, width, height);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Scattered district name labels — hidden until smoke is cleared ─────────
function DistrictNames({ smoke }: { smoke: MutableRefObject<HTMLDivElement | null> }) {
  const names = useMemo(() => [
    // left side / heading zone
    { label: "JUMEIRAH",        left: "3%",  top: "14%", gold: true  },
    { label: "SATWA",           left: "5%",  top: "52%", gold: false },
    { label: "AL WASL",         left: "10%", top: "72%", gold: true  },
    { label: "CITY WALK",       left: "18%", top: "30%", gold: false },
    { label: "ZAABEEL",         left: "22%", top: "63%", gold: false },
    { label: "MEYDAN",          left: "28%", top: "80%", gold: true  },
    // center
    { label: "DOWNTOWN",        left: "35%", top: "18%", gold: true  },
    { label: "DIFC",            left: "38%", top: "44%", gold: true  },
    { label: "BUSINESS BAY",    left: "43%", top: "62%", gold: true  },
    { label: "DUBAI CREEK",     left: "48%", top: "78%", gold: false },
    // right side / portrait zone
    { label: "PALM JUMEIRAH",   left: "56%", top: "16%", gold: true  },
    { label: "BLUEWATERS",      left: "62%", top: "26%", gold: false },
    { label: "DUBAI MARINA",    left: "68%", top: "42%", gold: true  },
    { label: "JBR",             left: "72%", top: "68%", gold: false },
    { label: "CREEK HARBOUR",   left: "58%", top: "56%", gold: false },
    { label: "DUBAI HILLS",     left: "76%", top: "20%", gold: false },
    { label: "EMIRATES HILLS",  left: "82%", top: "52%", gold: true  },
    { label: "EXPO CITY",       left: "85%", top: "76%", gold: false },
    { label: "ARABIAN RANCHES", left: "64%", top: "86%", gold: false },
    { label: "SOUTH MARINA",    left: "89%", top: "36%", gold: true  },
    // gap-fill: top band — just one anchor, no cluster
    { label: "SILICON OASIS",   left: "93%", top: "22%", gold: false },
    // gap-fill: far right column
    { label: "MOTOR CITY",      left: "93%", top: "60%", gold: false },
    { label: "SPORTS CITY",     left: "91%", top: "82%", gold: false },
    // gap-fill: center column vertical
    { label: "OLD TOWN",        left: "40%", top: "30%", gold: false },
    { label: "CULTURE VILLAGE", left: "50%", top: "46%", gold: false },
    // gap-fill: lower center
    { label: "MOTOR CITY",      left: "38%", top: "92%", gold: false },
    { label: "REMRAAM",         left: "20%", top: "92%", gold: false },
    // gap-fill: left lower
    { label: "AL QUOZ",         left: "8%",  top: "88%", gold: false },
  ], []);

  const positionedNames = useMemo(
    () => names.map((name) => {
      const topValue = Number.parseFloat(name.top);
      if (!IS_TOUCH && topValue < 20) {
        return { ...name, top: `${topValue + 7}%` };
      }
      return name;
    }),
    [names],
  );

  const mobilePositions = useMemo(
    () => ({
      JUMEIRAH: { left: "7%", top: "18%" },
      DOWNTOWN: { left: "58%", top: "19%" },
      DIFC: { left: "73%", top: "47%" },
      "BUSINESS BAY": { left: "44%", top: "68%" },
      MEYDAN: { left: "18%", top: "84%" },
    }),
    [],
  );

  // On mobile/touch: show key district names statically with subtle stagger animation
  const mobileLabels = useMemo(() => 
    IS_TOUCH ? ["JUMEIRAH", "DOWNTOWN", "DIFC", "BUSINESS BAY", "MEYDAN"] : [],
  []);

  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // On touch devices, show a curated subset of names with stagger animation
    if (IS_TOUCH) {
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const label = el.getAttribute("data-label") || "";
        if (mobileLabels.includes(label)) {
          gsap.fromTo(el,
            { opacity: 0, y: 8 },
            { opacity: 0.6, y: 0, duration: 1, delay: 3.5 + Math.random() * 1.5, ease: "power2.out" },
          );
        }
      });
      return;
    }

    let frameId = 0;
    const tick = () => {
      const smokeEl = smoke.current;
      if (!smokeEl) { frameId = requestAnimationFrame(tick); return; }
      const rect = smokeEl.getBoundingClientRect();
      // Read hole position from custom props on smoke element
      const mxStr = smokeEl.style.getPropertyValue("--smoke-mx");
      const myStr = smokeEl.style.getPropertyValue("--smoke-my");
      const mx = parseFloat(mxStr) || -9999;
      const my = parseFloat(myStr) || -9999;
      const inside = mx > -9000;

      itemRefs.current.forEach((el) => {
        if (!el) return;
        const er = el.getBoundingClientRect();
        const ex = er.left + er.width / 2 - rect.left;
        const ey = er.top + er.height / 2 - rect.top;
        const dist = Math.hypot(mx - ex, my - ey);
        const act = inside ? Math.max(0, Math.min(1, 1 - dist / 140)) : 0;
        el.style.opacity = String(act > 0.05 ? act : 0);
        el.style.transform = `scale(${0.88 + act * 0.18}) translateY(${(1 - act) * 6}px)`;
      });

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [smoke, mobileLabels]);

  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: 24 }} aria-hidden="true">
      {positionedNames.map((n, i) => {
        const mobilePosition = IS_TOUCH ? mobilePositions[n.label as keyof typeof mobilePositions] : undefined;
        const left = mobilePosition?.left ?? n.left;
        const top = mobilePosition?.top ?? n.top;
        const isMobileVisible = !IS_TOUCH || mobileLabels.includes(n.label);
        return (
        <div
          key={n.label}
          ref={el => { itemRefs.current[i] = el; }}
          data-label={n.label}
          className="absolute uppercase"
          style={{
            left,
            top,
            fontFamily: "'Inter', sans-serif",
            fontSize: IS_TOUCH ? "10px" : "clamp(11px, 1.1vw, 15px)",
            fontWeight: 700,
            letterSpacing: IS_TOUCH ? "0.2rem" : "0.36rem",
            color: n.gold ? "rgba(218,175,75,1)" : "rgba(255,248,228,0.95)",
            opacity: isMobileVisible ? 0 : 0,
            whiteSpace: "nowrap",
            willChange: "transform, opacity",
            textShadow: n.gold
              ? "0 0 18px rgba(218,175,75,0.9), 0 2px 8px rgba(0,0,0,0.8)"
              : "0 0 14px rgba(255,248,220,0.7), 0 2px 8px rgba(0,0,0,0.7)",
            transition: "color 0.15s",
            display: isMobileVisible ? "block" : "none",
          }}
        >
          <svg viewBox="0 0 24 28" style={{ display:"inline-block", width:"1.3em", height:"1.3em", marginRight:"0.4rem", verticalAlign:"-0.18em", flexShrink:0, opacity: n.gold ? 0.88 : 0.72 }} aria-hidden="true">
            <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 15 7 15s7-9.75 7-15c0-3.866-3.134-7-7-7z" fill="currentColor"/>
            <circle cx="12" cy="9" r="2.5" fill="#0a0703"/>
          </svg>
          {n.label}
        </div>
        );
      })}
      {/* Crosshair survey markers — flare sequentially as route dots travel through */}
      {!IS_TOUCH && positionedNames.map((n, i) => {
        const c = n.gold ? "rgba(218,175,75" : "rgba(255,235,180";
        const flareDelay = `${((parseFloat(n.left) / 90) * 12).toFixed(2)}s`;
        const pulseDelay = `${((i * 0.44) % 3).toFixed(2)}s`;
        const pulseSpeed = `${(3 + (i % 5) * 0.6).toFixed(1)}s`;
        return (
          <span key={`x-${n.label}`} style={{ position:"absolute", left:n.left, top:n.top }}>
            <span style={{
              position:"absolute", width:20, height:1,
              background:`linear-gradient(90deg, transparent 0%, ${c},0.85) 50%, transparent 100%)`,
              top:"50%", left:"50%", transform:"translate(-50%,-50%)",
              animation:`cityFlare 12s ${flareDelay} ease-in-out infinite, cityPulse ${pulseSpeed} ${pulseDelay} ease-in-out infinite`,
            }} />
            <span style={{
              position:"absolute", width:1, height:20,
              background:`linear-gradient(180deg, transparent 0%, ${c},0.85) 50%, transparent 100%)`,
              top:"50%", left:"50%", transform:"translate(-50%,-50%)",
              animation:`cityFlare 12s ${flareDelay} ease-in-out infinite, cityPulse ${pulseSpeed} ${pulseDelay} ease-in-out infinite`,
            }} />
            <span style={{
              position:"absolute", width:5, height:5, borderRadius:"50%",
              background:`${c},1)`,
              boxShadow:`0 0 6px 2px ${c},0.6)`,
              top:"50%", left:"50%", transform:"translate(-50%,-50%)",
              animation:`cityFlare 12s ${flareDelay} ease-in-out infinite, cityPulse ${pulseSpeed} ${pulseDelay} ease-in-out infinite`,
            }} />
          </span>
        );
      })}
    </div>
  );
}

// ── Visible white smoke layer — mouse cursor cuts a hole through it ─────────
function CloudMist({ mouse, smokeRef }: { mouse: MutableRefObject<{ x: number; y: number; inside: boolean }>; smokeRef: MutableRefObject<HTMLDivElement | null> }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    // forward ref for DistrictNames to read hole position
    (smokeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;

    // On touch devices: fade smoke out after intro to reveal the map
    if (IS_TOUCH) {
      gsap.to(el, { opacity: 0.25, duration: 2, delay: 4, ease: "power2.out" });
      return;
    }

    const applyMask = (mx: number, my: number, r = 55) => {
      const mask = `radial-gradient(circle ${r}px at ${mx}px ${my}px, transparent 0%, rgba(0,0,0,0.15) 38%, black 68%)`;
      el.style.maskImage = mask;
      (el.style as CSSStyleDeclaration & { WebkitMaskImage: string }).WebkitMaskImage = mask;
      // store for DistrictNames to read
      el.style.setProperty("--smoke-mx", String(mx));
      el.style.setProperty("--smoke-my", String(my));
    };

    const clearMask = () => {
      el.style.maskImage = "";
      (el.style as CSSStyleDeclaration & { WebkitMaskImage: string }).WebkitMaskImage = "";
      el.style.setProperty("--smoke-mx", "-9999");
      el.style.setProperty("--smoke-my", "-9999");
    };

    let rafId = 0;
    const tick = () => {
      const p = mouse.current;
      if (p.inside) {
        const rect = el.getBoundingClientRect();
        applyMask(p.x - rect.left, p.y - rect.top);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Intro auto-sweep — visits actual city positions so new visitors see the reveal effect
    const sw = window.innerWidth;
    const sh = window.innerHeight;
    // Waypoints matching DistrictNames positions (left% → x, top% → y)
    const cities = [
      { x: sw * 0.05, y: sh * 0.20 },   // JUMEIRAH
      { x: sw * 0.22, y: sh * 0.35 },   // CITY WALK
      { x: sw * 0.38, y: sh * 0.22 },   // DOWNTOWN
      { x: sw * 0.56, y: sh * 0.14 },   // PALM JUMEIRAH
      { x: sw * 0.70, y: sh * 0.46 },   // DUBAI MARINA
      { x: sw * 0.85, y: sh * 0.55 },   // EMIRATES HILLS
    ];
    const sp = { mx: cities[0].x, my: cities[0].y, r: 110 };
    const upd = () => {
      if (!mouse.current.inside) {
        const rect = el.getBoundingClientRect();
        applyMask(sp.mx - rect.left, sp.my - rect.top, sp.r);
      }
    };
    const tl = gsap.timeline({ delay: 1.5, onStart: upd });
    cities.slice(1).forEach((city) => {
      tl.to(sp, { mx: city.x, my: city.y, duration: 0.75, ease: "power1.inOut", onUpdate: upd })
        .to(sp, { mx: city.x, my: city.y, duration: 0.45, onUpdate: upd }); // hold at city
    });
    tl.to(sp, { r: 20, duration: 0.55, ease: "power2.in", onUpdate: upd })
      .call(() => { if (!mouse.current.inside) clearMask(); });

    return () => { cancelAnimationFrame(rafId); tl.kill(); clearMask(); };
  }, [mouse]);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 20 }}
    >
      {/* ── Golden smoke puffs ── */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 90% 55% at 50% 45%, rgba(218,165,32,0.38) 0%, rgba(196,148,24,0.28) 35%, rgba(160,118,12,0.14) 62%, transparent 82%)",
        filter:"blur(55px)",
        animation:"cloudFloat1 18s ease-in-out infinite alternate",
      }} />
      <div style={{
        position:"absolute", width:"70%", height:"80%",
        left:"-5%", top:"-10%",
        background:"radial-gradient(ellipse 68% 60% at 38% 40%, rgba(232,180,48,0.42) 0%, rgba(210,162,30,0.32) 38%, rgba(172,130,16,0.15) 65%, transparent 84%)",
        filter:"blur(48px)",
        animation:"cloudFloat2 22s ease-in-out infinite alternate",
      }} />
      <div style={{
        position:"absolute", width:"65%", height:"75%",
        right:"-4%", top:"-8%",
        background:"radial-gradient(ellipse 64% 58% at 60% 38%, rgba(228,175,40,0.40) 0%, rgba(205,158,26,0.30) 40%, rgba(165,124,14,0.14) 68%, transparent 86%)",
        filter:"blur(50px)",
        animation:"cloudFloat3 25s ease-in-out infinite alternate",
      }} />
      <div style={{
        position:"absolute", width:"80%", height:"60%",
        left:"10%", bottom:"-5%",
        background:"radial-gradient(ellipse 76% 56% at 48% 62%, rgba(222,172,35,0.36) 0%, rgba(200,155,22,0.26) 40%, rgba(158,120,10,0.12) 66%, transparent 84%)",
        filter:"blur(52px)",
        animation:"cloudFloat4 20s ease-in-out infinite alternate",
      }} />
      <div style={{
        position:"absolute", width:"55%", height:"70%",
        left:"22%", top:"8%",
        background:"radial-gradient(ellipse 56% 62% at 50% 44%, rgba(240,185,55,0.32) 0%, rgba(215,165,35,0.22) 42%, transparent 74%)",
        filter:"blur(44px)",
        animation:"cloudFloat5 30s ease-in-out infinite alternate-reverse",
      }} />
      {/* Deep gold rim */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(180,130,20,0.12) 70%, rgba(130,90,5,0.20) 100%)",
        filter:"blur(20px)",
      }} />
    </div>
  );
}

// ── Animated dashed route map with traveling gold dots ────────────────────
function CityRoutes() {
  // Three geographic arcs across the hero — coordinates match city left%/top%
  const pathA = "M3,14 Q18,22 35,18 Q46,16 56,16 Q68,16 76,20 L89,36";
  const pathB = "M5,52 Q18,44 38,44 Q53,50 58,56 Q65,48 68,42 Q76,46 82,52";
  const pathC = "M10,72 Q28,70 43,62 Q50,70 48,78 Q60,82 64,86 Q76,80 85,76";
  const pathE = "M43,62 Q50,46 58,56 Q68,60 72,68 Q82,72 85,76 Q88,80 91,82 L93,60";
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 22 }}
      aria-hidden="true"
    >
      <defs>
        <filter id="routeGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Route A — upper sweep: Jumeirah → Downtown → Palm → Dubai Hills → South Marina */}
      <path d={pathA} fill="none" stroke="rgba(218,175,75,0.32)" strokeWidth="0.22" strokeDasharray="1.2 2.5" />
      <circle r="0.65" fill="rgba(255,215,80,1)" filter="url(#routeGlow)">
        <animateMotion dur="10s" repeatCount="indefinite" path={pathA} />
      </circle>
      {/* Route B — middle sweep: Satwa → DIFC → Creek Harbour → Marina → Emirates Hills */}
      <path d={pathB} fill="none" stroke="rgba(218,175,75,0.26)" strokeWidth="0.22" strokeDasharray="1.2 2.5" />
      <circle r="0.65" fill="rgba(255,215,80,1)" filter="url(#routeGlow)">
        <animateMotion dur="9s" begin="3.5s" repeatCount="indefinite" path={pathB} />
      </circle>
      {/* Route C — lower sweep: Al Wasl → Business Bay → Dubai Creek → Arabian Ranches → Expo City */}
      <path d={pathC} fill="none" stroke="rgba(218,175,75,0.22)" strokeWidth="0.22" strokeDasharray="1.2 2.5" />
      <circle r="0.65" fill="rgba(255,215,80,0.9)" filter="url(#routeGlow)">
        <animateMotion dur="11s" begin="6s" repeatCount="indefinite" path={pathC} />
      </circle>
      {/* Route E — right column: Business Bay → JBR → Expo City → Sports City → Motor City */}
      <path d={pathE} fill="none" stroke="rgba(218,175,75,0.20)" strokeWidth="0.22" strokeDasharray="1.2 2.5" />
      <circle r="0.65" fill="rgba(255,215,80,0.85)" filter="url(#routeGlow)">
        <animateMotion dur="8s" begin="5s" repeatCount="indefinite" path={pathE} />
      </circle>
    </svg>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const heroSweepRef = useRef<HTMLDivElement>(null);
  const mouseScreenRef = useRef({ x: 0, y: 0, inside: false });
  const smokeRef = useRef<HTMLDivElement>(null);
  const portfolioWrapperRef = useRef<HTMLDivElement>(null);
  const portfolioImageRef = useRef<HTMLImageElement>(null);

  // Mouse handler: update fog reveal circle via CSS custom properties
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const onMove = (event: MouseEvent) => {
      mouseScreenRef.current = { x: event.clientX, y: event.clientY, inside: true };
    };

    const onLeave = () => {
      mouseScreenRef.current = { x: 0, y: 0, inside: false };
    };

    section.addEventListener("mousemove", onMove, { passive: true });
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Portrait proximity blur (desktop only)
  useEffect(() => {
    if (IS_TOUCH) return;
    const portfolio = portfolioWrapperRef.current;
    const portfolioImage = portfolioImageRef.current ?? (document.querySelector('img[alt="Saad Bin Zain"]') as HTMLImageElement);
    if (!portfolio || !portfolioImage) return;

    const onMouseMove = (event: MouseEvent) => {
      const rect = portfolio.getBoundingClientRect();
      const dist = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
      const blur = Math.max(0, Math.min(10, (200 - dist) / 22));
      portfolioImage.style.filter = `grayscale(1) contrast(1.12) brightness(0.88) blur(${blur}px)`;
      portfolio.style.opacity = `${Math.max(0.35, 1 - blur / 7)}`;
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Heading card proximity blur — same formula as portrait (desktop only)
  useEffect(() => {
    if (IS_TOUCH) return;
    const card = textRef.current;
    if (!card) return;
    const onMouseMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const dist = Math.hypot(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );
      const blur = Math.max(0, Math.min(10, (280 - dist) / 30));
      card.style.backdropFilter = `blur(${8 + blur * 2}px)`;
      (card.style as CSSStyleDeclaration & { WebkitBackdropFilter: string }).WebkitBackdropFilter = `blur(${8 + blur * 2}px)`;
      Array.from(card.children).forEach(ch => {
        (ch as HTMLElement).style.filter = `blur(${blur.toFixed(1)}px)`;
      });
      card.style.opacity = `${Math.max(0.38, 1 - blur / 8)}`;
    };
    const onMouseLeave = () => {
      card.style.backdropFilter = "blur(8px)";
      (card.style as CSSStyleDeclaration & { WebkitBackdropFilter: string }).WebkitBackdropFilter = "blur(8px)";
      Array.from(card.children).forEach(ch => { (ch as HTMLElement).style.filter = ""; });
      card.style.opacity = "1";
    };
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // GSAP entrance + scroll parallax
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          opacity: 0,
          y: 52,
          scale: 0.94,
          duration: 1.3,
          stagger: 0.16,
          ease: "power3.out",
          delay: 0.3,
        });
      }

      if (heroSweepRef.current) {
        gsap.fromTo(
          heroSweepRef.current,
          { x: "-110%" },
          { x: "540%", ease: "sine.inOut", duration: 6, repeat: -1, repeatDelay: 4, delay: 1.8 },
        );
      }

      // Fade fog in on load
      if (fogRef.current) {
        gsap.from(fogRef.current, { opacity: 0, duration: 1.8, ease: "power2.out", delay: 0.1 });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (textRef.current) {
            gsap.set(textRef.current, { y: self.progress * -22, opacity: 1 - self.progress * 0.22 });
          }
          if (fogRef.current) {
            gsap.set(fogRef.current, { opacity: 1 - self.progress * 0.55 });
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
      style={{ background: "#0a0703" }}
      data-section="hero"
    >
      <div className="hero-wrapper relative overflow-hidden min-h-screen lg:h-screen">

        {/* ── Dark background only ── */}
        <div className="absolute inset-0" style={{ zIndex: 0, background: "#0a0703" }} />

        {/* ── Fog Overlay with CSS-mask reveal at cursor ── */}
        {/* dark base tint — fog layer is now static, CloudMist handles the reveal */}
        <div
          ref={fogRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(4, 2, 0, 0.72)",
            zIndex: 1,
            willChange: "opacity",
          }}
        />

        {/* ── District names: hidden under smoke, revealed at cursor ── */}
        <DistrictNames smoke={smokeRef} />

        {/* ── White smoke cloud layer: z:20, mouse cuts a hole ── */}
        <CloudMist mouse={mouseScreenRef} smokeRef={smokeRef} />
        <CityRoutes />

        {/* ── Horizon Gold Line ── */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: "2px",
            background: "linear-gradient(90deg, transparent 5%, rgba(168, 120, 34, 0.55) 50%, transparent 95%)",
            boxShadow: "0 0 20px rgba(168, 120, 34, 0.25)",
            zIndex: 4,
          }}
        />

        {/* ── Animated Gold Sweep ── */}
        <div
          ref={heroSweepRef}
          className="pointer-events-none absolute inset-y-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,230,140,0.06) 28%, rgba(255,220,100,0.18) 50%, rgba(255,230,140,0.06) 72%, transparent 100%)",
            width: "22%",
            zIndex: 6,
            filter: "blur(3px)",
            willChange: "transform",
          }}
        />

        {/* ── Explore hint — desktop only ── */}
        {!IS_TOUCH && (
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 z-[12]"
          style={{ animation: "exploreHint 9s 5.8s ease both", whiteSpace: "nowrap" }}
        >
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.45rem",
            color: "rgba(192,152,60,0.72)",
            textTransform: "uppercase",
          }}>· move cursor to reveal ·</span>
        </div>
        )}

        {/* ── Main Content ── */}
        <div className="relative z-[28] mx-auto max-w-[1320px] px-4 sm:px-5 md:px-12 lg:px-16" style={{ paddingTop: `${NAVBAR_GUARD}px`, boxSizing: "border-box" }}>
          <div className="grid min-h-[calc(100vh-80px)] content-start gap-4 pb-8 pt-5 sm:gap-5 sm:pb-10 sm:pt-8 lg:min-h-0 lg:h-full lg:items-center lg:gap-10 lg:grid-cols-[1fr_0.9fr]">

            {/* LEFT: Text */}
            <div className="flex items-start lg:items-center">
              <div
                ref={textRef}
                className="relative max-w-[35rem] rounded-[22px] border p-5 sm:rounded-[24px] sm:p-8 md:p-10"
                style={{
                  borderColor: "rgba(180,130,40,0.32)",
                  background: "linear-gradient(160deg, rgba(6,3,0,0.28), rgba(4,2,0,0.22))",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 16px 50px rgba(40,20,2,0.35), 0 0 30px rgba(168,115,34,0.10), inset 0 1px 0 rgba(255,220,140,0.10)",
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(180,140,55,0), rgba(180,140,55,0.65))" }} />
                  <span className="h-px w-1" style={{ background: "rgba(180,140,55,0.55)", boxShadow: "0 0 10px rgba(180,140,55,0.35)" }} />
                  <p
                    className="text-[11px] sm:text-[clamp(0.76rem,0.9vw,0.9rem)] uppercase"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(255, 245, 220, 0.95)",
                      letterSpacing: "clamp(0.14rem, 1vw, 0.32rem)",
                      textShadow: "0 2px 12px rgba(80,45,8,0.6)",
                    }}
                  >
                    Global portfolio expertise
                  </p>
                </div>

                <h1
                  className="mt-5 sm:mt-7 uppercase"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 100,
                    fontSize: "clamp(2.45rem, 11vw, 5.8rem)",
                    letterSpacing: "clamp(0.08rem, 0.7vw, 0.62rem)",
                    lineHeight: 0.88,
                    backgroundImage: "linear-gradient(135deg, hsl(40 80% 96%) 0%, hsl(40 60% 82%) 25%, hsl(40 75% 96%) 50%, hsl(40 60% 82%) 75%, hsl(40 80% 96%) 100%)",
                    backgroundSize: "200% 200%",
                    animation: "shimmerBg 8s ease infinite",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "none",
                    filter: "drop-shadow(0 4px 18px rgba(80,45,8,0.32))",
                  }}
                >
                  <span className="block">Strategic</span>
                  <span className="block">Advisory</span>
                </h1>

                <p
                  className="mt-5 sm:mt-7 max-w-[27rem] text-[clamp(0.92rem,1.2vw,1.1rem)] leading-[1.68] sm:max-w-[29rem] sm:leading-[1.85]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "rgba(255, 245, 218, 0.88)",
                    textShadow: "0 2px 12px rgba(80,45,8,0.5)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Curated placements across Dubai&apos;s most exclusive districts through institutional connections, refined positioning, and sovereign-grade judgment.
                </p>
              </div>
            </div>

            {/* RIGHT: Portrait */}
            <div className="flex justify-center lg:justify-end">
              <div
                ref={portfolioWrapperRef}
                className="relative w-full max-w-[19.5rem] overflow-hidden rounded-[26px] border p-4 sm:max-w-[23rem] sm:p-5 md:max-w-[25rem] md:rounded-[30px] md:p-6 transition-opacity duration-300"
                style={{
                  borderColor: "rgba(90,55,12,0.38)",
                  background: "linear-gradient(160deg, rgba(16,10,4,0.72), rgba(10,7,3,0.55))",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 30px 80px rgba(60,35,8,0.45), 0 0 60px rgba(168,115,34,0.22), inset 0 1px 0 rgba(255,220,140,0.08)",
                  animation: "pulseGlow 5s ease-in-out infinite",
                }}
              >
                <div className="relative overflow-hidden rounded-[20px] border sm:rounded-[24px]" style={{ borderColor: "rgba(168,115,34,0.32)" }}>
                  <img
                    ref={portfolioImageRef}
                    src={saadPortrait}
                    alt="Saad Bin Zain"
                    className="h-[205px] w-full object-cover object-center sm:h-[300px] md:h-[420px] transition-filter duration-150"
                    style={{ filter: "grayscale(1) contrast(1.12) brightness(0.88)" }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.52) 100%)" }} />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
                    <h2
                      className="text-[clamp(1.7rem,10vw,3rem)] uppercase transition-all duration-300 ease-out"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 100,
                        lineHeight: 0.92,
                        letterSpacing: "0.14rem",
                        color: "rgba(215, 170, 80, 0.95)",
                        textShadow: "0 8px 28px rgba(0,0,0,0.45)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(240,200,110,1)";
                        e.currentTarget.style.textShadow = "0 8px 28px rgba(0,0,0,0.45), 0 0 28px rgba(215,170,80,0.5)";
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(215,170,80,0.95)";
                        e.currentTarget.style.textShadow = "0 8px 28px rgba(0,0,0,0.45)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <span className="block">Saad</span>
                      <span className="block">Bin Zain</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;