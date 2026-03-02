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

/* -------------------------------------------------
   COORDINATES PARSER (Backward Compatible)
-------------------------------------------------- */

type RawProjectData = Partial<Project> & {
  latitude?: unknown;
  longitude?: unknown;
};

function parseCoordinates(data: RawProjectData): ProjectCoordinates | undefined {
  // ✅ Preferred: new coordinates object
  if (
    data.coordinates &&
    typeof data.coordinates.lat === "number" &&
    typeof data.coordinates.lng === "number"
  ) {
    return data.coordinates;
  }

  // 🧱 Legacy support
  const lat = typeof data.latitude === "number" ? data.latitude : null;
  const lng = typeof data.longitude === "number" ? data.longitude : null;

  if (lat !== null && lng !== null) {
    return { lat, lng };
  }

  return undefined;
}

/* -------------------------------------------------
   PROJECT MAPPER
-------------------------------------------------- */

export function mapProjectData(
  id: string,
  data: RawProjectData
): Project | null {
  if (!data.slug || typeof data.slug !== "string") {
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
    specifications: Array.isArray(data.specifications)
      ? data.specifications
      : [],
    gallery: Array.isArray(data.gallery) ? data.gallery : [],

    landArea: typeof data.landArea === "string" ? data.landArea : null,
    rera: data.rera ?? null,

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function mapProjectSnapshot(
  snapshot: QueryDocumentSnapshot<DocumentData>
): Project | null {
  return mapProjectData(snapshot.id, snapshot.data() as RawProjectData);
}

/* -------------------------------------------------
   GOOGLE MAPS EMBED
-------------------------------------------------- */

export function buildProjectMapEmbedUrl(project: Project) {
  if (project.coordinates) {
    const { lat, lng } = project.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(
    project.location
  )}&z=14&output=embed`;
}

/* -------------------------------------------------
   FIRESTORE QUERIES
-------------------------------------------------- */

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  const q = query(
    collection(db, "projects"),
    where("slug", "==", slug),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return mapProjectSnapshot(snapshot.docs[0]);
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, "projects"));

  return snapshot.docs
    .map((doc) => doc.data().slug)
    .filter(
      (slug): slug is string =>
        typeof slug === "string" && slug.trim().length > 0
    );
}

/* -------------------------------------------------
   SLUG UNIQUENESS CHECK (ADMIN)
-------------------------------------------------- */

export async function isSlugUnique(
  slug: string,
  currentProjectId?: string
): Promise<boolean> {
  const q = query(
    collection(db, "projects"),
    where("slug", "==", slug),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return true;

  // Editing same project → allowed
  if (currentProjectId && snapshot.docs[0].id === currentProjectId) {
    return true;
  }

  return false;
}