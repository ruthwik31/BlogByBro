import Link from "next/link";

const BLOG_NAME = process.env.NEXT_PUBLIC_BLOG_NAME || "My Blog";
const TAGLINE =
  process.env.NEXT_PUBLIC_BLOG_TAGLINE || "Thoughts, stories and ideas";
const AUTHOR = process.env.NEXT_PUBLIC_AUTHOR_NAME || "The Author";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-base font-bold text-neutral-900 dark:text-white hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              {BLOG_NAME}
            </Link>
            <p className="text-sm text-neutral-500 mt-0.5">{TAGLINE}</p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              href="/"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-8">
          © {year} {AUTHOR}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
