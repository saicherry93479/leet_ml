import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import {eq} from 'drizzle-orm'

export async function GET({ cookies }) {
    const authSession = cookies.get('authSession');
    console.log('authSession is ',authSession)
    const session = await db.select().from(sessions).where(eq(sessions.id,authSession))
    console.log('session in api  ',session)
    if (!authSession) {
      return new Response(JSON.stringify({ error: 'No session' }), { status: 401 });
    }
    return new Response(JSON.stringify({
      expiryTime: new Date(Date.now() + 1000 * 60 * 15).getTime()
    }));
  }