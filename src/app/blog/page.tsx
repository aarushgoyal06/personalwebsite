import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import PostCard from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Blog | Aarush Goyal",
  description: "Thoughts, stories, and reflections.",
};

export const revalidate = 60;

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any;
  tags?: string[];
  author?: { name: string };
}

export default async function BlogPage() {
  const posts = (await sanityFetch<Post[]>(postsQuery)) ?? [];

  return (
    <div className="pt-24 pb-16 max-w-4xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <p className="text-neutral-400 mb-12">
        Thoughts, stories, and reflections on tech, life, and everything in
        between.
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg">No posts yet.</p>
          <p className="text-neutral-600 text-sm mt-2">
            Check back soon — or head to{" "}
            <a href="/studio" className="text-neutral-400 underline">
              the studio
            </a>{" "}
            to create your first post.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
