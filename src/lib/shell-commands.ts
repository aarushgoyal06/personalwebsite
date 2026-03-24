/**
 * Interactive home-terminal commands — pure parsing.
 * Side effects executed in the React component.
 */

import { ACCENT_PRESETS } from "./site-theme";

export type ShellEffect =
  | { type: "output"; lines: string[] }
  | { type: "navigate"; path: string; lines: string[] }
  | { type: "openUrl"; url: string }
  | { type: "sms"; phone: string; body: string }
  | { type: "mailto"; email: string; subject: string }
  | { type: "clear" }
  | { type: "rainbow"; durationMs: number }
  | { type: "theme"; name: string };

const PHONE_E164 = "13027409823";
const EMAIL = "goyalaarush6@gmail.com";

export function getHelpLines(): string[] {
  const names = Object.keys(ACCENT_PRESETS).join(", ");
  return [
    "Available commands:",
    "",
    "  Navigation",
    "    cd / | cd ~ | cd home     → home",
    "    cd projects | open projects",
    "    cd blog | cd resume | cd contact",
    "    ls                        → list site sections",
    "    pwd                       → print working directory",
    "",
    "  Links & contact",
    "    github | gh               → open GitHub",
    "    linkedin | li             → open LinkedIn",
    "    email | mail              → compose email",
    "    text | sms                → SMS (opens Messages on iPhone / app on Android)",
    "",
    "  Look & feel",
    "    theme <name> | accent <name>",
    `      ${names}`,
    "    rainbow                   → party mode (~6s)",
    "",
    "  Misc",
    "    echo <text>",
    "    whoami | date | fortune",
    "    sudo <anything>",
    "    clear",
    "    help | ?",
  ];
}

export function parseShellInput(raw: string): ShellEffect {
  const trimmed = raw.trim();
  if (!trimmed) return { type: "output", lines: [""] };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const rest = trimmed.slice(parts[0].length).trim();
  const restLower = rest.toLowerCase();

  if (cmd === "help" || cmd === "?") {
    return { type: "output", lines: getHelpLines() };
  }

  if (cmd === "clear") return { type: "clear" };

  if (cmd === "echo") {
    return { type: "output", lines: [rest || ""] };
  }

  if (cmd === "whoami") {
    return {
      type: "output",
      lines: ["aarush", "(the human behind the keyboard)"],
    };
  }

  if (cmd === "date") {
    return { type: "output", lines: [new Date().toString()] };
  }

  if (cmd === "fortune") {
    const quotes = [
      "Ship small, ship often.",
      "The best error message is the one you never see.",
      "Coffee first. Then code.",
      "Your terminal is cooler than mine.",
      "One more deploy couldn't hurt. (Famous last words.)",
    ];
    return {
      type: "output",
      lines: [quotes[Math.floor(Math.random() * quotes.length)]!],
    };
  }

  if (cmd === "sudo") {
    return {
      type: "output",
      lines: [
        "nice try :)",
        rest
          ? `If I had root, you'd still need a password for "${rest}".`
          : "This incident will be reported. (It won't.)",
      ],
    };
  }

  if (cmd === "pwd") {
    return { type: "output", lines: ["/home/aarush/portfolio"] };
  }

  if (cmd === "ls") {
    return {
      type: "output",
      lines: [
        "blog/  contact/  projects/  resume/",
        "Run cd <name> to open a page.",
      ],
    };
  }

  if (cmd === "github" || cmd === "gh") {
    return { type: "openUrl", url: "https://github.com/aarushgoyal06" };
  }

  if (cmd === "linkedin" || cmd === "li") {
    return {
      type: "openUrl",
      url: "https://www.linkedin.com/in/aarushgoyal/",
    };
  }

  if (cmd === "email" || cmd === "mail") {
    return {
      type: "mailto",
      email: EMAIL,
      subject: "Hey Aarush — from your site",
    };
  }

  if (cmd === "text" || cmd === "sms" || cmd === "imessage") {
    const firstWord = restLower.split(/\s+/)[0];
    const skip =
      !firstWord ||
      ["text", "sms", "imessage"].includes(firstWord);
    const body = skip
      ? "Hey Aarush — I found you through your portfolio!"
      : rest;
    return {
      type: "sms",
      phone: PHONE_E164,
      body,
    };
  }

  if (cmd === "rainbow") {
    return { type: "rainbow", durationMs: 6200 };
  }

  if (cmd === "theme" || cmd === "accent") {
    const name = restLower.split(/\s+/).filter(Boolean)[0] || "";
    if (!name) {
      return {
        type: "output",
        lines: ["Usage: theme <name>", "Try: theme cyan"],
      };
    }
    return { type: "theme", name };
  }

  if (cmd === "cd" || cmd === "open") {
    const target = restLower.replace(/^\/+/, "").split(/\s+/)[0] || "";
    const map: Record<string, string> = {
      "": "/",
      "~": "/",
      home: "/",
      projects: "/projects",
      project: "/projects",
      blog: "/blog",
      resume: "/resume",
      contact: "/contact",
    };
    const path = map[target];
    if (path === undefined) {
      return {
        type: "output",
        lines: [
          `cd: no such page: ${target || "(empty)"}`,
          "Try: cd blog · cd projects · cd resume · cd contact · cd ~",
        ],
      };
    }
    const label = path === "/" ? "/" : path;
    return {
      type: "navigate",
      path,
      lines: [`cd ${target || "~"}`, `→ ${label}`],
    };
  }

  return {
    type: "output",
    lines: [
      `command not found: ${parts[0]}`,
      'Type "help" for a list of commands.',
    ],
  };
}
