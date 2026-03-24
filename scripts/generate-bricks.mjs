/**
 * Procedural Taj Mahal voxel generator.
 * Outputs a JSON array of { x, y, z, color } brick positions sorted
 * bottom-to-top for the scroll-driven build animation.
 *
 * Run: node scripts/generate-bricks.mjs
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const COLORS = {
  marble: "#F5F0E8",
  marbleLight: "#FDFBF7",
  sandstone: "#D4A574",
  sandstoneLight: "#E8C9A0",
  red: "#C0392B",
  teal: "#1ABC9C",
  dome: "#F0EBE0",
  platform: "#D9D0C1",
  minaret: "#EDE8DC",
  minaretCap: "#C8A96E",
  garden: "#27AE60",
};

const bricks = [];

function addBrick(x, y, z, color) {
  bricks.push({ x, y, z, color });
}

function dist2D(x1, z1, x2, z2) {
  return Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2);
}

// ─── Platform / base ───
const PW = 44, PD = 44, PH = 2;
const OX = -PW / 2, OZ = -PD / 2;

for (let y = 0; y < PH; y++) {
  for (let x = 0; x < PW; x++) {
    for (let z = 0; z < PD; z++) {
      const edgeDist = Math.min(x, PW - 1 - x, z, PD - 1 - z);
      const color = edgeDist < 1 ? COLORS.sandstone : COLORS.platform;
      addBrick(OX + x, y, OZ + z, color);
    }
  }
}

// ─── Reflecting pool / garden area ───
for (let x = 10; x < PW - 10; x++) {
  for (let z = 0; z < 8; z++) {
    const gx = OX + x, gz = OZ + z + 2;
    if (z >= 2 && z <= 5 && x >= 14 && x <= PW - 15) {
      addBrick(gx, PH, gz, COLORS.teal);
    }
  }
}

// ─── Main building ───
const BW = 20, BD = 20, BH = 14;
const BX = -BW / 2, BZ = -BD / 2;
const BY = PH;

for (let y = 0; y < BH; y++) {
  for (let x = 0; x < BW; x++) {
    for (let z = 0; z < BD; z++) {
      const isEdge = x === 0 || x === BW - 1 || z === 0 || z === BD - 1;
      const isCorner =
        (x <= 1 || x >= BW - 2) && (z <= 1 || z >= BD - 2);

      // Arched openings on each face (center 6 units wide, bottom 8 units tall)
      const midX = BW / 2, midZ = BD / 2;
      const isArchFront = z === 0 && Math.abs(x - midX + 0.5) < 3 && y < 9 && y >= 1;
      const isArchBack = z === BD - 1 && Math.abs(x - midX + 0.5) < 3 && y < 9 && y >= 1;
      const isArchLeft = x === 0 && Math.abs(z - midZ + 0.5) < 3 && y < 9 && y >= 1;
      const isArchRight = x === BW - 1 && Math.abs(z - midZ + 0.5) < 3 && y < 9 && y >= 1;

      if (isArchFront || isArchBack || isArchLeft || isArchRight) continue;

      if (isEdge) {
        const color = isCorner ? COLORS.sandstone : COLORS.marble;
        addBrick(BX + x, BY + y, BZ + z, color);
      } else if (y === 0 || y === BH - 1) {
        addBrick(BX + x, BY + y, BZ + z, COLORS.marbleLight);
      }
    }
  }
}

// ─── Central dome ───
const DOME_R = 9.5;
const DOME_CY = BY + BH;
const DOME_CX = 0, DOME_CZ = 0;

for (let y = 0; y <= DOME_R; y++) {
  const sliceR = Math.sqrt(Math.max(0, DOME_R * DOME_R - y * y));
  for (let x = Math.floor(-DOME_R); x <= Math.ceil(DOME_R); x++) {
    for (let z = Math.floor(-DOME_R); z <= Math.ceil(DOME_R); z++) {
      const d = dist2D(x, z, 0, 0);
      if (d <= sliceR && d >= sliceR - 1.5) {
        addBrick(DOME_CX + x, DOME_CY + y, DOME_CZ + z, COLORS.dome);
      }
    }
  }
}
// Dome finial (spire)
for (let y = 0; y < 4; y++) {
  addBrick(0, DOME_CY + Math.ceil(DOME_R) + y, 0, COLORS.minaretCap);
}

// ─── Corner chattris (small domed pavilions) ───
const CHATTRI_OFFSETS = [
  [BW / 2 - 1, BW / 2 - 1],
  [-(BW / 2 - 1), BW / 2 - 1],
  [BW / 2 - 1, -(BW / 2 - 1)],
  [-(BW / 2 - 1), -(BW / 2 - 1)],
];

for (const [cx, cz] of CHATTRI_OFFSETS) {
  // Pillars
  for (let y = 0; y < 5; y++) {
    addBrick(cx, BY + BH + y, cz, COLORS.marble);
    addBrick(cx + 1, BY + BH + y, cz, COLORS.marble);
    addBrick(cx, BY + BH + y, cz + 1, COLORS.marble);
    addBrick(cx + 1, BY + BH + y, cz + 1, COLORS.marble);
  }
  // Small dome
  const cR = 2.5;
  const cBaseY = BY + BH + 5;
  for (let y = 0; y <= cR; y++) {
    const sr = Math.sqrt(Math.max(0, cR * cR - y * y));
    for (let dx = Math.floor(-cR); dx <= Math.ceil(cR); dx++) {
      for (let dz = Math.floor(-cR); dz <= Math.ceil(cR); dz++) {
        const d = dist2D(dx, dz, 0.5, 0.5);
        if (d <= sr) {
          addBrick(cx + dx, cBaseY + y, cz + dz, COLORS.dome);
        }
      }
    }
  }
}

// ─── Minarets ───
const MINARET_H = 30;
const MINARET_OFFSETS = [
  [PW / 2 - 2 + OX, PD / 2 - 2 + OZ],
  [-(PW / 2 - 2) - OX - 1, PD / 2 - 2 + OZ],
  [PW / 2 - 2 + OX, -(PD / 2 - 2) - OZ - 1],
  [-(PW / 2 - 2) - OX - 1, -(PD / 2 - 2) - OZ - 1],
];

for (const [mx, mz] of MINARET_OFFSETS) {
  for (let y = 0; y < MINARET_H; y++) {
    // Circular cross-section, radius ~1.5
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (Math.abs(dx) + Math.abs(dz) <= 1 || (dx === 0 && dz === 0)) {
          const color = y < MINARET_H - 3 ? COLORS.minaret : COLORS.minaretCap;
          addBrick(mx + dx, PH + y, mz + dz, color);
        }
      }
    }
  }
  // Minaret cap (small dome)
  for (let dy = 0; dy < 3; dy++) {
    addBrick(mx, PH + MINARET_H + dy, mz, COLORS.minaretCap);
  }
}

// ─── Sort bricks bottom-to-top, then by distance from center per layer ───
bricks.sort((a, b) => {
  if (a.y !== b.y) return a.y - b.y;
  const da = dist2D(a.x, a.z, 0, 0);
  const db = dist2D(b.x, b.z, 0, 0);
  return da - db;
});

// ─── De-duplicate (same x,y,z keeps last) ───
const seen = new Set();
const deduped = [];
for (let i = bricks.length - 1; i >= 0; i--) {
  const key = `${bricks[i].x},${bricks[i].y},${bricks[i].z}`;
  if (!seen.has(key)) {
    seen.add(key);
    deduped.push(bricks[i]);
  }
}
deduped.reverse();
deduped.sort((a, b) => {
  if (a.y !== b.y) return a.y - b.y;
  const da = dist2D(a.x, a.z, 0, 0);
  const db = dist2D(b.x, b.z, 0, 0);
  return da - db;
});

const outPath = resolve(__dirname, "../public/data/taj-mahal-bricks.json");
writeFileSync(outPath, JSON.stringify(deduped));

console.log(`Generated ${deduped.length} bricks -> ${outPath}`);
