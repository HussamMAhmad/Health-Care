import Image from "next/image";
import React from "react";
import RigisterForm from "@/components/forms/registerForm";
import { getUser } from "@/lib/actions/patient.actions";
import * as Sentry from "@sentry/nextjs";

async function Register({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getUser(userId);
  Sentry.metrics.count("user_view_register", 1);
  Sentry.metrics.distribution("api_response_time", 150);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container overflow-y-auto">
        <div className="sub-container max-w-[860px] h-fit flex-col py-10 ">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
          <RigisterForm user={user} />
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        alt="patient"
        width={1000}
        height={1000}
        className="side-img max-w-[390px] max-h-screen "
      />
    </div>
  );
}

export default Register;
