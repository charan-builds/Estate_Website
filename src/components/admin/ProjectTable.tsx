"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";

type Props = {
  projects: Project[];
  onDelete: (id: string) => Promise<void>;
};

const STATUS_STYLES: Record<Project["status"], string> = {
  "Ready to Move": "bg-emerald-100 text-emerald-700",
  "Under Construction": "bg-amber-100 text-amber-700",
  "New Launch": "bg-blue-100 text-blue-700",
};

export default function ProjectTable({ projects, onDelete }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (!projects.length) {
    return <p className="rounded-md border border-slate-200 bg-white p-6 text-slate-500">No projects found.</p>;
  }

  async function confirmDelete() {
    if (!selectedProject?.id) {
      return;
    }

    setDeleting(true);
    await onDelete(selectedProject.id);
    setDeleting(false);
    setSelectedProject(null);
  }

  return (
    <>
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
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{project.name}</p>
                  <p className="text-xs text-slate-500">/projects/{project.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[project.status]}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{project.price}</td>
                <td className="px-4 py-3 text-slate-700">{project.location}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-md border border-[#1a3a52] px-3 py-1.5 text-xs font-medium text-[#1a3a52] transition hover:bg-[#1a3a52] hover:text-white"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900">Delete Project</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete <strong>{selectedProject.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
