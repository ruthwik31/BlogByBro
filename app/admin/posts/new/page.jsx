import PostForm from "@/components/PostForm";

export const metadata = { title: "New Post" };
export const dynamic = "force-dynamic";
export default function NewPostPage() {
  return <PostForm />;
}
