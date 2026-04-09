"use client";

import { useEffect, useRef } from "react";

/** 4D hypercube: 16 vertices (±S in each dimension). */
const S = 0.34;
const VERTS4: [number, number, number, number][] = Array.from(
  { length: 16 },
  (_, i) =>
    [
      (i & 1) ? S : -S,
      (i & 2) ? S : -S,
      (i & 4) ? S : -S,
      (i & 8) ? S : -S,
    ] as [number, number, number, number]
);

/** 32 edges: Hamming distance 1. */
const EDGES32: [number, number][] = (() => {
  const e: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const d = i ^ j;
      if (d && (d & (d - 1)) === 0) e.push([i, j]);
    }
  }
  return e;
})();

function rotXW(
  p: [number, number, number, number],
  a: number
): [number, number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const [x, y, z, w] = p;
  return [x * c - w * s, y, z, x * s + w * c];
}

function rotYW(
  p: [number, number, number, number],
  a: number
): [number, number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const [x, y, z, w] = p;
  return [x, y * c - w * s, z, y * s + w * c];
}

function rotZW(
  p: [number, number, number, number],
  a: number
): [number, number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const [x, y, z, w] = p;
  return [x, y, z * c - w * s, z * s + w * c];
}

function rotXY4(
  p: [number, number, number, number],
  a: number
): [number, number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const [x, y, z, w] = p;
  return [x * c - y * s, x * s + y * c, z, w];
}

/** Perspective R⁴ → R³ (w treated as depth). */
const A4 = 2.35;
function project4to3(
  p: [number, number, number, number]
): [number, number, number] | null {
  const [x, y, z, w] = p;
  const d = A4 - w;
  if (d < 0.05) return null;
  const k = 1 / d;
  return [x * k, y * k, z * k];
}

function rotX(p: [number, number, number], a: number): [number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const [x, y, z] = p;
  return [x, y * c - z * s, y * s + z * c];
}

function rotY(p: [number, number, number], a: number): [number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const [x, y, z] = p;
  return [x * c + z * s, y, -x * s + z * c];
}

function rotZ(p: [number, number, number], a: number): [number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const [x, y, z] = p;
  return [x * c - y * s, x * s + y * c, z];
}

function project3to2(
  p: [number, number, number],
  w: number,
  h: number,
  camZ: number,
  focal: number
): [number, number] | null {
  const [x, y, z] = p;
  const d = camZ - z;
  if (d < 0.08) return null;
  const m = focal / d;
  return [w * 0.5 + x * m, h * 0.5 - y * m];
}

/** Target scale + center from bounds; smoothed separately to avoid jitter / “pulsing”. */
const FIT_SMOOTH = 0.1;

type FitSmoothState = {
  sc: number;
  cx: number;
  cy: number;
  ready: boolean;
};

function fitPointsSmoothed(
  pts: ([number, number] | null)[],
  size: number,
  pad: number,
  smooth: FitSmoothState
): ([number, number] | null)[] {
  const flat = pts.filter(
    (p): p is [number, number] =>
      p !== null && Number.isFinite(p[0]) && Number.isFinite(p[1])
  );
  if (flat.length === 0) return pts.map(() => null);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of flat) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const tCx = (minX + maxX) / 2;
  const tCy = (minY + maxY) / 2;
  const span = Math.max(maxX - minX, maxY - minY, 1e-4);
  const tSc = (size - 2 * pad) / span;

  const a = FIT_SMOOTH;
  if (!smooth.ready) {
    smooth.sc = tSc;
    smooth.cx = tCx;
    smooth.cy = tCy;
    smooth.ready = true;
  } else {
    smooth.sc += (tSc - smooth.sc) * a;
    smooth.cx += (tCx - smooth.cx) * a;
    smooth.cy += (tCy - smooth.cy) * a;
  }

  const { sc, cx, cy } = smooth;
  return pts.map((p) => {
    if (!p || !Number.isFinite(p[0])) return null;
    return [
      size / 2 + (p[0] - cx) * sc,
      size / 2 + (p[1] - cy) * sc,
    ];
  });
}

const SIZE = 48;
const PAD = 5;
const CAM_Z = 2.92;
const FOCAL = 100;
const TILT = 0.44;

function accentShadowColor(cssColor: string): string {
  const m = cssColor.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i
  );
  if (m) {
    const a = m[4] !== undefined ? Number(m[4]) : 1;
    return `rgba(${m[1]},${m[2]},${m[3]},${0.45 * a})`;
  }
  return "rgba(59, 130, 246, 0.45)";
}

type Props = { interactive: boolean };

export default function CursorTesseractCanvas({ interactive }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef(interactive);
  interactiveRef.current = interactive;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let rafId = 0;
    let t = 0;
    const fitSmooth: FitSmoothState = {
      sc: 1,
      cx: SIZE / 2,
      cy: SIZE / 2,
      ready: false,
    };

    const tick = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const wPx = SIZE * dpr;
      const hPx = SIZE * dpr;
      if (canvas.width !== wPx || canvas.height !== hPx) {
        canvas.width = wPx;
        canvas.height = hPx;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);

      const color = getComputedStyle(wrap).color || "#3b82f6";
      const hi = interactiveRef.current;
      ctx.strokeStyle = color;
      ctx.lineWidth = hi ? 1.65 : 1.1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = hi ? 1 : 0.88;

      if (hi) {
        ctx.shadowColor = accentShadowColor(color);
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } else {
        ctx.shadowBlur = 0;
      }

      t += 0.0155;
      const spinY = t;
      const spinZ = t * 0.28;

      const raw2: ([number, number] | null)[] = VERTS4.map((v4) => {
        let v = rotXY4(v4, t * 0.22);
        v = rotXW(v, t);
        v = rotYW(v, t * 0.68);
        v = rotZW(v, t * 0.42);
        const p3 = project4to3(v);
        if (!p3) return null;
        let p = rotX(p3, TILT);
        p = rotY(p, spinY);
        p = rotZ(p, spinZ);
        return project3to2(p, SIZE, SIZE, CAM_Z, FOCAL);
      });

      const projected = fitPointsSmoothed(raw2, SIZE, PAD, fitSmooth);

      ctx.beginPath();
      for (const [a, b] of EDGES32) {
        const pa = projected[a];
        const pb = projected[b];
        if (!pa || !pb) continue;
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={wrapRef} className="text-[var(--accent)]">
      <canvas
        ref={canvasRef}
        className="block h-[48px] w-[48px]"
        width={SIZE}
        height={SIZE}
        aria-hidden
      />
    </div>
  );
}
