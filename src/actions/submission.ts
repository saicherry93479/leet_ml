import { db } from "@/lib/db";
import { problemSubmissions } from "@/lib/db/schema";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";

export const submission = defineAction({
  input: z.object({
    id: z.string(),
  }),

  handler: async (data, { locals }) => {
    if (!locals.user) {
      return { success: false } as const;
    }

    try {
      await db.insert(problemSubmissions).values({
        userId: locals.user.id,
      problemId: data.id,
      });
      return { success: true } as const;
    } catch (e) {
      console.log("here ", e);
      return { success: false } as const;
    }
  },
});
