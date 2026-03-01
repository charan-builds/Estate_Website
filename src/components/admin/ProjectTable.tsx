"use client";

import Link from "next/link";
import { Project } from "@/app/admin/projects/page";

interface Props {
  projects: Project[];
  onDelete: (id: string) => void;
}

export default function ProjectTable({ projects, onDelete }: Props) {
  if (projects.length === 0) {
    return <p>No projects found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Price</th>
            <th className="border px-4 py-2 text-left">Location</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{project.name}</td>
              <td className="border px-4 py-2">{project.status}</td>
              <td className="border px-4 py-2">{project.price}</td>
              <td className="border px-4 py-2">{project.location}</td>
              <td className="border px-4 py-2 text-center space-x-3">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(project.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}