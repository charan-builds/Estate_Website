import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailsClient from "@/components/projects/ProjectDetailsClient";
import { getProjectBySlug } from "@/lib/projects";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* -------------------------------------------
   STATIC PARAMS (SSG)
------------------------------------------- */

export async function generateStaticParams() {
  const snap = await getDocs(collection(db, "projects"));

  return snap.docs
    .map((doc) => doc.data()?.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

/* -------------------------------------------
   TYPES
------------------------------------------- */

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

/* -------------------------------------------
   SEO METADATA
------------------------------------------- */

export async function generateMetadata(
  { params }: ProjectPageProps
): Promise<Metadata> {
  const slug = params?.slug;

  if (!slug) {
    return {
      title: "Project Not Found | Ekam Properties",
      description: "Invalid project URL.",
      robots: { index: false, follow: false },
    };
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Ekam Properties",
      description: "The requested project could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${project.name} in ${project.location} | Ekam Properties`;

  const description =
    project.description ||
    `${project.name} is a premium residential project located in ${project.location}. Explore price, configuration, amenities, and book a site visit with Ekam Properties.`;

  const image =
    project.gallery && project.gallery.length > 0
      ? project.gallery[0]
      : "/og-default.jpg";

  const url = `/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      project.name,
      `${project.name} ${project.location}`,
      "Ekam Properties",
      "Real Estate in Hyderabad",
      "TG RERA Certified Projects",
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ekam Properties",
      type: "article",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* -------------------------------------------
   PAGE
------------------------------------------- */

export default async function ProjectDetailsPage({
  params,
}: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={project} />;
}