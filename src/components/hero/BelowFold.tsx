"use client";

import Link from "next/link";

const quickLinks = [
  {
    title: "Projects",
    description:
      "A collection of things I've built — from web apps to creative experiments.",
    href: "/projects",
  },
  {
    title: "Blog",
    description:
      "Thoughts, stories, and reflections on tech, life, and everything in between.",
    href: "/blog",
  },
  {
    title: "Resume",
    description: "My experience, education, and skills at a glance.",
    href: "/resume",
  },
  {
    title: "Contact",
    description: "Want to work together or just say hi? Reach out.",
    href: "/contact",
  },
];

export default function BelowFold() {
  return (
    <section className="relative z-20 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
          Where to next?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group block p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neutral-100">
                {link.title}
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
