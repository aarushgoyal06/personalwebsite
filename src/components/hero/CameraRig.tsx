"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

const target = new THREE.Vector3(0, 6, 0);
const spherical = new THREE.Spherical();

export default function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame((_state, delta) => {
    const p = scroll.offset;
    const dt = Math.min(delta, 0.05);

    // Theta: orbit ~450 degrees total
    const theta = p * Math.PI * 2.5 + Math.PI / 4;
    // Phi: start at ~80 deg (near ground), rise to ~55 deg (elevated)
    const phi = THREE.MathUtils.lerp(1.35, 0.9, p);
    // Radius: start close, pull back as structure grows
    const radius = THREE.MathUtils.lerp(25, 45, Math.pow(p, 0.6));

    spherical.set(radius, phi, theta);

    const targetPos = new THREE.Vector3().setFromSpherical(spherical);
    targetPos.add(target);

    // Smooth damping
    camera.position.lerp(targetPos, 1 - Math.exp(-4 * dt));

    // Look-at target rises as building grows
    const lookY = THREE.MathUtils.lerp(2, 10, p);
    const lookTarget = new THREE.Vector3(0, lookY, 0);
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    camera.lookAt(lookTarget);
  });

  return null;
}
