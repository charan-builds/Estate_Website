"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import { db } from "@/lib/firebase";
import { buildProjectMapEmbedUrl, mapProjectSnapshot } from "@/lib/projects";
import { Project, ProjectCoordinates } from "@/types/project";

declare global {
  interface Window {
    google?: {
      maps?: {
        Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMapInstance;
        Marker: new (options: {
          map: GoogleMapInstance;
          position: { lat: number; lng: number };
          title: string;
        }) => GoogleMapMarkerInstance;
      };
    };
  }
}

type GoogleMapInstance = object;
type GoogleMapMarkerInstance = {
  addListener: (eventName: string, callback: () => void) => void;
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function hasCoordinates(project: Project): project is Project & { coordinates: ProjectCoordinates } {
  return project.coordinates !== undefined;
}

function getGoogleMapsApi() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.google?.maps;
}

function loadGoogleMapsScript() {
  return new Promise<void>((resolve, reject) => {
    if (getGoogleMapsApi()) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[data-google-maps="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

export default function MapSearchPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [mapsReady, setMapsReady] = useState(false);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const nextProjects = snapshot.docs.map(mapProjectSnapshot).filter(Boolean) as Project[];
      setProjects(nextProjects);
      if (!selectedProjectId && nextProjects[0]) {
        setSelectedProjectId(nextProjects[0].id || nextProjects[0].slug);
      }
    });

    return unsubscribe;
  }, [selectedProjectId]);

  const selectedProject = useMemo(() => {
    return projects.find((project) => (project.id || project.slug) === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (typeof window === "undefined" || !GOOGLE_MAPS_API_KEY || !mapRef.current || !projects.length) {
      return;
    }

    let cancelled = false;

    loadGoogleMapsScript()
      .then(() => {
        const googleMaps = getGoogleMapsApi();

        if (cancelled || !mapRef.current || !googleMaps) {
          return;
        }

        const centerProject =
          selectedProject && hasCoordinates(selectedProject)
            ? selectedProject
            : projects.find(hasCoordinates);

        const map = new googleMaps.Map(mapRef.current, {
          center: centerProject?.coordinates || { lat: 17.385, lng: 78.4867 },
          zoom: centerProject?.coordinates ? 11 : 8,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        projects
          .filter(hasCoordinates)
          .forEach((project) => {
            const marker = new googleMaps.Marker({
              map,
              position: project.coordinates,
              title: project.name,
            });

            marker.addListener("click", () => {
              setSelectedProjectId(project.id || project.slug);
            });
          });

        setMapsReady(true);
      })
      .catch(() => {
        setMapsReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projects, selectedProject]);

  return (
    <div className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-[#1a3a52]">Map Search</h1>
          <p className="text-gray-600">
            Browse available projects with a location-first experience.
          </p>

          <div className="space-y-3">
            {projects.map((project) => (
              <button
                key={project.id || project.slug}
                type="button"
                onClick={() => setSelectedProjectId(project.id || project.slug)}
                className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                  (project.id || project.slug) === (selectedProject?.id || selectedProject?.slug)
                    ? "border-[#1a3a52] bg-slate-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-lg font-serif text-[#1a3a52]">{project.name}</p>
                <p className="mt-1 text-sm text-slate-600">{project.location}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          {GOOGLE_MAPS_API_KEY ? (
            <div ref={mapRef} className="h-[520px] w-full" />
          ) : selectedProject ? (
            <iframe
              src={buildProjectMapEmbedUrl(selectedProject)}
              title={`${selectedProject.name} map`}
              className="h-[520px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-[520px] items-center justify-center text-slate-500">
              No mappable projects available yet.
            </div>
          )}

          {selectedProject ? (
            <div className="border-t p-5">
              {!GOOGLE_MAPS_API_KEY ? (
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#1a3a52]/60">
                  Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for interactive markers
                </p>
              ) : mapsReady ? (
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#1a3a52]/60">Marker Preview</p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <div className="overflow-hidden rounded-xl">
                  <ImageWithFallback
                    src={selectedProject.gallery[0]}
                    alt={selectedProject.name}
                    className="h-28 w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#1a3a52]">{selectedProject.name}</h2>
                  <p className="mt-1 text-slate-600">{selectedProject.location}</p>
                  <p className="mt-2 font-semibold text-[#1a3a52]">₹ {selectedProject.price}</p>
                  <Link
                    href={`/projects/${selectedProject.slug}`}
                    className="mt-4 inline-flex rounded-md bg-[#1a3a52] px-4 py-2 text-sm font-medium text-white"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
