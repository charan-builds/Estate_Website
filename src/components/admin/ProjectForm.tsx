"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type ProjectFormProps = {
  projectId?: string; // ✅ If provided → Edit mode
};

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const isEdit = Boolean(projectId);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔹 Core fields
  const [form, setForm] = useState({
    name: "",
    slug: "",
    location: "",
    status: "Ready to Move",
    configuration: "",
    price: "",
    description: "",
  });

  // 🔹 Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");

  // 🔹 Specifications
  const [specifications, setSpecifications] = useState<
    { label: string; value: string }[]
  >([]);
  const [specLabel, setSpecLabel] = useState("");
  const [specValue, setSpecValue] = useState("");

  // 🔹 Gallery
  const [gallery, setGallery] = useState<string[]>([]);

  // ===============================
  // 🔹 Load project (EDIT MODE)
  // ===============================
 useEffect(() => {
  if (!projectId) return;

  const id =
    typeof projectId === "string"
      ? projectId
      : Array.isArray(projectId)
      ? projectId[0]
      : "";

  if (!id) return;

  async function loadProject() {
    const ref = doc(db, "projects", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("Project not found");
      return;
    }

    const data = snap.data();

    setForm({
      name: data.name ?? "",
      slug: data.slug ?? "",
      location: data.location ?? "",
      status: data.status ?? "Ready to Move",
      configuration: data.configuration ?? "",
      price: data.price ?? "",
      description: data.description ?? "",
    });

    setAmenities(data.amenities ?? []);
    setSpecifications(data.specifications ?? []);
    setGallery(data.gallery ?? []);
  }

  loadProject();
}, [projectId]);
  // ===============================
  // 🔹 Handlers
  // ===============================
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url as string;
  }

  // ===============================
  // 🔹 Submit
  // ===============================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (amenities.length === 0) {
      alert("Add at least one amenity");
      setLoading(false);
      return;
    }

    if (gallery.length === 0) {
      alert("Upload at least one image");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      amenities,
      specifications,
      gallery,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "projects", projectId!), payload);
      } else {
        await addDoc(collection(db, "projects"), {
          ...payload,
          createdAt: serverTimestamp(),
        });

        // ✅ Reset only in CREATE mode
        setForm({
          name: "",
          slug: "",
          location: "",
          status: "Ready to Move",
          configuration: "",
          price: "",
          description: "",
        });
        setAmenities([]);
        setSpecifications([]);
        setGallery([]);
        fileInputRef.current && (fileInputRef.current.value = "");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // 🔹 UI
  // ===============================
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-semibold">
        {isEdit ? "Edit Project" : "Add New Project"}
      </h2>

      {success && (
        <div className="p-3 bg-green-100 text-green-700">
          Project saved successfully
        </div>
      )}

      {/* BASIC INFO */}
      {["name", "slug", "location", "configuration", "price"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.toUpperCase()}
          value={(form as any)[field]}
          onChange={handleChange}
          className="w-full border p-3"
          required
        />
      ))}

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-3"
      >
        <option>Ready to Move</option>
        <option>Under Construction</option>
        <option>New Launch</option>
      </select>

      <textarea
        name="description"
        placeholder="Project Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-3 h-32"
      />

      {/* AMENITIES */}
      <Section title="Amenities">
        <AddItem
          input={amenityInput}
          setInput={setAmenityInput}
          onAdd={() =>
            setAmenities([...amenities, amenityInput.trim()])
          }
        />
        <ItemList items={amenities} setItems={setAmenities} />
      </Section>

      {/* SPECIFICATIONS */}
      <Section title="Specifications">
        <div className="flex gap-2">
          <input
            placeholder="Label"
            value={specLabel}
            onChange={(e) => setSpecLabel(e.target.value)}
            className="flex-1 border p-2"
          />
          <input
            placeholder="Value"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            className="flex-1 border p-2"
          />
          <button
            type="button"
            onClick={() => {
              setSpecifications([...specifications, { label: specLabel, value: specValue }]);
              setSpecLabel("");
              setSpecValue("");
            }}
            className="bg-[#1a3a52] text-white px-4"
          >
            Add
          </button>
        </div>
      </Section>

      {/* GALLERY */}
      <Section title="Gallery">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          disabled={uploading}
          onChange={async (e) => {
            if (!e.target.files) return;
            setUploading(true);
            for (const file of Array.from(e.target.files)) {
              const url = await uploadImage(file);
              setGallery((g) => [...g, url]);
            }
            setUploading(false);
          }}
        />

        <div className="grid grid-cols-3 gap-3 mt-3">
          {gallery.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="h-24 w-full object-cover border" />
              <button
                type="button"
                onClick={() => setGallery(gallery.filter((_, x) => x !== i))}
                className="absolute top-1 right-1 bg-black text-white text-xs px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </Section>

      <button
        disabled={loading}
        className="bg-[#1a3a52] text-white px-6 py-3"
      >
        {loading ? "Saving..." : isEdit ? "Update Project" : "Save Project"}
      </button>
    </form>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function Section({ title, children }: any) {
  return (
    <div className="border rounded p-4 bg-gray-50 space-y-3">
      <h3 className="font-medium">{title}</h3>
      {children}
    </div>
  );
}

function AddItem({ input, setInput, onAdd }: any) {
  return (
    <div className="flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border p-2"
      />
      <button
        type="button"
        onClick={() => input.trim() && onAdd()}
        className="bg-[#1a3a52] text-white px-4"
      >
        Add
      </button>
    </div>
  );
}

function ItemList({ items, setItems }: any) {
  return (
    <ul className="space-y-2">
      {items.map((item: string, i: number) => (
        <li key={i} className="flex justify-between border p-2 bg-white">
          {item}
          <button
            type="button"
            onClick={() => setItems(items.filter((_: any, x: number) => x !== i))}
            className="text-red-500"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}