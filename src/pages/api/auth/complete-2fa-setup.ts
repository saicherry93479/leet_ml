import { createSession } from "@/lib/auth/google";
import { TwoFactorAuth } from "@/lib/auth/twoFactor";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const { code } = await request.json();
    const setupAuth = cookies.get("setup_auth")?.json();
    
    if (!setupAuth) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { 
        status: 401 
      });
    }
  
    try {
      const verified = await TwoFactorAuth.verifyAndEnable(setupAuth.userId, code);
      
      console.log("here in complete 2fa")
      if (verified) {
        // Clear setup auth
        cookies.delete("setup_auth");
        
        // Update first login status
        console.log('here ')
        await db.update(users)
          .set({ firstLogin: false })
          .where(eq(users.id, setupAuth.userId));
        console.log('no came here ')
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
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });
  
        return new Response(JSON.stringify({ success: true }));
      }
  
      return new Response(JSON.stringify({ error: "Invalid code" }), { 
        status: 400 
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to complete 2FA setup" }), { 
        status: 500 
      });
    }
  };