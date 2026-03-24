"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  terminalCommands,
  terminalIntro,
} from "@/data/terminal-commands";
import {
  ACCENT_PRESETS,
  getStoredAccentName,
  setSiteAccent,
} from "@/lib/site-theme";
import { parseShellInput, type ShellEffect } from "@/lib/shell-commands";
import NowPlayingWidget from "@/components/hero/NowPlayingWidget";

const PROMPT = "aarush@portfolio:~$";

/** Only ~3–4% of the hero scroll is “intro”; first command appears quickly */
const INTRO_SCROLL_FRACTION = 0.04;

function useScrollLinkedStep(
  containerRef: React.RefObject<HTMLElement | null>,
  commandCount: number
) {
  const [step, setStep] = useState(0);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el || commandCount <= 0) return;
    const top = el.offsetTop;
    const height = el.offsetHeight;
    const vh = window.innerHeight;
    const scrollable = Math.max(1, height - vh);
    const y = window.scrollY - top;
    const p = Math.max(0, Math.min(1, y / scrollable));

    let next: number;
    if (p < INTRO_SCROLL_FRACTION) {
      next = 0;
    } else {
      const p2 = (p - INTRO_SCROLL_FRACTION) / (1 - INTRO_SCROLL_FRACTION);
      next = Math.min(commandCount, Math.floor(p2 * commandCount) + 1);
    }
    setStep(next);
  }, [containerRef, commandCount]);

  useEffect(() => {
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return step;
}

function useTypedLine(full: string, enabled: boolean) {
  const [text, setText] = useState(enabled ? "" : full);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setText(full);
      setDone(true);
      return;
    }
    let i = 0;
    setText("");
    setDone(false);
    const id = window.setInterval(() => {
      i += 1;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 20);
    return () => clearInterval(id);
  }, [full, enabled]);

  return { text, done };
}

type InteractiveLine =
  | { kind: "in"; text: string }
  | { kind: "out"; lines: string[] };

export default function TerminalHero() {
  const shellRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const inputId = useId();

  const n = terminalCommands.length;
  const step = useScrollLinkedStep(shellRef, n);
  const unlocked = step >= n;

  const [interactive, setInteractive] = useState<InteractiveLine[]>([]);
  const [input, setInput] = useState("");
  const rainbowTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [step, interactive]);

  useEffect(() => {
    if (unlocked) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [unlocked]);

  const stopRainbow = useCallback(() => {
    if (rainbowTimerRef.current) {
      clearInterval(rainbowTimerRef.current);
      rainbowTimerRef.current = null;
    }
  }, []);

  const startRainbow = useCallback(
    (durationMs: number) => {
      stopRainbow();
      const names = Object.keys(ACCENT_PRESETS);
      const saved = getStoredAccentName() || "blue";
      let i = 0;
      rainbowTimerRef.current = setInterval(() => {
        const k = names[i % names.length]!;
        setSiteAccent(k, { persist: false });
        i += 1;
      }, 240);
      window.setTimeout(() => {
        stopRainbow();
        setSiteAccent(saved, { persist: true });
      }, durationMs);
    },
    [stopRainbow]
  );

  useEffect(() => () => stopRainbow(), [stopRainbow]);

  const runEffect = useCallback(
    (effect: Exclude<ShellEffect, { type: "clear" }>): string[] => {
      switch (effect.type) {
        case "output":
          return effect.lines;
        case "theme": {
          const r = setSiteAccent(effect.name);
          return [r.message];
        }
        case "navigate":
          router.push(effect.path);
          return effect.lines;
        case "openUrl":
          window.open(effect.url, "_blank", "noopener,noreferrer");
          return [`Opened: ${effect.url}`];
        case "mailto": {
          const q = new URLSearchParams({
            subject: effect.subject,
          });
          window.location.href = `mailto:${effect.email}?${q.toString()}`;
          return [
            `Opening mail to ${effect.email}…`,
            "(If nothing opens, copy the address from the Contact page.)",
          ];
        }
        case "sms": {
          const url = `sms:+${effect.phone}?body=${encodeURIComponent(effect.body)}`;
          window.location.href = url;
          const p = effect.phone;
          const pretty =
            p.length === 11 && p.startsWith("1")
              ? `+1 (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7)}`
              : `+${p}`;
          return [
            "Opening your SMS app…",
            `Number: ${pretty}`,
            "On desktop, nothing may open — text me from your phone.",
            `Suggested message: "${effect.body.slice(0, 60)}${effect.body.length > 60 ? "…" : ""}"`,
          ];
        }
        case "rainbow":
          startRainbow(effect.durationMs);
          return [
            "🌈 Rainbow mode — cycling accents. Hang tight…",
            `Reverting to your saved theme in ${(effect.durationMs / 1000).toFixed(1)}s.`,
          ];
      }
    },
    [router, startRainbow]
  );

  const onSubmitLine = useCallback(
    (raw: string) => {
      const line = raw.trim();
      if (!line) return;

      const effect = parseShellInput(line);
      if (effect.type === "clear") {
        setInteractive([]);
        return;
      }

      setInteractive((prev) => [...prev, { kind: "in", text: line }]);

      const lines = runEffect(effect);
      if (lines.length) {
        setInteractive((prev) => [...prev, { kind: "out", lines }]);
      }
    },
    [runEffect]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmitLine(input);
      setInput("");
    }
  };

  return (
    <section
      ref={shellRef}
      className="relative"
      style={{ minHeight: `${(1 + Math.max(n, 1)) * 100}vh` }}
    >
      <div className="sticky top-0 flex min-h-screen w-full items-center justify-center px-4 pt-20 pb-16">
        <div className="flex w-full max-w-[90rem] flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
          <div className="relative w-full max-w-3xl shrink-0">
            <div className="overflow-hidden rounded-xl border-2 bg-[#050a12] shadow-2xl shadow-black/40 terminal-shell-border">
            <div className="flex items-center gap-2 px-4 py-2.5 terminal-shell-titlebar">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-500">
                portfolio — bash
              </span>
            </div>

            <div
              ref={bodyRef}
              className="max-h-[min(72vh,680px)] overflow-y-auto p-5 font-mono text-sm leading-relaxed text-slate-200 md:text-[15px]"
            >
              <pre className="whitespace-pre-wrap text-slate-500">
                {terminalIntro.lines.join("\n")}
              </pre>

              {terminalCommands.slice(0, step).map((block, i) => {
                const isLatest = i === step - 1;
                return (
                  <CommandBlock
                    key={`${block.command}-${i}`}
                    block={block}
                    animateTyping={isLatest}
                  />
                );
              })}

              {step === 0 && (
                <p className="mt-5 text-slate-600">
                  <span className="inline-block animate-bounce text-[var(--accent)]">
                    ↓
                  </span>{" "}
                  Scroll to run commands
                </p>
              )}

              {interactive.map((row, i) =>
                row.kind === "in" ? (
                  <div
                    key={`i-${i}`}
                    className="mt-4 flex flex-wrap gap-x-2 border-l-2 pl-4 terminal-shell-accent-line"
                  >
                    <span className="shrink-0 text-[var(--accent)]">
                      {PROMPT}
                    </span>
                    <span className="text-emerald-400">{row.text}</span>
                  </div>
                ) : (
                  <pre
                    key={`o-${i}`}
                    className="mt-2 whitespace-pre-wrap pl-4 text-slate-300"
                  >
                    {row.lines.join("\n")}
                  </pre>
                )
              )}

              {unlocked && (
                <div className="mt-6 border-t border-[color-mix(in_srgb,var(--accent)_18%,transparent)] pt-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
                    Interactive shell — try{" "}
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[var(--accent)]">
                      help
                    </kbd>
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2">
                    <label htmlFor={inputId} className="sr-only">
                      Terminal command
                    </label>
                    <span className="shrink-0 text-[var(--accent)]">
                      {PROMPT}
                    </span>
                    <input
                      ref={inputRef}
                      id={inputId}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      autoComplete="off"
                      spellCheck={false}
                      className="min-w-[12rem] flex-1 border-none bg-transparent py-1 text-emerald-400 outline-none placeholder:text-slate-600 focus:ring-0"
                      placeholder="type a command…"
                    />
                  </div>
                </div>
              )}
            </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-600">
              {unlocked
                ? "Scroll is done — use the shell above, or keep exploring below."
                : "Scroll — each segment runs the next command (first one appears quickly)."}
            </p>
          </div>
          <NowPlayingWidget className="w-full max-w-md shrink-0 lg:sticky lg:top-24 lg:w-96 lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}

function CommandBlock({
  block,
  animateTyping,
}: {
  block: { command: string; output: string };
  animateTyping: boolean;
}) {
  const { text, done } = useTypedLine(block.command, animateTyping);
  const cmdDisplay = animateTyping ? text : block.command;

  return (
    <div className="mt-5 border-l-2 pl-4 terminal-shell-accent-line">
      <div className="flex flex-wrap gap-x-2">
        <span className="shrink-0 text-[var(--accent)]">{PROMPT}</span>
        <span className="text-emerald-400">{cmdDisplay}</span>
        {animateTyping && !done && (
          <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-emerald-400/80 align-middle" />
        )}
      </div>
      {(!animateTyping || done) && (
        <pre className="mt-3 whitespace-pre-wrap text-slate-300">
          {block.output}
        </pre>
      )}
    </div>
  );
}
