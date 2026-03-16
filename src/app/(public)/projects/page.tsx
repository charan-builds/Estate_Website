import { Suspense } from "react";
import type { Metadata } from "next";
import ProjectsPageClient from "@/components/projects/ProjectsPageClient";
import { PROJECT_SUBCATEGORY_OPTIONS } from "@/lib/constants";

type ProjectsPageProps = {
  searchParams?: {
    type?: string;
    location?: string;
    budget?: string;
    status?: string;
    amenity?: string;
  };
};

const subcategoryLabels = Object.values(PROJECT_SUBCATEGORY_OPTIONS)
  .flat()
  .reduce<Record<string, string>>((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

export function generateMetadata({ searchParams }: ProjectsPageProps): Metadata {
  const type = searchParams?.type;
  const location = searchParams?.location;
  const status = searchParams?.status;

  const titleParts = [
    type ? subcategoryLabels[type] || type : "Projects",
    location ? `in ${location}` : "",
    status ? `- ${status}` : "",
  ].filter(Boolean);

  return {
    title: `${titleParts.join(" ")} | Ekam Properties`,
    description:
      type || location
        ? `Browse ${type ? `${subcategoryLabels[type] || type} ` : ""}projects${location ? ` in ${location}` : ""} with verified details, pricing, and amenities from Ekam Properties.`
        : "Browse verified real estate projects with filters for location, budget, status, and amenities.",
  };
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsPageClient />
    </Suspense>
  );
}
