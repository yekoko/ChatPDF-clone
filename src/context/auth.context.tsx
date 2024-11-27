"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { User } from "firebase/auth";
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from "@/lib/firebase/firebase";

interface AuthContextType {
  authUser: User | null;
  setAuthUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const value = { authUser, setAuthUser };

  useEffect(() => {
    const unSubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
        setAuthUser(user);
      }
    });
    return unSubscribe;
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
