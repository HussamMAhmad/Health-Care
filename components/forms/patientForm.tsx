"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FieldGroup } from "@/components/ui/field";
import CustomeInput from "../ui/CustomeInput";
import SubmitButton from "../ui/SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
  INPUT = "Input",
  CHECKBOX = "Checkbox",
  TEXTAREA = "Textarea",
  PHONE_INPUT = "phoneInput",
  DATA_PICKER = "dataPicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

function PatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);
      if (user) router.push(`/patients/${user.$id}/register`);
      setIsLoading(false);
    } catch (e) {
      console.log(e); 
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there,...</h1>
        <p className="text-dark-700">Get Started with Appointments</p>
      </section>
      <FieldGroup>
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.INPUT}
          name="name"
          label="Full Name"
          placeholder="Ali Mohammad"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
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
      </FieldGroup>
      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  );
}
export default PatientForm;
