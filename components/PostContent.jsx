/**
 * Renders rich-text HTML stored in the database.
 * Wrapped in Tailwind Typography `prose` for beautiful reading.
 */
export default function PostContent({ content }) {
  if (!content) return null;

  return (
    <div
      className="prose prose-neutral dark:prose-invert prose-lg max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-a:text-accent-600 dark:prose-a:text-accent-400
        prose-blockquote:border-accent-500 prose-blockquote:not-italic
        prose-img:rounded-xl prose-img:shadow-md
        prose-code:text-accent-700 dark:prose-code:text-accent-300
        prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800
        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-[#1e1e2e] prose-pre:text-[#cdd6f4]"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
