import { Message } from "ai";
import ReactMarkdown from "react-markdown";

const ChatLog = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="flex flex-row-reverse gap-3">
            <div className="w-3/5 flex flex-col gap-2 border px-4 pt-3 pb-4 rounded-xl bg-slate-50/80 border-slate-200/80">
              <div>{message.content}</div>
              {/* <div className="text-xs text-slate-500/70">12:00 AM</div> */}
            </div>
          </div>
        ) : (
          <div key={message.id} className="flex items-end gap-3">
            <div className="w-3/5 flex flex-col gap-2 border px-4 pt-3 pb-4 rounded-xl bg-slate-50/80 border-slate-200/80">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {/* <div className="text-xs text-slate-500/70">12:00 AM</div> */}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ChatLog;
