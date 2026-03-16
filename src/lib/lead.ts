import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LeadSource, LeadType } from "@/types/lead";

interface CreateLeadInput {
  type: LeadType;
  name: string;
  phone: string;
  email?: string;
  projectId?: string;
  projectName?: string;
  preferredDate?: string;
  preferredTime?: string;
  source?: LeadSource;
}

export async function createLead(input: CreateLeadInput) {
  await addDoc(collection(db, "leads"), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

export async function createInteractionLead(input: {
  projectId?: string;
  projectName?: string;
  source: LeadSource;
}) {
  await addDoc(collection(db, "leads"), {
    type: "enquiry",
    name: "Website Visitor",
    phone: "N/A",
    projectId: input.projectId,
    projectName: input.projectName,
    source: input.source,
    createdAt: serverTimestamp(),
  });
}
