import {
  getMessageList,
  getUserPdfFiles,
  type File,
} from "@/lib/firebase/firebase";
import { getS3Url } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { chatId, userId } = await request.json();
    const data: File[] = await getUserPdfFiles(userId);
    const previewPath = data.filter((file) => file.id === chatId);
    const s3Url = getS3Url(previewPath[0].filePath);
    const messages = await getMessageList(userId, chatId);

    return NextResponse.json(
      {
        data,
        fileUrl: s3Url,
        name: previewPath[0].fileName,
        s3Path: previewPath[0].filePath,
        messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Getting user data error ${error}`);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
