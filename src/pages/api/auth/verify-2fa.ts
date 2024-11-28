import { createSession } from "@/lib/auth/google";
import { TwoFactorAuth } from "@/lib/auth/twoFactor";
import type { APIRoute } from "astro";

// pages/api/auth/verify-2fa.ts
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { code } = await request.json();
  const tempAuth = cookies.get("temp_auth")?.json();

  if (!tempAuth) {
    return new Response(JSON.stringify({ error: "Invalid session" }), {
      status: 401,
    });
  }

  const verified = await TwoFactorAuth.verify(tempAuth.userId, code);

  if (verified) {
    // Clear temporary auth
    cookies.delete("temp_auth");

    // Create actual session
    const sessionId = await createSession(
      tempAuth.userId,
      tempAuth.tokens,
      tempAuth.userAgent
    );

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Failed to create session" }),
        {
          status: 500,
        }
      );
    }

    cookies.set("authSession", sessionId, {
      secure: import.meta.env.PROD,
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });

    return new Response(JSON.stringify({ success: true }));
  }

  return new Response(JSON.stringify({ error: "Invalid code" }), {
    status: 400,
  });
};
