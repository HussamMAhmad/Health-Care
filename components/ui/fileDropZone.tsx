"use client";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";
import { convertFileToUrl } from "@/lib/utils";

type fileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileDropZone = ({ files, onChange }: fileUploaderProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles);
      console.log(acceptedFiles);
    },
  });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded iamge"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            alt="icon"
            width={40}
            height={40}
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Click to upload</span> or drag
              and drop
            </p>
            <p>SVG , PNG , JPG or Gif (max 800x400)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileDropZone;
