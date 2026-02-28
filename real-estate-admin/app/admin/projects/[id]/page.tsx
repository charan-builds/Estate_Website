import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProjectById } from '@/lib/firebase';
import ProjectForm from '@/components/admin/ProjectForm';

const ProjectPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        const projectData = await getProjectById(id);
        setProject(projectData);
        setLoading(false);
      };
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  );
};

export default ProjectPage;