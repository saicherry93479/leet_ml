import {
  generateCodeVerifier,
  generateState,
  Google,
  type GoogleTokens,
} from "arctic";
import { db } from "../db";
import { sessions } from "../db/schema";

const googleClientId =
  "558616366545-qf0s95ioagurbcc3m54avii0ue5i45fr.apps.googleusercontent.com";
const googleClientSecret = "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";



function google(url?: URL) {
  url ??= new URL("http://localhost:4321");
  if (import.meta.env.PROD && url.hostname !== "localhost") {
    url.protocol = "https:";
  }
  return new Google(
    googleClientId,
    googleClientSecret,
    new URL("/auth/callback/google", url).toString()
  );
}

google.default = google();

export async function createAuthorizationURL(url?: URL) {

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["email", "profile"];
  const redirectUrl = await google(url).createAuthorizationURL(
    state,
    codeVerifier,
    {
      scopes,
    }
  );

  return {
    state,
    codeVerifier,
    redirectUrl,
  };
}

export function validateAuthorizationCode(
  code: string,
  codeVerifier: string,
  url?: URL
) {
  const g = url ? google(url) : google.default;
  return g.validateAuthorizationCode(code, codeVerifier);
}

export function refreshAccessToken(refreshToken: string) {
  return google.default.refreshAccessToken(refreshToken);
}

export function revokeAccessToken(_: string) {}

const googleUserEndpoint = "https://www.googleapis.com/oauth2/v1/userinfo";

type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

export async function fetchUser(tokens: any) {
  const res = await fetch(googleUserEndpoint, {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  })
    .then((res) => res.json() as Promise<GoogleUser>)
    .catch((err) => {
      console.error(err);
      return null;
    });

  if (!res) return null;

  return {
    name: res.name,
    email: res.email,
    avatar_url: res.picture,
  };
}

export async function createSession(
  userId: string,
  tokens: any,
  userAgent?: string
) {
  if (!userAgent) {
    userAgent = "Unknown Device";
  }
  const deviceLabel = "web";
  const accessToken = tokens.accessToken;
  const accessTokenExpiresAt = tokens.accessTokenExpiresAt;
  const refreshToken = tokens.refreshToken ?? null;
  const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt ?? null;

  try {
    const [session] = await db
      .insert(sessions)
      .values({
        userId,
        deviceLabel,
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      })
      .returning({ id: sessions.id });
    if (!session) return null;

    return session.id;
  } catch (error) {
    console.error(error);
    return null;
  }
}
