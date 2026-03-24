import { NextResponse } from "next/server";
import { getSpotifyRedirectUri } from "@/lib/spotify-server";

/**
 * OAuth callback. In Spotify Dashboard add:
 * http://127.0.0.1:PORT/api/spotify/callback (local) and/or https://YOUR_DOMAIN/api/spotify/callback
 * Visit /api/spotify/auth, sign in, then copy SPOTIFY_REFRESH_TOKEN from this response.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const err = searchParams.get("error");

  if (err) {
    return new NextResponse(`Spotify error: ${err}`, {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (!code) {
    return new NextResponse("Missing ?code= — start from /api/spotify/auth", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return new NextResponse(
      "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local",
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const redirectUri = getSpotifyRedirectUri(request.url);

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const raw = await tokenRes.text();
  if (!tokenRes.ok) {
    return new NextResponse(`Token exchange failed:\n${raw}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const data = JSON.parse(raw) as { refresh_token?: string };
  const refresh = data.refresh_token;
  if (!refresh) {
    return new NextResponse(
      "No refresh_token in response. Revoke app access in Spotify account settings and try again.",
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Spotify connected</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
    pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; word-break: break-all; }
    code { font-size: 0.875rem; }
  </style>
</head>
<body>
  <h1>Spotify connected</h1>
  <p>Add this to <strong>.env.local</strong> (then restart <code>npm run dev</code>):</p>
  <pre><code>SPOTIFY_REFRESH_TOKEN=${refresh}</code></pre>
  <p>You can close this tab.</p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
