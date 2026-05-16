import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostContent from "@/components/PostContent";
import { createClient } from "@/lib/supabase/server";
import { formatDate, absoluteUrl } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const supabase = await createClient();
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image, category")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post || error) notFound();

  // Fetch related posts (same category, exclude current)
  const { data: related } = await supabase
    .from("posts")
    .select("id, title, slug, cover_image, category, read_time, published_at")
    .eq("status", "published")
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            Back to all posts
          </Link>

          {/* Category */}
          <div className="mb-4">
            <Link
              href={`/?category=${encodeURIComponent(post.category)}`}
              className="text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400 hover:underline"
            >
              {post.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 border-l-4 border-accent-500 pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-500 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.published_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.read_time} min read
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
            <div className="overflow-hidden rounded-2xl aspect-video relative">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <PostContent content={post.content} />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={14} className="text-neutral-400" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related posts */}
        {related && related.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold mb-8 text-neutral-900 dark:text-white">
              More from{" "}
              <span className="text-accent-600 dark:text-accent-400">
                {post.category}
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group block space-y-2"
                >
                  {p.cover_image && (
                    <div className="overflow-hidden rounded-xl aspect-video bg-neutral-100 dark:bg-neutral-800">
                      <Image
                        src={p.cover_image}
                        alt={p.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
                    {p.category}
                  </p>
                  <h3 className="font-bold leading-snug group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {formatDate(p.published_at)} · {p.read_time} min read
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
