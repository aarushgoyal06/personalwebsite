import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post ? post.title : "Post Not Found",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const date = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="pt-24 pb-16 max-w-3xl mx-auto px-6">
      <Link
        href="/blog"
        className="text-sm text-blue-400 hover:text-blue-300 mb-6 inline-block"
      >
        &larr; Back to blog
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          {date && <time>{date}</time>}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose-invert prose-blue max-w-none
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-white
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-white
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-white
          [&_p]:text-slate-300 [&_p]:leading-relaxed [&_p]:mb-4
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1 [&_ul]:text-slate-300
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1 [&_ol]:text-slate-300
          [&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-300
          [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-blue-500/10 [&_code]:text-sm [&_code]:font-mono [&_code]:text-blue-200
          [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500/30 [&_blockquote]:pl-4 [&_blockquote]:my-6 [&_blockquote]:text-slate-400 [&_blockquote]:italic
          [&_strong]:text-white [&_strong]:font-semibold
          [&_img]:rounded-lg [&_img]:my-6 [&_img]:w-full"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
