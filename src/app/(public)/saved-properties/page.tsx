"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import FilteredProjects from "@/components/projects/FilteredProjects";
import ProjectsSkeletonGrid from "@/components/projects/ProjectsSkeletonGrid";
import useSavedProjects from "@/hooks/useSavedProjects";
import { db } from "@/lib/firebase";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

export default function SavedPropertiesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { savedProjectIds } = useSavedProjects();

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const nextProjects = snapshot.docs.map(mapProjectSnapshot).filter(Boolean) as Project[];
      setProjects(nextProjects);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const savedProjects = useMemo(() => {
    return projects.filter((project) => savedProjectIds.includes(project.id || project.slug));
  }, [projects, savedProjectIds]);

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-4xl font-serif text-[#1a3a52]">Saved Properties</h1>
        <p className="mt-4 max-w-2xl text-gray-600">
          Revisit the projects you&apos;ve shortlisted and continue comparing options.
        </p>

        <div className="mt-10">
          {loading ? <ProjectsSkeletonGrid /> : null}

          {!loading && savedProjects.length ? (
            <FilteredProjects projects={savedProjects} />
          ) : null}

          {!loading && savedProjects.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <h2 className="text-2xl font-serif text-[#1a3a52]">No saved properties yet.</h2>
              <p className="mt-3 text-gray-600">
                Save projects from listing cards to build your shortlist here.
              </p>
              <Link
                href="/projects"
                className="mt-6 inline-flex rounded-md bg-[#1a3a52] px-6 py-3 text-sm font-medium text-white"
              >
                Browse Projects
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
