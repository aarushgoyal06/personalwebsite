import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/client";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/lib/queries";
import PortableTextRenderer from "@/components/blog/PortableTextRenderer";

export const revalidate = 60;

interface PostData {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any;
  tags?: string[];
  author?: { name: string; bio?: string };
}

export async function generateStaticParams() {
  const slugs = (await sanityFetch<string[]>(postSlugsQuery)) ?? [];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<PostData>(postBySlugQuery, { slug });
  return {
    title: post ? `${post.title} | Aarush Goyal` : "Post Not Found",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<PostData>(postBySlugQuery, { slug });

  if (!post) notFound();

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="pt-24 pb-16 max-w-3xl mx-auto px-6">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          {date && <time>{date}</time>}
          {post.author?.name && (
            <>
              <span>&bull;</span>
              <span>{post.author.name}</span>
            </>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-md bg-white/5 text-neutral-400 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose-invert">
        {post.body && <PortableTextRenderer value={post.body} />}
      </div>
    </article>
  );
}
