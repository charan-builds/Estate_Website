import React from 'react';
import { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <img src={project.gallery[0]} alt={project.name} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{project.name}</h2>
      <p className="text-gray-600">{project.location}</p>
      <p className="text-gray-800 mt-1">Price: ${project.price}</p>
      <p className="text-gray-600 mt-1">{project.description}</p>
      <div className="mt-4 flex justify-between">
        <button onClick={onEdit} className="text-blue-500 hover:underline">Edit</button>
        <button onClick={onDelete} className="text-red-500 hover:underline">Delete</button>
      </div>
    </div>
  );
};

export default ProjectCard;