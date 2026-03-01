import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project, ProjectCoordinates } from "@/types/project";

function parseCoordinates(data: Partial<Project> & { latitude?: unknown; longitude?: unknown }) {
  if (
    data.coordinates &&
    typeof data.coordinates.lat === "number" &&
    typeof data.coordinates.lng === "number"
  ) {
    return data.coordinates;
  }

  const legacyLat = typeof data.latitude === "number" ? data.latitude : null;
  const legacyLng = typeof data.longitude === "number" ? data.longitude : null;

  if (legacyLat !== null && legacyLng !== null) {
    const legacyCoordinates: ProjectCoordinates = { lat: legacyLat, lng: legacyLng };
    return legacyCoordinates;
  }

  return undefined;
}

export function mapProjectData(
  id: string,
  data: Partial<Project> & { latitude?: unknown; longitude?: unknown }
): Project | null {
  if (!data.slug) {
    return null;
  }

  return {
    id,
    name: data.name ?? "",
    slug: data.slug,
    location: data.location ?? "",
    coordinates: parseCoordinates(data),
    status: data.status ?? "Ready to Move",
    configuration: data.configuration ?? "",
    price: data.price ?? "",
    description: data.description ?? "",
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    landArea: typeof data.landArea === "string" ? data.landArea : null,
    rera: data.rera ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function mapProjectSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): Project | null {
  return mapProjectData(snapshot.id, snapshot.data() as Partial<Project> & { latitude?: unknown; longitude?: unknown });
}

export function buildProjectMapEmbedUrl(project: Project) {
  if (project.coordinates) {
    return `https://www.google.com/maps?q=${project.coordinates.lat},${project.coordinates.lng}(${encodeURIComponent(project.name)})&output=embed`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(project.location)}&output=embed`;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projectQuery = query(collection(db, "projects"), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(projectQuery);

  if (snapshot.empty) {
    return null;
  }

  return mapProjectSnapshot(snapshot.docs[0]);
}

export async function getAllProjectSlugs() {
  const projectsQuery = query(collection(db, "projects"));
  const snapshot = await getDocs(projectsQuery);

  return snapshot.docs
    .map((projectSnapshot) => projectSnapshot.data().slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.trim().length > 0);
}

export async function isSlugUnique(slug: string, currentProjectId?: string) {
  const projectQuery = query(collection(db, "projects"), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(projectQuery);

  if (snapshot.empty) {
    return true;
  }

  if (currentProjectId && snapshot.docs[0].id === currentProjectId) {
    return true;
  }

  return false;
}
