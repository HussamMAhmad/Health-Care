"use server";
import { tablesDB, messaging } from "../appwrite.config";
import { DATABASE_ID, APPOINTMENT } from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "../utils";

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

    const emailMessage = `Hi, it's CarePulse. 
    ${
      type === "schedule"
        ? `Your appointment has been ascheduled for ${formatDateTime(appointment.schedule).dateTime}
         with Dr. ${appointment.primaryPhysician}`
        : `we regret to inform you that your appontment has been cancelled. Reason :
       ${appointment.cancellationReason} `
    }`;
    await sendEmail(emailMessage, userId);
    revalidatePath("./admin");
    return parseStringify(result);
  } catch (e) {
    console.error("failed to update the appointment", e);
  }
}

export const sendEmail = async (content: string, userId: string) => {
  try {
    const message = await messaging.createEmail({
      messageId: ID.unique(),
      subject: "Health Care",
      content: content,
      users: [userId],
    });
    return parseStringify(message);
  } catch (e) {
    console.log(e);
  }
};
