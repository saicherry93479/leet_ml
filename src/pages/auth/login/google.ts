import * as google from "../../../lib/auth/google.ts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, url, cookies }) => {
  if (!google) {
    return new Response("Invalid provider", { status: 400 });
  }
  const provider = google;

  const { state, codeVerifier, redirectUrl } =
    await provider.createAuthorizationURL(url);
  const fromUrl = url.searchParams.get("from");

  cookies.set(
    "authState",
    {
      state,
      codeVerifier,
      from: fromUrl,
    },
    {
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      path: "/auth", // Only send this cookie to /auth routese
    }
  );
  return new Response("", {
    status: 302,
    headers: {
      Location: redirectUrl.toString(),
    },
  });
};
