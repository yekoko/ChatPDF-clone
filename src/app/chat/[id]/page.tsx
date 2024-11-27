import HomeChat from "@/components/chat/chat-home";

const Chat = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="flex max-h-screen">
      <HomeChat id={id} />
    </div>
  );
};

export default Chat;
