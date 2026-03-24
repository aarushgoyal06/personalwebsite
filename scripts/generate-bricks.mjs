/**
 * Procedural Lego car voxel generator — bold classic colors.
 * Outputs a JSON array of { x, y, z, color } brick positions sorted
 * bottom-to-top for the scroll-driven build animation.
 *
 * Run: node scripts/generate-bricks.mjs
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const C = {
  chassis:    "#1565C0", // Deep blue
  body:       "#1E88E5", // Bright blue
  bodyAccent: "#42A5F5", // Light blue
  roof:       "#0D47A1", // Dark blue
  bumper:     "#B0BEC5", // Silver/grey
  grill:      "#37474F", // Dark grey
  headlight:  "#FDD835", // Yellow
  taillight:  "#E53935", // Red
  window:     "#81D4FA", // Light blue glass
  windowTrim: "#263238", // Very dark
  tire:       "#212121", // Near-black
  hubcap:     "#BDBDBD", // Light grey
  undercar:   "#37474F", // Dark grey
  stripe:     "#FFFFFF", // White racing stripe
  interior:   "#455A64", // Medium dark
  mirror:     "#90A4AE", // Silver
  spoiler:    "#0D47A1", // Dark blue
  exhaust:    "#757575", // Grey
  ground:     "#1A1A2E", // Ground
};

const bricks = [];
function add(x, y, z, color) { bricks.push({ x, y, z, color }); }

// ─── Car dimensions ───
// Car faces along X axis. Length ~24, width ~10, height ~9
// Y=0 is ground level

// ─── Wheels (4) ───
const wheelPositions = [
  { cx: -7, cz: -5 },  // front-left
  { cx: -7, cz: 5 },   // front-right
  { cx: 7, cz: -5 },   // rear-left
  { cx: 7, cz: 5 },    // rear-right
];

for (const { cx, cz } of wheelPositions) {
  // Tire: disc shape, 3 wide (z), radius ~2
  for (let dy = -1; dy <= 1; dy++) {
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r <= 1.5) {
          add(cx + dx, 1 + dy, cz + dz, C.tire);
        }
      }
    }
  }
  // Hubcap center
  const outerZ = cz < 0 ? cz - 1 : cz + 1;
  add(cx, 1, outerZ, C.hubcap);
}

// ─── Undercarriage / axle ───
for (let x = -8; x <= 8; x++) {
  for (let z = -3; z <= 3; z++) {
    add(x, 0, z, C.undercar);
  }
}

// ─── Chassis base (y=1..2) ───
for (let y = 1; y <= 2; y++) {
  for (let x = -10; x <= 10; x++) {
    for (let z = -4; z <= 4; z++) {
      // Rounded front and back
      const frontDist = x + 10;
      const backDist = 10 - x;
      if (frontDist < 0 || backDist < 0) continue;

      // Taper front
      if (x <= -8 && (Math.abs(z) > 3 + (x + 10))) continue;
      // Taper back
      if (x >= 9 && (Math.abs(z) > 3 + (10 - x))) continue;

      const isEdge = Math.abs(z) >= 4;
      add(x, y, z, isEdge ? C.bumper : C.chassis);
    }
  }
}

// ─── Body panels (y=3..5) ───
for (let y = 3; y <= 5; y++) {
  for (let x = -9; x <= 9; x++) {
    for (let z = -4; z <= 4; z++) {
      // Taper front
      if (x <= -7 && (Math.abs(z) > 3 + (x + 9))) continue;
      // Taper back
      if (x >= 8 && (Math.abs(z) > 3 + (9 - x))) continue;

      const isEdge = Math.abs(z) >= 4 || x === -9 || x === 9;
      const isHood = x <= -4 && y === 3;
      const isTrunk = x >= 5 && y === 3;

      // Racing stripe on top center
      const isStripe = Math.abs(z) === 0 && y === 5 && x >= -6 && x <= 7;

      // Body shell (walls + top)
      if (isEdge || y === 3 || y === 5) {
        let color = C.body;
        if (isStripe) color = C.stripe;
        else if (isHood || isTrunk) color = C.bodyAccent;
        else if (y === 5) color = C.body;
        add(x, y, z, color);
      }
    }
  }
}

// ─── Grill and headlights (front face) ───
for (let z = -3; z <= 3; z++) {
  for (let y = 2; y <= 4; y++) {
    if (Math.abs(z) <= 1) {
      add(-10, y, z, C.grill);
    } else if (Math.abs(z) >= 2 && y <= 3) {
      add(-10, y, z, C.headlight);
    } else {
      add(-10, y, z, C.bumper);
    }
  }
}

// ─── Taillights (rear face) ───
for (let z = -3; z <= 3; z++) {
  for (let y = 2; y <= 4; y++) {
    if (Math.abs(z) >= 2 && y <= 3) {
      add(10, y, z, C.taillight);
    } else if (Math.abs(z) <= 1 && y === 2) {
      add(10, y, z, C.exhaust);
    } else {
      add(10, y, z, C.bumper);
    }
  }
}

// ─── Cabin / windshield (y=6..8) ───
for (let y = 6; y <= 8; y++) {
  for (let x = -3; x <= 4; x++) {
    for (let z = -3; z <= 3; z++) {
      // Taper windshield at front
      if (x <= -2 && y >= 7 && Math.abs(z) > 2) continue;

      const isEdge = Math.abs(z) >= 3 || x === -3 || x === 4;
      const isTop = y === 8;

      if (isEdge || isTop) {
        let color;
        if (isTop) {
          color = C.roof;
        } else if (x === -3 || x === 4) {
          // Front/rear windshield
          color = C.window;
        } else if (Math.abs(z) >= 3) {
          // Side windows
          color = y === 6 ? C.windowTrim : C.window;
        } else {
          color = C.body;
        }
        add(x, y, z, color);
      } else if (y === 6) {
        // Interior floor
        add(x, y, z, C.interior);
      }
    }
  }
}

// ─── Side mirrors ───
add(-2, 6, -5, C.mirror);
add(-2, 6, 5, C.mirror);

// ─── Spoiler (rear) ───
for (let z = -3; z <= 3; z++) {
  add(5, 6, z, C.spoiler);
  add(6, 6, z, C.spoiler);
}
for (let z = -3; z <= 3; z++) {
  add(6, 7, z, C.spoiler);
}

// ─── Bumper details ───
// Front bumper
for (let z = -4; z <= 4; z++) {
  add(-11, 1, z, Math.abs(z) > 3 ? C.bumper : C.grill);
  add(-11, 2, z, C.bumper);
}
// Rear bumper
for (let z = -4; z <= 4; z++) {
  add(11, 1, z, C.bumper);
  add(11, 2, z, Math.abs(z) >= 3 ? C.taillight : C.exhaust);
}

// ─── Sort bricks bottom-to-top, then front-to-back per layer ───
bricks.sort((a, b) => {
  if (a.y !== b.y) return a.y - b.y;
  return a.x - b.x;
});

// ─── De-duplicate ───
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
  return a.x - b.x;
});

const outPath = resolve(__dirname, "../public/data/taj-mahal-bricks.json");
writeFileSync(outPath, JSON.stringify(deduped));

const colorCounts = {};
for (const b of deduped) {
  colorCounts[b.color] = (colorCounts[b.color] || 0) + 1;
}
console.log(`Generated ${deduped.length} bricks -> ${outPath}`);
console.log("Color breakdown:");
for (const [c, n] of Object.entries(colorCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${c}: ${n} bricks`);
}
