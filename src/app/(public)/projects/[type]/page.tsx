import { notFound } from "next/navigation";
import ProjectDetailsClient from "@/components/projects/ProjectDetailsClient";
import ProjectsByTypeClient from "@/components/projects/ProjectsByTypeClient";
import { getProjectBySlug } from "@/lib/projects";

type ProjectsByTypePageProps = {
  params: {
    type: string;
  };
};

export default async function ProjectsByTypePage({
  params,
}: ProjectsByTypePageProps) {
  const project = await getProjectBySlug(params.type);
  const validTypeSlugs = new Set([
    "open-plots",
    "villas",
    "apartments",
    "farm-plots",
    "highway-plots",
  ]);

  if (project) {
    return <ProjectDetailsClient project={project} />;
  }

  if (!validTypeSlugs.has(params.type)) {
    notFound();
  }

  return <ProjectsByTypeClient type={params.type} />;
}
