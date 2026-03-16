"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Download, Heart, MessageCircle, Scale } from "lucide-react";

import StaggerContainer from "@/components/animations/StaggerContainer";
import { fadeInUpVariants } from "@/components/animations/motion";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import useCompareProjects from "@/hooks/useCompareProjects";
import useSavedProjects from "@/hooks/useSavedProjects";
import { EKAM_BUSINESS } from "@/lib/business";
import { createInteractionLead } from "@/lib/lead";
import { Project } from "@/types/project";

type FilteredProjectsProps = {
  projects: Project[];
};

function buildWhatsappLink(projectName: string) {
  const message = encodeURIComponent(
    `Hi Ekam Properties,\nI am interested in ${projectName}.\nPlease share full details and pricing.`
  );

  return `https://wa.me/${EKAM_BUSINESS.whatsappNumber}?text=${message}`;
}

export default function FilteredProjects({
  projects,
}: FilteredProjectsProps) {
  const router = useRouter();
  const { isSaved, toggleSavedProject } = useSavedProjects();
  const { comparedProjectIds, isCompared, toggleComparedProject } = useCompareProjects();

  if (!projects.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm"
      >
        <h3 className="text-2xl font-serif text-[#1a3a52]">No matching projects found</h3>
        <p className="mt-3 text-gray-600">
          Try adjusting the filters to explore more verified opportunities.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {comparedProjectIds.length > 1 ? (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/compare")}
            className="rounded-xl bg-[#1a3a52] px-4 py-3 text-sm font-medium text-white"
          >
            Compare Projects ({comparedProjectIds.length})
          </button>
        </div>
      ) : null}

    <StaggerContainer className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const isNewLaunch = project.status === "New Launch";
        const isReadyToMove = project.status === "Ready to Move";

        return (
          <motion.article
            key={project.id}
            variants={fadeInUpVariants}
            whileHover={{ scale: 1.02, y: -6 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm hover:shadow-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    toggleSavedProject(project.id || project.slug);
                  }}
                  className="rounded-full bg-white/90 p-2 text-[#1a3a52] shadow"
                  aria-label="Save project"
                >
                  <Heart size={16} className={isSaved(project.id || project.slug) ? "fill-[#1a3a52]" : ""} />
                </button>
              </div>
              <ImageWithFallback
                src={project.gallery[0]}
                alt={project.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {isNewLaunch ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#1a3a52] shadow">
                    New Launch
                  </span>
                ) : null}
                {isReadyToMove ? (
                  <span className="rounded-full bg-[#1a3a52] px-3 py-1 text-xs font-medium text-white shadow">
                    Ready to Move
                  </span>
                ) : null}
                {project.hotDeal ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-rose-700 shadow">
                    Hot Deal
                  </span>
                ) : null}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#1a3a52]/60">
                    {project.propertyType}
                  </p>
                  <h3 className="mt-2 text-2xl font-serif text-[#1a3a52]">{project.name}</h3>
                </div>
                <p className="text-right text-sm font-semibold text-[#1a3a52]">₹ {project.price}</p>
              </div>

              <p className="mt-3 text-gray-600">{project.location}</p>
              <p className="mt-2 text-sm text-gray-500">{project.configuration || "Configuration details available on request."}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a3a52] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#224865]"
                >
                  View Project <ArrowRight size={15} />
                </Link>
                {project.brochureUrl ? (
                  <a
                    href={`${project.brochureUrl}?fl_attachment`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      createInteractionLead({
                        projectId: project.id,
                        projectName: project.name,
                        source: "brochure",
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#1a3a52]"
                  >
                    <Download size={15} />
                    Download Brochure
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-center text-sm text-slate-400">
                    Brochure Soon
                  </span>
                )}
                <a
                  href={buildWhatsappLink(project.name)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    createInteractionLead({
                      projectId: project.id,
                      projectName: project.name,
                      source: "whatsapp",
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#1a3a52]"
                >
                  <MessageCircle size={15} />
                  WhatsApp Enquiry
                </a>
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={isCompared(project.id || project.slug)}
                  onChange={(event) => {
                    event.preventDefault();
                    toggleComparedProject(project.id || project.slug);
                  }}
                />
                <Scale size={15} />
                Compare
              </label>
            </div>
          </motion.article>
        );
      })}
    </StaggerContainer>
    </>
  );
}
