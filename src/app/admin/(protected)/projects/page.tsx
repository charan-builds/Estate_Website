"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectTable from "@/components/admin/ProjectTable";
import { mapProjectData } from "@/lib/projects";
import { Project } from "@/types/project";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const mapped = snapshot.docs
          .map((projectSnapshot) =>
            mapProjectData(projectSnapshot.id, projectSnapshot.data() as Partial<Project>)
          )
          .filter(Boolean) as Project[];

        setProjects(mapped);
        setLoading(false);
      },
      () => {
        setProjects([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "projects", id));
  }

  function renderSkeletonRows() {
    return (
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="ml-auto h-7 w-24 animate-pulse rounded bg-slate-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a3a52]">Projects</h1>
          <p className="text-sm text-slate-600">Create, edit, and manage live property listings.</p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center rounded-md bg-[#1a3a52] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#224865]"
        >
          Add New Project
        </Link>
      </div>

      {loading ? renderSkeletonRows() : <ProjectTable projects={projects} onDelete={handleDelete} />}
    </section>
  );
}
