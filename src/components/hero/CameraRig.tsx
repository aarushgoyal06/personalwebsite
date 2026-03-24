"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

const spherical = new THREE.Spherical();
const center = new THREE.Vector3(0, 3, 0);

export default function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame((_state, delta) => {
    const p = scroll.offset;
    const dt = Math.min(delta, 0.05);

    // Orbit ~400 degrees total
    const theta = p * Math.PI * 2.2 + Math.PI / 3;
    // Start slightly low, rise to elevated view
    const phi = THREE.MathUtils.lerp(1.2, 0.85, p);
    // Start close, pull back as car builds
    const radius = THREE.MathUtils.lerp(15, 28, Math.pow(p, 0.5));

    spherical.set(radius, phi, theta);

    const targetPos = new THREE.Vector3().setFromSpherical(spherical);
    targetPos.add(center);

    camera.position.lerp(targetPos, 1 - Math.exp(-4 * dt));

    const lookY = THREE.MathUtils.lerp(1, 4, p);
    camera.lookAt(new THREE.Vector3(0, lookY, 0));
  });

  return null;
}
