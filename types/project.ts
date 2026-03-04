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

  amenities: string[];

  specifications: ProjectSpecification[];

  gallery: string[];

  /* Optional Video Support */

  video?: string;
  videoType?: ProjectVideoType;

  /* Optional Meta Fields */

  landArea?: string | null;
  rera?: string | null;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}