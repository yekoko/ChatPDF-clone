import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getFileContext } from "@/lib/get-context";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const context = await getFileContext(lastMessage.content, chatId);
    // console.log(context);
    const result = streamText({
      model: openai("gpt-4-turbo"),
      system: `You are a helpful assistant. ${context}`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(`Chat error ${error}`);
  }
}
