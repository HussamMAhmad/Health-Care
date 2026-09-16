import Image from "next/image";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPaitent } from "@/lib/actions/patient.actions";
import * as Sentry from "@sentry/nextjs";

export default async function NewAppointment({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const paitentId = await getPaitent(userId);
  Sentry.metrics.count("user_view_new-appointment", paitentId.name);
  Sentry.metrics.distribution("api_response_time", 150);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            type="create"
            paitentId={paitentId?.$id}
            userId={userId}
          />
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        alt="patient"
        width={1000}
        height={1000}
        className="side-img max-w-[400px] bg-bottom"
      />
    </div>
  );
}
