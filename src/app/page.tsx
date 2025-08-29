// src/app/page.tsx
"use client";
import React from "react";

const WORDS = ["Welcome", "to", "the", "world", "of"] as const;

export default function Page() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const maskRef = React.useRef<HTMLCanvasElement | null>(null);
  const rainRef = React.useRef<HTMLCanvasElement | null>(null);

  const [wordIndex, setWordIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<"fill" | "final">("fill");

  // Réglages animation texte
  const FONT_FAMILY = "Nosifer, cursive";
  const HEIGHT_RATIO = 0.5;
  const SIDE_PADDING = 0.08;
  const FILL_DURATION = 800; // plus petit = plus rapide
  const PAUSE_BETWEEN = 420;
  const BUBBLES_PER_FRAME = 14;
  const BUBBLE_MIN = 4,
    BUBBLE_MAX = 10;

  const commonFontSizeRef = React.useRef<number>(0);
  const lastSizeRef = React.useRef<{ W: number; H: number }>({ W: 0, H: 0 });

  // Sécurité : force l’état final si l’anim n’aboutit pas
  React.useEffect(() => {
    const total = WORDS.length * (FILL_DURATION + PAUSE_BETWEEN) + 800;
    const t = setTimeout(() => setPhase("final"), total);
    return () => clearTimeout(t);
  }, []);

  // Calcul d’un corps de texte commun (basé sur le mot le plus large)
  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    const compute = () => {
      const Wcss = wrap.clientWidth;
      const Hcss = wrap.clientHeight;
      if (!Wcss || !Hcss) return;

      const W = Math.floor(Wcss * dpr);
      const H = Math.floor(Hcss * dpr);

      if (
        lastSizeRef.current.W === W &&
        lastSizeRef.current.H === H &&
        commonFontSizeRef.current > 0
      )
        return;
      lastSizeRef.current = { W, H };

      const ctx = document.createElement("canvas").getContext("2d")!;
      let fs = Math.round(H * HEIGHT_RATIO);
      const maxTextWidth = W * (1 - SIDE_PADDING * 2);

      const measure = (word: string, size: number) => {
        ctx.font = `900 ${size}px ${FONT_FAMILY}`;
        return ctx.measureText(word).width;
      };

      while (true) {
        const widest = Math.max(...WORDS.map((w) => measure(w, fs)));
        if (widest <= maxTextWidth || fs <= 12) break;
        fs = Math.max(12, Math.floor(fs * 0.95));
      }
      commonFontSizeRef.current = fs;
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(wrap);
    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Animation mot par mot (remplissage à l’eau)
  React.useEffect(() => {
    if (phase === "final") return;

    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const W = Math.floor(wrap.clientWidth * dpr);
    const H = Math.floor(wrap.clientHeight * dpr);
    if (W === 0 || H === 0) return;

    canvas.width = W;
    canvas.height = H;

    const ensure = (r: React.MutableRefObject<HTMLCanvasElement | null>) => {
      if (!r.current) r.current = document.createElement("canvas");
      r.current.width = W;
      r.current.height = H;
      return r.current;
    };
    const mask = ensure(maskRef)!;
    const rain = ensure(rainRef)!;

    const out = canvas.getContext("2d")!;
    const mctx = mask.getContext("2d")!;
    const rctx = rain.getContext("2d")!;

    const word = WORDS[wordIndex];
    const fontSize =
      commonFontSizeRef.current || Math.round(H * HEIGHT_RATIO);

    // Texte masque (blanc)
    mctx.clearRect(0, 0, W, H);
    mctx.fillStyle = "#fff";
    mctx.textAlign = "center";
    mctx.textBaseline = "middle";
    mctx.font = `900 ${fontSize}px ${FONT_FAMILY}`;
    mctx.fillText(word, W / 2, H / 2);

    type Bubble = {
      x: number;
      y: number;
      r: number;
      vy: number;
      life: number;
    };
    const bubbles: Bubble[] = [];

    const meas = document.createElement("canvas").getContext("2d")!;
    meas.font = `900 ${fontSize}px ${FONT_FAMILY}`;
    const w = meas.measureText(word).width;

    const start = performance.now();
    let raf = 0;

    function spawn(levelY: number, width: number) {
      for (let i = 0; i < BUBBLES_PER_FRAME; i++) {
        const r =
          (BUBBLE_MIN + Math.random() * (BUBBLE_MAX - BUBBLE_MIN)) *
          (dpr * 0.6);
        const x = (W - width) / 2 + Math.random() * width;
        const y = levelY + Math.random() * (H - levelY) + r;
        const vy = -((H * 0.003) + Math.random() * (H * 0.0045));
        bubbles.push({ x, y, r, vy, life: 0 });
      }
    }

    function drawWater(level: number) {
      const levelY = H / 2 + fontSize * 0.6 - level * (fontSize * 1.2);
      const amp = Math.max(6 * dpr, fontSize * 0.02);
      const len = Math.max(80 * dpr, fontSize * 0.9);
      const t = performance.now() / 900;

      const grd = rctx.createLinearGradient(
        0,
        levelY - 200 * dpr,
        0,
        levelY + 200 * dpr
      );
      grd.addColorStop(0, "#b9edff");
      grd.addColorStop(0.5, "#57bfff");
      grd.addColorStop(1, "#3aaef9");

      rctx.fillStyle = grd;
      rctx.beginPath();
      rctx.moveTo(0, H);
      rctx.lineTo(0, levelY);
      for (let x = 0; x <= W; x += 8 * dpr) {
        const y = levelY + Math.sin((x + t * 120) / len) * amp;
        rctx.lineTo(x, y);
      }
      rctx.lineTo(W, levelY);
      rctx.lineTo(W, H);
      rctx.closePath();
      rctx.fill();
      return levelY;
    }

    function drawBubble(c: CanvasRenderingContext2D, b: Bubble) {
      c.save();
      const g = c.createRadialGradient(
        b.x - b.r * 0.2,
        b.y - b.r * 0.3,
        b.r * 0.1,
        b.x,
        b.y,
        b.r
      );
      g.addColorStop(0, "rgba(255,255,255,0.85)");
      g.addColorStop(0.25, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(63,182,255,0.45)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    function frame(now: number) {
      const p = Math.min(1, (now - start) / FILL_DURATION);

      rctx.clearRect(0, 0, W, H);
      const levelY = drawWater(p);

      spawn(levelY, w);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y += b.vy;
        b.life++;
        drawBubble(rctx, b);
        if (b.y + b.r < levelY - 80 * dpr) bubbles.splice(i, 1);
      }

      out.globalCompositeOperation = "source-over";
      out.clearRect(0, 0, W, H);
      out.drawImage(rain, 0, 0);
      out.globalCompositeOperation = "destination-in";
      out.drawImage(mask, 0, 0);
      out.globalCompositeOperation = "source-over";

      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          if (wordIndex < WORDS.length - 1) setWordIndex(wordIndex + 1);
          else setPhase("final");
        }, PAUSE_BETWEEN);
      }
    }

    const id = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(raf);
    };
  }, [wordIndex, phase]);

  const isFinal = phase === "final";

  return (
    <main className="relative">
      <div className="home-center relative">
        {/* Phase texte */}
        <div
          ref={wrapRef}
          className="canvasWrap"
          style={{ display: isFinal ? "none" : "block" }}
        >
          <canvas ref={canvasRef} />
        </div>

        {/* Phase finale : logo */}
        <div
          className="canvasWrap flex items-center justify-center"
          style={{ display: isFinal ? "flex" : "none" }}
        >
          <div className="logoWrap" style={{ zIndex: 100, position: "relative" }}>
            <img src="/aw-logo-yellow.png" alt="ANGRY WHALES" className="finalLogo" />
          </div>
        </div>
      </div>

      {/* Bande de vagues (derrière les stickers) */}
      {isFinal && <WaveBand />}

      {/* Stickers whales (devant les vagues) */}
      {isFinal && (
        <div className="whalesLayer" aria-hidden="true">
          <img src="/whale-bottom-left.png" alt="" className="whaleSticker left" />
          <img src="/whale-bottom-right.png" alt="" className="whaleSticker right" />
        </div>
      )}
    </main>
  );
}

/* ===== Composant WaveBand : amplitude & couleurs renforcées ===== */
function WaveBand() {
  return (
    <div className="wave-band" aria-hidden="true">
      <svg
        className="wave-svg"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Dégradés plus riches (plus de stops) */}
          <linearGradient id="waveG1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94dcff" />
            <stop offset="35%" stopColor="#66c3ff" />
            <stop offset="65%" stopColor="#3fb0ff" />
            <stop offset="100%" stopColor="#2b8ef5" />
          </linearGradient>
          <linearGradient id="waveG2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86d4ff" />
            <stop offset="35%" stopColor="#5fbeff" />
            <stop offset="65%" stopColor="#3aa8ff" />
            <stop offset="100%" stopColor="#237fe6" />
          </linearGradient>
          <linearGradient id="waveG3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#79cbff" />
            <stop offset="35%" stopColor="#51b5ff" />
            <stop offset="65%" stopColor="#329cf4" />
            <stop offset="100%" stopColor="#1f70da" />
          </linearGradient>

          {/* Ondulation douce (ripple) */}
          <filter id="ripple" x="-20%" y="-25%" width="140%" height="170%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.010"
              numOctaves="2"
              seed="7"
              stitchTiles="stitch"
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.006 0.010; 0.004 0.008; 0.006 0.010"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="10" />
          </filter>
        </defs>

        {/* groupe filtré → déformation verticale (effet de houle) */}
        <g filter="url(#ripple)">
          {/* Couche 1 — amplitude ++ (remonte davantage) */}
          <path fill="url(#waveG1)" opacity="0.9">
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0,160 Q120,110 240,160 T480,160 T720,160 T960,160 T1200,160 T1440,160 L1440,260 L0,260 Z;
                M0,190 Q120,140 240,190 T480,190 T720,190 T960,190 T1200,190 T1440,190 L1440,260 L0,260 Z;
                M0,150 Q120,100 240,150 T480,150 T720,150 T960,150 T1200,150 T1440,150 L1440,260 L0,260 Z;
                M0,160 Q120,110 240,160 T480,160 T720,160 T960,160 T1200,160 T1440,160 L1440,260 L0,260 Z
              "
            />
          </path>

          {/* Couche 2 — amplitude +, déphasée */}
          <path fill="url(#waveG2)" opacity="0.75">
            <animate
              attributeName="d"
              dur="6.5s"
              begin="-1.2s"
              repeatCount="indefinite"
              values="
                M0,175 Q120,130 240,175 T480,175 T720,175 T960,175 T1200,175 T1440,175 L1440,260 L0,260 Z;
                M0,195 Q120,150 240,195 T480,195 T720,195 T960,195 T1200,195 T1440,195 L1440,260 L0,260 Z;
                M0,165 Q120,120 240,165 T480,165 T720,165 T960,165 T1200,165 T1440,165 L1440,260 L0,260 Z;
                M0,175 Q120,130 240,175 T480,175 T720,175 T960,175 T1200,175 T1440,175 L1440,260 L0,260 Z
              "
            />
          </path>

          {/* Couche 3 — ondulation fine rapide */}
          <path fill="url(#waveG3)" opacity="0.6">
            <animate
              attributeName="d"
              dur="5s"
              begin="-0.6s"
              repeatCount="indefinite"
              values="
                M0,185 Q120,150 240,185 T480,185 T720,185 T960,185 T1200,185 T1440,185 L1440,260 L0,260 Z;
                M0,200 Q120,165 240,200 T480,200 T720,200 T960,200 T1200,200 T1440,200 L1440,260 L0,260 Z;
                M0,170 Q120,140 240,170 T480,170 T720,170 T960,170 T1200,170 T1440,170 L1440,260 L0,260 Z;
                M0,185 Q120,150 240,185 T480,185 T720,185 T960,185 T1200,185 T1440,185 L1440,260 L0,260 Z
              "
            />
          </path>
        </g>
      </svg>

      {/* petit fondu haut si besoin */}
      <div className="wave-fade" />
    </div>
  );
}
