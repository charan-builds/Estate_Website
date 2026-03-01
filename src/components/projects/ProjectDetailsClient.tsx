"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Download, MapPin, Phone, MessageCircle, CalendarCheck } from "lucide-react";
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
  }, [project.name, project.slug]);

  const whatsappMessage = useMemo(
    () =>
      encodeURIComponent(
        `Hi Ekam Properties,\nI am interested in the project: ${project.name}.\nPlease share more details.`
      ),
    [project.name]
  );

  const whatsappLink = `https://wa.me/${EKAM_BUSINESS.whatsappNumber}?text=${whatsappMessage}`;

  function handleWhatsappClick() {
    trackEvent("whatsapp_click", {
      project_slug: project.slug,
      project_name: project.name,
    });
  }

  function handleCallClick() {
    trackEvent("call_now_click", {
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

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.name,
    description: project.description,
    category: "Real Estate Project",
    brand: { "@type": "Brand", name: EKAM_BUSINESS.name },
    areaServed: "Hyderabad",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      price: project.price,
    },
    image: project.gallery,
  };

  return (
    <div className="bg-slate-50 pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }} />

      <div className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link href="/projects" className="inline-flex items-center gap-2 text-gray-600 transition hover:text-[#1a3a52]">
            <ArrowLeft size={18} />
            Back to Projects
          </Link>
        </div>
      </div>

      <section className="relative h-[460px] overflow-hidden">
        <ImageWithFallback
          src={project.gallery[0] || "https://via.placeholder.com/1200x600"}
          alt={project.name}
          className="h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-1/2 w-full max-w-7xl -translate-x-1/2 px-6 pb-10 text-white">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1a3a52]">
            {project.status}
          </span>
          <h1 className="mt-3 max-w-4xl text-4xl font-serif leading-tight md:text-5xl">{project.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-base text-gray-100 md:text-lg">
            <MapPin size={18} /> {project.location}
          </p>
        </div>
      </section>

      <section className="-mt-10 px-4">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-2xl border border-white/30 bg-gradient-to-r from-[#0f2d43]/95 to-[#1a3a52]/95 p-5 text-white shadow-2xl backdrop-blur md:grid-cols-5">
          <Info label="Configuration" value={project.configuration || "-"} emphasize />
          <Info label="Price" value={project.price || "On Request"} emphasize />
          <Info label="RERA" value={project.rera || "Available on request"} />
          <Info label="Status" value={project.status} />
          <Info label="Land Area" value={project.landArea || "Available on request"} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <Section title="Project Overview">
              <Card>
                <p className="text-gray-700 leading-relaxed">{project.description || "Project details will be updated soon."}</p>
              </Card>
            </Section>

            <Section title="Amenities">
              <div className="grid gap-3 sm:grid-cols-2">
                {project.amenities.map((amenity, index) => (
                  <div
                    key={`${amenity}-${index}`}
                    className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-3 text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CheckCircle2 size={18} className="text-[#1a3a52]" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Specifications">
              <Card className="overflow-hidden p-0">
                {project.specifications.map((specification, index) => (
                  <div
                    key={`${specification.label}-${index}`}
                    className={`grid grid-cols-2 px-4 py-3 ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
                  >
                    <span className="text-slate-700">{specification.label}</span>
                    <span className="font-semibold text-slate-900">{specification.value}</span>
                  </div>
                ))}
              </Card>
            </Section>

            <Section title="Gallery">
              <div className="grid gap-4 md:grid-cols-2">
                {project.gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className="group overflow-hidden rounded-lg border border-slate-200"
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${project.name} gallery ${index + 1}`}
                      className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </Section>

            <MapSection project={project} />
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-[#d5e3ec] bg-white p-6 shadow-lg">
              <h2 className="mb-3 text-xl font-semibold text-[#1a3a52]">Talk to Our Property Expert</h2>
              <p className="mb-4 text-sm text-slate-600">Quick actions to connect with Ekam Properties.</p>

              <div className="space-y-3">
                <a
                  href={`tel:${EKAM_BUSINESS.phoneDial}`}
                  onClick={handleCallClick}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1a3a52] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#224865]"
                >
                  <Phone size={16} /> Call Now
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleWhatsappClick}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-[#1a3a52] px-4 py-2.5 text-sm font-semibold text-[#1a3a52] transition hover:bg-[#1a3a52] hover:text-white"
                >
                  <MessageCircle size={16} /> WhatsApp Enquiry
                </a>

                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#123147] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e2a3d]"
                >
                  <CalendarCheck size={16} /> Book Site Visit
                </button>

                <button
                  type="button"
                  onClick={handleBrochureClick}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <Download size={16} /> Download Brochure
                </button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-[0_-6px_20px_rgba(0,0,0,0.12)] lg:hidden">
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${EKAM_BUSINESS.phoneDial}`}
            onClick={handleCallClick}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-[#1a3a52] px-2 py-2 text-xs font-semibold text-white"
          >
            <Phone size={14} /> Call
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={handleWhatsappClick}
            className="inline-flex items-center justify-center gap-1 rounded-md border border-[#1a3a52] px-2 py-2 text-xs font-semibold text-[#1a3a52]"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setIsLeadModalOpen(true)}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-[#123147] px-2 py-2 text-xs font-semibold text-white"
          >
            <CalendarCheck size={14} /> Site Visit
          </button>
        </div>
      </div>

      <LeadForm project={project} open={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />

      {activeImageIndex !== null ? (
        <GalleryModal
          images={project.gallery}
          index={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
          onPrev={() =>
            setActiveImageIndex((previous) =>
              previous === null
                ? 0
                : (previous - 1 + project.gallery.length) % project.gallery.length
            )
          }
          onNext={() =>
            setActiveImageIndex((previous) =>
              previous === null ? 0 : (previous + 1) % project.gallery.length
            )
          }
        />
      ) : null}
    </div>
  );
}

function Info({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-blue-100">{label}</p>
      <p className={emphasize ? "text-xl font-bold" : "text-base font-semibold"}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
  return <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className || ""}`}>{children}</div>;
}
