"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  signInWithGooglePopup,
  getUserPdfFiles,
  type File,
} from "@/lib/firebase/firebase";
import { Button } from "../ui/button";
import { useAuthContext } from "@/context/auth.context";

const SignIn = () => {
  const { authUser } = useAuthContext();
  const userId = authUser?.uid;
  const [fileId, setFileId] = useState<string>("");

  useEffect(() => {
    const getFiles = async () => {
      if (userId) {
        const data: File[] = await getUserPdfFiles(userId);
        if (data.length > 0) setFileId(data[0].id);
      }
    };

    getFiles();
  }, [userId]);

  const signInWithGoogle = async () => {
    await signInWithGooglePopup();
  };
  return (
    <>
      {authUser ? (
        fileId && (
          <Link href={`/chat/${fileId}`}>
            <div className="flex mt-2">
              <Button>Go to chat</Button>
            </div>
          </Link>
        )
      ) : (
        <div className="flex mt-2">
          <Button onClick={signInWithGoogle}>Sign In</Button>
        </div>
      )}
    </>
  );
};
export default SignIn;
