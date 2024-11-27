"use client";

import { signInWithGooglePopup } from "@/lib/firebase/firebase";
import { Button } from "../ui/button";
import { useAuthContext } from "@/context/auth.context";

const SignIn = () => {
  const { authUser } = useAuthContext();
  const signInWithGoogle = async () => {
    await signInWithGooglePopup();
  };
  return (
    <>
      {!authUser && (
        <div className="flex mt-2">
          <Button onClick={signInWithGoogle}>Sign In</Button>
        </div>
      )}
    </>
  );
};
export default SignIn;
