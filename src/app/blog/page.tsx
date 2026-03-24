import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Aarush Goyal",
  description: "Thoughts, stories, and reflections.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-24 pb-16 max-w-4xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <p className="text-slate-400 mb-12">
        Thoughts, stories, and reflections on tech, life, and everything in
        between.
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">No posts yet.</p>
          <p className="text-slate-600 text-sm mt-2">
            Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const date = post.date
              ? new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : null;

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-6 rounded-xl border border-blue-500/10 bg-blue-500/[0.02] hover:bg-blue-500/[0.06] hover:border-blue-500/20 transition-all"
              >
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  {date && <time>{date}</time>}
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>&bull;</span>
                      <span>{post.tags.join(", ")}</span>
                    </>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-300">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
