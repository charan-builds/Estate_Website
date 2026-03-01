import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailsClient from "@/components/projects/ProjectDetailsClient";
import { getProjectBySlug } from "@/lib/projects";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateStaticParams() {
  const snap = await getDocs(collection(db, "projects"));

  return snap.docs.map((doc) => ({
    slug: doc.data().slug,
  }));
}

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found | Ekam Properties",
      description: "The requested project could not be found.",
    };
  }

  const title = `${project.name} | Ekam Properties`;
  const description = project.description || `${project.name} in ${project.location}`;
  const image = project.gallery[0];

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={project} />;
}
