import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST({ request }) {
  const { userId, code } = request.body;
  console.log("request us ", request.body);
  console.log("userid jknj", userId);
  console.log("code ", code);
  if (!userId || !code) {
    return new Response(
      JSON.stringify({
        status: 400,
        body: { error: "Invalid or expired code" },
      })
    );
  }

  try {
    console.log("checking");
    let userAll = await db.select().from(users).where(eq(users.id, userId));
    const user = userAll[0];
    console.log("user");
    if (
      user.emailTwoFactorEnabled &&
      user.emailTwoFactorCode === code &&
      user.emailTwoFactorCodeExpiresAt > new Date()
    ) {
      await db
        .update(users)
        .set({
          emailTwoFactorCode: null,
          emailTwoFactorCodeExpiresAt: null,
        })
        .where(eq(users.id, userId));

      return {
        status: 200,
        body: { message: "Email code verified" },
      };
    }

    return new Response(
      JSON.stringify({
        status: 400,
        body: { error: "Invalid or expired code" },
      })
    );
  } catch (error) {
    console.error("Error verifying email code:", error);
    return new Response(
      JSON.stringify({
        status: 400,
        body: { error: "Invalid or expired code" },
      })
    );
  }
}
