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
import {
  PROJECT_MAIN_CATEGORY_OPTIONS,
  PROJECT_STATUSES,
  PROJECT_SUBCATEGORY_OPTIONS,
} from "@/lib/constants";
import { buildProjectMapEmbedUrl, isSlugUnique } from "@/lib/projects";
import { Project, ProjectSpecification, ProjectVideo } from "@/types/project";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type ProjectFormProps = {
  projectId?: string;
};

type FormState = {
  name: string;
  slug: string;
  location: string;
  propertyType: Project["propertyType"];
  mainCategory: Project["mainCategory"] | "";
  subCategory: Project["subCategory"] | "";
  hotDeal: boolean;
  status: Project["status"];
  configuration: string;
  price: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  rera: string;
  latitude: string;
  longitude: string;
  video: string;
  videoType: "youtube" | "upload" | "";
  brochureUrl: string;
  plotSize: string;
  totalUnits: string;
  launchYear: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  slug: "",
  location: "",
  propertyType: "Open Plots",
  mainCategory: "",
  subCategory: "",
  hotDeal: false,
  status: "Ready to Move",
  configuration: "",
  price: "",
  description: "",
  bedrooms: "",
  bathrooms: "",
  rera: "",
  latitude: "",
  longitude: "",
  video: "",
  videoType: "",
  brochureUrl: "",
  plotSize: "",
  totalUnits: "",
  launchYear: "",
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isProjectVideo(value: unknown): value is ProjectVideo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { url?: unknown; type?: unknown };
  return (
    typeof candidate.url === "string" &&
    candidate.url.trim().length > 0 &&
    (candidate.type === "youtube" || candidate.type === "upload")
  );
}

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const isEdit = Boolean(projectId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const brochureInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<ProjectSpecification[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [nearbyLocations, setNearbyLocations] = useState<{ name: string; distance: string }[]>([]);

  const [amenityInput, setAmenityInput] = useState("");
  const [specLabel, setSpecLabel] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [videoTypeInput, setVideoTypeInput] = useState<"youtube" | "upload" | "">("");
  const [highlightInput, setHighlightInput] = useState("");
  const [nearbyName, setNearbyName] = useState("");
  const [nearbyDistance, setNearbyDistance] = useState("");

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(isEdit);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => !loading && !uploading && !brochureUploading,
    [loading, uploading, brochureUploading]
  );

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

      const normalizedVideos = Array.isArray(data.videos)
        ? data.videos.filter(isProjectVideo)
        : [];

      const legacyVideo: ProjectVideo[] =
        normalizedVideos.length === 0 &&
        typeof data.video === "string" &&
        data.video.trim().length > 0
          ? [
              {
                url: data.video,
                type: data.videoType === "upload" ? "upload" : "youtube",
              },
            ]
          : [];

      setForm({
        name: data.name ?? "",
        slug: data.slug ?? "",
        location: data.location ?? "",
        propertyType: data.propertyType ?? "Open Plots",
        mainCategory: data.mainCategory ?? "",
        subCategory: data.subCategory ?? "",
        hotDeal: Boolean(data.hotDeal),
        status: data.status ?? "Ready to Move",
        configuration: data.configuration ?? "",
        price: data.price ?? "",
        description: data.description ?? "",
        bedrooms: data.bedrooms ? String(data.bedrooms) : "",
        bathrooms: data.bathrooms ? String(data.bathrooms) : "",
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
        video: data.video ?? "",
        videoType: data.videoType ?? "",
        brochureUrl: data.brochureUrl ?? "",
        plotSize: data.plotSize ?? "",
        totalUnits: data.totalUnits ?? "",
        launchYear: data.launchYear ?? "",
      });

      setAmenities(Array.isArray(data.amenities) ? data.amenities : []);
      setSpecifications(Array.isArray(data.specifications) ? data.specifications : []);
      setGallery(Array.isArray(data.gallery) ? data.gallery : []);
      setVideos(normalizedVideos.length > 0 ? normalizedVideos : legacyVideo);
      setHighlights(Array.isArray(data.highlights) ? data.highlights.filter((item) => typeof item === "string" && item.trim().length > 0) : []);
      setNearbyLocations(Array.isArray(data.nearbyLocations) ? data.nearbyLocations : []);
      setLoadingProject(false);
    }

    loadProject();
  }, [projectId]);

  function updateFormField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  const subCategoryOptions = useMemo(() => {
    return form.mainCategory
      ? PROJECT_SUBCATEGORY_OPTIONS[form.mainCategory]
      : [];
  }, [form.mainCategory]);

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
    if (!value) {
      setError("Amenity cannot be empty.");
      return;
    }

    setAmenities((previous) => [...previous, value]);
    setAmenityInput("");
    setError("");
  }

  function addSpecification() {
    const label = specLabel.trim();
    const value = specValue.trim();

    if (!label || !value) {
      setError("Specification label and value are required.");
      return;
    }

    setSpecifications((previous) => [...previous, { label, value }]);
    setSpecLabel("");
    setSpecValue("");
    setError("");
  }

  function addVideo() {
    const url = videoUrlInput.trim();

    if (!url) {
      setError("Video URL cannot be empty.");
      return;
    }

    if (!videoTypeInput) {
      setError("Select a video type before adding.");
      return;
    }

    if (videos.length >= 5) {
      setError("You can add up to 5 videos.");
      return;
    }

    setVideos((previous) => [...previous, { url, type: videoTypeInput }]);
    setVideoUrlInput("");
    setVideoTypeInput("");
    setError("");
  }

  function addHighlight() {
    const value = highlightInput.trim();

    if (!value) {
      setError("Highlight cannot be empty.");
      return;
    }

    setHighlights((previous) => [...previous, value]);
    setHighlightInput("");
    setError("");
  }

  function addNearbyLocation() {
    const name = nearbyName.trim();
    const distance = nearbyDistance.trim();

    if (!name || !distance) {
      setError("Nearby location name and distance are required.");
      return;
    }

    setNearbyLocations((previous) => [...previous, { name, distance }]);
    setNearbyName("");
    setNearbyDistance("");
    setError("");
  }

  async function uploadFile(file: File, resourceType: "image" | "raw") {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed.");
    }

    const data = (await response.json()) as { secure_url?: string };
    if (!data.secure_url) {
      throw new Error("Uploaded file URL is missing.");
    }

    return data.secure_url;
  }

  async function handleGalleryChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;

    setUploading(true);
    setError("");

    try {
      const urls = await Promise.all(Array.from(event.target.files).map((file) => uploadFile(file, "image")));
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

  async function handleBrochureChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Brochure must be a PDF file.");
      if (brochureInputRef.current) {
        brochureInputRef.current.value = "";
      }
      return;
    }

    setBrochureUploading(true);
    setError("");

    try {
      const url = await uploadFile(file, "raw");
      updateFormField("brochureUrl", url);
    } catch {
      setError("Failed to upload brochure. Please try again.");
    } finally {
      setBrochureUploading(false);
      if (brochureInputRef.current) {
        brochureInputRef.current.value = "";
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

    const normalizedVideos = videos
      .map((item) => ({
        url: item.url.trim(),
        type: item.type,
      }))
      .filter((item) => item.url.length > 0);

    const primaryVideo = normalizedVideos[0];

    const payload = {
      name: form.name.trim(),
      slug: normalizedSlug,
      location: form.location.trim(),
      propertyType: form.propertyType,
      mainCategory: form.mainCategory || null,
      subCategory: form.subCategory || null,
      hotDeal: form.hotDeal,
      status: form.status,
      configuration: form.configuration.trim(),
      price: form.price.trim(),
      description: form.description.trim(),
      bedrooms: form.bedrooms.trim() ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms.trim() ? Number(form.bathrooms) : null,
      amenities,
      specifications,
      gallery,
      nearbyLocations,
      videos: normalizedVideos,
      video: primaryVideo?.url ?? null,
      videoType: primaryVideo?.type ?? null,
      highlights: highlights.map((item) => item.trim()).filter((item) => item.length > 0),
      brochureUrl: form.brochureUrl.trim() || null,
      plotSize: form.plotSize.trim() || null,
      totalUnits: form.totalUnits.trim() || null,
      launchYear: form.launchYear.trim() || null,
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
        setVideos([]);
        setHighlights([]);
        setNearbyLocations([]);
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
    propertyType: form.propertyType,
    mainCategory: form.mainCategory || null,
    subCategory: form.subCategory || null,
    hotDeal: form.hotDeal,
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
                placeholder="Ekam Green Valley"
                required
              />
            </Field>

            <Field label="Slug" required>
              <input
                value={form.slug}
                onChange={(event) => updateFormField("slug", generateSlug(event.target.value))}
                className={INPUT_CLASS}
                placeholder="ekam-green-valley"
                required
              />
            </Field>

            <Field label="Location" required>
              <input
                value={form.location}
                onChange={(event) => updateFormField("location", event.target.value)}
                className={INPUT_CLASS}
                placeholder="Sangareddy, Hyderabad"
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
                placeholder="200-400 Sq Yards"
                required
              />
            </Field>

            <Field label="Bedrooms">
              <input
                type="number"
                value={form.bedrooms}
                onChange={(event) => updateFormField("bedrooms", event.target.value)}
                className={INPUT_CLASS}
                placeholder="2"
                min="0"
              />
            </Field>

            <Field label="Bathrooms">
              <input
                type="number"
                value={form.bathrooms}
                onChange={(event) => updateFormField("bathrooms", event.target.value)}
                className={INPUT_CLASS}
                placeholder="2"
                min="0"
              />
            </Field>

            <Field label="Property Type" required>
              <select
                value={form.propertyType}
                onChange={(event) => updateFormField("propertyType", event.target.value as Project["propertyType"])}
                className={INPUT_CLASS}
                required
              >
                <option value="Open Plots">Open Plots</option>
                <option value="Villas">Villas</option>
                <option value="Apartments">Apartments</option>
                <option value="Farm Plots">Farm Plots</option>
                <option value="Highway Plots">Highway Plots</option>
              </select>
            </Field>

            <Field label="Main Category">
              <select
                value={form.mainCategory || ""} 
                onChange={(event) => {
                  const nextMainCategory = event.target.value as FormState["mainCategory"];
                  setForm((previous) => ({
                    ...previous,
                    mainCategory: nextMainCategory,
                    subCategory: "",
                  }));
                }}
                className={INPUT_CLASS}
              >
                <option value="">Select main category</option>
                {PROJECT_MAIN_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sub Category">
              <select
                value={form.subCategory || ""
                }
                onChange={(event) => updateFormField("subCategory", event.target.value as FormState["subCategory"])}
                className={INPUT_CLASS}
                disabled={!form.mainCategory}
              >
                <option value="">
                  {form.mainCategory ? "Select sub category" : "Choose main category first"}
                </option>
                {subCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Hot Deal">
              <label className="flex items-center gap-3 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.hotDeal}
                  onChange={(event) => updateFormField("hotDeal", event.target.checked)}
                />
                Highlight this project as a Hot Deal
              </label>
            </Field>

            <Field label="Price" required>
              <input
                value={form.price}
                onChange={(event) => updateFormField("price", event.target.value)}
                className={INPUT_CLASS}
                placeholder="Starts at Rs 24 Lakhs"
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
              placeholder="Premium gated plotted development near Mumbai Highway"
              required
            />
          </Field>
        </Section>

        <Section title="Project Stats (Optional)">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Plot Size">
              <input
                value={form.plotSize}
                onChange={(event) => updateFormField("plotSize", event.target.value)}
                className={INPUT_CLASS}
                placeholder="200-400 Sq Yards"
              />
            </Field>

            <Field label="Total Units">
              <input
                value={form.totalUnits}
                onChange={(event) => updateFormField("totalUnits", event.target.value)}
                className={INPUT_CLASS}
                placeholder="180 Plots"
              />
            </Field>

            <Field label="Launch Year">
              <input
                value={form.launchYear}
                onChange={(event) => updateFormField("launchYear", event.target.value)}
                className={INPUT_CLASS}
                placeholder="2024"
              />
            </Field>
          </div>
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

        <Section title="Project Highlights">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={highlightInput}
              onChange={(event) => setHighlightInput(event.target.value)}
              className={INPUT_CLASS}
              placeholder="HMDA Approved Layout"
            />
            <button type="button" onClick={addHighlight} className={SECONDARY_BUTTON_CLASS}>
              Add Highlight
            </button>
          </div>

          <div className="space-y-2">
            {highlights.map((highlight, index) => (
              <div key={`${highlight}-${index}`} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
                <span className="text-sm text-slate-700">{highlight}</span>
                <button
                  type="button"
                  onClick={() => setHighlights((previous) => previous.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-red-600 transition hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Specifications">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={specLabel}
              onChange={(event) => setSpecLabel(event.target.value)}
              className={INPUT_CLASS}
              placeholder="Road Width"
            />
            <input
              value={specValue}
              onChange={(event) => setSpecValue(event.target.value)}
              className={INPUT_CLASS}
              placeholder="40 Ft"
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

        <Section title="Nearby Locations">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={nearbyName}
              onChange={(event) => setNearbyName(event.target.value)}
              placeholder="Woxsen University"
              className={INPUT_CLASS}
            />

            <input
              value={nearbyDistance}
              onChange={(event) => setNearbyDistance(event.target.value)}
              placeholder="10 mins"
              className={INPUT_CLASS}
            />

            <button
              type="button"
              onClick={addNearbyLocation}
              className={SECONDARY_BUTTON_CLASS}
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {nearbyLocations.map((place, index) => (
              <div
                key={`${place.name}-${place.distance}-${index}`}
                className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2"
              >
                <span className="text-sm text-slate-700">
                  {place.name} - {place.distance}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setNearbyLocations((previous) =>
                      previous.filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
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

        <Section title="Project Videos">
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_auto]">
            <input
              value={videoUrlInput}
              onChange={(event) => setVideoUrlInput(event.target.value)}
              className={INPUT_CLASS}
              placeholder="https://youtube.com/embed/abc"
            />

            <select
              value={videoTypeInput}
              onChange={(event) => setVideoTypeInput(event.target.value as "youtube" | "upload" | "")}
              className={INPUT_CLASS}
            >
              <option value="">Select Type</option>
              <option value="youtube">YouTube</option>
              <option value="upload">Uploaded Video</option>
            </select>

            <button type="button" onClick={addVideo} className={SECONDARY_BUTTON_CLASS}>
              Add Video
            </button>
          </div>

          <p className="text-xs text-slate-500">Add up to 5 videos. Use embed URL for YouTube videos.</p>

          <div className="space-y-2">
            {videos.map((item, index) => (
              <div key={`${item.url}-${index}`} className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-slate-500">{item.type}</p>
                  <p className="break-all text-sm text-slate-700">{item.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVideos((previous) => previous.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-sm text-red-600 transition hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Brochure (Optional)">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Upload Brochure PDF">
              <input
                ref={brochureInputRef}
                type="file"
                accept="application/pdf"
                disabled={brochureUploading}
                onChange={handleBrochureChange}
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#1a3a52] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#224865] disabled:opacity-60"
              />
            </Field>

            <Field label="Brochure URL">
              <input
                value={form.brochureUrl}
                onChange={(event) => updateFormField("brochureUrl", event.target.value)}
                className={INPUT_CLASS}
                placeholder="https://cdn.site.com/project-brochure.pdf"
              />
            </Field>
          </div>
          {brochureUploading ? <p className="text-sm text-slate-600">Uploading brochure...</p> : null}
        </Section>

        <button type="submit" disabled={!canSubmit} className={PRIMARY_BUTTON_CLASS}>
          {uploading || brochureUploading
            ? "Uploading files..."
            : loading
            ? "Saving..."
            : isEdit
            ? "Update Project"
            : "Create Project"}
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
