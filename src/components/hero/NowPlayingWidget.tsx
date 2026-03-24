"use client";

import { useEffect, useState } from "react";

import type { SpotifyTrackPayload } from "@/lib/spotify-types";

export type NowPlayingPayload =
  | { ok: false }
  | {
      ok: true;
      isPlaying: boolean;
      current: SpotifyTrackPayload | null;
      recentTracks: SpotifyTrackPayload[];
    };

const IDLE_COPY = "Aarush is not listening to anything right now";

function TrackRow({
  track,
  dense,
}: {
  track: SpotifyTrackPayload;
  dense?: boolean;
}) {
  const art = dense ? 40 : 56;
  return (
    <div className="flex gap-3">
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-900 ${
          dense ? "h-10 w-10" : "h-14 w-14"
        }`}
      >
        {track.albumImageUrl ? (
          <img
            src={track.albumImageUrl}
            alt=""
            className="h-full w-full object-cover"
            width={art}
            height={art}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-600">
            ♪
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {track.songUrl ? (
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`line-clamp-2 font-mono font-medium text-slate-100 underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] underline-offset-2 hover:text-[var(--accent)] ${
              dense ? "text-[12px]" : "text-sm"
            }`}
          >
            {track.title}
          </a>
        ) : (
          <p
            className={`line-clamp-2 font-mono font-medium text-slate-100 ${
              dense ? "text-[12px]" : "text-sm"
            }`}
          >
            {track.title}
          </p>
        )}
        <p
          className={`mt-0.5 line-clamp-2 font-mono text-slate-400 ${
            dense ? "text-[10px]" : "text-xs"
          }`}
        >
          {track.artist}
        </p>
        {!dense && (
          <p className="mt-0.5 line-clamp-1 font-mono text-[11px] text-slate-600">
            {track.album}
          </p>
        )}
      </div>
    </div>
  );
}

export default function NowPlayingWidget({
  className = "",
}: {
  className?: string;
}) {
  const [data, setData] = useState<NowPlayingPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/spotify/now-playing");
        const json = (await res.json()) as NowPlayingPayload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ ok: false });
      }
    }

    load();
    const id = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (data === null || !data.ok) return null;

  const { isPlaying, current, recentTracks } = data;
  const hasRecent = recentTracks.length > 0;

  return (
    <aside
      className={`overflow-hidden rounded-xl border-2 bg-[#050a12] shadow-2xl shadow-black/40 terminal-shell-border ${className}`}
      aria-label="Spotify now playing"
    >
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 terminal-shell-titlebar">
        <span className="font-mono text-xs text-slate-500">spotify</span>
      </div>

      <div className="space-y-4 p-4 pt-3">
        {current ? (
          <section aria-label="Now playing">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                Now playing
              </span>
              {isPlaying ? (
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
                    Live
                  </span>
                </span>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Paused
                </span>
              )}
            </div>
            <div
              className={`rounded-lg border p-3 ${
                isPlaying
                  ? "border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
                  : "border-white/[0.08] bg-white/[0.02]"
              }`}
            >
              <TrackRow track={current} />
            </div>
          </section>
        ) : (
          <p className="text-xs leading-relaxed text-slate-500">{IDLE_COPY}</p>
        )}

        {hasRecent && (
          <section aria-label="Recently played">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Recently played
            </p>
            <ul className="flex max-h-[min(320px,45vh)] flex-col gap-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {recentTracks.map((track, i) => (
                <li key={`${track.id}-${i}`}>
                  <div className="rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:bg-white/[0.03]">
                    <TrackRow track={track} dense />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!hasRecent && !current && (
          <p className="font-mono text-xs text-slate-600">
            No recent tracks yet — connect Spotify and grant “recently played”
            access (re-run /api/spotify/auth if needed).
          </p>
        )}
      </div>
    </aside>
  );
}
