"use client";

import { KeyboardEvent, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Send, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ChatLog from "./chat-log";
import { getFileContext } from "@/lib/get-context";

const ChatComponent = ({ chatId }: { chatId: string }) => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="relative flex flex-col h-screen">
      <div className="flex flex-row sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-lg font-bold w-full">Chat</h3>
        {/* <Trash2 className="m-2 cursor-pointer" width={20} height={20} /> */}
      </div>
      <div
        ref={chatContainerRef}
        className="flex flex-col flex-grow gap-3.5 py-5 px-3 overflow-y-scroll"
      >
        <ChatLog messages={messages} />
      </div>
      <form onSubmit={handleSubmit} className="relative p-4">
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here."
        ></Textarea>
        <Button
          type="submit"
          className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center bg-gradient-to-t rounded-full text-white"
        >
          <Send />
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
