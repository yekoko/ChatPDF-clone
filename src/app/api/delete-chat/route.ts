import { deleteUserFile } from "@/lib/firebase/firebase";
import { deleteFromPineconeDb } from "@/lib/pinecone";
import { deleteFileFromS3 } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, id, filePath } = body;
    await deleteFromPineconeDb(id);
    await deleteUserFile(userId, id);
    await deleteFileFromS3(filePath);
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
