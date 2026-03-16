"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import useCompareProjects from "@/hooks/useCompareProjects";
import { db } from "@/lib/firebase";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

const comparisonRows: Array<{ label: string; getValue: (project: Project) => string }> = [
  { label: "Price", getValue: (project) => project.price || "—" },
  { label: "Location", getValue: (project) => project.location || "—" },
  { label: "Plot Size", getValue: (project) => project.plotSize || "—" },
  { label: "Amenities", getValue: (project) => project.amenities.join(", ") || "—" },
  { label: "RERA", getValue: (project) => project.rera || "—" },
  { label: "Land Area", getValue: (project) => project.landArea || "—" },
];

export default function CompareProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { comparedProjectIds, clearComparedProjects } = useCompareProjects();

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const nextProjects = snapshot.docs.map(mapProjectSnapshot).filter(Boolean) as Project[];
      setProjects(nextProjects);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const comparedProjects = useMemo(() => {
    return projects.filter((project) => comparedProjectIds.includes(project.id || project.slug));
  }, [comparedProjectIds, projects]);

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-serif text-[#1a3a52]">Compare Projects</h1>
            <p className="mt-4 max-w-2xl text-gray-600">
              Review up to three shortlisted projects side by side.
            </p>
          </div>
          {comparedProjects.length ? (
            <button
              type="button"
              onClick={clearComparedProjects}
              className="rounded-md border border-[#1a3a52] px-5 py-3 text-sm font-medium text-[#1a3a52]"
            >
              Clear Compare
            </button>
          ) : null}
        </div>

        <div className="mt-10">
          {!loading && comparedProjects.length ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-[#1a3a52]">Attribute</th>
                    {comparedProjects.map((project) => (
                      <th key={project.id || project.slug} className="px-4 py-4 text-left text-[#1a3a52]">
                        {project.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-t">
                      <td className="px-4 py-4 font-medium text-slate-700">{row.label}</td>
                      {comparedProjects.map((project) => (
                        <td key={`${project.id || project.slug}-${row.label}`} className="px-4 py-4 text-slate-600">
                          {row.getValue(project)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!loading && comparedProjects.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <h2 className="text-2xl font-serif text-[#1a3a52]">No projects selected for comparison.</h2>
              <p className="mt-3 text-gray-600">
                Choose up to three projects from the listings page to compare them here.
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
