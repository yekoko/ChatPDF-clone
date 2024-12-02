"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { UploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth.context";
import { storeUserPdfFile, type File } from "@/lib/firebase/firebase";
import ErrorAlert from "./alert/error-alert";
import SuccessAlert from "./alert/success-alert";
import { getUserPdfFiles } from "@/lib/firebase/firebase";

const FileUpload = () => {
  const { authUser } = useAuthContext();
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  // console.log(authUser);
  const userId = authUser?.uid;
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const getFiles = async () => {
      if (userId) {
        const data: File[] = await getUserPdfFiles(userId);
        setPdfFiles(data);
      }
    };
    getFiles();
  }, [userId]);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      filePath,
      fileName,
      userId,
    }: {
      filePath: string;
      fileName: string;
      userId: string;
    }) => {
      const response = await axios.post("/api/embedding-file", {
        filePath,
        fileName,
        userId,
      });
      return response.data;
    },
  });
  const { toast } = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast({
          variant: "destructive",
          description: (
            <ErrorAlert message="File is too large! Maximum allowed size is 10 MB." />
          ),
        });
        return;
      }

      try {
        setIsUploading(true);
        const data = await UploadToS3(file);
        if (!data?.filePath || !data.fileName) {
          toast({
            variant: "destructive",
            description: <ErrorAlert message=" Something went wrong!" />,
          });
          return;
        }
        const { fileId } = await storeUserPdfFile(
          userId!,
          data.filePath,
          data.fileName
        );

        mutate(
          { ...data, userId: fileId! },
          {
            onSuccess: (data) => {
              const { chatId } = data;
              toast({
                description: <SuccessAlert message="Successfully created!" />,
              });
              router.push(`/chat/${chatId}`);
            },
            onError: (error) => {
              toast({
                variant: "destructive",
                description: (
                  <ErrorAlert message={`Embedding file error ${error}`} />
                ),
              });
            },
          }
        );
      } catch (error) {
        toast({
          variant: "destructive",
          description: (
            <ErrorAlert message={`File upload to s3 error ${error}`} />
          ),
        });
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <>
      {authUser && pdfFiles.length < 2 && (
        <div className="p-5 bg-white rounded-xl shadow-[0_0px_28px_#c7d2fe]">
          <div
            {...getRootProps({
              className:
                "border-dashed boder-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
            })}
          >
            <input {...getInputProps()} />
            {isUploading || isPending ? (
              <Loader className="h-10 w-10 animate-spin" />
            ) : (
              <>
                <Image
                  src="/static/upload-icon.svg"
                  alt="File Upload Icon"
                  width={68}
                  height={83}
                  className="py-8"
                />
                <p className="mt-2 md:text-lg text-sm text-slate-600">
                  Click to upload, or drop PDF here
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FileUpload;
