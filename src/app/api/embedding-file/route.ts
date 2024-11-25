import { embededToPinconeDb } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filePath, fileName } = body;

    console.log(filePath, fileName);
    const docs = await embededToPinconeDb(filePath);
    return NextResponse.json({ docs });
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
