"use server";
import {
  storage,
  users,
  tablesDB,
  ENDPOINT,
  PROJECT_ID,
} from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";
import { BUCKET_ID, DATABASE_ID, PATIENT_ID } from "../appwrite.config";

export async function createUser(userData: CreateUserParams) {
  try {
    const result = await users.create({
      userId: ID.unique(),
      email: userData.email,
      phone: userData.phone,
      name: userData.name,
    });
    console.log(parseStringify(result));
    return parseStringify(result);
  } catch (e: any) {
    if (e && e.code === 409) {
      const result = await users.list({
        queries: [Query.equal("email", [userData.email])],
      });
      console.log("error in result from create user:", result);
      if (result?.users?.length > 0) {
        return parseStringify(result.users[0]);
      }
    }
    console.error("Error creating user:", e);
    throw e;
  }
}

export async function getUser(userid: string) {
  try {
    const result = await users.get({
      userId: userid,
    });
    console.log(result);
    return parseStringify(result);
  } catch (e) {
    console.error("failed to fetch user ", e);
  }
}

export async function getPaitent(userId: string) {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_ID!,
      queries: [Query.equal("userId", userId)],
    });
    return parseStringify(result.rows[0]);
  } catch (e) {
    console.error("failed to fetch paitent for user ", e);
  }
}

export async function registerPatient({
  identificationDocument,
  ...patient
}: RegisterUserParams) {
  try {
    let file;

    if (identificationDocument) {
      const document = identificationDocument?.get("blobFile") as Blob;
      const fileName = identificationDocument?.get("fileName") as string;

      const petientFile = InputFile.fromBuffer(document, fileName);

      file = await storage.createFile({
        bucketId: BUCKET_ID!,
        fileId: ID.unique(),
        file: petientFile,
      });
    }

    const result = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_ID!,
      rowId: ID.unique(),
      data: {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      },
    });

    return parseStringify(result);
  } catch (e) {
    console.log(e);
  }
}
