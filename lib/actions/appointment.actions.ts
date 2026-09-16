"use server";
import { tablesDB } from "../appwrite.config";
import { DATABASE_ID, APPOINTMENT } from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export async function CreateAppointment(
  appointmentData: CreateAppointmentParams,
) {
  try {
    const result = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT!,
      rowId: ID.unique(),
      data: {
        ...appointmentData,
      },
    });
    return parseStringify(result);
  } catch (e) {
    console.error("failed to create appointment", e);
  }
}

export async function getAppointment(appointmentId: string) {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT!,
      queries: [Query.equal("$id", appointmentId)],
    });
    return parseStringify(result);
  } catch (e) {
    console.error("failed to fetch appointment data", e);
  }
}

export async function getAppointmentList() {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT!,
      queries: [
        Query.orderDesc("$createdAt"),
        Query.select(["*", "patient.*"]),
      ],
    });

    const initialCounts = {
      shceduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = result.rows.reduce((acc, appointment) => {
      if (appointment.status === "scheduled") {
        acc.shceduledCount += 1;
      } else if (appointment.status === "pending") {
        acc.pendingCount += 1;
      } else if (appointment.status === "cancelled") {
        acc.cancelledCount += 1;
      }
      return acc;
    }, initialCounts);

    const data = {
      totalCount: result.total,
      ...counts,
      rows: result.rows,
    };
    return parseStringify(data);
  } catch (e) {
    console.error("failed to fetch appointment data", e);
  }
}

export async function updateAppointment({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) {
  try {
    const result = await tablesDB.updateRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT!,
      rowId: appointmentId,
      data: {
        ...appointment,
      },
    });
    if (!result) {
      throw new Error("Appointment not found");
    }
    // SMS notifaction
    revalidatePath("./admin");
    return parseStringify(result);
  } catch (e) {
    console.error("failed to update the appointment", e);
  }
}
