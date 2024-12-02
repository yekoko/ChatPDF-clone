"use client";

import ChatSideBar from "./chat-sidebar";
import PdfViewer from "../pdf/pdf-viewer";
import ChatComponent from "./chat-component";
import { useAuthContext } from "@/context/auth.context";
import { useEffect, useState } from "react";
import { type File } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PanelRightClose } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import SuccessAlert from "../alert/success-alert";

const HomeChat = ({ id }: { id: string }) => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [previewFileName, setPreviewFileName] = useState<string>("");
  const [isShowMenu, setIsShowMenu] = useState<boolean>(true);
  const [isShowMobileMenu, setIsShowMobileMenu] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [messages, setMessages] = useState<[]>([]);
  const { authUser } = useAuthContext();
  // console.log(authUser?.uid);
  const userId = authUser?.uid;
  const router = useRouter();

  useEffect(() => {
    const getFiles = async () => {
      if (userId) {
        const response = await axios.post("/api/user-data", {
          chatId: id,
          userId,
        });
        setPdfFiles(response.data.data);
        setPreviewFile(response.data.fileUrl);
        setPreviewFileName(response.data.name);
        setMessages(response.data.messages);
        setFilePath(response.data.s3Path);
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
        filePath,
      });
      const updatedItems = pdfFiles.filter((item) => item.id !== id);
      setPdfFiles(updatedItems);
      setIsDeleting(false);
      toast({
        description: <SuccessAlert message="File deleted successfully" />,
      });
      if (updatedItems.length === 0) {
        router.push("/");
      } else {
        router.push(`/chat/${updatedItems[0].id}`);
      }
    } catch (error) {
      console.error(`File deleting error ${error}`);
    }
  };

  const handleShowHideMenu = () => {
    setIsShowMenu((prevState) => !prevState);
  };

  const handleShowHideMobileMenu = () => {
    setIsShowMobileMenu((prevState) => !prevState);
  };

  return (
    <>
      {authUser && (
        <div className="flex w-full max-h-screen overflow-hidden">
          {isShowMenu && (
            <div className="flex-[3] max-w-xs  hidden md:block">
              <ChatSideBar
                chats={pdfFiles}
                chatId={id}
                userId={userId!}
                onDelete={handleDeleteChat}
                isDeleting={isDeleting}
                handleShowHideMenu={handleShowHideMenu}
                handleClickMobileMenu={handleShowHideMobileMenu}
              />
            </div>
          )}
          {isShowMobileMenu && (
            <div className="flex-[5] block md:hidden">
              <ChatSideBar
                chats={pdfFiles}
                chatId={id}
                userId={userId!}
                onDelete={handleDeleteChat}
                isDeleting={isDeleting}
                handleShowHideMenu={handleShowHideMenu}
                handleClickMobileMenu={handleShowHideMobileMenu}
              />
            </div>
          )}
          <div className="flex-[5] max-h-screen p-2 hidden md:block">
            <div className="flex flex-row my-2">
              {!isShowMenu && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PanelRightClose
                        className="cursor-pointer"
                        onClick={handleShowHideMenu}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Show Sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <h1 className="text-lg font-bold pl-2">{previewFileName}</h1>
            </div>
            {previewFile && (
              <PdfViewer filePath={previewFile} isDeleting={isDeleting} />
            )}
          </div>
          <div className="flex-[5] border-l-4 text-sm border-l-slate-200 hidden md:block">
            <ChatComponent
              chatId={id}
              userId={userId!}
              oldMessages={messages}
              previewFileName={previewFileName}
              handleClickMenu={handleShowHideMobileMenu}
            />
          </div>
          {!isShowMobileMenu && (
            <div className="flex-[5] border-l-4 text-sm border-l-slate-200 block md:hidden">
              <ChatComponent
                chatId={id}
                userId={userId!}
                oldMessages={messages}
                previewFileName={previewFileName}
                handleClickMenu={handleShowHideMobileMenu}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default HomeChat;
