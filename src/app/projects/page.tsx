import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects | Aarush Goyal",
  description: "A collection of projects and experiments.",
};

const projects = [
  {
    title: "Personal Website",
    description:
      "This site! A scroll-driven terminal hero, file-based blog, and blue-on-black UI — Next.js and Tailwind.",
    tech: ["Next.js", "Tailwind CSS"],
    link: "https://github.com/aarushgoyal06",
  },
  {
    title: "Project Alpha",
    description:
      "A full-stack web application that solves a real-world problem. Features real-time data processing and a clean UI.",
    tech: ["React", "Node.js", "PostgreSQL", "Docker"],
    link: "#",
  },
  {
    title: "Project Beta",
    description:
      "An experimental creative coding project exploring generative art and interactive visuals.",
    tech: ["Three.js", "GLSL", "TypeScript"],
    link: "#",
  },
  {
    title: "Project Gamma",
    description:
      "A CLI tool that automates tedious developer workflows and boosts productivity.",
    tech: ["Python", "Click", "APIs"],
    link: "#",
  },
];

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-16 max-w-4xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      <p className="text-slate-400 mb-12">
        Things I&apos;ve built, shipped, and tinkered with.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.title}
            href={project.link}
            target={project.link.startsWith("http") ? "_blank" : undefined}
            rel={
              project.link.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="group block p-6 rounded-xl border border-blue-500/10 bg-blue-500/[0.02] hover:bg-blue-500/[0.06] hover:border-blue-500/20 transition-all"
          >
            <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300">
              {project.title}
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1 text-slate-500">
                &rarr;
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
