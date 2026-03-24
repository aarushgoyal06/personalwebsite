"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import HeroFallback from "./HeroFallback";

interface Brick {
  x: number;
  y: number;
  z: number;
  color: string;
}

const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-neutral-500 text-lg animate-pulse">
        Loading experience...
      </div>
    </div>
  ),
});

function useCanRun3D() {
  const [canRun, setCanRun] = useState<boolean | null>(null);

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency ?? 2;
    const lowEnd = isMobile && cores < 4;

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        setCanRun(false);
        return;
      }
    } catch {
      setCanRun(false);
      return;
    }

    setCanRun(!lowEnd);
  }, []);

  return canRun;
}

export default function HeroLoader({ bricks }: { bricks: Brick[] }) {
  const canRun3D = useCanRun3D();

  if (canRun3D === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-neutral-500 text-lg animate-pulse">
          Loading experience...
        </div>
      </div>
    );
  }

  if (!canRun3D) {
    return <HeroFallback />;
  }

  return <HeroScene bricks={bricks} />;
}
