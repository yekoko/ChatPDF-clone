import { initializeApp } from "firebase/app";
import {
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export default firebaseApp;

export const db = getFirestore(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const createUserDocumentFromAuth = async (
  authUser: User,
  additionalInfomations = {}
) => {
  const userDocRef = doc(db, "users", authUser.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { email } = authUser;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        email,
        createdAt,
        ...additionalInfomations,
      });
    } catch (error) {
      console.error("Creating user error ", (error as Error).message);
    }
  }

  //return userDocRef;
  return userSnapshot;
};

export const storeUserPdfFile = async (
  userId: string,
  filePath: string,
  fileName: string
) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const fileCollectionRef = collection(userDocRef, "files");

    const fileDocRef = await addDoc(fileCollectionRef, { filePath, fileName });

    //console.log("File added successful:", fileDocRef.id);
    const data: any = { fileId: fileDocRef.id };
    return data;
  } catch (error) {
    console.error("Adding user files error ", (error as Error).message);
  }
};

export type FileData = {
  [key: string]: any;
};

export type File = FileData & { id: string };

export const getUserPdfFiles = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const fileCollectionRef = collection(userDocRef, "files");
  const filesSnapshot = await getDocs(fileCollectionRef);
  const files: File[] = filesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return files;
};

export const storeChatMessages = async (
  userId: string,
  fileId: string,
  message: string,
  agent: string
) => {
  try {
    const messageRef = doc(db, "users", userId, "files", fileId);
    const messageCollection = collection(messageRef, "messages");
    const messageDocRef = addDoc(messageCollection, {
      content: message,
      role: agent,
      timestamp: serverTimestamp(),
    });
    return messageDocRef;
  } catch (error) {
    console.error(`Store chat messages error ${error}`);
  }
};

export const getMessageList = async (userId: string, fileId: string) => {
  try {
    const messageListRef = doc(db, "users", userId, "files", fileId);
    const messageListCollection = collection(messageListRef, "messages");
    const messageQuery = query(
      messageListCollection,
      orderBy("timestamp", "asc")
    );
    const messageListSnapshot = await getDocs(messageQuery);
    const messages = messageListSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return messages;
  } catch (error) {
    console.error(`Getting message list error ${error}`);
  }
};

export const deleteUserFile = async (userId: string, fileId: string) => {
  try {
    const fileRef = doc(db, "users", userId, "files", fileId);
    const messagesRef = collection(
      db,
      "users",
      userId,
      "files",
      fileId,
      "messages"
    );
    const messagesSnapshot = await getDocs(messagesRef);

    const deletePromises = messagesSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );

    await Promise.all(deletePromises);
    await deleteDoc(fileRef);
  } catch (error) {
    console.error(`File deleting files and messages error: ${error}`);
  }
};

type SignUpType = {
  email: string;
  password: string;
};
export const SignUp = async ({ email, password }: SignUpType) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
): void => {
  onAuthStateChanged(auth, callback);
};
