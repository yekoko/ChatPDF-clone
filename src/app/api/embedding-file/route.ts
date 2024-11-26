import { embededToPinconeDb } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filePath } = body;
    const { userId } = await embededToPinconeDb(filePath);
    return NextResponse.json({ chatId: userId }, { status: 200 });
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
