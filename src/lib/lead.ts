import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LeadType } from "@/types/lead";

interface CreateLeadInput {
  type: LeadType;
  name: string;
  phone: string;
  email?: string;
  projectId?: string;
  projectName?: string;
  preferredDate?: string;
  preferredTime?: string;
  source?: string;
}

export async function createLead(input: CreateLeadInput) {
  await addDoc(collection(db, "leads"), {
    ...input,
    createdAt: serverTimestamp(),
  });
}