import { Timestamp } from "firebase/firestore";

/* -----------------------------------------
   PROJECT STATUS
------------------------------------------ */

export type ProjectStatus =
  | "Ready to Move"
  | "Under Construction"
  | "New Launch";
 
  export type PropertyType =
  | "Open Plots"
  | "Villas"
  | "Apartments"
  | "Farm Plots"
  | "Highway Plots";
/* -----------------------------------------
   SPECIFICATIONS
------------------------------------------ */

export interface ProjectSpecification {
  label: string;
  value: string;
}

/* -----------------------------------------
   MAP COORDINATES
------------------------------------------ */

export interface ProjectCoordinates {
  lat: number;
  lng: number;
}

/* -----------------------------------------
   VIDEO TYPES
------------------------------------------ */

export type ProjectVideoType =
  | "youtube"
  | "upload";

export interface ProjectVideo {
  url: string;
  type: ProjectVideoType;
}

  export interface NearbyLocation {
  name: string
  distance: string
}
/* -----------------------------------------
   MAIN PROJECT MODEL
------------------------------------------ */

export interface Project {
  id?: string;
  propertyType: PropertyType;
  name: string;
  slug: string;
  location: string;

  coordinates?: ProjectCoordinates;

  status: ProjectStatus;
  configuration: string;

  price: string;
  description: string;

  bedrooms?: number | null;
  bathrooms?: number | null;
  
  amenities: string[];

  specifications: ProjectSpecification[];
  nearbyLocations?: NearbyLocation[]
  gallery: string[];
  

  /* Optional Video Support */

  video?: string;
  videoType?: ProjectVideoType;
  videos?: ProjectVideo[];

  /* Optional Highlights & Brochure */

  highlights?: string[];
  brochureUrl?: string | null;

  /* Optional Stats */

  plotSize?: string | null;
  totalUnits?: string | null;
  launchYear?: string | null;

  /* Optional Meta Fields */

  landArea?: string | null;
  rera?: string | null;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
