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
        </div>
      </main>
      <Footer />
    </>
  );
}
