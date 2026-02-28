import React from 'react';

interface Props {
  params: { id: string };
}

export default function EditProjectPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Project {params.id}</h1>
      {/* placeholder for edit form, prefilled with project data */}
      <p>Form to edit project with ID {params.id} goes here.</p>
    </div>
  );
}
