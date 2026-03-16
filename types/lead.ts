export type LeadType =
  | "enquiry"
  | "site-visit"
  | "callback"
  | "download-brochure";

export type LeadSource =
  | "website"
  | "project-page"
  | "project_detail"
  | "contact-page"
  | "contact_page"
  | "whatsapp"
  | "call"
  | "brochure"
  | "homepage_scroll_modal";

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

  source?: LeadSource;

  createdAt: any; // Firestore Timestamp
}
