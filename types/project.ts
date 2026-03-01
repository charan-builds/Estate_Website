import { Timestamp } from "firebase/firestore";

export type ProjectStatus = "Ready to Move" | "Under Construction" | "New Launch";

export interface ProjectSpecification {
  label: string;
  value: string;
}

export interface ProjectCoordinates {
  lat: number;
  lng: number;
}

export interface Project {
  id?: string;
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
  landArea?: string | null;
  rera?: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
