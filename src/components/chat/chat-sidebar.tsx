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
  Loader2,
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

const ChatSideBar = ({
  chats,
  chatId,
  userId,
  onDelete,
  isDeleting,
}: {
  chats: File[];
  chatId: string;
  userId: string;
  onDelete: (id: string) => void;
  isDeleting: boolean;
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
    <div className="w-full h-screen p-4 text-center text-gray-200 bg-gray-800">
      <div className="my-5 h-10">
        <Link className="flex flex-row" href="/">
          <div className="flex items-center justify-center text-sm text-center text-white bg-gradient-to-t from-sky-400 to-emerald-400 w-8 h-8 overflow-hidden rounded-full">
            (.|.)
          </div>
          <h1 className="text-white text-2xl text-left font-semibold pl-4">
            ChatPDF Clone
          </h1>
        </Link>
      </div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Button
          type="button"
          onClick={handleNewChat}
          className="w-full border border-slate-500"
        >
          {isUploading || isPending ? (
            <Loader className="h-10 w-10 animate-spin" />
          ) : (
            <>
              <CirclePlus className="mr-2 w-4 h-4" />
              New Chat
            </>
          )}
        </Button>
      </div>
      {isDeleting ? (
        <div className="w-full text-center">
          <Loader2 className="w-full h-10 mt-3 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "rounded-lg p-3 flex flex-row items-center",
                chatId === chat.id ? " bg-gray-700 text-white" : ""
              )}
            >
              <Link href={`/chat/${chat.id}`} className="flex flex-row w-[90%]">
                <MessageCircle className="mr-2" />
                <p className="w-full overflow-hidden text-sm text-left truncate whitespace-nowrap text-ellipsis">
                  {chat.fileName}
                </p>
              </Link>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2
                      className="w-4 h-4 ml-2 cursor-pointer"
                      onClick={() => onDelete(chat.id)}
                    />
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
    </div>
  );
};
export default ChatSideBar;
