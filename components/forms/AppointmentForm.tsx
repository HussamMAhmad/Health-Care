"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomeInput from "../ui/CustomeInput";
import SubmitButton from "../ui/SubmitButton";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./patientForm";
import { Doctors } from "@/constants";
import Image from "next/image";
import { SelectItem } from "@/components/ui/select";
import {
  CreateAppointmentSchema,
  getAppointmentSchema,
} from "@/lib/validation";
import { CreateAppointment } from "@/lib/actions/appointment.actions";

function AppointmentForm({
  userId,
  paitentId,
  type,
}: {
  userId: string;
  paitentId: string;
  type: "create" | "cancel" | "schedule";
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;
    switch (type) {
      case "cancel":
        status = "cancelled";
        break;
      case "schedule":
        status = "scheduled";
        break;
      default:
        status = "pending";
    }
    try {
      if (type === "create" && paitentId) {
        const apponintmentData = {
          userId,
          patient: paitentId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          cancellationReason: values.cancellationReason,
          status: status as Status,
        };
        const appointment = await CreateAppointment(apponintmentData);
        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`,
          );
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }
  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      <section className="mb-12 space-y-4">
        <h1 className="header">New Appointment</h1>
        <p className="text-dark-700">Request a new appointment in 10 seconds</p>
      </section>
      {type !== "cancel" && (
        <>
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
          <CustomeInput
            control={form.control}
            fieldtype={FormFieldType.DATA_PICKER}
            name="schedule"
            label="Expected appointment date"
            showTimeSelect
          />
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomeInput
              control={form.control}
              fieldtype={FormFieldType.TEXTAREA}
              name="reason"
              label="Reason for appointment"
              placeholder="Enter reason for appointment"
            />
            <CustomeInput
              control={form.control}
              fieldtype={FormFieldType.TEXTAREA}
              name="note"
              label="Note"
              placeholder="Enter Nots"
            />
          </div>
        </>
      )}
      {type === "cancel" && (
        <CustomeInput
          control={form.control}
          fieldtype={FormFieldType.TEXTAREA}
          name="cancellationReason"
          label="Reason for cancellation"
          placeholder="Enter reason for cancellation"
        />
      )}
      <SubmitButton
        isLoading={isLoading}
        className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full h-11 cursor-pointer`}
      >
        {buttonLabel}
      </SubmitButton>
    </form>
  );
}
export default AppointmentForm;
