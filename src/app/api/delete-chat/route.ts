import { deleteUserFile } from "@/lib/firebase/firebase";
import { deleteFromPineconeDb } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, id } = body;
    await deleteFromPineconeDb(id);
    await deleteUserFile(userId, id);
    return NextResponse.json(
      { message: "Successfully deleted!" },
      { status: 200 }
    );
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
