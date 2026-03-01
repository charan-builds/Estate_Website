import ProjectForm from "@/components/admin/ProjectForm";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const projectId = params.id;

  if (!projectId) {
    return <div className="p-6">Invalid project ID</div>;
  }

  return (
    <div className="p-6">
      <ProjectForm projectId={projectId} />
    </div>
  );
}
