const SPOTIFY_ACCOUNTS = "https://accounts.spotify.com";

export const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
].join(" ");

export async function getSpotifyAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;

  const res = await fetch(`${SPOTIFY_ACCOUNTS}/api/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
      client_id: id,
      client_secret: secret,
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

/**
 * Spotify no longer allows `localhost` as a redirect host (loopback must use
 * 127.0.0.1 or [::1]). We normalize so opening /auth via http://localhost:…
 * still sends a valid redirect_uri to Spotify.
 */
function normalizeLoopbackHost(uri: string): string {
  try {
    const u = new URL(uri);
    if (u.hostname === "localhost") {
      u.hostname = "127.0.0.1";
    }
    return u.toString();
  } catch {
    return uri;
  }
}

export function getSpotifyRedirectUri(requestUrl: string): string {
  const explicit = process.env.SPOTIFY_REDIRECT_URI?.trim();
  const resolved =
    explicit || new URL("/api/spotify/callback", requestUrl).toString();
  return normalizeLoopbackHost(resolved);
}
