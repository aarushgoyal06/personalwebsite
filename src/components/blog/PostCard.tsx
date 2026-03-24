import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    slug: { current: string };
    publishedAt: string;
    excerpt?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    coverImage?: any;
    tags?: string[];
    author?: { name: string };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all overflow-hidden"
    >
      {post.coverImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={urlFor(post.coverImage).width(600).height(300).url()}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
          {date && <time>{date}</time>}
          {post.author?.name && (
            <>
              <span>&bull;</span>
              <span>{post.author.name}</span>
            </>
          )}
        </div>
        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-neutral-100">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}
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
      </div>
    </Link>
  );
}
