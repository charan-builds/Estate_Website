"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  /* ---------------- BUSINESS INFO ---------------- */
  const [businessName, setBusinessName] = useState("Ekam Properties");
  const [phone, setPhone] = useState("+91 79013 24545");
  const [whatsapp, setWhatsapp] = useState("+91 79013 24545");
  const [email, setEmail] = useState("info@ekamproperties.com");
  const [rera, setRera] = useState("TG RERA Certified Real Estate Agent");

  /* ---------------- LEAD SETTINGS ---------------- */
  const [enableWhatsappLeads, setEnableWhatsappLeads] = useState(true);
  const [enableEmailLeads, setEnableEmailLeads] = useState(true);
  const [leadMessage, setLeadMessage] = useState(
    "Hi, I am interested in {{projectName}}. Please contact me."
  );

  /* ---------------- WEBSITE CONTROLS ---------------- */
  const [showPrices, setShowPrices] = useState(true);
  const [enableSiteVisit, setEnableSiteVisit] = useState(true);
  const [enableBrochure, setEnableBrochure] = useState(true);

  /* ---------------- ADMIN SETTINGS ---------------- */
  const [adminEmails, setAdminEmails] = useState(
    "admin@ekamproperties.com"
  );

  function handleSave() {
    // 🔥 Later we will connect this to Firestore
    alert("Settings saved (mock). Firebase wiring comes next.");
  }

  return (
    <div className="max-w-5xl space-y-10">
      <h1 className="text-3xl font-semibold text-[#1a3a52]">
        Admin Settings
      </h1>

      {/* ================= BUSINESS PROFILE ================= */}
      <Section title="Business Profile">
        <Field label="Business Name">
          <Input value={businessName} onChange={setBusinessName} />
        </Field>

        <Field label="Phone Number">
          <Input value={phone} onChange={setPhone} />
        </Field>

        <Field label="WhatsApp Number">
          <Input value={whatsapp} onChange={setWhatsapp} />
        </Field>

        <Field label="Email">
          <Input value={email} onChange={setEmail} />
        </Field>

        <Field label="RERA Information">
          <Input value={rera} onChange={setRera} />
        </Field>
      </Section>

      {/* ================= LEAD MANAGEMENT ================= */}
      <Section title="Lead Management">
        <Toggle
          label="Enable WhatsApp Enquiries"
          checked={enableWhatsappLeads}
          onChange={setEnableWhatsappLeads}
        />
        <Toggle
          label="Enable Email Enquiries"
          checked={enableEmailLeads}
          onChange={setEnableEmailLeads}
        />

        <Field label="Default Lead Message">
          <textarea
            className="w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
            value={leadMessage}
            onChange={(e) => setLeadMessage(e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">
            Use <code>{"{{projectName}}"}</code> for dynamic project name
          </p>
        </Field>
      </Section>

      {/* ================= WEBSITE CONTROLS ================= */}
      <Section title="Website Controls">
        <Toggle
          label="Show Prices on Website"
          checked={showPrices}
          onChange={setShowPrices}
        />
        <Toggle
          label="Enable Site Visit Booking"
          checked={enableSiteVisit}
          onChange={setEnableSiteVisit}
        />
        <Toggle
          label="Enable Brochure Download"
          checked={enableBrochure}
          onChange={setEnableBrochure}
        />
      </Section>

      {/* ================= ADMIN SECURITY ================= */}
      <Section title="Admin & Security">
        <Field label="Allowed Admin Emails">
          <Input
            value={adminEmails}
            onChange={setAdminEmails}
            placeholder="comma-separated emails"
          />
          <p className="text-xs text-slate-500 mt-1">
            Only these emails can access admin panel
          </p>
        </Field>
      </Section>

      {/* ================= SAVE ================= */}
      <div className="pt-6">
        <button
          onClick={handleSave}
          className="rounded-md bg-[#1a3a52] px-6 py-2 text-white hover:bg-[#224865]"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-white p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[#1a3a52]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="w-full rounded-md border px-3 py-2 text-sm"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
    </div>
  );
}