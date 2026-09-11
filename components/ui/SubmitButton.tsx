import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

function SubmitButton({ isLoading, className, children }: ButtonProps) {
  return (
    <Button
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full cursor-pointer py-5"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="assets/icons/spinner.svg"
            width={24}
            height={24}
            alt="loader"
            className="animate-spin"
          />
          Loading ...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

export default SubmitButton;
