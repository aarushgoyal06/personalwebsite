/**
 * Isometric-ish projection of a unit cube (8 corners) → 12 edges for SVG wireframe.
 * Coordinates tuned for a ~32×32 viewBox centered look.
 */
const CX = 16;
const CY = 17;
const S = 5.4;

function iso(x: number, y: number, z: number): [number, number] {
  return [
    CX + (x - y) * S,
    CY + (x + y) * S * 0.52 - z * S * 1.18,
  ];
}

/** Corner indices 0..7 map to (0|1, 0|1, 0|1) in x,y,z order. */
function corner(i: number): [number, number, number] {
  return [i & 1, (i >> 1) & 1, (i >> 2) & 1];
}

function edges12(): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < 8; i++) {
    for (let b = 0; b < 3; b++) {
      const j = i ^ (1 << b);
      if (i < j) out.push([i, j]);
    }
  }
  return out;
}

export function buildCubeWireframePath(): string {
  const verts = Array.from({ length: 8 }, (_, i) => {
    const [x, y, z] = corner(i);
    return iso(x, y, z);
  });
  const parts: string[] = [];
  for (const [a, b] of edges12()) {
    const [x1, y1] = verts[a];
    const [x2, y2] = verts[b];
    parts.push(`M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`);
  }
  return parts.join("");
}
