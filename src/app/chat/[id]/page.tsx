import ChatComponent from "@/components/chat/chat-component";
import ChatSideBar from "@/components/chat/chat-sidebar";
import PdfViewer from "@/components/pdf/pdf-viewer";

const Chat = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="flex max-h-screen">
      <div className="flex w-full max-h-screen">
        <div className="flex-[3] max-w-xs">
          <ChatSideBar chats={[]} chatId={parseInt("1")} />
        </div>
        <div className="flex-[5] max-h-screen p-2">
          <PdfViewer />
        </div>
        <div className="flex-[4] border-l-4 border-l-slate-200">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
};

export default Chat;
