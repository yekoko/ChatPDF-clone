import { embededToPinconeDb } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filePath, userId } = body;
    const { chatId } = await embededToPinconeDb(filePath, userId);
    return NextResponse.json({ chatId }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
