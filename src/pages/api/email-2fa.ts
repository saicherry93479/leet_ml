import { db } from "@/lib/db";
import { sendEmail } from "./utils";

import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";

export async function POST({ request }) {
  const { userId } = request.body;

  try {
    const emailCode = await sendEmail("");

    if (emailCode === 0) {
      return new Response(
        JSON.stringify({
          status: 500,
          body: { error: "Error sending email" },
        })
      );
    }

    await db
      .update(users)
      .set({
        emailTwoFactorCode: emailCode.toString(),

        emailTwoFactorEnabled: true,
        emailTwoFactorCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      })
      .where(eq(users.id, userId));

    
    return new Response(
      JSON.stringify({
        status: 200,
        body: { message: "Email code sent" },
      })
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        status: 500,
        body: { error: "Error sending email" },
      })
    );
  }
}
