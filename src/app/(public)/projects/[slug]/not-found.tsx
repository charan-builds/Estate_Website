import Link from "next/link";

export default function ProjectNotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-3xl font-serif text-[#1a3a52]">Project Not Found</h1>
      <p className="mb-6 text-gray-600">The project you are looking for may have been removed or is unavailable.</p>
      <Link href="/projects" className="rounded-md bg-[#1a3a52] px-6 py-3 text-white transition hover:bg-[#224865]">
        View All Projects
      </Link>
    </div>
  );
}
