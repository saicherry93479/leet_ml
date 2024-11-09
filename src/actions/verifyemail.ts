import { createSession } from "@/lib/auth/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendEmail } from "@/pages/api/utils";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";

export const verifyEmail = defineAction({
  input: z.object({
    code: z.string(),
  }),
  handler: async (data, { locals, cookies }) => {
    console.log("userif ", locals.userId);
    console.log("code ", data.code);
    const userId = locals.userId;
    const code = data.code;

    if (!userId || !code) {
      return { success: false } as const;
    }

    try {
      console.log("checking");
      let userAll = await db.select().from(users).where(eq(users.id, userId));
      console.log("userAll ", userAll);
      const user = userAll[0];
      console.log("user ", user);
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
        const tempAuth = cookies.get("temp_auth")?.json();
        const sessionId = await createSession(
          userId,
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
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });

        return {
          success: true,
        };
      }
      console.log("failed here");
      return {
        success: false,
      };
    } catch (error) {
      console.log("error ", error);
      return {
        success: false,
      };
    }
  },
});

export const sendMail = defineAction({
  input: z.object({}),
  handler: async (data, { locals }) => {
    const userId = locals.userId;
    if (!userId) {
      return { status: false } as const;
    }
    try {
      const emailCode = await sendEmail("");

      if (emailCode === 0) {
        return { status: false } as const;
      }

      await db
        .update(users)
        .set({
          emailTwoFactorCode: emailCode.toString(),

          emailTwoFactorEnabled: true,
          emailTwoFactorCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        })
        .where(eq(users.id, userId));

      return { status: true } as const;
    } catch (error) {
      console.error("Error sending email:", error);
      return { status: false } as const;
    }
  },
});
