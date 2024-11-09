import { TwoFactorAuth } from "@/lib/auth/twoFactor";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
  console.log('here came ')
    const setupAuth = cookies.get("setup_auth")?.json();
    console.log('here came ',setupAuth)
    if (!setupAuth) {
      
      return new Response(JSON.stringify({ error: "Invalid session" }), { 
        status: 401 
      });
    }
  
    try {
      const { secret, otpauthUrl } = await TwoFactorAuth.setupTwoFactor(setupAuth.userId);
      
      return new Response(JSON.stringify({ secret, otpauthUrl }));
    } catch (err) {
        console.log("error in intialzing the 2fa ",err)
      return new Response(JSON.stringify({ error: "Failed to initialize 2FA" }), { 
        status: 500 
      });
    }
  };