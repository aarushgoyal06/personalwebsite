"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { createLegoBrickGeometry, BRICK_SCALE } from "./LegoBrickGeometry";

interface Brick {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface LegoRendererProps {
  bricks: Brick[];
}

const dummy = new THREE.Object3D();

export default function LegoRenderer({ bricks }: LegoRendererProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScroll();
  const prevCount = useRef(0);

  const geometry = useMemo(() => createLegoBrickGeometry(), []);
  const totalBricks = bricks.length;

  const colorArray = useMemo(() => {
    const arr = new Float32Array(totalBricks * 3);
    const c = new THREE.Color();
    for (let i = 0; i < totalBricks; i++) {
      c.set(bricks[i].color);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [bricks, totalBricks]);

  // Pre-compute target matrices for all bricks
  const targetMatrices = useMemo(() => {
    const matrices = new Float32Array(totalBricks * 16);
    for (let i = 0; i < totalBricks; i++) {
      dummy.position.set(
        bricks[i].x * BRICK_SCALE.w,
        bricks[i].y * BRICK_SCALE.h,
        bricks[i].z * BRICK_SCALE.d
      );
      dummy.updateMatrix();
      dummy.matrix.toArray(matrices, i * 16);
    }
    return matrices;
  }, [bricks, totalBricks]);

  // Track per-brick animation progress (0 = invisible, 1 = settled)
  const animProgress = useMemo(() => new Float32Array(totalBricks), [totalBricks]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Set up instance colors
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      colorArray.slice(),
      3
    );

    // Initialize all instances off-screen
    for (let i = 0; i < totalBricks; i++) {
      dummy.position.set(0, -100, 0);
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.count = totalBricks;
  }, [totalBricks, colorArray]);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const progress = scroll.offset;
    // Start with 3% of bricks visible so the scene isn't empty on load.
    // Use 85% of scroll for building, reserve 15% for the completion state.
    const baseVisible = 0.03;
    const buildProgress = Math.min(1, baseVisible + (progress / 0.85) * (1 - baseVisible));
    const targetCount = Math.floor(buildProgress * totalBricks);

    const dt = Math.min(delta, 0.05);

    let needsUpdate = false;
    const dropHeight = 3;

    for (let i = 0; i < totalBricks; i++) {
      if (i < targetCount) {
        // Brick should be visible — animate toward 1
        if (animProgress[i] < 1) {
          animProgress[i] = Math.min(1, animProgress[i] + dt * 6);
          needsUpdate = true;
        }
      } else {
        // Brick should not be visible — animate toward 0
        if (animProgress[i] > 0) {
          animProgress[i] = Math.max(0, animProgress[i] - dt * 10);
          needsUpdate = true;
        }
      }

      if (animProgress[i] > 0) {
        const t = animProgress[i];
        // Ease-out bounce for drop-in
        const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;

        const targetX = targetMatrices[i * 16 + 12];
        const targetY = targetMatrices[i * 16 + 13];
        const targetZ = targetMatrices[i * 16 + 14];

        dummy.position.set(
          targetX,
          targetY + dropHeight * (1 - eased),
          targetZ
        );
        dummy.scale.setScalar(Math.min(1, eased * 1.1));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      } else if (prevCount.current > targetCount && i >= targetCount) {
        // Hide brick
        dummy.position.set(0, -100, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      mesh.instanceMatrix.needsUpdate = true;
    }
    prevCount.current = targetCount;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, totalBricks]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial toneMapped={false} />
    </instancedMesh>
  );
}
