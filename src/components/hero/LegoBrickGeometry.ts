import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const BRICK_W = 1;
const BRICK_H = 0.6;
const BRICK_D = 1;
const STUD_RADIUS = 0.2;
const STUD_HEIGHT = 0.12;

let _cached: THREE.BufferGeometry | null = null;

export function createLegoBrickGeometry(): THREE.BufferGeometry {
  if (_cached) return _cached;

  const body = new THREE.BoxGeometry(BRICK_W, BRICK_H, BRICK_D);
  body.translate(0, BRICK_H / 2, 0);

  const stud = new THREE.CylinderGeometry(
    STUD_RADIUS,
    STUD_RADIUS,
    STUD_HEIGHT,
    8
  );
  stud.translate(0, BRICK_H + STUD_HEIGHT / 2, 0);

  const merged = mergeGeometries([body, stud]);
  if (!merged) {
    _cached = body;
    return body;
  }

  _cached = merged;
  return merged;
}

export const BRICK_SCALE = { w: BRICK_W, h: BRICK_H, d: BRICK_D };
