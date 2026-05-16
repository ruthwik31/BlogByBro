import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/PostForm";

export const metadata = { title: "Edit Post" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post || error) notFound();

  return <PostForm initialData={post} />;
}
