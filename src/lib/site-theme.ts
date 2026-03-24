/** Accent presets — used by terminal `theme` / `accent` and persisted in localStorage */

export const ACCENT_PRESETS: Record<string, string> = {
  blue: "#3b82f6",
  cyan: "#22d3ee",
  emerald: "#34d399",
  violet: "#a78bfa",
  amber: "#fbbf24",
  rose: "#fb7185",
  lime: "#a3e635",
  crimson: "#f43f5e",
};

const STORAGE_KEY = "portfolio-accent";

export function getStoredAccentName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setSiteAccent(
  name: string,
  options?: { persist?: boolean }
): { ok: boolean; message: string } {
  const persist = options?.persist !== false;
  const key = name.toLowerCase().trim();
  const hex = ACCENT_PRESETS[key];
  if (!hex) {
    const keys = Object.keys(ACCENT_PRESETS).join(", ");
    return { ok: false, message: `Unknown theme. Try: ${keys}` };
  }
  document.documentElement.style.setProperty("--accent", hex);
  if (persist) localStorage.setItem(STORAGE_KEY, key);
  return { ok: true, message: `Accent set to ${key}.` };
}

export function hydrateSiteAccent() {
  if (typeof window === "undefined") return;
  const name = localStorage.getItem(STORAGE_KEY);
  if (name && ACCENT_PRESETS[name]) {
    document.documentElement.style.setProperty(
      "--accent",
      ACCENT_PRESETS[name]
    );
  }
}
