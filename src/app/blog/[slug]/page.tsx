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
    <article className="mx-auto max-w-3xl px-6 pb-16 pt-24">
      <Link
        href="/blog"
        className="text-sm text-[var(--accent)] mb-6 inline-flex items-center rounded-lg border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--background)_90%,var(--accent)_10%)] px-3 py-2 transition-colors hover:bg-[color-mix(in_srgb,var(--background)_82%,var(--accent)_18%)] hover:text-[color-mix(in_srgb,var(--accent)_95%,white)]"
      >
        &larr; Back to blog
      </Link>

      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] bg-[color-mix(in_srgb,var(--background)_90%,var(--accent)_10%)] p-6 shadow-[0_1px_0_rgba(0,0,0,0.4)] md:p-10">
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
                  className="text-xs px-2 py-1 rounded-md border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--background)_85%,var(--accent)_15%)] text-[color-mix(in_srgb,var(--accent)_82%,#e2e8f0)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose-invert max-w-none
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-white
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-white
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-white
          [&_p]:text-slate-300 [&_p]:leading-relaxed [&_p]:mb-4
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1 [&_ul]:text-slate-300
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1 [&_ol]:text-slate-300
          [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[color-mix(in_srgb,var(--accent)_88%,white)]
          [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:border [&_code]:border-[color-mix(in_srgb,var(--accent)_22%,transparent)] [&_code]:bg-[color-mix(in_srgb,var(--background)_82%,var(--accent)_18%)] [&_code]:text-[color-mix(in_srgb,var(--accent)_85%,#e2e8f0)]
          [&_blockquote]:border-l-2 [&_blockquote]:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] [&_blockquote]:pl-4 [&_blockquote]:my-6 [&_blockquote]:text-slate-400 [&_blockquote]:italic
          [&_strong]:text-white [&_strong]:font-semibold
          [&_img]:rounded-lg [&_img]:my-6 [&_img]:w-full"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </article>
  );
}
