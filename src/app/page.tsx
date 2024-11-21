import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-6xl font-semibold">Chat with any PDF</h1>
          </div>
          <div className="flex mt-2">
            <Button>Go to Chats</Button>
          </div>
          <p className="max-w-xl mt-2 text-lg text-slate-600">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>

          <div className="w-full mt-4">
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
