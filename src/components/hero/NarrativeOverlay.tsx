"use client";

import { useEffect, useRef, useState } from "react";
import { scrollProgress } from "./scrollProgress";

interface Milestone {
  range: [number, number];
  title: string;
  body: string;
}

const milestones: Milestone[] = [
  {
    range: [0.0, 0.1],
    title: "Hey, I'm Aarush.",
    body: "Let me build something for you.",
  },
  {
    range: [0.1, 0.3],
    title: "A bit about me",
    body: "I'm a developer and builder who loves creating things that live at the intersection of design and technology.",
  },
  {
    range: [0.3, 0.55],
    title: "What I do",
    body: "Full-stack development, creative coding, and bringing ambitious ideas to life — one brick at a time.",
  },
  {
    range: [0.55, 0.8],
    title: "Highlights",
    body: "From hackathon wins to production apps, I've built projects that push boundaries and solve real problems.",
  },
  {
    range: [0.8, 0.95],
    title: "Explore more",
    body: "Scroll down to see my projects, read my blog, or get in touch.",
  },
];

function MilestoneCard({
  milestone,
  opacity,
  index,
}: {
  milestone: Milestone;
  opacity: number;
  index: number;
}) {
  if (opacity <= 0.01) return null;

  const side = index % 2 === 0 ? "left-8 md:left-16" : "right-8 md:right-16";

  return (
    <div
      className={`fixed top-1/2 ${side} max-w-sm z-10 pointer-events-none`}
      style={{
        opacity,
        transform: `translateY(calc(-50% + ${(1 - opacity) * 20}px))`,
      }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
        {milestone.title}
      </h2>
      <p className="text-base md:text-lg text-neutral-300 leading-relaxed drop-shadow-md">
        {milestone.body}
      </p>
    </div>
  );
}

export default function NarrativeOverlay() {
  const [opacities, setOpacities] = useState<number[]>(
    () => new Array(milestones.length).fill(0)
  );
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function tick() {
      const p = scrollProgress.current;
      const next = milestones.map((m) => {
        const [start, end] = m.range;
        const fadeIn = 0.04;
        const fadeOut = 0.04;

        if (p < start || p > end) return 0;
        if (p < start + fadeIn) return (p - start) / fadeIn;
        if (p > end - fadeOut) return (end - p) / fadeOut;
        return 1;
      });

      setOpacities((prev) => {
        const changed = next.some((v, i) => Math.abs(v - prev[i]) > 0.01);
        return changed ? next : prev;
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {milestones.map((m, i) => (
        <MilestoneCard
          key={i}
          milestone={m}
          opacity={opacities[i]}
          index={i}
        />
      ))}
    </div>
  );
}
