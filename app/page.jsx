import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage({ searchParams }) {
  const supabase = await createClient();
  const { category: categoryParam } = await searchParams;
  const category = categoryParam || null;

  // Fetch posts
  let query = supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, cover_image, category, tags, read_time, published_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: posts, error } = await query;

  // Fetch available categories
  const { data: categoryRows } = await supabase
    .from("posts")
    .select("category")
    .eq("status", "published");

  const categories = [
    ...new Set((categoryRows || []).map((r) => r.category)),
  ].filter(Boolean);

  const featured = posts?.[0] ?? null;
  const rest = posts?.slice(1) ?? [];

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero / Featured post */}
        {featured && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="mb-4 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-accent-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
                Featured
              </span>
            </div>
            <PostCard post={featured} featured />
          </section>
        )}

        {/* Category filter */}
        {categories.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !category
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Posts grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          {rest.length > 0 ? (
            <>
              {featured && (
                <div className="my-8 border-t border-neutral-200 dark:border-neutral-800" />
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            !featured && (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">📝</p>
                <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
                  No posts yet
                </h2>
                <p className="text-neutral-500 mt-2 mb-6">
                  The blog is empty. Start writing!
                </p>
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium"
                >
                  Write your first post
                </Link>
              </div>
            )
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
