
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ locals, cookies, redirect }) => {
  if (!locals.session) return redirect("/", 302);

  const sessionId = locals.session.id;
  await db.delete(sessions).where(eq(sessions.id, sessionId));

  cookies.delete("authSession", {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
  });
  return redirect("/", 302);
};
