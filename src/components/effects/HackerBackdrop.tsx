"use client";

import { useEffect, useRef, useState } from "react";

const FONT_SIZE = 13;
const CHAR_W = 8;
const LINE_HEIGHT = 20;
/** Code-like glyphs — reads as text more than raw digits */
const TEXT_CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.:[]{}()/\\=+*%&|^~`\"'<>?@#$";
const BG_RGB = [6, 11, 20] as const;
const TRAIL_FADE = 0.12;
const ACCENT_POLL_MS = 2000;

const FALLBACK_ACCENT: [number, number, number] = [59, 130, 246];

function parseCssColor(raw: string): [number, number, number] {
  const s = raw.trim();
  if (s.startsWith("#")) {
    const h = s.slice(1);
    if (h.length === 3) {
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16),
      ];
    }
    if (h.length === 6) {
      const n = parseInt(h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
  }
  const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return FALLBACK_ACCENT;
}

function randomSegment(len: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < len; i++) {
    if (i > 0 && Math.random() < 0.08) {
      out.push(" ");
    } else {
      out.push(
        TEXT_CHARSET[Math.floor(Math.random() * TEXT_CHARSET.length)] ?? "0"
      );
    }
  }
  return out;
}

type Row = {
  y: number;
  x: number;
  speed: number;
  len: number;
  segment: string[];
};

export default function HackerBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const node = canvasRef.current;
    if (!node) return;
    const canvas: HTMLCanvasElement = node;

    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    let accent: [number, number, number] = FALLBACK_ACCENT;
    let rows: Row[] = [];
    let frame = 0;
    let rafId = 0;
    let width = 0;
    let height = 0;

    function readAccent() {
      accent = parseCssColor(
        getComputedStyle(document.documentElement).getPropertyValue("--accent")
      );
    }

    function initRows(w: number, h: number) {
      const n = Math.max(1, Math.floor(h / LINE_HEIGHT));
      rows = Array.from({ length: n }, (_, i) => {
        const len = 28 + Math.floor(Math.random() * 48);
        return {
          y: i * LINE_HEIGHT + 3,
          x: Math.random() * (w + 400) - 200,
          speed: 0.55 + Math.random() * 1.85,
          len,
          segment: randomSegment(len),
        };
      });
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readAccent();
      initRows(width, height);
    }

    function draw() {
      frame += 1;
      ctx.fillStyle = `rgba(${BG_RGB[0]}, ${BG_RGB[1]}, ${BG_RGB[2]}, ${TRAIL_FADE})`;
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";

      const [r, g, b] = accent;

      for (let ri = 0; ri < rows.length; ri++) {
        const row = rows[ri];

        for (let j = 0; j < row.len; j++) {
          const px = row.x - j * CHAR_W;
          if (px < -CHAR_W || px > width + CHAR_W) continue;

          const flicker =
            j > 0 && j < row.len - 1 && frame % 14 === (ri + j) % 14;
          let ch = row.segment[j] ?? "0";
          if (flicker && Math.random() < 0.15) {
            ch =
              TEXT_CHARSET[Math.floor(Math.random() * TEXT_CHARSET.length)] ??
              ch;
          }

          const isHead = j === 0;

          if (isHead) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.97)`;
          } else {
            const falloff = 1 - j / Math.max(row.len - 1, 1);
            const a = 0.16 + falloff * 0.52;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          }
          ctx.fillText(ch, px, row.y);
        }

        row.x += row.speed;
        const span = row.len * CHAR_W;
        if (row.x > width + span + 40) {
          row.len = 28 + Math.floor(Math.random() * 48);
          row.segment = randomSegment(row.len);
          row.x = -span - Math.random() * 120;
          row.speed = 0.55 + Math.random() * 1.85;
        }
      }
    }

    function loop() {
      if (document.visibilityState === "hidden") return;
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(loop);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    const accentTimer = window.setInterval(readAccent, ACCENT_POLL_MS);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(accentTimer);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.26] [mask-image:radial-gradient(ellipse_85%_75%_at_50%_35%,black_15%,transparent_72%)]"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
