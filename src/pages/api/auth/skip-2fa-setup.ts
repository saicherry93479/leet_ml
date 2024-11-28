import { createSession } from "@/lib/auth/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ cookies }) => {
    const setupAuth = cookies.get("setup_auth")?.json();
    
    if (!setupAuth) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { 
        status: 401 
      });
    }
  
    try {
      // Update first login status
      await db.update(users)
        .set({ firstLogin: false })
        .where(eq(users.id, setupAuth.userId));
      
      // Clear setup auth
      cookies.delete("setup_auth");
      
      // Create actual session
      const sessionId = await createSession(
        setupAuth.userId, 
        setupAuth.tokens, 
        setupAuth.userAgent
      );
  
      if (!sessionId) {
        throw new Error("Failed to create session");
      }
  
      cookies.set("authSession", sessionId, {
        secure: import.meta.env.PROD,
        httpOnly: true,
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 15),
      });
  
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to skip 2FA setup" }), { 
        status: 500 
      });
    }
  };