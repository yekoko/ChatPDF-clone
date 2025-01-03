"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Menu, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ChatLog from "./chat-log";
import { toast } from "@/hooks/use-toast";
import ErrorAlert from "../alert/error-alert";

const ChatComponent = ({
  chatId,
  userId,
  oldMessages,
  previewFileName,
  handleClickMenu,
}: {
  chatId: string;
  userId: string;
  oldMessages: [];
  previewFileName: string;
  handleClickMenu: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [requestHistory, setRequestHistory] = useState<number[]>([]);
  const rateLimit = 10;
  // const timeLimit = 60000;
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      chatId,
      userId,
    },
    initialMessages: oldMessages,
    onResponse: () => {
      setIsLoading(false);
    },
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // useEffect(() => {
  //   const currentTime = Date.now();
  //   const filterHistory = requestHistory.filter(
  //     (time) => currentTime - time < timeLimit
  //   );
  //   setRequestHistory(filterHistory);
  // }, [timeLimit]);

  const handleRequest = (
    event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const userChatlogs = messages.filter((msg) => msg.role === "user");
    if (userChatlogs.length >= rateLimit) {
      toast({
        variant: "destructive",
        description: (
          <ErrorAlert message="You have exceeded the rate limit. Please try again later." />
        ),
      });
      return;
    }
    // if (requestHistory.length >= rateLimit) {
    //   toast({
    //     variant: "destructive",
    //     description: (
    //       <ErrorAlert message="You have exceeded the rate limit. Please try again later." />
    //     ),
    //   });
    //   return;
    // }
    setIsLoading(true);
    // const currentTime = Date.now();
    // setRequestHistory((prevHistory) => [...prevHistory, currentTime]);
    try {
      handleSubmit(event);
    } catch (error) {
      console.error(`Sending message error ${error}`);
    }
  };
  const handleLocalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleRequest(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleRequest(event);
    }
  };

  return (
    <div className="relative flex flex-col h-screen">
      <div className="flex flex-row sticky top-0 inset-x-0 p-4 bg-white h-fit">
        <h3 className="text-xl font-semibold w-full hidden md:block">Chat</h3>
        <Menu
          className="w-6 h-6 mr-3 block md:hidden"
          onClick={handleClickMenu}
        />
        <h3 className="text-lg font-semibold w-full block md:hidden">
          {previewFileName}
        </h3>
      </div>
      <div
        ref={chatContainerRef}
        className="flex flex-col flex-grow gap-3.5 py-5 px-3 overflow-y-scroll"
      >
        <ChatLog messages={messages} isLoading={isLoading} />
      </div>
      <form onSubmit={handleLocalSubmit} className="relative p-4">
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here."
          className="md:text-md text-sm"
        ></Textarea>
        <Button
          type="submit"
          className="absolute top-6 right-6 md:h-10 h-8 md:w-10 w-8 flex items-center justify-center bg-gradient-to-t from-sky-400 to-emerald-400 rounded-full text-white"
          disabled={isLoading}
        >
          <Send />
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
