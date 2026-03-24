"use client";

import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { scrollProgress } from "./scrollProgress";

export default function ScrollProgressTracker() {
  const scroll = useScroll();

  useFrame(() => {
    scrollProgress.current = scroll.offset;
  });

  return null;
}
