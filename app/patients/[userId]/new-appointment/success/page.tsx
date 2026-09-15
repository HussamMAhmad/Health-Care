import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

async function Success({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await params;
  const appointmentId = (await searchParams)?.appointmentId as string;
  const Doc = await getAppointment(appointmentId);
  return (
    <div className="max-h-screen h-screen flex px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            width={1000}
            height={1000}
            alt="checked"
            className="mb-12 h-20 w-fit"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p className="">we'll be in touch shortly to confirm</p>
        </section>
        <section className="request-details">
          <p>Requested appointment details: </p>
          {Doctors.map(({ name, image }: { name: string; image: string }) => {
            if (name === Doc.rows[0].primaryPhysician) {
              return (
                <div className="flex items-center gap-3" key={name}>
                  <Image
                    src={image}
                    width={100}
                    height={100}
                    alt="date"
                    className="size-6"
                  />
                  <p className="whitespace-nowrap">Dr. {name}</p>
                </div>
              );
            }
          })}
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              width={24}
              height={24}
              alt="calendar"
            />
            <p>{formatDateTime(Doc.rows[0].schedule).dateTime}</p>
          </div>
        </section>
        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link> 
        </Button>
        <p className="copyright">© 2026 CarePulse</p>
      </div>
    </div>
  );
}

export default Success;
