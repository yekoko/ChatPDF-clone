import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import {
  MessageCircle,
  CirclePlus,
  Loader,
  Trash2,
  PanelRightOpen,
  X,
} from "lucide-react";
import { type File, storeUserPdfFile } from "@/lib/firebase/firebase";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import ErrorAlert from "../alert/error-alert";
import SuccessAlert from "../alert/success-alert";
import { UploadToS3 } from "@/lib/s3";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ChatSideBar = ({
  chats,
  chatId,
  userId,
  onDelete,
  isDeleting,
  handleShowHideMenu,
  handleClickMobileMenu,
}: {
  chats: File[];
  chatId: string;
  userId: string;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  handleShowHideMenu: () => void;
  handleClickMobileMenu: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      filePath,
      fileName,
      userId,
    }: {
      filePath: string;
      fileName: string;
      userId: string;
    }) => {
      const response = await axios.post("/api/embedding-file", {
        filePath,
        fileName,
        userId,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    noClick: true,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast({
          variant: "destructive",
          description: (
            <ErrorAlert message="File is too large! Maximum allowed size is 10 MB." />
          ),
        });
        return;
      }

      try {
        setIsUploading(true);
        const data = await UploadToS3(file);
        if (!data?.filePath || !data.fileName) {
          toast({
            variant: "destructive",
            description: <ErrorAlert message=" Something went wrong!" />,
          });
          return;
        }
        const { fileId } = await storeUserPdfFile(
          userId!,
          data.filePath,
          data.fileName
        );

        mutate(
          { ...data, userId: fileId! },
          {
            onSuccess: (data) => {
              const { chatId } = data;
              toast({
                description: <SuccessAlert message="Successfully created!" />,
              });
              router.push(`/chat/${chatId}`);
            },
            onError: (error) => {
              toast({
                variant: "destructive",
                description: (
                  <ErrorAlert message={`Embedding file error ${error}`} />
                ),
              });
            },
          }
        );
      } catch (error) {
        toast({
          variant: "destructive",
          description: (
            <ErrorAlert message={`File upload to s3 error ${error}`} />
          ),
        });
      } finally {
        setIsUploading(false);
      }
    },
  });

  const handleNewChat = () => {
    if (chats.length >= 2) {
      toast({
        variant: "destructive",
        description: (
          <ErrorAlert message="You have reached the file upload limit." />
        ),
      });
    } else {
      open();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen p-4 text-center text-gray-200 bg-gray-800">
      <div className="flex flex-row my-2 h-10">
        <Link className="flex flex-row w-full" href="/">
          <div className="flex items-center justify-center text-sm text-center text-white bg-gradient-to-t from-sky-400 to-emerald-400 w-8 h-8 overflow-hidden rounded-full">
            (.|.)
          </div>
          <h1 className="text-white text-2xl text-left font-semibold pl-2">
            ChatPDF Clone
          </h1>
        </Link>
        <div className="cursor-pointer hidden md:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PanelRightOpen onClick={handleShowHideMenu} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Hide Sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div
          className="cursor-pointer block md:hidden"
          onClick={handleClickMobileMenu}
        >
          <X className="w-6 h-6" />
        </div>
      </div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Button
          type="button"
          onClick={handleNewChat}
          className="w-full border border-slate-500"
        >
          {isUploading || isPending ? (
            <>
              <Loader className="h-10 w-10 animate-spin" />
              <span className="ml-2 text-sm">Uploading....</span>
            </>
          ) : (
            <>
              <CirclePlus className="mr-2 w-4 h-4" />
              New Chat
            </>
          )}
        </Button>
      </div>
      {isDeleting ? (
        <div className="flex flex-row flex-grow mt-4 text-center justify-center items-center">
          <Loader className="w-7 h-7 animate-spin" />
          <span className="ml-2 mt-1 text-md">File Deleting</span>
        </div>
      ) : (
        <div className="flex flex-col flex-grow gap-2 mt-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "rounded-lg p-3 flex items-center",
                chatId === chat.id ? " bg-gray-700 text-white" : ""
              )}
            >
              <Link href={`/chat/${chat.id}`}>
                <div className="flex" onClick={handleClickMobileMenu}>
                  <MessageCircle className="mr-2" />
                  <p className="max-w-[200px] overflow-hidden text-sm text-left truncate whitespace-nowrap text-ellipsis pt-[2px]">
                    {chat.fileName}
                  </p>
                </div>
              </Link>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash2 className="w-4 h-4 ml-2 cursor-pointer" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Do you really want to delete this file?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the chat and PDF
                            content.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(chat.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      )}
      <div>
        <ul className="flex flex-row text-sm text-left">
          <Link href="/">
            <li className="pr-3">Home</li>
          </Link>
          <li className="text-gray-400">Chat</li>
        </ul>
      </div>
    </div>
  );
};
export default ChatSideBar;
