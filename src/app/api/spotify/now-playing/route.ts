import { NextResponse } from "next/server";
import type { SpotifyTrackPayload } from "@/lib/spotify-types";
import { getSpotifyAccessToken } from "@/lib/spotify-server";

export const dynamic = "force-dynamic";

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

type SpotifyCurrentlyPlaying = {
  is_playing: boolean;
  item: SpotifyTrack | null;
};

type SpotifyRecentItem = {
  track: SpotifyTrack | null;
  played_at: string;
};

type SpotifyRecentResponse = {
  items: SpotifyRecentItem[];
};

function mapTrack(t: SpotifyTrack): SpotifyTrackPayload {
  const albumImageUrl =
    t.album.images?.[0]?.url ?? t.album.images?.[1]?.url ?? null;
  return {
    id: t.id,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    albumImageUrl,
    songUrl: t.external_urls?.spotify ?? null,
  };
}

export async function GET() {
  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    return NextResponse.json({ ok: false as const });
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const [currentlyRes, recentRes] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers,
      cache: "no-store",
    }),
    fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=11",
      {
        headers,
        cache: "no-store",
      }
    ),
  ]);

  let isPlaying = false;
  let current: SpotifyTrackPayload | null = null;

  if (currentlyRes.status === 204) {
    isPlaying = false;
  } else if (currentlyRes.ok) {
    const cp = (await currentlyRes.json()) as SpotifyCurrentlyPlaying;
    if (cp.item) {
      current = mapTrack(cp.item);
      isPlaying = cp.is_playing;
    }
  }

  const recentTracks: SpotifyTrackPayload[] = [];

  if (recentRes.ok) {
    const recent = (await recentRes.json()) as SpotifyRecentResponse;
    for (const row of recent.items ?? []) {
      if (!row.track?.id) continue;
      recentTracks.push({
        ...mapTrack(row.track),
        playedAt: row.played_at,
      });
    }
  }

  const currentId = current?.id ?? null;
  let recentFiltered = recentTracks;
  if (currentId) {
    recentFiltered = recentTracks
      .filter((t) => t.id !== currentId)
      .slice(0, 10);
  } else {
    recentFiltered = recentTracks.slice(0, 10);
  }

  return NextResponse.json({
    ok: true as const,
    isPlaying,
    current,
    recentTracks: recentFiltered,
  });
}
