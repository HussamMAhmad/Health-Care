"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomeInput from "../ui/CustomeInput";
import SubmitButton from "../ui/SubmitButton";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Gender,
  Doctors,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { SelectItem } from "@/components/ui/select";
import Image from "next/image";
import FileDropZone from "../ui/fileDropZone";
import { registerPatient } from "@/lib/actions/patient.actions";

export enum FormFieldType {
  INPUT = "Input",
  CHECKBOX = "Checkbox",
  TEXTAREA = "Textarea",
  PHONE_INPUT = "phoneInput",
  DATA_PICKER = "dataPicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

function RigisterForm({ user }: { user: User }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      const patient = await registerPatient(patientData);
      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (e) {
      console.error("error registering patient", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 h-fit">
      <section className="space-y-4">
        <h1 className="header">Welcome</h1>
        <p className="text-dark-700">Let us know more about yourself.</p>
      </section>
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Personal Information</h2>
        </div>
      </section>
      <CustomeInput
        control={form.control}
        fieldtype={FormFieldType.INPUT}
        name="name"
        label="Full Name"
        placeholder="Ali Mohammad"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
      />
      <div className="flex gap-6 items-center flex-col xl:flex-row">
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="Ali@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone Number"
          placeholder="+963 ..."
        />
      </div>
      <div className="flex gap-6 items-center flex-col xl:flex-row">
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.DATA_PICKER}
          name="birthDate"
          label="Date of birth"
        />
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.SKELETON}
          name="gender"
          label="Gender"
          renderSkeleton={(field) => (
            <RadioGroup
              className="flex h-11 gap-6 xl:justify-between"
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              {Gender.map((option: string) => (
                <div key={option} className="radio-group">
                  <RadioGroupItem
                    value={option}
                    id={option}
                    className="cursor-pointer"
                  />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      </div>
      <div className="flex gap-6 items-center flex-col xl:flex-row">
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.INPUT}
          name="address"
          label="Adress"
          placeholder="14th street , New Your"
        />
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.INPUT}
          name="occupation"
          label="Occupation"
          placeholder="Software Engineer"
        />
      </div>
      <div className="flex gap-6 items-center flex-col xl:flex-row">
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.INPUT}
          name="emergencyContactName"
          label="Emergency Contact Name"
          placeholder="Guardian's name"
        />
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.PHONE_INPUT}
          name="emergencyContactNumber"
          label="Emergency Contact Number"
          placeholder="+963 ..."
        />
      </div>
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical Information</h2>
        </div>
      </section>
      <CustomeInput
        control={form.control}
        fieldtype={FormFieldType.SELECT}
        name="primaryPhysician"
        label="Primary Physician"
        placeholder="Select a physician"
      >
        {Doctors.map((doctor) => (
          <SelectItem key={doctor.name} value={doctor.name}>
            <div className="flex cursor-pointer items-center gap-2">
              <Image
                src={doctor.image}
                alt="doctor"
                width={32}
                height={32}
                className="rounded-full border border-solid border-dark-500"
              />
              <p>{doctor.name}</p>
            </div>
          </SelectItem>
        ))}
      </CustomeInput>
      <div className="flex gap-6 items-center flex-col xl:flex-row">
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.INPUT}
          name="insuranceProvider"
          label="Insurance Provider"
          placeholder="BlueCross BlueShield"
        />
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.INPUT}
          name="insurancePolicyNumber"
          label="Insurance Policy Number"
          placeholder="ABC12345789"
        />
      </div>
      <div className="flex gap-6 items-center flex-col xl:flex-row">
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.TEXTAREA}
          name="allergies"
          label="Allergies (if any)"
          placeholder="Peanuts , Penicillin , Pollen"
        />
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.TEXTAREA}
          name="currentMedication"
          label="Current Medication (if any)"
          placeholder="paracetamol 500mg"
        />
      </div>
      <div className="flex gap-6 items-center flex-col xl:flex-row">
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.TEXTAREA}
          name="familyMedicalHistory"
          label="Family Medical History"
          placeholder="Mother had brain cancer, Father had heart disease"
        />
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.TEXTAREA}
          name="pastMedicalHistory"
          label="Past Medical History"
          placeholder="Appendectomy , Tonsillectomy"
        />
      </div>
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Identification and Verification</h2>
        </div>
      </section>
      <CustomeInput
        control={form.control}
        fieldtype={FormFieldType.SELECT}
        name="identificationType"
        label="Identification Type"
        placeholder="Select a identification"
      >
        {IdentificationTypes.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </CustomeInput>
      <CustomeInput
        control={form.control}
        fieldtype={FormFieldType.INPUT}
        name="identificationNumber"
        label="Identification Number"
        placeholder="123456789"
      />
      <CustomeInput
        control={form.control}
        fieldtype={FormFieldType.SKELETON}
        name="identificationDocument"
        label="Scanned copy of identification document"
        renderSkeleton={(field) => (
          <div>
            <FileDropZone files={field.value} onChange={field.onChange} />
          </div>
        )}
      />
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>
      </section>
      <CustomeInput
        control={form.control}
        fieldtype={FormFieldType.CHECKBOX}
        name="treatmentConsent"
        label="I consent to treatment"
      />
      <CustomeInput
        control={form.control}
        fieldtype={FormFieldType.CHECKBOX}
        name="disclosureConsent"
        label="I consent to disclosure of information"
      />
      <CustomeInput
        control={form.control}
        fieldtype={FormFieldType.CHECKBOX}
        name="privacyConsent"
        label="I consent to privacy policy"
      />
      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  );
}
export default RigisterForm;
