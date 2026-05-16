import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";

export default function PostCard({ post, featured = false }) {
  const href = `/blog/${post.slug}`;

  if (featured) {
    return (
      <article className="group grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        {/* Cover image */}
        <Link
          href={href}
          className="block overflow-hidden rounded-2xl aspect-video bg-neutral-100 dark:bg-neutral-800"
        >
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {getCategoryEmoji(post.category)}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="space-y-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
            {post.category}
          </span>
          <Link href={href}>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-neutral-900 dark:text-white hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
              {post.title}
            </h2>
          </Link>
          {post.excerpt && (
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {truncate(post.excerpt, 200)}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(post.published_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.read_time} min read
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      {/* Cover image */}
      <Link
        href={href}
        className="block overflow-hidden rounded-xl aspect-video bg-neutral-100 dark:bg-neutral-800 mb-4"
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            width={600}
            height={338}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {getCategoryEmoji(post.category)}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
          {post.category}
        </span>
        <Link href={href}>
          <h3 className="font-bold text-lg leading-snug text-neutral-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500 pt-1">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.read_time} min read
          </span>
        </div>
      </div>
    </article>
  );
}

function getCategoryEmoji(category) {
  const map = {
    Technology: "💻",
    Tech: "💻",
    Life: "🌿",
    Lifestyle: "🌿",
    Travel: "✈️",
    Food: "🍜",
    Health: "🏃",
    Business: "💼",
    Finance: "💰",
    Design: "🎨",
    Music: "🎵",
    Sports: "⚽",
    Science: "🔬",
    General: "📝",
  };
  return map[category] || "📝";
}
