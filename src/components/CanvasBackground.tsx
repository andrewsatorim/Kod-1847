"use client";
import { useEffect, useRef } from "react";

interface Blob {
  ox: number; oy: number; r: number; wanderR: number;
  phaseX: number; phaseY: number; breathPhase: number;
  speedX: number; speedY: number; breathSpeed: number;
  baseAlpha: number; hueShift: number;
}

interface Dust {
  x: number; y: number; r: number;
  vx: number; vy: number; o: number; ph: number;
}

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, t = 0, animId = 0;
    const blobs: Blob[] = [];
    const dust: Dust[] = [];

    function resize() {
      const d = window.devicePixelRatio || 1;
      w = c!.offsetWidth;
      h = c!.offsetHeight;
      c!.width = w * d;
      c!.height = h * d;
      ctx!.setTransform(d, 0, 0, d, 0, 0);
      initScene();
    }

    function initScene() {
      blobs.length = 0;
      const s = Math.max(w, h);
      const pos = [
        { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 }, { x: 0.5, y: 0.5 },
        { x: 0.1, y: 0.9 }, { x: 0.9, y: 0.9 }, { x: 0.0, y: 0.5 },
        { x: 1.0, y: 0.5 }, { x: 0.5, y: 0.0 }, { x: 0.5, y: 1.0 },
        { x: 0.3, y: 0.4 },
      ];
      for (let i = 0; i < 10; i++) {
        const p = pos[i];
        blobs.push({
          ox: p.x * w, oy: p.y * h,
          r: s * (0.4 + Math.random() * 0.35),
          wanderR: s * 0.4,
          phaseX: Math.random() * 6.28, phaseY: Math.random() * 6.28,
          breathPhase: Math.random() * 6.28,
          speedX: 0.08 + Math.random() * 0.06,
          speedY: 0.06 + Math.random() * 0.05,
          breathSpeed: 0.04 + Math.random() * 0.035,
          baseAlpha: 0.045 + Math.random() * 0.04,
          hueShift: Math.random() * 20 - 10,
        });
      }
      dust.length = 0;
      for (let i = 0; i < 20; i++) {
        dust.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 0.6 + 0.2,
          vx: (Math.random() - 0.5) * 0.03,
          vy: -Math.random() * 0.06 - 0.01,
          o: Math.random() * 0.035 + 0.008,
          ph: Math.random() * 6.28,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "#08080A";
      ctx.fillRect(0, 0, w, h);
      t += 0.016;

      for (const b of blobs) {
        const br = 0.5 + 0.5 * Math.sin(t * b.breathSpeed + b.breathPhase);
        const a = b.baseAlpha * br;
        const bx = b.ox + Math.sin(t * b.speedX + b.phaseX) * b.wanderR;
        const by = b.oy + Math.cos(t * b.speedY + b.phaseY) * b.wanderR;
        const r = b.r * (0.92 + 0.08 * Math.sin(t * b.breathSpeed * 0.7 + b.breathPhase));
        const rC = Math.min(255, 184 + Math.round(b.hueShift));
        const gC = Math.min(255, 152 + Math.round(b.hueShift * 0.6));
        const bC = Math.min(255, 96 + Math.round(b.hueShift * 0.3));
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        g.addColorStop(0, `rgba(${rC},${gC},${bC},${a})`);
        g.addColorStop(0.3, `rgba(${rC},${gC},${bC},${a * 0.6})`);
        g.addColorStop(0.6, `rgba(${rC},${gC},${bC},${a * 0.2})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of dust) {
        p.x += p.vx + Math.sin(t * 0.0015 + p.ph) * 0.02;
        p.y += p.vy;
        const fl = 0.4 + 0.6 * Math.sin(t * 0.002 + p.ph);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fillStyle = `rgba(184,152,96,${p.o * fl})`;
        ctx.fill();
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}
