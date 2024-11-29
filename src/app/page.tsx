import Link from "next/link";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/auth/sign-in";

export default async function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-row justify-center items-center p-5 bg-gradient-to-r from-indigo-100 from-10% via-sky-100 via-30% to-emerald-100 to-90%">
      <div className="flex flex-col items-center text-center">
        <div>
          <h1 className="text-6xl font-semibold">Chat with any PDF</h1>
        </div>
        <SignIn />
        <p className="max-w-xl mt-4 text-lg">
          Join millions of students, researchers and professionals to instantly
          answer questions and understand research with AI
        </p>

        <div className="w-full mt-12">
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
