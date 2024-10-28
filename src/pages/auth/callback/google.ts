import * as google from "../../../lib/auth/google.ts";
import { createSession } from "../../../lib/auth/google.ts";

import { db } from "../../../lib/db/index";
import { users } from "../../../lib/db/schema.ts";
import { OAuth2RequestError } from "arctic";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url, cookies, request, redirect }) => {
  const provider = google;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const { state: authState, codeVerifier } =
    cookies.get("authState")?.json() || {};

  cookies.delete("authState");

  if (!code || !state || state !== authState) {
    return new Response("Invalid request", { status: 400 });
  }

  let tokens;
  try {
    tokens = await provider.validateAuthorizationCode(code, codeVerifier, url);

    const oauthUser = await provider.fetchUser(tokens);
    if (!oauthUser) {
      return new Response("Failed to fetch user", { status: 400 });
    }

    let user = await db.query.users.findFirst({
      where: eq(users.email, oauthUser.email),
      //   with: {
      //     profile: true,
      //   },
    });

    if (!user) {
      try {
        const [newUser] = await db
          .insert(users)
          .values({
            email: oauthUser.email,
            avatar: oauthUser.avatar_url,
            name: oauthUser.name,
          })
          .returning();

        if (!newUser) {
          return new Response("Failed to create user", { status: 500 });
        }

        // @ts-ignore
        user = newUser;
        // @ts-ignore
        // user!.profile = null;
      } catch (error) {
        console.error(error);
        return new Response("Failed to create user", { status: 500 });
      }
    }

    if (!user) {
      return new Response("Failed to create user", { status: 500 });
    }

    if (user.twoFactorEnabled) {
      const tempId = crypto.randomUUID();
      cookies.set(
        "temp_auth",
        JSON.stringify({
          id: tempId,
          userId: user.id,
          tokens,
          userAgent: request.headers.get("user-agent"),
        }),
        {
          secure: import.meta.env.PROD,
          httpOnly: true,
          path: "/",
          maxAge: 300, // 5 minutes
        }
      );

      return redirect("/auth/verify-2fa", 302);
    }

    if (user.firstLogin) {
      const tempId = crypto.randomUUID();
      cookies.set(
        "setup_auth",
        JSON.stringify({
          id: tempId,
          userId: user.id,
          tokens,
          userAgent: request.headers.get("user-agent"),
        }),
        {
          secure: import.meta.env.PROD,
          httpOnly: true,
          path: "/",
          maxAge: 900, // 15 minutes
        }
      );

      return redirect("/auth/setup-2fa", 302);
    }

    const userAgent = request.headers.get("user-agent");
    const sessionId = await createSession(user.id, tokens, userAgent || "");
    if (!sessionId) {
      return new Response("Failed to create session", { status: 500 });
    }

    cookies.set("authSession", sessionId, {
      secure: import.meta.env.PROD,
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return redirect("/", 302);
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(error.description, { status: 400 });
    }
    throw error;
  }

  return redirect("/auth", 302);
};
