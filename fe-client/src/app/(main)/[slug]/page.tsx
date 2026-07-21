import { notFound } from "next/navigation";
import BlogDetailScreen from "@/screens/blogDetail";
import { getPostBySlug } from "@/screens/blogDetail/constants";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };

  return {
    title: `${post.title} | Tiệm Len Nhà Kiều`,
    description: post.excerpt,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailScreen slug={slug} />;
}
