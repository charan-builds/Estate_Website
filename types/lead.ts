export type LeadType =
  | "enquiry"
  | "site-visit"
  | "callback"
  | "download-brochure";

export interface Lead {
  id: string;

  type: LeadType;

  name: string;
  phone: string;
  email?: string;

  projectId?: string;
  projectName?: string;

  preferredDate?: string;
  preferredTime?: string;

  source?: "website" | "project-page" | "contact-page";

  createdAt: any; // Firestore Timestamp
}