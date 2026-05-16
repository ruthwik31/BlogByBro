"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Save, Eye, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { generateSlug, estimateReadTime } from "@/lib/utils";
import toast from "react-hot-toast";

// Dynamically import Editor to avoid SSR issues with TipTap
const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl h-64 flex items-center justify-center text-neutral-400">
      Loading editor…
    </div>
  ),
});

const CATEGORIES = [
  "General",
  "Technology",
  "Life",
  "Travel",
  "Food",
  "Health",
  "Business",
  "Finance",
  "Design",
  "Science",
  "Music",
  "Sports",
  "Opinion",
];

export default function PostForm({ initialData = null }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    cover_image: initialData?.cover_image || "",
    category: initialData?.category || "General",
    tags: initialData?.tags?.join(", ") || "",
    status: initialData?.status || "draft",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(
    initialData?.cover_image || "",
  );

  const updateField = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    updateField("title", title);
    if (!isEdit || !form.slug) {
      updateField("slug", generateSlug(title));
    }
  };

  const handleContentChange = useCallback((html) => {
    updateField("content", html);
  }, []);

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `covers/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error("Image upload failed: " + error.message);
    } else {
      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(path);
      updateField("cover_image", urlData.publicUrl);
      setCoverPreview(urlData.publicUrl);
      toast.success("Cover uploaded!");
    }
    setUploading(false);
  };

  const handleEditorImageUpload = async (file) => {
    const ext = file.name.split(".").pop();
    const path = `inline/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("blog-images")
      .upload(path, file, { upsert: true });
    if (error) {
      toast.error("Image upload failed");
      return null;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (publishStatus) => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setSaving(true);
    const slug = generateSlug(form.slug);
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const readTime = estimateReadTime(form.content);
    const status = publishStatus ?? form.status;
    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim() || null,
      content: form.content || null,
      cover_image: form.cover_image || null,
      category: form.category,
      tags,
      status,
      read_time: readTime,
      published_at:
        status === "published"
          ? initialData?.published_at || new Date().toISOString()
          : null,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("posts").insert(payload));
    }

    if (error) {
      toast.error(error.message || "Failed to save");
      setSaving(false);
      return;
    }

    toast.success(status === "published" ? "Published!" : "Saved as draft");
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Save draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Eye size={14} />
            )}
            Publish
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Your amazing post title…"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500 text-lg font-semibold"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Slug
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
              <span className="text-xs text-neutral-400">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className="flex-1 bg-transparent text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Excerpt{" "}
              <span className="text-neutral-400 font-normal">
                (optional — shown in post cards)
              </span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              rows={3}
              placeholder="A short summary of your post…"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm resize-none"
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Content
            </label>
            <Editor
              content={form.content}
              onChange={handleContentChange}
              onImageUpload={handleEditorImageUpload}
            />
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Status
            </h3>
            <div className="flex gap-2">
              {["draft", "published"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateField("status", s)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                    form.status === s
                      ? s === "published"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Cover Image
            </h3>

            {coverPreview ? (
              <div className="relative group rounded-xl overflow-hidden aspect-video mb-3">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => {
                    updateField("cover_image", "");
                    setCoverPreview("");
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ) : null}

            <label
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                uploading
                  ? "border-accent-300 bg-accent-50 dark:bg-accent-900/10"
                  : "border-neutral-200 dark:border-neutral-700 hover:border-accent-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              {uploading ? (
                <Loader2 size={20} className="animate-spin text-accent-500" />
              ) : (
                <Upload size={18} className="text-neutral-400" />
              )}
              <span className="text-xs text-neutral-500">
                {uploading
                  ? "Uploading…"
                  : coverPreview
                    ? "Replace image"
                    : "Upload cover image"}
              </span>
            </label>

            <div className="mt-3">
              <input
                type="url"
                value={form.cover_image}
                onChange={(e) => {
                  updateField("cover_image", e.target.value);
                  setCoverPreview(e.target.value);
                }}
                placeholder="Or paste an image URL…"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Category
            </h3>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
              Tags
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              Comma separated, e.g. react, nextjs, web
            </p>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
