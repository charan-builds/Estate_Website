export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  project?: string;
  preferredDate?: string;
  preferredTime?: string;
  enquiryType: "Schedule Site Visit" | "Request Call Back" | "Download Brochure" | "General Enquiry";
  source: "project_detail" | "contact_page";
};

const EMAIL_WEBHOOK = process.env.NEXT_PUBLIC_LEAD_EMAIL_WEBHOOK_URL || "";
const GOOGLE_FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL || "";
const GOOGLE_FIELD = {
  name: process.env.NEXT_PUBLIC_GOOGLE_FORM_NAME_FIELD || "entry.1111111111",
  phone: process.env.NEXT_PUBLIC_GOOGLE_FORM_PHONE_FIELD || "entry.2222222222",
  email: process.env.NEXT_PUBLIC_GOOGLE_FORM_EMAIL_FIELD || "entry.3333333333",
  project: process.env.NEXT_PUBLIC_GOOGLE_FORM_PROJECT_FIELD || "entry.4444444444",
  enquiryType: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENQUIRY_FIELD || "entry.5555555555",
  preferredDate: process.env.NEXT_PUBLIC_GOOGLE_FORM_DATE_FIELD || "entry.6666666666",
  preferredTime: process.env.NEXT_PUBLIC_GOOGLE_FORM_TIME_FIELD || "entry.7777777777",
  source: process.env.NEXT_PUBLIC_GOOGLE_FORM_SOURCE_FIELD || "entry.8888888888",
};

export async function sendLeadEmail(payload: LeadPayload) {
  if (!EMAIL_WEBHOOK) {
    return;
  }

  await fetch(EMAIL_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function syncLeadToGoogleForm(payload: LeadPayload) {
  if (!GOOGLE_FORM_URL) {
    return;
  }

  const formData = new URLSearchParams();
  formData.append(GOOGLE_FIELD.name, payload.name);
  formData.append(GOOGLE_FIELD.phone, payload.phone);
  formData.append(GOOGLE_FIELD.email, payload.email || "");
  formData.append(GOOGLE_FIELD.project, payload.project || "");
  formData.append(GOOGLE_FIELD.enquiryType, payload.enquiryType);
  formData.append(GOOGLE_FIELD.preferredDate, payload.preferredDate || "");
  formData.append(GOOGLE_FIELD.preferredTime, payload.preferredTime || "");
  formData.append(GOOGLE_FIELD.source, payload.source);

  await fetch(GOOGLE_FORM_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });
}

export function triggerLeadWhatsappNotification(payload: LeadPayload, whatsappNumber?: string) {
  if (!whatsappNumber) {
    return;
  }

  const message = encodeURIComponent(
    `New lead from ${payload.source}: ${payload.name}, ${payload.phone}, ${payload.project || "General"}, ${payload.enquiryType}`
  );

  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
}
