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

  // Réglages
  const FONT_FAMILY = "Nosifer, cursive";
  const HEIGHT_RATIO = 0.5;
  const SIDE_PADDING = 0.08;
  const FILL_DURATION = 2600;
  const PAUSE_BETWEEN = 420;
  const BUBBLES_PER_FRAME = 14;
  const BUBBLE_MIN = 4,
    BUBBLE_MAX = 10;

  React.useEffect(() => {
    if (phase === "final") return;

    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const W = Math.floor(wrap.clientWidth * dpr);
    const H = Math.floor(wrap.clientHeight * dpr);
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
    const measure = document.createElement("canvas").getContext("2d")!;
    let fontSize = Math.round(H * HEIGHT_RATIO);

    const measureWidth = (fs: number) => {
      measure.font = `900 ${fs}px ${FONT_FAMILY}`;
      return measure.measureText(word).width;
    };

    const maxTextWidth = W * (1 - SIDE_PADDING * 2);
    let w = measureWidth(fontSize);
    while (w > maxTextWidth) {
      fontSize = Math.max(12, Math.floor(fontSize * 0.95));
      w = measureWidth(fontSize);
    }

    // Texte masque (blanc)
    mctx.clearRect(0, 0, W, H);
    mctx.fillStyle = "#fff";
    mctx.textAlign = "center";
    mctx.textBaseline = "middle";
    mctx.font = `900 ${fontSize}px ${FONT_FAMILY}`;
    mctx.fillText(word, W / 2, H / 2);

    type Bubble = { x: number; y: number; r: number; vy: number; life: number };
    const bubbles: Bubble[] = [];

    const start = performance.now();
    let raf = 0;

    function spawn(levelY: number, width: number) {
      for (let i = 0; i < BUBBLES_PER_FRAME; i++) {
        const r = (BUBBLE_MIN + Math.random() * (BUBBLE_MAX - BUBBLE_MIN)) * (dpr * 0.6);
        const x = (W - w) / 2 + Math.random() * width;
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

      const grd = rctx.createLinearGradient(0, levelY - 200 * dpr, 0, levelY + 200 * dpr);
      grd.addColorStop(0, "#b9edff");
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
      const g = c.createRadialGradient(b.x - b.r * 0.2, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r);
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

  return (
    <main className="relative">
      <div className="home-center">
        {phase !== "final" ? (
          <div ref={wrapRef} className="canvasWrap">
            <canvas ref={canvasRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full px-6">
            <div className="logoWrap">
              <img src="/aw-logo-yellow.png" alt="ANGRY WHALES" className="finalLogo" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
