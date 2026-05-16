"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PenSquare,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, slug, status, category, read_time, published_at, created_at",
      )
      .order("created_at", { ascending: false });

    if (data) {
      setPosts(data);
      setStats({
        total: data.length,
        published: data.filter((p) => p.status === "published").length,
        drafts: data.filter((p) => p.status === "draft").length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeleting(post.id);

    const { error } = await supabase.from("posts").delete().eq("id", post.id);

    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setStats((s) => ({
        total: s.total - 1,
        published: post.status === "published" ? s.published - 1 : s.published,
        drafts: post.status === "draft" ? s.drafts - 1 : s.drafts,
      }));
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <PenSquare size={15} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Posts",
            value: stats.total,
            icon: FileText,
            color: "text-neutral-600 dark:text-neutral-400",
          },
          {
            label: "Published",
            value: stats.published,
            icon: CheckCircle2,
            color: "text-green-600 dark:text-green-400",
          },
          {
            label: "Drafts",
            value: stats.drafts,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5"
          >
            <div className={cn("mb-2", color)}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Posts table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="font-semibold text-neutral-900 dark:text-white">
            All Posts
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-neutral-500">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-neutral-600 dark:text-neutral-400">
              No posts yet.
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-accent-600 dark:text-accent-400 hover:underline"
            >
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                {/* Status indicator */}
                <div
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    post.status === "published"
                      ? "bg-green-500"
                      : "bg-amber-500",
                  )}
                />

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 dark:text-white truncate text-sm">
                    {post.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {post.category} ·{" "}
                    {post.status === "published"
                      ? `Published ${formatDate(post.published_at)}`
                      : `Draft · ${formatDate(post.created_at)}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {post.status === "published" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      title="View post"
                      className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <Eye size={15} />
                    </Link>
                  )}
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    title="Edit post"
                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post)}
                    disabled={deleting === post.id}
                    title="Delete post"
                    className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
