import { Project } from "@/types/project";
import { buildProjectMapEmbedUrl } from "@/lib/projects";

type MapSectionProps = {
  project: Project;
};

export default function MapSection({ project }: MapSectionProps) {
  const mapUrl = buildProjectMapEmbedUrl(project);

  return (
    <section>
      <h2 className="mb-4 text-3xl font-serif text-[#1a3a52]">Location Map</h2>
      <div className="h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-white">
        <iframe
          src={mapUrl}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${project.name} map`}
        />
      </div>
    </section>
  );
}
