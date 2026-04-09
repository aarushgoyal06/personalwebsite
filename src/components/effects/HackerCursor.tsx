"use client";

import { useEffect, useRef, useState } from "react";
import CursorTesseractCanvas from "./CursorTesseractCanvas";

const INTERACTIVE =
  "a[href], button, [role='button'], [role='link'], input, textarea, select, label, summary";

/** Box-shadow on the wrapper reads as a square “aura”; glow lives on the canvas only. */
const HOVER_TRANSITION = "transform 200ms linear, opacity 200ms linear";

/** Injected at end of <head> so it wins over Tailwind and any layered CSS. */
const CURSOR_HIDE_CSS = `
html.custom-cursor,
html.custom-cursor *,
html.custom-cursor *::before,
html.custom-cursor *::after {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E") 0 0, none !important;
}
`;

export default function HackerCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const html = document.documentElement;

    const style = document.createElement("style");
    style.id = "hacker-cursor-hide";
    style.textContent = CURSOR_HIDE_CSS;

    const reinstateCursorLock = () => {
      html.classList.add("custom-cursor");
      html.style.setProperty("cursor", "none", "important");
      document.body.style.setProperty("cursor", "none", "important");
      if (!document.getElementById("hacker-cursor-hide")) {
        document.head.appendChild(style);
      }
    };

    reinstateCursorLock();
    setActive(true);

    const onMove = (e: MouseEvent) => {
      reinstateCursorLock();
      const el = rootRef.current;
      if (el) {
        el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        el.style.opacity = "1";
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      setInteractive(!!hit?.closest(INTERACTIVE));
    };

    const onLeave = () => {
      const el = rootRef.current;
      if (el) el.style.opacity = "0";
    };

    const onVis = () => {
      if (document.visibilityState === "visible") reinstateCursorLock();
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    html.addEventListener("mouseenter", reinstateCursorLock);
    document.body.addEventListener("mouseenter", reinstateCursorLock);
    window.addEventListener("focus", reinstateCursorLock);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      style.remove();
      html.classList.remove("custom-cursor");
      html.style.removeProperty("cursor");
      document.body.style.removeProperty("cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      html.removeEventListener("mouseenter", reinstateCursorLock);
      document.body.removeEventListener("mouseenter", reinstateCursorLock);
      window.removeEventListener("focus", reinstateCursorLock);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (!active) return null;

  const hover = interactive;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 top-0 z-[2147483647] will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        opacity: 0,
        color: "var(--accent)",
      }}
      aria-hidden
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 origin-center"
        style={{
          transition: HOVER_TRANSITION,
          opacity: hover ? 1 : 0.88,
          transform: hover ? "scale(1.1)" : "scale(1)",
        }}
      >
        <div className="hypercube-cursor-stage">
          <CursorTesseractCanvas interactive={hover} />
        </div>
      </div>
    </div>
  );
}
