"use client";

import { useEffect, useState } from "react";
import { scrollProgress } from "./scrollProgress";

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function check() {
      setVisible(scrollProgress.current < 0.05);
      requestAnimationFrame(check);
    }
    const id = requestAnimationFrame(check);
    return () => cancelAnimationFrame(id);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none animate-bounce">
      <span className="text-sm text-neutral-400">Scroll to build</span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-neutral-400"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </div>
  );
}
