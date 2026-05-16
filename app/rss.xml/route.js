import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

const BLOG_NAME = process.env.NEXT_PUBLIC_BLOG_NAME || "My Blog";
const DESCRIPTION =
  process.env.NEXT_PUBLIC_BLOG_DESCRIPTION || "A personal blog";

export async function GET() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, excerpt, published_at, category")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BLOG_NAME)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml"/>
    ${(posts || [])
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl(`/blog/${post.slug}`)}</link>
      <guid>${absoluteUrl(`/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
