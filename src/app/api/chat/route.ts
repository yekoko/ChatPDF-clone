import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getFileContext } from "@/lib/get-context";
import { storeChatMessages } from "@/lib/firebase/firebase";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId, userId } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const context = await getFileContext(lastMessage.content, chatId);
    await storeChatMessages(userId, chatId, lastMessage.content, "user");
    let prompt = "";
    if (messages.length <= 1) {
      // prompt = `Please generate a welcome message based on the context, keeping it under 100 words. Additionally, generate three sample questions based on the context. ${context} . Return the response as structured JSON with fields:
      //         {
      //           "message": "Message text",
      //           "questions": ["1", "2", "3"]
      //         }`;
      prompt = `Please generate a welcome message of under 100 words based on the following context: ${context}.`;
    } else {
      prompt = `You are a helpful assistant. Provide a concise response to the user’s question, keeping it under 100 words. ${context}.`;
    }

    // console.log(context);
    const result = streamText({
      model: openai("gpt-4-turbo"),
      system: prompt,
      messages,
      async onFinish({ text }) {
        await storeChatMessages(userId, chatId, text, "system");
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(`Chat error ${error}`);
  }
}
