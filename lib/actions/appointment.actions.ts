"use server";
import { tablesDB } from "../appwrite.config";
import { DATABASE_ID, APPOINTMENT } from "../appwrite.config";
import { ID } from "node-appwrite";
import { parseStringify } from "../utils";

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
