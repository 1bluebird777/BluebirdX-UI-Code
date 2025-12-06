import OpenAI from "openai";
import { ENV } from "./env";

const openai = new OpenAI({
  apiKey: ENV.forgeApiKey || ENV.openaiApiKey,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithLeia(
  message: string,
  threadId?: string
): Promise<{ response: string; threadId: string }> {
  try {
    // Get or create thread
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    // Add user message to thread
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: ENV.openaiAssistantId,
    });

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(
      currentThreadId,
      run.id
    );

    // Poll for completion (with timeout)
    let attempts = 0;
    const maxAttempts = 60; // 30 seconds max
    while (runStatus.status !== "completed" && attempts < maxAttempts) {
      if (runStatus.status === "failed" || runStatus.status === "cancelled") {
        throw new Error(`Assistant run ${runStatus.status}: ${runStatus.last_error?.message || "Unknown error"}`);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      runStatus = await openai.beta.threads.runs.retrieve(
        currentThreadId,
        run.id
      );
      attempts++;
    }

    if (runStatus.status !== "completed") {
      throw new Error("Assistant response timed out");
    }

    // Get the latest assistant message
    const messages = await openai.beta.threads.messages.list(currentThreadId, {
      order: "desc",
      limit: 1,
    });

    const lastMessage = messages.data[0];
    if (lastMessage.role !== "assistant") {
      throw new Error("No assistant response found");
    }

    // Extract text content
    const textContent = lastMessage.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in assistant response");
    }

    return {
      response: textContent.text.value,
      threadId: currentThreadId,
    };
  } catch (error) {
    console.error("Error in chatWithLeia:", error);
    throw error;
  }
}
