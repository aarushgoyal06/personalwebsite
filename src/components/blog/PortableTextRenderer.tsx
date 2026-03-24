"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || "Blog image"}
            width={800}
            height={450}
            className="rounded-lg w-full"
          />
          {value.alt && (
            <figcaption className="text-center text-sm text-neutral-500 mt-2">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3 text-white">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-neutral-600 pl-4 my-6 text-neutral-300 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-neutral-300 leading-relaxed mb-4">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-white/10 text-sm font-mono text-neutral-200">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1 text-neutral-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1 text-neutral-300">
        {children}
      </ol>
    ),
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortableTextRenderer({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
