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

import {
  Project,
  ProjectCoordinates,
  ProjectVideo,
} from "@/types/project";

/* -------------------------------------------------
   RAW DATA TYPE (Firestore flexibility)
-------------------------------------------------- */

type RawProjectData = Partial<Project> & {
  latitude?: unknown;
  longitude?: unknown;
  propertyType?: unknown;
  videos?: unknown;
  highlights?: unknown;
  brochureUrl?: unknown;
  plotSize?: unknown;
  totalUnits?: unknown;
  launchYear?: unknown;
  video?: unknown;
  videoType?: unknown;
  nearbyLocations?: unknown;
  mainCategory?: unknown;
  subCategory?: unknown;
  hotDeal?: unknown;
};

/* -------------------------------------------------
   HELPERS
-------------------------------------------------- */

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

/* -------------------------------------------------
   COORDINATES PARSER (Backward Compatible)
-------------------------------------------------- */

function parseCoordinates(data: RawProjectData): ProjectCoordinates | undefined {
  if (
    data.coordinates &&
    typeof data.coordinates.lat === "number" &&
    typeof data.coordinates.lng === "number"
  ) {
    return data.coordinates;
  }

  const lat = typeof data.latitude === "number" ? data.latitude : null;
  const lng = typeof data.longitude === "number" ? data.longitude : null;

  if (lat !== null && lng !== null) {
    return { lat, lng };
  }

  return undefined;
}

/* -------------------------------------------------
   PROJECT DATA MAPPER
-------------------------------------------------- */

export function mapProjectData(
  id: string,
  data: RawProjectData
): Project | null {

  if (!isString(data.slug)) {
    return null;
  }

  return {
    id,

    name: isString(data.name) ? data.name : "",
    slug: data.slug,

    location: isString(data.location) ? data.location : "",

    propertyType: isString(data.propertyType)
      ? data.propertyType
      : "Open Plots",

    mainCategory: isString(data.mainCategory) ? data.mainCategory : null,
    subCategory: isString(data.subCategory) ? data.subCategory : null,
    hotDeal: typeof data.hotDeal === "boolean" ? data.hotDeal : false,

    coordinates: parseCoordinates(data),

    status: data.status ?? "Ready to Move",

    configuration: isString(data.configuration)
      ? data.configuration
      : "",

    price: isString(data.price)
      ? data.price
      : "",

    description: isString(data.description)
      ? data.description
      : "",

    amenities: isStringArray(data.amenities)
      ? data.amenities
      : [],

    specifications: Array.isArray(data.specifications)
      ? data.specifications
      : [],

    gallery: isStringArray(data.gallery)
      ? data.gallery
      : [],

    videos: Array.isArray(data.videos)
      ? data.videos
      : [],

    nearbyLocations: Array.isArray(data.nearbyLocations)
      ? data.nearbyLocations
      : [],

    landArea: isString(data.landArea)
      ? data.landArea
      : null,

    rera: isString(data.rera)
      ? data.rera
      : null,

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/* -------------------------------------------------
   SNAPSHOT MAPPER
-------------------------------------------------- */

export function mapProjectSnapshot(
  snapshot: QueryDocumentSnapshot<DocumentData>
): Project | null {
  return mapProjectData(snapshot.id, snapshot.data() as RawProjectData);
}

/* -------------------------------------------------
   GOOGLE MAPS EMBED URL
-------------------------------------------------- */

export function buildProjectMapEmbedUrl(project: Project): string {

  if (project.coordinates) {

    const { lat, lng } = project.coordinates;

    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  }

  return `https://www.google.com/maps?q=${encodeURIComponent(
    project.location
  )}&z=14&output=embed`;
}

/* -------------------------------------------------
   GET PROJECT BY SLUG
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

  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  const data = doc.data() as RawProjectData;
  const mapped = mapProjectSnapshot(doc);

  if (!mapped) {
    return null;
  }

  const rawVideos: ProjectVideo[] = Array.isArray(data.videos)
    ? data.videos.filter(
        (item): item is ProjectVideo =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as { url?: unknown }).url === "string" &&
          (((item as { type?: unknown }).type === "youtube") ||
            (item as { type?: unknown }).type === "upload")
      )
    : [];

  const fallbackVideos: ProjectVideo[] =
    rawVideos.length === 0 && isString(data.video)
      ? [
          {
            url: data.video,
            type: data.videoType === "upload" ? "upload" : "youtube",
          },
        ]
      : rawVideos;

  return {
    ...mapped,
    videos: fallbackVideos,
    highlights: isStringArray(data.highlights) ? data.highlights : [],
    brochureUrl: isString(data.brochureUrl) ? data.brochureUrl : null,
    plotSize: isString(data.plotSize) ? data.plotSize : null,
    totalUnits: isString(data.totalUnits) ? data.totalUnits : null,
    launchYear: isString(data.launchYear) ? data.launchYear : null,
  };
}

/* -------------------------------------------------
   GET ALL PROJECT SLUGS (SEO / SSG)
-------------------------------------------------- */

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

  if (snapshot.empty) {
    return true;
  }

  if (currentProjectId && snapshot.docs[0].id === currentProjectId) {
    return true;
  }

  return false;
}
