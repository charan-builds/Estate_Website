"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  MapPin,
  Phone,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { EKAM_BUSINESS } from "@/lib/business";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import GalleryModal from "@/components/projects/GalleryModal";
import LeadForm from "@/components/projects/LeadForm";
import MapSection from "@/components/projects/MapSection";
import { Project } from "@/types/project";

type Props = {
  project: Project;
};

export default function ProjectDetailsClient({ project }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  useEffect(() => {
    trackEvent("project_page_view", {
      project_slug: project.slug,
      project_name: project.name,
    });
  }, [project.slug, project.name]);
function handleCallClick() {
  trackEvent("call_now_click", {
    project_slug: project.slug,
    project_name: project.name,
  });
}

function handleWhatsappClick() {
  trackEvent("whatsapp_click", {
    project_slug: project.slug,
    project_name: project.name,
  });
}

function handleBrochureClick() {
  trackEvent("brochure_click", {
    project_slug: project.slug,
    project_name: project.name,
  });
}
  const whatsappMessage = useMemo(
    () =>
      encodeURIComponent(
        `Hi Ekam Properties,\nI am interested in ${project.name}.\nPlease share price, floor plans, and site visit details.`
      ),
    [project.name]
  );

  const whatsappLink = `https://wa.me/${EKAM_BUSINESS.whatsappNumber}?text=${whatsappMessage}`;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.name,
    description: project.description,
    address: project.location,
    image: project.gallery,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: project.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="bg-slate-50 pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      {/* Top Bar */}
      <div className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a3a52]"
          >
            <ArrowLeft size={18} /> Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[460px] overflow-hidden">
        <ImageWithFallback
          src={project.gallery[0]}
          alt={project.name}
          className="h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 w-full max-w-7xl -translate-x-1/2 px-6 pb-10 text-white">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-[#1a3a52]">
            {project.status}
          </span>
          <h1 className="mt-3 text-4xl font-serif md:text-5xl">
            {project.name}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-gray-200">
            <MapPin size={18} /> {project.location}
          </p>
        </div>
      </section>

      {/* Price + Highlights */}
      <section className="-mt-14 px-4">
  <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
    
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-5">

      {/* CONFIGURATION */}
      <InfoBlock
        label="Configuration"
        value={project.configuration || "-"}
      />

      {/* PRICE – HERO */}
      <div className="rounded-xl bg-[#1a3a52] p-4 text-white shadow-md">
        <p className="text-xs uppercase tracking-wide text-blue-100">
          Starting Price
        </p>
        <p className="mt-1 text-2xl font-extrabold">
          ₹ {project.price || "On Request"}
        </p>
        <p className="mt-1 text-xs text-blue-200">
          * All inclusive
        </p>
      </div>

      {/* RERA */}
      <InfoBlock
        label="RERA No."
        value={project.rera || "Available"}
      />

      {/* STATUS */}
      <InfoBlock
        label="Status"
        value={project.status}
        highlight
      />

      {/* LAND AREA */}
      <InfoBlock
        label="Land Area"
        value={project.landArea || "—"}
      />

    </div>
  </div>
</section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <Section title="Project Overview">
              <Card>
                <p className="leading-relaxed text-gray-700">
                  {project.description ||
                    "Detailed project information will be updated shortly."}
                </p>
              </Card>
            </Section>

            <Section title="Lifestyle Amenities">
              <div className="grid gap-3 sm:grid-cols-2">
                {project.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border bg-white p-3 shadow-sm"
                  >
                    <CheckCircle2 size={18} className="text-[#1a3a52]" />
                    <span className="font-medium text-slate-800">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Construction & Specifications">
              <Card className="p-0">
                {project.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-2 px-4 py-3 ${
                      i % 2 === 0 ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    <span className="text-slate-700">{spec.label}</span>
                    <span className="font-semibold text-slate-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </Card>
            </Section>

            <Section title={`Project Gallery (${project.gallery.length})`}>
              <div className="grid gap-4 md:grid-cols-2">
                {project.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className="overflow-hidden rounded-lg border"
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${project.name} image ${i + 1}`}
                      className="aspect-[4/3] w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </Section>

            <MapSection project={project} />
          </div>

          {/* Sidebar */}
          {/* RIGHT SIDEBAR – PREMIUM CTA */}
<div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
    {/* Trust Header */}
    <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3">
      <ShieldCheck className="text-[#1a3a52]" size={20} />
      <div>
        <p className="text-sm font-semibold text-[#1a3a52]">
          Verified by Ekam Properties
        </p>
        <p className="text-xs text-slate-600">
          TG-RERA Certified Real Estate Advisor
        </p>
      </div>
    </div>

    <h2 className="mb-2 text-xl font-serif text-[#1a3a52]">
      Talk to a Property Expert
    </h2>
    <p className="mb-5 text-sm text-slate-600">
      Get price details, floor plans & site visit assistance.
    </p>

    {/* CTA BUTTONS */}
    <div className="space-y-3">
      {/* CALL NOW – PRIMARY */}
      <a
        href={`tel:${EKAM_BUSINESS.phoneDial}`}
        onClick={handleCallClick}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a3a52] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#224865]"
      >
        <Phone size={18} />
        Call Now
      </a>

      {/* WHATSAPP – SECONDARY */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        onClick={handleWhatsappClick}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#25D366] bg-[#25D366]/10 px-4 py-3 text-base font-semibold text-[#1f8f4e] transition hover:bg-[#25D366]/20"
      >
        <MessageCircle size={18} />
        WhatsApp Enquiry
      </a>

      {/* SITE VISIT – CONVERSION */}
      <button
        type="button"
        onClick={() => setIsLeadModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#123147] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#0e2a3d]"
      >
        <CalendarCheck size={18} />
        Book Site Visit
      </button>

      {/* BROCHURE – TERTIARY */}
      <button
        type="button"
        onClick={handleBrochureClick}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <Download size={16} />
        Download Brochure
      </button>
    </div>

    {/* Micro Trust Text */}
    <p className="mt-4 text-center text-xs text-slate-500">
      No brokerage • Bank approved projects • 100% verified listings
    </p>
  </div>
</div>
        </div>
      </section>

      {/* Mobile CTA */}
      
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white px-3 py-2 shadow-[0_-6px_20px_rgba(0,0,0,0.18)] lg:hidden">
  <div className="grid grid-cols-3 gap-3">
    
    {/* CALL */}
    <a
      href={`tel:${EKAM_BUSINESS.phoneDial}`}
      onClick={handleCallClick}
      className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1a3a52] py-3 text-white font-semibold"
    >
      <Phone size={18} />
      <span className="text-xs">Call</span>
    </a>

    {/* WHATSAPP */}
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      onClick={handleWhatsappClick}
      className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#25D366] py-3 text-white font-semibold"
    >
      <MessageCircle size={18} />
      <span className="text-xs">WhatsApp</span>
    </a>

    {/* SITE VISIT */}
    <button
      type="button"
      onClick={() => setIsLeadModalOpen(true)}
      className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#123147] py-3 text-white font-semibold"
    >
      <CalendarCheck size={18} />
      <span className="text-xs">Visit</span>
    </button>

  </div>
</div>

      <LeadForm
        project={project}
        open={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

      {activeImageIndex !== null && (
        <GalleryModal
          images={project.gallery}
          index={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
          onPrev={() =>
            setActiveImageIndex(
              (activeImageIndex - 1 + project.gallery.length) %
                project.gallery.length
            )
          }
          onNext={() =>
            setActiveImageIndex(
              (activeImageIndex + 1) % project.gallery.length
            )
          }
        />
      )}
    </div>
  );
}

/* ---------- UI Helpers ---------- */

function Info({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase text-blue-200">{label}</p>
      <p className={emphasize ? "text-xl font-bold" : "font-semibold"}>
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 text-3xl font-serif text-[#1a3a52]">{title}</h2>
      {children}
    </section>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border bg-white shadow-sm ${className || ""}`}
    >
      {children}
    </div>
  );
}
function InfoBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        highlight
          ? "bg-emerald-50 text-emerald-800"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}8