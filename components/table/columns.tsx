"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { type DataTableFeatures } from "./data-table-features";
import StatusBadge from "../statusBadge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointmentModel from "../AppointmentModel";
import { Appointment } from "@/types/appwrite.types";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Appointment>();

export const columns = columnHelper.columns([
  columnHelper.accessor("$id", {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  }),
  columnHelper.accessor("patient", {
    header: "Patient",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.patient.name}</p>;
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  }),
  columnHelper.accessor("schedule", {
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  }),
  columnHelper.accessor("primaryPhysician", {
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician,
      );
      return (
        <div className="flex items-center gap-3 mr-4">
          <Image
            src={doctor?.image || ""}
            alt={doctor?.name || ""}
            height={100}
            width={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModel
            type="schedule"
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            title="Schedule Appointment"
            descrption="please confirm the following details to schedule"
          />
          <AppointmentModel
            type="cancel"
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            title="Cancel Appointment"
            descrption="Are you sure you want cancel this appointment"
          />
        </div>
      );
    },
  }),
]);
