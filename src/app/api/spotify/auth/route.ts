import { NextResponse } from "next/server";
import { getSpotifyRedirectUri, SPOTIFY_SCOPES } from "@/lib/spotify-server";

export async function GET(request: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.json(
      { error: "Set SPOTIFY_CLIENT_ID in .env.local" },
      { status: 500 }
    );
  }

  const redirectUri = getSpotifyRedirectUri(request.url);
  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", SPOTIFY_SCOPES);
  url.searchParams.set("show_dialog", "true");

  return NextResponse.redirect(url.toString());
}
