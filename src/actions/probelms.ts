import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { db } from "@/lib/db";
import { problems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const setProblemHidden = defineAction({
  input: z.object({
    id: z.string(),
  }),

  handler: async (data, { locals }) => {
    try {
      await db
        .update(problems)
        .set({
          show: "No",
        })
        .where(eq(problems.id, data.id));
      return { success: true };
    } catch (e) {
      console.log("here ", e);
      return { success: false } as const;
    }
  },
});
