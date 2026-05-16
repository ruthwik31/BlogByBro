import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AUTHOR = process.env.NEXT_PUBLIC_AUTHOR_NAME || "The Author";
const BLOG_NAME = process.env.NEXT_PUBLIC_BLOG_NAME || "My Blog";

export const metadata = {
  title: "About",
  description: `Learn more about ${AUTHOR} and ${BLOG_NAME}`,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold mb-8 text-neutral-900 dark:text-white">
          About
        </h1>

        <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
          <p>
            Hi, I&apos;m <strong>{AUTHOR}</strong>. Welcome to{" "}
            <strong>{BLOG_NAME}</strong>.
          </p>
          <p>
            This is my corner of the internet where I share my thoughts, ideas,
            and whatever is on my mind. You&apos;ll find posts about technology,
            life experiences, and anything else I find worth writing about.
          </p>
          {/* <p>
            I believe in writing clearly and honestly. I hope you find something
            here that sparks a thought or makes your day a little better.
          </p>
          <p>
            Feel free to explore the posts and reach out if something resonates.
          </p> */}
        </div>

        {/* Update this section with your real info */}
        <div className="mt-12 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
            ✏️ <strong>Tip:</strong> Edit{" "}
            <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded">
              app/about/page.jsx
            </code>{" "}
            to update this page with your real bio.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
