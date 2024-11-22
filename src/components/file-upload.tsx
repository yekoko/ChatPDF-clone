"use client";
import { UploadToS3 } from "@/lib/s3";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert(`File is too large! Maximum allowed size is 10 MB.`);
        return;
      }

      try {
        const data = await UploadToS3(file);
        console.log(data);
      } catch (error) {
        console.error(`File upload to s3 error ${error}`);
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
      </div>
    </div>
  );
};

export default FileUpload;
