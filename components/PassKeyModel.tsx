"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { encryptKey, decryptKey } from "@/lib/utils";

function PassKeyModel() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [passkey, setPassKey] = useState("");
  const [error, setError] = useState("");
  const path = usePathname();
  function closeModel() {
    setOpen(false);
    router.push("/");
  }
  const encryptedKey =
    typeof window !== "undefined" ? localStorage.getItem("accessKey") : null;

  const accessKey = encryptedKey && decryptKey(encryptedKey);
  useEffect(() => {
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey]);
  const validatePassKey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encrypttedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encrypttedKey);
      setOpen(false);
    } else {
      setError("Invalid passkey, Please try again");
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between w-full">
            <p>Admin Access Verification</p>
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModel()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            to access the admin page , please enter the passkey
          </AlertDialogDescription>
          <div className="w-full">
            <InputOTP
              id="digits-only"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={passkey}
              onChange={(value) => setPassKey(value)}
            >
              <InputOTPGroup className="shad-otp">
                <InputOTPSlot className="shad-otp-slot" index={0} />
                <InputOTPSlot className="shad-otp-slot" index={1} />
                <InputOTPSlot className="shad-otp-slot" index={2} />
                <InputOTPSlot className="shad-otp-slot" index={3} />
                <InputOTPSlot className="shad-otp-slot" index={4} />
                <InputOTPSlot className="shad-otp-slot" index={5} />
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <p className="shad-error text-14-regular mt-4 flex justify-center">
                {error}
              </p>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePassKey(e)}
            className="shad-primary-btn w-full cursor-pointer"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PassKeyModel;
