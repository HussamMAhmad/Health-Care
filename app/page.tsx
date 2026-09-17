import Image from "next/image";
import PatientForm from "@/components/forms/patientForm";
import Link from "next/link";
import PassKeyModel from "@/components/PassKeyModel";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const isAdmin = (await searchParams)?.admin === "true";
  return (
    <div className="flex min-h-screen">
      {isAdmin && (
        <PassKeyModel/>
      )}
      <section className="container my-auto">
        <div>
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="text-dark-600 xl:text-left">© 2026 CarePulse</p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        alt="patient"
        width={1000}
        height={1000}
        className=" h-full object-cover md:block hidden max-w-[50%]"
      />
    </div>
  );
}
