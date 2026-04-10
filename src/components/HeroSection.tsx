import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import saadPortrait from "../assets/saad-bin-zain-2.jpg";
import { useIsMobile } from "../hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_GUARD = 80;
const IS_TOUCH = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
const MOBILE_LABELS = [
  "JUMEIRAH",
  "CITY WALK",
  "AL WASL",
  "DOWNTOWN",
  "DIFC",
  "BUSINESS BAY",
  "MEYDAN",
  "PALM JUMEIRAH",
  "DUBAI MARINA",
  "EMIRATES HILLS",
  "EXPO CITY",
];

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

    const render = () => {
      const { width, height } = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      drawDubaiMap(ctx, width, height);
    };

    render();
    window.addEventListener("resize", render, { passive: true });
    return () => window.removeEventListener("resize", render);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Scattered district name labels — hidden until smoke is cleared ─────────
function DistrictNames({ smoke, isMobile, elevate = false }: { smoke: MutableRefObject<HTMLDivElement | null>; isMobile: boolean; elevate?: boolean }) {
  const names = useMemo(() => [
    // left side / heading zone
    { label: "JUMEIRAH",        left: "3%",  top: "14%", gold: true  },
    { label: "SATWA",           left: "5%",  top: "52%", gold: false },
    { label: "AL WASL",         left: "10%", top: "72%", gold: true  },
    { label: "CITY WALK",       left: "18%", top: "30%", gold: false },
    { label: "ZAABEEL",         left: "22%", top: "63%", gold: false },
    { label: "MEYDAN",          left: "14%", top: "72%", gold: true  },
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
    { label: "EXPO CITY",       left: "85%", top: "76%", gold: true  },
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
      if (!isMobile && topValue < 20) {
        return { ...name, top: `${topValue + 7}%` };
      }
      return name;
    }),
    [isMobile, names],
  );

  const mobilePositions = useMemo(
    () => ({
      JUMEIRAH: { left: "7%", top: "16%" },
      "CITY WALK": { left: "9%", top: "32%" },
      "AL WASL": { left: "8%", top: "54%" },
      DOWNTOWN: { left: "55%", top: "18%" },
      DIFC: { left: "69%", top: "36%" },
      "BUSINESS BAY": { left: "45%", top: "53%" },
      MEYDAN: { left: "2%", top: "81%" },
      "PALM JUMEIRAH": { left: "60%", top: "14%" },
      "DUBAI MARINA": { right: "3%", top: "74%" },
      "EMIRATES HILLS": { right: "4%", top: "86%" },
      "EXPO CITY": { right: "4%", top: "93%" },
    }),
    [],
  );

  const mobileLabels = useMemo(() => (isMobile ? MOBILE_LABELS : []), [isMobile]);

  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
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
        const label = el.getAttribute("data-label") || "";
        const eligibleOnMobile = mobileLabels.includes(label);
        if (isMobile && !eligibleOnMobile) {
          el.style.opacity = "0";
          el.style.transform = "scale(0.9) translateY(8px)";
          return;
        }
        const er = el.getBoundingClientRect();
        const ex = er.left + er.width / 2 - rect.left;
        const ey = er.top + er.height / 2 - rect.top;
        const dist = Math.hypot(mx - ex, my - ey);
        const revealRadius = isMobile ? 180 : 140;
        const activation = inside ? Math.max(0, Math.min(1, 1 - dist / revealRadius)) : 0;
        const isGold = el.getAttribute("data-gold") === "true";
        const baseOpacity = isMobile ? 0.32 : 0;
        const opacity = isMobile ? Math.max(baseOpacity, 0.38 + activation * 0.62) : (activation > 0.05 ? activation : 0);
        const scale = isMobile ? 0.98 + activation * 0.14 : 0.88 + activation * 0.18;
        const shift = isMobile ? (1 - activation) * 3 : (1 - activation) * 6;
        el.style.opacity = String(opacity);
        el.style.transform = `scale(${scale}) translateY(${shift}px)`;
        if (isMobile) {
          const glow = 14 + activation * 26;
          el.style.color = activation > 0.2
            ? (isGold ? "rgba(244,205,108,1)" : "rgba(255,248,232,1)")
            : (isGold ? "rgba(228,184,82,0.98)" : "rgba(255,248,228,0.9)");
          el.style.textShadow = isGold
            ? `0 0 ${glow}px rgba(244,205,108,${0.34 + activation * 0.5}), 0 2px 8px rgba(0,0,0,0.88)`
            : `0 0 ${glow - 2}px rgba(255,248,232,${0.26 + activation * 0.4}), 0 2px 8px rgba(0,0,0,0.82)`;
          el.style.background = activation > 0.16
            ? `linear-gradient(90deg, rgba(0,0,0,${0.18 + activation * 0.18}), rgba(0,0,0,${0.3 + activation * 0.22}), rgba(0,0,0,${0.14 + activation * 0.14}))`
            : "rgba(0,0,0,0.16)";
          el.style.boxShadow = activation > 0.16
            ? `0 0 ${10 + activation * 16}px rgba(0,0,0,${0.18 + activation * 0.2}), inset 0 0 0 1px rgba(255,220,140,${0.1 + activation * 0.14})`
            : "inset 0 0 0 1px rgba(255,220,140,0.06)";
          el.style.borderColor = activation > 0.16
            ? `rgba(255,220,140,${0.12 + activation * 0.16})`
            : "rgba(255,220,140,0.06)";
        }
      });

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isMobile, mobileLabels, smoke]);

  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: elevate ? 30 : 24 }} aria-hidden="true">
      {positionedNames.map((n, i) => {
        const mobilePosition = isMobile ? mobilePositions[n.label as keyof typeof mobilePositions] : undefined;
        const left = mobilePosition && "left" in mobilePosition ? mobilePosition.left : n.left;
        const right = mobilePosition && "right" in mobilePosition ? mobilePosition.right : undefined;
        const top = mobilePosition?.top ?? n.top;
        const isMobileVisible = !isMobile || mobileLabels.includes(n.label);
        const isCompactMobileLabel = isMobile && ["MEYDAN", "DUBAI MARINA", "EMIRATES HILLS", "EXPO CITY"].includes(n.label);
        return (
        <div
          key={`${n.label}-${i}`}
          ref={el => { itemRefs.current[i] = el; }}
          data-label={n.label}
          data-gold={n.gold ? "true" : "false"}
          className="absolute uppercase"
          style={{
            left: right ? undefined : left,
            right: right ?? undefined,
            top,
            fontFamily: "'Inter', sans-serif",
            fontSize: isMobile ? (isCompactMobileLabel ? "10px" : "11px") : "clamp(11px, 1.1vw, 15px)",
            fontWeight: isMobile ? 800 : 700,
            letterSpacing: isMobile ? (isCompactMobileLabel ? "0.14rem" : "0.2rem") : "0.36rem",
            color: n.gold ? "rgba(218,175,75,1)" : "rgba(255,248,228,0.95)",
            opacity: isMobileVisible ? (isMobile ? 0.32 : 0) : 0,
            whiteSpace: "nowrap",
            willChange: "transform, opacity",
            padding: isMobile ? (isCompactMobileLabel ? "0.16rem 0.34rem" : "0.18rem 0.42rem") : 0,
            borderRadius: isMobile ? "999px" : 0,
            border: isMobile ? "1px solid rgba(255,220,140,0.06)" : "none",
            background: isMobile ? "rgba(0,0,0,0.16)" : "transparent",
            textShadow: n.gold
              ? "0 0 18px rgba(218,175,75,0.9), 0 2px 8px rgba(0,0,0,0.8)"
              : "0 0 14px rgba(255,248,220,0.7), 0 2px 8px rgba(0,0,0,0.7)",
            transition: "color 0.15s, background 0.15s, box-shadow 0.15s, border-color 0.15s",
            display: isMobileVisible ? "block" : "none",
          }}
        >
          <svg viewBox="0 0 24 28" style={{ display:"inline-block", width:isMobile ? "1.15em" : "1.3em", height:isMobile ? "1.15em" : "1.3em", marginRight:isMobile ? "0.32rem" : "0.4rem", verticalAlign:"-0.18em", flexShrink:0, opacity: n.gold ? 0.94 : 0.82 }} aria-hidden="true">
            <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 15 7 15s7-9.75 7-15c0-3.866-3.134-7-7-7z" fill="currentColor"/>
            <circle cx="12" cy="9" r="2.5" fill="#0a0703"/>
          </svg>
          {n.label}
        </div>
        );
      })}
    </div>
  );
}

// ── Visible white smoke layer — mouse cursor cuts a hole through it ─────────
function CloudMist({ mouse, smokeRef, isMobile, spotlightRef, travelingSpotlight = false, desktopPreview = false }: { mouse: MutableRefObject<{ x: number; y: number; inside: boolean }>; smokeRef: MutableRefObject<HTMLDivElement | null>; isMobile: boolean; spotlightRef?: MutableRefObject<HTMLDivElement | null>; travelingSpotlight?: boolean; desktopPreview?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const useTravelingSpotlight = isMobile || travelingSpotlight;
    // forward ref for DistrictNames to read hole position
    (smokeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;

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
      if (p.inside && !useTravelingSpotlight) {
        const rect = el.getBoundingClientRect();
        applyMask(p.x - rect.left, p.y - rect.top);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const cyclePause = useTravelingSpotlight ? 3.6 : 0;

    const cities = desktopPreview
      ? [
          { x: 10, y: 16, r: 112 },
          { x: 20, y: 32, r: 120 },
          { x: 34, y: 22, r: 120 },
          { x: 46, y: 54, r: 128 },
          { x: 61, y: 16, r: 132 },
          { x: 70, y: 62, r: 136 },
          { x: 76, y: 76, r: 134 },
          { x: 78, y: 88, r: 138 },
          { x: 12, y: 84, r: 118 },
        ]
      : isMobile
      ? [
          { x: 8, y: 15, r: 100 },
          { x: 18, y: 32, r: 116 },
          { x: 56, y: 16, r: 126 },
          { x: 45, y: 53, r: 120 },
          { x: 69, y: 64, r: 124 },
          { x: 58, y: 80, r: 120 },
          { x: 73, y: 89, r: 132 },
        ]
      : [
          { x: 5, y: 20, r: 110 },
          { x: 22, y: 35, r: 110 },
          { x: 38, y: 22, r: 110 },
          { x: 56, y: 14, r: 110 },
          { x: 70, y: 46, r: 110 },
          { x: 85, y: 55, r: 110 },
        ];
    const sp = { x: cities[0].x, y: cities[0].y, r: cities[0].r };
    const upd = () => {
      if (!mouse.current.inside || useTravelingSpotlight) {
        const rect = el.getBoundingClientRect();
        const px = (sp.x / 100) * rect.width;
        const py = (sp.y / 100) * rect.height;
        applyMask(px, py, sp.r);
        if (spotlightRef?.current) {
          spotlightRef.current.style.left = `${px}px`;
          spotlightRef.current.style.top = `${py}px`;
          spotlightRef.current.style.width = `${sp.r * 1.5}px`;
          spotlightRef.current.style.height = `${sp.r * 1.5}px`;
          spotlightRef.current.style.opacity = useTravelingSpotlight ? "0.95" : "0";
        }
      }
    };
    if (useTravelingSpotlight) {
      gsap.set(el, { opacity: 0.44 });
      gsap.to(el, { opacity: desktopPreview ? 0.34 : (travelingSpotlight && !isMobile ? 0.34 : 0.3), duration: 1.6, ease: "power2.out" });
    }
    const tl = gsap.timeline({
      delay: useTravelingSpotlight ? 0.8 : 1.5,
      repeat: useTravelingSpotlight ? -1 : 0,
      repeatDelay: cyclePause,
      onStart: upd,
      onRepeat: () => {
        if (!useTravelingSpotlight) return;
        sp.x = cities[0].x;
        sp.y = cities[0].y;
        sp.r = cities[0].r;
        upd();
      },
    });
    cities.slice(1).forEach((city) => {
      tl.to(sp, {
        x: city.x,
        y: city.y,
        r: city.r,
        duration: desktopPreview ? 0.85 : (useTravelingSpotlight ? 1.05 : 0.75),
        ease: "power1.inOut",
        onUpdate: upd,
      }).to(sp, {
        x: city.x,
        y: city.y,
        duration: desktopPreview ? 0.34 : (useTravelingSpotlight ? 0.6 : 0.45),
        onUpdate: upd,
      });
    });
    if (useTravelingSpotlight) {
      tl.to(sp, { r: desktopPreview ? 168 : 150, duration: 0.8, ease: "power2.inOut", onUpdate: upd })
        .to(sp, { r: desktopPreview ? 102 : 92, duration: 0.8, ease: "power2.out", onUpdate: upd })
        .call(() => {
          clearMask();
          if (spotlightRef?.current) spotlightRef.current.style.opacity = "0";
        });
    } else {
      tl.to(sp, { r: 20, duration: 0.55, ease: "power2.in", onUpdate: upd })
        .call(() => { if (!mouse.current.inside) clearMask(); });
    }

    return () => {
      cancelAnimationFrame(rafId);
      tl.kill();
      clearMask();
      if (spotlightRef?.current) spotlightRef.current.style.opacity = "0";
    };
  }, [desktopPreview, isMobile, mouse, smokeRef, spotlightRef]);

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
function CityRoutes({ isMobile }: { isMobile: boolean }) {
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
      style={{ zIndex: 22, opacity: isMobile ? 0.95 : 1 }}
      aria-hidden="true"
    >
      <defs>
        <filter id="routeGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Route A — upper sweep: Jumeirah → Downtown → Palm → Dubai Hills → South Marina */}
      <path d={pathA} fill="none" stroke="rgba(218,175,75,0.32)" strokeWidth={isMobile ? "0.34" : "0.22"} strokeDasharray={isMobile ? "1.4 2.2" : "1.2 2.5"} />
      <circle r={isMobile ? "0.8" : "0.65"} fill="rgba(255,215,80,1)" filter="url(#routeGlow)">
        <animateMotion dur="10s" repeatCount="indefinite" path={pathA} />
      </circle>
      {/* Route B — middle sweep: Satwa → DIFC → Creek Harbour → Marina → Emirates Hills */}
      <path d={pathB} fill="none" stroke="rgba(218,175,75,0.26)" strokeWidth={isMobile ? "0.34" : "0.22"} strokeDasharray={isMobile ? "1.4 2.2" : "1.2 2.5"} />
      <circle r={isMobile ? "0.8" : "0.65"} fill="rgba(255,215,80,1)" filter="url(#routeGlow)">
        <animateMotion dur="9s" begin="3.5s" repeatCount="indefinite" path={pathB} />
      </circle>
      {/* Route C — lower sweep: Al Wasl → Business Bay → Dubai Creek → Arabian Ranches → Expo City */}
      <path d={pathC} fill="none" stroke="rgba(218,175,75,0.22)" strokeWidth={isMobile ? "0.34" : "0.22"} strokeDasharray={isMobile ? "1.4 2.2" : "1.2 2.5"} />
      <circle r={isMobile ? "0.8" : "0.65"} fill="rgba(255,215,80,0.9)" filter="url(#routeGlow)">
        <animateMotion dur="11s" begin="6s" repeatCount="indefinite" path={pathC} />
      </circle>
      {/* Route E — right column: Business Bay → JBR → Expo City → Sports City → Motor City */}
      <path d={pathE} fill="none" stroke="rgba(218,175,75,0.20)" strokeWidth={isMobile ? "0.34" : "0.22"} strokeDasharray={isMobile ? "1.4 2.2" : "1.2 2.5"} />
      <circle r={isMobile ? "0.8" : "0.65"} fill="rgba(255,215,80,0.85)" filter="url(#routeGlow)">
        <animateMotion dur="8s" begin="5s" repeatCount="indefinite" path={pathE} />
      </circle>
    </svg>
  );
}

const HeroSection = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const heroSweepRef = useRef<HTMLDivElement>(null);
  const mouseScreenRef = useRef({ x: 0, y: 0, inside: false });
  const smokeRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const portfolioWrapperRef = useRef<HTMLDivElement>(null);
  const portfolioImageRef = useRef<HTMLImageElement>(null);
  const showDesktopCartographicPreview = !isMobile;
  const useCartographicPreviewLogic = isMobile || showDesktopCartographicPreview;

  useEffect(() => {
    if (!useCartographicPreviewLogic) return;

    let frameId = 0;
    const tick = () => {
      const smokeEl = smokeRef.current;
      const textCard = textRef.current;
      const portraitCard = portfolioWrapperRef.current;
      const portraitImage = portfolioImageRef.current;

      if (!smokeEl || !textCard || !portraitCard || !portraitImage) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const mxStr = smokeEl.style.getPropertyValue("--smoke-mx");
      const myStr = smokeEl.style.getPropertyValue("--smoke-my");
      const mx = parseFloat(mxStr) || -9999;
      const my = parseFloat(myStr) || -9999;

      const applyCardEffect = (
        element: HTMLDivElement,
        radius: number,
        onUpdate: (strength: number) => void,
      ) => {
        const smokeRect = smokeEl.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - smokeRect.left;
        const cy = rect.top + rect.height / 2 - smokeRect.top;
        const dist = Math.hypot(mx - cx, my - cy);
        const rawStrength = mx > -9000 ? Math.max(0, Math.min(1, 1 - dist / radius)) : 0;
        onUpdate(Math.min(1, Math.pow(rawStrength, 1.15) * 1.08));
      };

      applyCardEffect(textCard, showDesktopCartographicPreview ? 360 : 300, (strength) => {
        textCard.style.backdropFilter = "none";
        (textCard.style as CSSStyleDeclaration & { WebkitBackdropFilter: string }).WebkitBackdropFilter = "none";
        textCard.style.background = "transparent";
        textCard.style.filter = `blur(${(strength * 5.2).toFixed(2)}px)`;
        textCard.style.opacity = `${1 - strength * 0.24}`;
        textCard.style.borderColor = `rgba(180,130,40,${0.18 - strength * 0.06})`;
        textCard.style.boxShadow = `inset 0 1px 0 rgba(255,220,140,${0.08 - strength * 0.03}), 0 0 ${12 + strength * 8}px rgba(255,214,95,${0.05 + strength * 0.03})`;
        const title = textCard.querySelector('[data-hero-title="true"]');
        const copy = textCard.querySelector('[data-hero-copy="true"]');
        const eyebrow = textCard.querySelector('[data-hero-eyebrow="true"]');
        const accentTop = textCard.querySelector('[data-hero-accent="top"]');
        const accentCenter = textCard.querySelector('[data-hero-accent="center"]');
        const veil = textCard.querySelector('[data-hero-accent="veil"]');
        const corners = textCard.querySelector('[data-hero-accent="corners"]');
        if (title instanceof HTMLElement) {
          title.style.filter = `blur(${(strength * 2.6).toFixed(2)}px)`;
          title.style.opacity = `${1 - strength * 0.22}`;
          title.style.textShadow = `0 7px 22px rgba(12,8,2,${0.62 + strength * 0.12}), 0 0 ${10 + strength * 14}px rgba(255,228,150,${0.06 + strength * 0.08})`;
        }
        if (copy instanceof HTMLElement) {
          copy.style.filter = `blur(${(strength * 2).toFixed(2)}px)`;
          copy.style.opacity = `${1 - strength * 0.24}`;
          copy.style.textShadow = `0 3px 12px rgba(8,5,1,${0.72 + strength * 0.08})`;
        }
        if (eyebrow instanceof HTMLElement) {
          eyebrow.style.filter = `blur(${(strength * 1.8).toFixed(2)}px)`;
          eyebrow.style.opacity = `${0.96 - strength * 0.2}`;
          eyebrow.style.textShadow = `0 2px 12px rgba(10,7,2,${0.64 + strength * 0.12}), 0 0 ${7 + strength * 8}px rgba(255,218,120,${0.06 + strength * 0.1})`;
        }
        if (accentTop instanceof HTMLElement) {
          accentTop.style.opacity = `${0.16 - strength * 0.06}`;
          accentTop.style.transform = `translate(-50%, -50%) scale(${1 + strength * 0.08})`;
        }
        if (accentCenter instanceof HTMLElement) {
          accentCenter.style.opacity = `${0.24 - strength * 0.1}`;
          accentCenter.style.transform = `translate(-50%, -50%) scale(${1 + strength * 0.1})`;
        }
        if (veil instanceof HTMLElement) {
          veil.style.opacity = `${0.56 - strength * 0.26}`;
          veil.style.backdropFilter = `blur(${3.4 - strength * 1.8}px)`;
          (veil.style as CSSStyleDeclaration & { WebkitBackdropFilter: string }).WebkitBackdropFilter = `blur(${3.4 - strength * 1.8}px)`;
        }
        if (corners instanceof HTMLElement) {
          corners.style.opacity = `${0.82 - strength * 0.22}`;
        }
      });

      applyCardEffect(portraitCard, showDesktopCartographicPreview ? 320 : 255, (strength) => {
        portraitCard.style.filter = `blur(${(strength * (showDesktopCartographicPreview ? 6.2 : 4.6)).toFixed(2)}px)`;
        portraitCard.style.opacity = `${1 - strength * (showDesktopCartographicPreview ? 0.34 : 0.22)}`;
        portraitCard.style.boxShadow = `0 32px 80px rgba(60,35,8,${0.42 - strength * 0.14}), 0 0 ${30 + strength * 12}px rgba(168,115,34,${0.16 + strength * 0.04}), inset 0 1px 0 rgba(255,220,140,${0.08 - strength * 0.03})`;
        portraitImage.style.filter = `grayscale(1) contrast(1.12) brightness(${(showDesktopCartographicPreview ? 0.76 : 0.88) + strength * 0.02}) blur(${(strength * (showDesktopCartographicPreview ? 5.2 : 3.4)).toFixed(2)}px)`;
        const name = portraitCard.querySelector("h2");
        const portraitVeil = portraitCard.querySelector('[data-portrait-veil="true"]');
        if (name instanceof HTMLElement) {
          name.style.filter = `blur(${(strength * (showDesktopCartographicPreview ? 3.1 : 2.2)).toFixed(2)}px)`;
          name.style.opacity = `${1 - strength * (showDesktopCartographicPreview ? 0.28 : 0.18)}`;
        }
        if (portraitVeil instanceof HTMLElement) {
          portraitVeil.style.opacity = `${(showDesktopCartographicPreview ? 0.72 : 0.56) - strength * (showDesktopCartographicPreview ? 0.34 : 0.22)}`;
        }
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [useCartographicPreviewLogic, showDesktopCartographicPreview]);

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
    if (IS_TOUCH || showDesktopCartographicPreview) return;
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
  }, [showDesktopCartographicPreview]);

  // Heading card proximity blur — same formula as portrait (desktop only)
  useEffect(() => {
    if (IS_TOUCH || showDesktopCartographicPreview) return;
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
  }, [showDesktopCartographicPreview]);

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
            gsap.set(textRef.current, { y: self.progress * (isMobile ? -14 : -22), opacity: 1 - self.progress * 0.22 });
          }
          if (portfolioWrapperRef.current && isMobile) {
            gsap.set(portfolioWrapperRef.current, { y: self.progress * 28, opacity: 1 - self.progress * 0.14 });
          }
          if (mapFrameRef.current && isMobile) {
            gsap.set(mapFrameRef.current, { y: self.progress * -20, scale: 1 + self.progress * 0.035 });
          }
          if (fogRef.current) {
            gsap.set(fogRef.current, { opacity: 1 - self.progress * (isMobile ? 0.42 : 0.55) });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

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
        <div
          ref={mapFrameRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0, opacity: useCartographicPreviewLogic ? 0.9 : 0.72, mixBlendMode: "screen" }}
        >
          <DubaiMapBackground />
        </div>
        {useCartographicPreviewLogic && (
          <>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 5,
                background: showDesktopCartographicPreview
                  ? "radial-gradient(circle at 50% 14%, rgba(219,177,74,0.24) 0%, rgba(120,83,10,0.12) 26%, transparent 58%), radial-gradient(circle at 24% 72%, rgba(219,177,74,0.12) 0%, transparent 30%), linear-gradient(180deg, rgba(11,8,3,0.08) 0%, rgba(11,8,3,0) 18%, rgba(11,8,3,0.18) 100%)"
                  : "radial-gradient(circle at 50% 18%, rgba(219,177,74,0.22) 0%, rgba(120,83,10,0.1) 24%, transparent 56%), radial-gradient(circle at 28% 78%, rgba(219,177,74,0.1) 0%, transparent 28%), linear-gradient(180deg, rgba(11,8,3,0.1) 0%, rgba(11,8,3,0) 20%, rgba(11,8,3,0.16) 100%)",
              }}
            />
            <div
              ref={spotlightRef}
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                zIndex: 23,
                opacity: 0,
                background: showDesktopCartographicPreview
                  ? "radial-gradient(circle, rgba(255,224,132,0.42) 0%, rgba(255,213,84,0.24) 30%, rgba(255,213,84,0.08) 55%, rgba(255,213,84,0) 74%)"
                  : "radial-gradient(circle, rgba(255,224,132,0.34) 0%, rgba(255,213,84,0.18) 30%, rgba(255,213,84,0.05) 55%, rgba(255,213,84,0) 72%)",
                border: showDesktopCartographicPreview ? "1px solid rgba(255,221,126,0.46)" : "1px solid rgba(255,221,126,0.38)",
                boxShadow: showDesktopCartographicPreview
                  ? "0 0 28px rgba(255,214,95,0.24), 0 0 72px rgba(255,214,95,0.16), inset 0 0 30px rgba(255,235,170,0.16)"
                  : "0 0 18px rgba(255,214,95,0.18), 0 0 44px rgba(255,214,95,0.12), inset 0 0 24px rgba(255,235,170,0.12)",
                backdropFilter: showDesktopCartographicPreview ? "blur(2px)" : "blur(1px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: showDesktopCartographicPreview ? "18%" : "20%",
                  borderRadius: "50%",
                  border: showDesktopCartographicPreview ? "1px dashed rgba(255,221,126,0.46)" : "1px dashed rgba(255,221,126,0.38)",
                }}
              />
            </div>
          </>
        )}

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
    <DistrictNames smoke={smokeRef} isMobile={useCartographicPreviewLogic} elevate={showDesktopCartographicPreview} />

        {/* ── White smoke cloud layer: z:20, mouse cuts a hole ── */}
    <CloudMist mouse={mouseScreenRef} smokeRef={smokeRef} isMobile={useCartographicPreviewLogic} spotlightRef={spotlightRef} travelingSpotlight={showDesktopCartographicPreview} desktopPreview={showDesktopCartographicPreview} />
    <CityRoutes isMobile={useCartographicPreviewLogic} />

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
        {!showDesktopCartographicPreview && <div
          ref={heroSweepRef}
          className="pointer-events-none absolute inset-y-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,230,140,0.06) 28%, rgba(255,220,100,0.18) 50%, rgba(255,230,140,0.06) 72%, transparent 100%)",
            width: "22%",
            zIndex: 6,
            filter: "blur(3px)",
            willChange: "transform",
          }}
        />}

        {/* ── Explore hint — desktop only ── */}
        {!isMobile && !IS_TOUCH && !showDesktopCartographicPreview && (
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
          {isMobile ? (
            <div className="relative min-h-[calc(100svh-80px)] px-2 pb-8 pt-5">
              <div
                ref={textRef}
                className="relative mx-auto"
                style={{
                  width: "100%",
                  maxWidth: "22.5rem",
                  padding: "1.35rem 1.1rem 1.45rem",
                  textAlign: "center",
                  border: "1px solid rgba(180,130,40,0.12)",
                  borderRadius: "1.75rem",
                  background: "transparent",
                  backdropFilter: "none",
                  WebkitBackdropFilter: "none",
                  boxShadow: "inset 0 1px 0 rgba(255,220,140,0.04), 0 0 12px rgba(255,214,95,0.04)",
                }}
              >
                <div
                  data-hero-accent="corners"
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    opacity: 0.82,
                    background: "radial-gradient(circle at 0% 0%, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.3) 22%, rgba(0,0,0,0) 44%), radial-gradient(circle at 100% 0%, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.3) 22%, rgba(0,0,0,0) 44%), radial-gradient(circle at 0% 100%, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.24) 22%, rgba(0,0,0,0) 44%), radial-gradient(circle at 100% 100%, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.24) 22%, rgba(0,0,0,0) 44%)",
                  }}
                />
                <div
                  data-hero-accent="veil"
                  className="pointer-events-none absolute inset-[7%_5%_9%] rounded-[1.5rem]"
                  style={{
                    opacity: 0.56,
                    background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.42) 44%, rgba(0,0,0,0.16) 68%, rgba(0,0,0,0) 100%)",
                    backdropFilter: "blur(3.4px)",
                    WebkitBackdropFilter: "blur(3.4px)",
                  }}
                />
                <div
                  data-hero-accent="top"
                  className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: "84%",
                    height: "28%",
                    opacity: 0.14,
                    background: "radial-gradient(circle, rgba(214,170,72,0.24) 0%, rgba(214,170,72,0.08) 36%, rgba(214,170,72,0) 72%)",
                    filter: "blur(16px)",
                  }}
                />
                <div
                  data-hero-accent="center"
                  className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: "72%",
                    height: "32%",
                    opacity: 0.18,
                    background: "radial-gradient(circle, rgba(9,6,2,0.42) 0%, rgba(9,6,2,0.18) 40%, rgba(9,6,2,0) 74%)",
                    filter: "blur(14px)",
                  }}
                />
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-8" style={{ background: "linear-gradient(90deg, rgba(180,140,55,0), rgba(180,140,55,0.65))" }} />
                  <span className="h-px w-1" style={{ background: "rgba(180,140,55,0.55)", boxShadow: "0 0 10px rgba(180,140,55,0.35)" }} />
                  <p
                    data-hero-eyebrow="true"
                    className="uppercase"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.69rem",
                      color: "rgba(255, 246, 224, 0.98)",
                      letterSpacing: "0.22rem",
                      textShadow: "0 2px 12px rgba(10,7,2,0.7), 0 0 6px rgba(255,218,120,0.08)",
                    }}
                  >
                    Global portfolio expertise
                  </p>
                </div>

                <h1
                  data-hero-title="true"
                  className="mt-5 uppercase"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 100,
                    fontSize: "clamp(2.15rem, 11.2vw, 3rem)",
                    letterSpacing: "0.015rem",
                    lineHeight: 0.94,
                    backgroundImage: "linear-gradient(135deg, hsl(40 80% 96%) 0%, hsl(40 60% 82%) 25%, hsl(40 75% 96%) 50%, hsl(40 60% 82%) 75%, hsl(40 80% 96%) 100%)",
                    backgroundSize: "200% 200%",
                    animation: "shimmerBg 8s ease infinite",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: "0.55px rgba(255,248,234,0.22)",
                    filter: "drop-shadow(0 5px 18px rgba(0,0,0,0.84)) drop-shadow(0 0 8px rgba(255,222,132,0.08))",
                  }}
                >
                  <span className="block">Strategic</span>
                  <span className="block">Advisory</span>
                </h1>

                <p
                  data-hero-copy="true"
                  className="mx-auto mt-5 max-w-[19rem]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.98rem",
                    lineHeight: 1.6,
                    color: "rgba(255, 246, 226, 0.96)",
                    textShadow: "0 3px 12px rgba(0,0,0,0.86)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Curated placements across Dubai&apos;s most exclusive districts through institutional connections, refined positioning, and sovereign-grade judgment.
                </p>
              </div>

              <div
                ref={portfolioWrapperRef}
                className="relative mx-auto mt-10 overflow-hidden rounded-[28px] border p-3 transition-opacity duration-300"
                style={{
                  width: "min(54vw, 13.2rem)",
                  borderColor: "rgba(90,55,12,0.42)",
                  background: "linear-gradient(160deg, rgba(16,10,4,0.8), rgba(10,7,3,0.62))",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 32px 80px rgba(60,35,8,0.42), 0 0 60px rgba(168,115,34,0.16), inset 0 1px 0 rgba(255,220,140,0.08)",
                  animation: "pulseGlow 5s ease-in-out infinite",
                }}
              >
                <div className="relative overflow-hidden rounded-[22px] border" style={{ borderColor: "rgba(168,115,34,0.32)" }}>
                  <img
                    ref={portfolioImageRef}
                    src={saadPortrait}
                    alt="Saad Bin Zain"
                    className="w-full object-cover object-center transition-filter duration-150"
                    style={{
                      height: "205px",
                      filter: "grayscale(1) contrast(1.12) brightness(0.88)",
                    }}
                  />
                  <div data-portrait-veil="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.06) 32%, rgba(0,0,0,0.62) 100%)", opacity: 0.56 }} />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h2
                      className="uppercase transition-all duration-300 ease-out"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 100,
                        fontSize: "2.08rem",
                        lineHeight: 0.9,
                        letterSpacing: "0.05rem",
                        color: "rgba(234, 189, 92, 0.98)",
                        textShadow: "0 8px 28px rgba(0,0,0,0.45), 0 0 14px rgba(234,189,92,0.22)",
                      }}
                    >
                      <span className="block">Saad</span>
                      <span className="block">Bin Zain</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ) : (
          <div className="grid min-h-[calc(100svh-80px)] items-center gap-10 pb-10 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.8fr)] xl:gap-14">

            <div className="flex items-center">
              <div
                ref={textRef}
                className="relative max-w-[47rem]"
                style={{
                  padding: "2.25rem 2.5rem 2.8rem",
                  border: "1px solid rgba(180,130,40,0.16)",
                  borderRadius: "2.4rem",
                  background: "transparent",
                  backdropFilter: "none",
                  WebkitBackdropFilter: "none",
                  boxShadow: "inset 0 1px 0 rgba(255,220,140,0.08), 0 0 14px rgba(255,214,95,0.05)",
                }}
              >
                <div
                  data-hero-accent="corners"
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    opacity: 0.82,
                    background: "radial-gradient(circle at 0% 0%, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.3) 24%, rgba(0,0,0,0) 48%), radial-gradient(circle at 100% 0%, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.3) 24%, rgba(0,0,0,0) 48%), radial-gradient(circle at 0% 100%, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.24) 24%, rgba(0,0,0,0) 48%), radial-gradient(circle at 100% 100%, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.24) 24%, rgba(0,0,0,0) 48%)",
                  }}
                />
                <div
                  data-hero-accent="veil"
                  className="pointer-events-none absolute inset-[9%_6%_12%] rounded-[2rem]"
                  style={{
                    opacity: 0.56,
                    background: "radial-gradient(circle at 50% 44%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.44) 42%, rgba(0,0,0,0.16) 68%, rgba(0,0,0,0) 100%)",
                    backdropFilter: "blur(3.2px)",
                    WebkitBackdropFilter: "blur(3.2px)",
                  }}
                />
                <div
                  data-hero-accent="top"
                  className="pointer-events-none absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: "78%",
                    height: "26%",
                    opacity: 0.16,
                    background: "radial-gradient(circle, rgba(214,170,72,0.26) 0%, rgba(214,170,72,0.08) 36%, rgba(214,170,72,0) 72%)",
                    filter: "blur(18px)",
                  }}
                />
                <div
                  data-hero-accent="center"
                  className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: "70%",
                    height: "32%",
                    opacity: 0.24,
                    background: "radial-gradient(circle, rgba(9,6,2,0.46) 0%, rgba(9,6,2,0.2) 40%, rgba(9,6,2,0) 74%)",
                    filter: "blur(16px)",
                  }}
                />

                <div className="flex items-center gap-4">
                  <span className="h-px w-14" style={{ background: "linear-gradient(90deg, rgba(180,140,55,0), rgba(180,140,55,0.65))" }} />
                  <span className="h-px w-1.5" style={{ background: "rgba(180,140,55,0.55)", boxShadow: "0 0 10px rgba(180,140,55,0.35)" }} />
                  <p
                    data-hero-eyebrow="true"
                    className="uppercase"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.82rem",
                      color: "rgba(255,246,224,0.98)",
                      letterSpacing: "0.34rem",
                      textShadow: "0 2px 12px rgba(10,7,2,0.72), 0 0 6px rgba(255,218,120,0.08)",
                    }}
                  >
                    Global portfolio expertise
                  </p>
                </div>

                <h1
                  data-hero-title="true"
                  className="mt-8 uppercase"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 100,
                    fontSize: "clamp(4rem, 7vw, 6.1rem)",
                    letterSpacing: "0.1rem",
                    lineHeight: 0.88,
                    backgroundImage: "linear-gradient(135deg, hsl(40 80% 96%) 0%, hsl(40 60% 82%) 25%, hsl(40 75% 96%) 50%, hsl(40 60% 82%) 75%, hsl(40 80% 96%) 100%)",
                    backgroundSize: "200% 200%",
                    animation: "shimmerBg 8s ease infinite",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: "0.55px rgba(255,248,234,0.2)",
                    filter: "drop-shadow(0 5px 18px rgba(0,0,0,0.84)) drop-shadow(0 0 8px rgba(255,222,132,0.08))",
                  }}
                >
                  <span className="block">Strategic</span>
                  <span className="block">Advisory</span>
                </h1>

                <p
                  data-hero-copy="true"
                  className="mt-8 max-w-[34rem]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.28rem",
                    lineHeight: 1.72,
                    color: "rgba(255,246,226,0.96)",
                    textShadow: "0 3px 12px rgba(0,0,0,0.86)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Curated placements across Dubai&apos;s most exclusive districts through institutional connections, refined positioning, and sovereign-grade judgment.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div
                ref={portfolioWrapperRef}
                className="relative overflow-hidden rounded-[34px] border p-4 transition-opacity duration-300"
                style={{
                  width: "min(27vw, 22.5rem)",
                  borderColor: "rgba(90,55,12,0.42)",
                  background: "linear-gradient(160deg, rgba(16,10,4,0.8), rgba(10,7,3,0.62))",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 32px 80px rgba(60,35,8,0.42), 0 0 60px rgba(168,115,34,0.16), inset 0 1px 0 rgba(255,220,140,0.08)",
                  animation: "pulseGlow 5s ease-in-out infinite",
                }}
              >
                <div className="relative overflow-hidden rounded-[28px] border" style={{ borderColor: "rgba(168,115,34,0.32)" }}>
                  <img
                    ref={portfolioImageRef}
                    src={saadPortrait}
                    alt="Saad Bin Zain"
                    className="w-full object-cover object-center transition-filter duration-150"
                    style={{
                      height: "470px",
                      filter: "grayscale(1) contrast(1.12) brightness(0.76)",
                    }}
                  />
                  <div data-portrait-veil="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18) 18%, rgba(0,0,0,0.74) 100%)", opacity: 0.72 }} />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h2
                      className="uppercase transition-all duration-300 ease-out"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 100,
                        fontSize: "3.3rem",
                        lineHeight: 0.9,
                        letterSpacing: "0.08rem",
                        color: "rgba(234, 189, 92, 0.98)",
                        textShadow: "0 8px 28px rgba(0,0,0,0.45), 0 0 14px rgba(234,189,92,0.22)",
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
          )}
        </div>

      </div>
    </section>
  );
};

export default HeroSection;