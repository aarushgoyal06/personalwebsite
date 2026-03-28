import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects | Aarush Goyal",
  description: "A collection of projects and experiments.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="pt-24 pb-16 max-w-4xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      <p className="text-slate-400 mb-12">
        Things I&apos;ve built, shipped, and tinkered with.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={project.demo || project.repo}
            target={(project.demo || project.repo).startsWith("http")
              ? "_blank"
              : undefined}
            rel={
              (project.demo || project.repo).startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="group block p-6 rounded-xl border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--background)_88%,var(--accent)_12%)] shadow-[0_1px_0_rgba(0,0,0,0.35)] transition-all hover:border-[color-mix(in_srgb,var(--accent)_34%,transparent)] hover:bg-[color-mix(in_srgb,var(--background)_78%,var(--accent)_22%)]"
          >
            <div
              className={
                project.coverImage
                  ? "flex gap-6 items-start"
                  : "block"
              }
            >
              {project.coverImage && (
                <div className="flex-shrink-0 w-40">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[#050a12]">
                    <Image
                      src={project.coverImage}
                      alt={`${project.title} cover image`}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--accent)]">
                  {project.title}
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-1 text-slate-500">
                    &rarr;
                  </span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                {project.tech?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-md border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--background)_85%,var(--accent)_15%)] text-[var(--accent)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
