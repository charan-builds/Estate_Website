"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PROJECT_STATUSES } from "@/lib/constants";
import { buildProjectMapEmbedUrl, isSlugUnique } from "@/lib/projects";
import { Project, ProjectSpecification } from "@/types/project";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type ProjectFormProps = {
  projectId?: string;
};

type FormState = {
  name: string;
  slug: string;
  location: string;
  status: Project["status"];
  configuration: string;
  price: string;
  description: string;
  rera: string;
  latitude: string;
  longitude: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  slug: "",
  location: "",
  status: "Ready to Move",
  configuration: "",
  price: "",
  description: "",
  rera: "",
  latitude: "",
  longitude: "",
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const isEdit = Boolean(projectId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<ProjectSpecification[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);

  const [amenityInput, setAmenityInput] = useState("");
  const [specLabel, setSpecLabel] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(isEdit);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => !loading && !uploading, [loading, uploading]);

  useEffect(() => {
    const editProjectId = projectId ?? "";
    if (!editProjectId) {
      setLoadingProject(false);
      return;
    }

    async function loadProject() {
      setLoadingProject(true);
      setError("");

      const snapshot = await getDoc(doc(db, "projects", editProjectId));

      if (!snapshot.exists()) {
        setError("Project not found.");
        setLoadingProject(false);
        return;
      }

      const data = snapshot.data() as Partial<Project> & {
        latitude?: number | null;
        longitude?: number | null;
      };

      setForm({
        name: data.name ?? "",
        slug: data.slug ?? "",
        location: data.location ?? "",
        status: data.status ?? "Ready to Move",
        configuration: data.configuration ?? "",
        price: data.price ?? "",
        description: data.description ?? "",
        rera: data.rera ?? "",
        latitude:
          data.coordinates?.lat !== undefined
            ? String(data.coordinates.lat)
            : data.latitude !== undefined && data.latitude !== null
            ? String(data.latitude)
            : "",
        longitude:
          data.coordinates?.lng !== undefined
            ? String(data.coordinates.lng)
            : data.longitude !== undefined && data.longitude !== null
            ? String(data.longitude)
            : "",
      });

      setAmenities(Array.isArray(data.amenities) ? data.amenities : []);
      setSpecifications(Array.isArray(data.specifications) ? data.specifications : []);
      setGallery(Array.isArray(data.gallery) ? data.gallery : []);
      setLoadingProject(false);
    }

    loadProject();
  }, [projectId]);

  function updateFormField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setForm((previous) => ({
      ...previous,
      name: value,
      slug: isEdit ? previous.slug : generateSlug(value),
    }));
  }

  function addAmenity() {
    const value = amenityInput.trim();
    if (!value) return;

    setAmenities((previous) => [...previous, value]);
    setAmenityInput("");
  }

  function addSpecification() {
    const label = specLabel.trim();
    const value = specValue.trim();

    if (!label || !value) return;

    setSpecifications((previous) => [...previous, { label, value }]);
    setSpecLabel("");
    setSpecValue("");
  }

  async function uploadImage(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed.");
    }

    const data = (await response.json()) as { secure_url?: string };
    if (!data.secure_url) {
      throw new Error("Image upload URL is missing.");
    }

    return data.secure_url;
  }

  async function handleGalleryChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;

    setUploading(true);
    setError("");

    try {
      const urls = await Promise.all(Array.from(event.target.files).map(uploadImage));
      setGallery((previous) => [...previous, ...urls]);
    } catch {
      setError("Failed to upload image(s). Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!form.location.trim()) {
      setError("Location is required.");
      setLoading(false);
      return;
    }

    if (amenities.length < 1) {
      setError("Add at least one amenity.");
      setLoading(false);
      return;
    }

    if (gallery.length < 1) {
      setError("Add at least one gallery image.");
      setLoading(false);
      return;
    }

    const normalizedSlug = form.slug.trim();

    if (!normalizedSlug) {
      setError("Slug is required.");
      setLoading(false);
      return;
    }

    const uniqueSlug = await isSlugUnique(normalizedSlug, projectId);
    if (!uniqueSlug) {
      setError("This slug is already in use. Choose a different slug.");
      setLoading(false);
      return;
    }

    const latitude = form.latitude.trim() === "" ? null : Number(form.latitude);
    const longitude = form.longitude.trim() === "" ? null : Number(form.longitude);

    if ((latitude !== null && Number.isNaN(latitude)) || (longitude !== null && Number.isNaN(longitude))) {
      setError("Latitude and longitude must be valid numbers.");
      setLoading(false);
      return;
    }

    if ((latitude === null) !== (longitude === null)) {
      setError("Please provide both latitude and longitude.");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: normalizedSlug,
      location: form.location.trim(),
      status: form.status,
      configuration: form.configuration.trim(),
      price: form.price.trim(),
      description: form.description.trim(),
      amenities,
      specifications,
      gallery,
      rera: form.rera.trim() || null,
      coordinates:
        latitude !== null && longitude !== null
          ? { lat: latitude, lng: longitude }
          : null,
      updatedAt: serverTimestamp(),
    };

    try {
      if (projectId) {
        await updateDoc(doc(db, "projects", projectId), payload);
        setMessage("Project updated successfully.");
      } else {
        await addDoc(collection(db, "projects"), {
          ...payload,
          createdAt: serverTimestamp(),
        });

        setForm(INITIAL_FORM);
        setAmenities([]);
        setSpecifications([]);
        setGallery([]);
        setMessage("Project created successfully.");
      }
    } catch {
      setError("Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const previewLatitude = Number(form.latitude);
  const previewLongitude = Number(form.longitude);
  const mapPreviewUrl = buildProjectMapEmbedUrl({
    id: projectId ?? "preview",
    name: form.name,
    slug: form.slug,
    location: form.location,
    status: form.status,
    configuration: form.configuration,
    price: form.price,
    description: form.description,
    amenities,
    specifications,
    gallery,
    coordinates:
      form.latitude.trim() &&
      form.longitude.trim() &&
      !Number.isNaN(previewLatitude) &&
      !Number.isNaN(previewLongitude)
        ? { lat: previewLatitude, lng: previewLongitude }
        : undefined,
  });

  if (loadingProject) {
    return <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-600">Loading project...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a3a52]">{isEdit ? "Edit Project" : "Add New Project"}</h1>
          <p className="mt-1 text-sm text-slate-600">Manage project details and publish updates to the website.</p>
        </div>

        {message ? <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <Section title="Basic Information">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project Name" required>
              <input
                value={form.name}
                onChange={handleNameChange}
                className={INPUT_CLASS}
                placeholder="Ekam Heights"
                required
              />
            </Field>

            <Field label="Slug" required>
              <input
                value={form.slug}
                onChange={(event) => updateFormField("slug", generateSlug(event.target.value))}
                className={INPUT_CLASS}
                placeholder="ekam-heights"
                required
              />
            </Field>

            <Field label="Location" required>
              <input
                value={form.location}
                onChange={(event) => updateFormField("location", event.target.value)}
                className={INPUT_CLASS}
                placeholder="Hyderabad"
                required
              />
            </Field>

            <Field label="Status" required>
              <select
                value={form.status}
                onChange={(event) => updateFormField("status", event.target.value as Project["status"])}
                className={INPUT_CLASS}
                required
              >
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Configuration" required>
              <input
                value={form.configuration}
                onChange={(event) => updateFormField("configuration", event.target.value)}
                className={INPUT_CLASS}
                placeholder="2 & 3 BHK"
                required
              />
            </Field>

            <Field label="Price" required>
              <input
                value={form.price}
                onChange={(event) => updateFormField("price", event.target.value)}
                className={INPUT_CLASS}
                placeholder="Starts at ₹75 Lakhs"
                required
              />
            </Field>

            <Field label="RERA Number">
              <input
                value={form.rera}
                onChange={(event) => updateFormField("rera", event.target.value)}
                className={INPUT_CLASS}
                placeholder="P02400000000"
              />
            </Field>
          </div>

          <Field label="Description" required>
            <textarea
              value={form.description}
              onChange={(event) => updateFormField("description", event.target.value)}
              className={`${INPUT_CLASS} min-h-28`}
              placeholder="Describe the project highlights"
              required
            />
          </Field>
        </Section>

        <Section title="Location Map Coordinates">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Latitude">
              <input
                value={form.latitude}
                onChange={(event) => updateFormField("latitude", event.target.value)}
                className={INPUT_CLASS}
                placeholder="17.3850"
              />
            </Field>

            <Field label="Longitude">
              <input
                value={form.longitude}
                onChange={(event) => updateFormField("longitude", event.target.value)}
                className={INPUT_CLASS}
                placeholder="78.4867"
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.location || "Hyderabad")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[#1a3a52] px-3 py-2 text-sm font-medium text-[#1a3a52] transition hover:bg-[#1a3a52] hover:text-white"
            >
              Open Google Maps Picker
            </a>
            <span className="text-xs text-slate-500">Copy lat/lng from Maps and paste above.</span>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <iframe
              src={mapPreviewUrl}
              title="Project location preview"
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Section>

        <Section title="Amenities">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={amenityInput}
              onChange={(event) => setAmenityInput(event.target.value)}
              className={INPUT_CLASS}
              placeholder="Clubhouse"
            />
            <button type="button" onClick={addAmenity} className={SECONDARY_BUTTON_CLASS}>
              Add Amenity
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <span
                key={`${amenity}-${index}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#1a3a52] px-3 py-1.5 text-sm font-medium text-white"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => setAmenities((previous) => previous.filter((_, itemIndex) => itemIndex !== index))}
                  className="rounded-full bg-white/20 px-1.5 text-xs hover:bg-white/35"
                >
                  X
                </button>
              </span>
            ))}
          </div>
        </Section>

        <Section title="Specifications">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={specLabel}
              onChange={(event) => setSpecLabel(event.target.value)}
              className={INPUT_CLASS}
              placeholder="Possession"
            />
            <input
              value={specValue}
              onChange={(event) => setSpecValue(event.target.value)}
              className={INPUT_CLASS}
              placeholder="Dec 2027"
            />
            <button type="button" onClick={addSpecification} className={SECONDARY_BUTTON_CLASS}>
              Add
            </button>
          </div>

          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            {specifications.map((item, index) => (
              <div key={`${item.label}-${item.value}-${index}`} className="grid grid-cols-[1fr_1fr_auto] border-b border-slate-100 px-3 py-2 text-sm last:border-b-0">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-slate-700">{item.value}</span>
                <button
                  type="button"
                  onClick={() => setSpecifications((previous) => previous.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-red-600 transition hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Gallery">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={handleGalleryChange}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#1a3a52] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#224865] disabled:opacity-60"
          />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((image, index) => (
              <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-md border border-slate-200">
                <ImageWithFallback
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="h-32 w-full cursor-zoom-in object-cover"
                  onClick={() => setPreviewImage(image)}
                />
                <button
                  type="button"
                  onClick={() => setGallery((previous) => previous.filter((_, itemIndex) => itemIndex !== index))}
                  className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white transition hover:bg-black"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Section>

        <button type="submit" disabled={!canSubmit} className={PRIMARY_BUTTON_CLASS}>
          {uploading ? "Uploading images..." : loading ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
        </button>
      </form>

      {previewImage ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-h-[90vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <ImageWithFallback
              src={previewImage}
              alt="Gallery preview"
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const INPUT_CLASS =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#1a3a52] focus:ring-2 focus:ring-[#1a3a52]/20";

const PRIMARY_BUTTON_CLASS =
  "rounded-md bg-[#1a3a52] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#224865] disabled:cursor-not-allowed disabled:opacity-60";

const SECONDARY_BUTTON_CLASS =
  "rounded-md border border-[#1a3a52] px-4 py-2 text-sm font-medium text-[#1a3a52] transition hover:bg-[#1a3a52] hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-base font-semibold text-[#1a3a52]">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
