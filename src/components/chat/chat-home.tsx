"use client";

import ChatSideBar from "./chat-sidebar";
import PdfViewer from "../pdf/pdf-viewer";
import ChatComponent from "./chat-component";
import { useAuthContext } from "@/context/auth.context";
import { useEffect, useState } from "react";
import { getUserPdfFiles, type File } from "@/lib/firebase/firebase";
import { getS3Url } from "@/lib/s3";

const HomeChat = ({ id }: { id: string }) => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<string>("");
  const { authUser } = useAuthContext();
  // console.log(authUser?.uid);
  const userId = authUser?.uid;

  useEffect(() => {
    const getFiles = async () => {
      if (userId) {
        const data: File[] = await getUserPdfFiles(userId);
        setPdfFiles(data);
        const previewPath = data.filter((file) => file.id === id);
        const s3Url = getS3Url(previewPath[0].filePath);
        setPreviewFile(s3Url);
      }
    };

    getFiles();
  }, [id, userId]);
  return (
    <>
      {authUser && (
        <div className="flex w-full max-h-screen">
          <div className="flex-[1] max-w-xs">
            <ChatSideBar chats={pdfFiles} chatId={id} />
          </div>
          <div className="flex-[5] max-h-screen p-2">
            {previewFile && <PdfViewer filePath={previewFile} />}
          </div>
          <div className="flex-[4] border-l-4 border-l-slate-200">
            <ChatComponent chatId={id}/>
          </div>
        </div>
      )}
    </>
  );
};
export default HomeChat;
