"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { UploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";

const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      filePath,
      fileName,
    }: {
      filePath: string;
      fileName: string;
    }) => {
      const response = await axios.post("/api/embedding-file", {
        filePath,
        fileName,
      });
      return response.data;
    },
  });
  const { toast } = useToast();
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      const maxSizeInBytes = 10 * 1024 * 1024;
      console.log(file.size > maxSizeInBytes);
      if (file.size > maxSizeInBytes) {
        toast({
          variant: "destructive",
          description: "File is too large! Maximum allowed size is 10 MB.",
        });
        return;
      }

      try {
        setIsUploading(true);
        const data = await UploadToS3(file);
        if (!data?.filePath || !data.fileName) {
          toast({
            variant: "destructive",
            description: "Something went wrong!",
          });
          return;
        }
        mutate(data, {
          onSuccess: (data) => {
            console.log(data);
            toast({
              description: "Successfully embeded",
            });
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              description: `Embedding file error ${error}`,
            });
          },
        });
      } catch (error) {
        toast({
          variant: "destructive",
          description: `File upload to s3 error ${error}`,
        });
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <div className="p-5 bg-white rounded-xl shadow-[0_0px_28px_rgba(255,228,230,1)]">
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
            <p className="mt-2 text-lg text-slate-600">
              Click to upload, or drop PDF here
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
