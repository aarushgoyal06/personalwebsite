"use client";

import { Canvas } from "@react-three/fiber";
import { ScrollControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import LegoRenderer from "./LegoRenderer";
import CameraRig from "./CameraRig";
import ScrollProgressTracker from "./ScrollProgressTracker";
import NarrativeOverlay from "./NarrativeOverlay";

interface Brick {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface HeroSceneProps {
  bricks: Brick[];
}

function Scene({ bricks }: { bricks: Brick[] }) {
  return (
    <>
      <ScrollProgressTracker />
      <CameraRig />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-10, 20, -10]} intensity={0.4} />
      <Environment preset="city" />

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      <LegoRenderer bricks={bricks} />
    </>
  );
}

export default function HeroScene({ bricks }: HeroSceneProps) {
  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [25, 15, 25], fov: 45, near: 0.1, far: 200 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 60, 120]} />
        <Suspense fallback={null}>
          <ScrollControls pages={6} damping={0.25}>
            <Scene bricks={bricks} />
          </ScrollControls>
        </Suspense>
      </Canvas>
      <NarrativeOverlay />
    </div>
  );
}
