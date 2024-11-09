import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { PythonShell } from "python-shell";

export const runPython = defineAction({
  input: z.object({
    code: z.string(),
  }),
  handler: async (data, { locals }) => {
    try {
      const message = await PythonShell.runString(data.code, { mode: "text" });

      return new Response(
        JSON.stringify({
          data: message,
          message: "Compilation Finished",
          success: true,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          data: null,
          message: "Error during compilation",
          success: false,
          status: error.status,
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
});
