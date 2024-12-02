import { Message } from "ai";
import { Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatLog = ({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2 md:px-4 px-1">
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="flex flex-row-reverse gap-3 mt-4 md:mt-2">
            <div className="md:w-3/5 w-full flex flex-col gap-2 border px-3 py-2 rounded-lg bg-slate-50 border-slate-200/80 font-normal">
              <div>{message.content}</div>
              {/* <div className="text-xs text-slate-500/70">12:00 AM</div> */}
            </div>
          </div>
        ) : (
          <div key={message.id} className="flex items-end gap-1 md:gap-3">
            <div className="flex items-center justify-center text:xs md:text-sm text-center text-white bg-gradient-to-t from-sky-400 to-emerald-400 w-6 h-6 overflow-hidden rounded-full">
              (.|.)
            </div>
            <div className="md:w-3/5 w-full flex flex-col gap-2 px-2 pt-3">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {/* <div className="text-xs text-slate-500/70">12:00 AM</div> */}
            </div>
          </div>
        )
      )}
      {isLoading && (
        <div className="flex items-end gap-3">
          <div className="flex items-center justify-center text-sm text-center text-white bg-gradient-to-t from-sky-400 to-emerald-400 w-6 h-6 overflow-hidden rounded-full">
            (.|.)
          </div>
          <Loader className="w-4 h-4 animate-spin text-sky-500" />
        </div>
      )}
    </div>
  );
};

export default ChatLog;
