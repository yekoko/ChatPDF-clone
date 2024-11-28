"use client";

import ChatSideBar from "./chat-sidebar";
import PdfViewer from "../pdf/pdf-viewer";
import ChatComponent from "./chat-component";
import { useAuthContext } from "@/context/auth.context";
import { useEffect, useState } from "react";
import {
  getUserPdfFiles,
  type File,
  deleteUserFile,
} from "@/lib/firebase/firebase";
import { getS3Url } from "@/lib/s3";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

const HomeChat = ({ id }: { id: string }) => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { authUser } = useAuthContext();
  // console.log(authUser?.uid);
  const userId = authUser?.uid;
  const router = useRouter();

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

  const handleDeleteChat = async (id: string) => {
    try {
      setIsDeleting(true);
      await axios.post("/api/delete-chat", {
        userId,
        id,
      });
      const updatedItems = pdfFiles.filter((item) => item.id !== id);
      setPdfFiles(updatedItems);
      setIsDeleting(false);
      if (updatedItems.length === 0) {
        router.push("/");
      } else {
        router.push(`/chat/${updatedItems[0].id}`);
      }
    } catch (error) {
      console.error(`File deleting error ${error}`);
    }
  };

  return (
    <>
      {authUser && (
        <div className="flex w-full max-h-screen">
          <div className="flex-[3] max-w-xs">
            <ChatSideBar
              chats={pdfFiles}
              chatId={id}
              userId={userId!}
              onDelete={handleDeleteChat}
              isDeleting={isDeleting}
            />
          </div>
          <div className="flex-[5] max-h-screen p-2">
            {previewFile && <PdfViewer filePath={previewFile} />}
          </div>
          <div className="flex-[5] border-l-4 text-sm border-l-slate-200">
            <ChatComponent chatId={id} />
          </div>
        </div>
      )}
    </>
  );
};
export default HomeChat;
