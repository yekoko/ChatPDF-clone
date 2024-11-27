import Link from "next/link";
import { Button } from "../ui/button";
import { MessageCircle, PlusIcon } from "lucide-react";
import { type File } from "@/lib/firebase/firebase";
import { cn } from "@/lib/utils";

const ChatSideBar = ({ chats, chatId }: { chats: File[]; chatId: string }) => {
  
  return (
    <div className="w-full h-screen p-4 text-center text-gray-200 bg-gray-900">
      <div className="mt-3 h-10"></div>
      <Link href="/">
        <Button className="w-full border-white border">
          <PlusIcon className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id}>
            <div
              className={cn(
                "rounded-lg p-3 flex items-center",
                chatId === chat.id ? " bg-gray-500 text-white" : ""
              )}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm text-left truncate whitespace-nowrap text-ellipsis">
                {chat.fileName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ChatSideBar;
