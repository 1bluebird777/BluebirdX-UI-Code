import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { chatWithLeia } from "./_core/assistantService";

export const assistantRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        message: z.string(),
        threadId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await chatWithLeia(input.message, input.threadId);
        return {
          success: true,
          response: result.response,
          threadId: result.threadId,
        };
      } catch (error) {
        console.error("Chat error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
});
