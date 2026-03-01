"use client";

import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

export default function EditProjectPage() {
  const params = useParams();

  const projectId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  if (!projectId) {
    return <div className="p-6">Invalid project ID</div>;
  }

  return (
    <div className="p-6">
      <ProjectForm projectId={projectId} />
    </div>
  );
}