"use client";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });

  return (
    <div className="p-5 bg-white rounded-xl">
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
