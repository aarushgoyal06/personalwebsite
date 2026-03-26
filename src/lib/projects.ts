import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tech: string[];
  repo: string;
  demo?: string;
  coverImage?: string;
}

const projectsDir = path.join(process.cwd(), "content/projects");

function parseDateToMs(dateStr: string): number {
  // Expect YYYY-MM-DD, but be tolerant of other formats.
  const t = Date.parse(dateStr);
  return Number.isFinite(t) ? t : 0;
}

function readProjectFile(filePath: string, slug: string): ProjectMeta | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const title = (data.title as string) || slug;
  const description = (data.description as string) || "";
  const date = (data.date as string) || "";
  const tech = (data.tech as string[]) || [];
  const repo = (data.repo as string) || "";
  const demo = (data.demo as string) || undefined;
  const coverImage = (data.coverImage as string) || undefined;

  if (!repo) return null;

  return {
    slug,
    title,
    description,
    date,
    tech,
    repo,
    demo,
    coverImage,
  };
}

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(projectsDir)) return [];

  return fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx?|MDX?)$/, "");
      const filePath = path.join(projectsDir, filename);
      return readProjectFile(filePath, slug);
    })
    .filter((p): p is ProjectMeta => Boolean(p))
    .sort((a, b) => parseDateToMs(b.date) - parseDateToMs(a.date));
}

