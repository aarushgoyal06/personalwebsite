import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Aarush Goyal",
  description: "Education, experience, and skills.",
};

const experience = [
  {
    role: "Software Engineer Intern",
    company: "Company Name",
    period: "Summer 2025",
    bullets: [
      "Built full-stack features using React and Node.js",
      "Improved API response times by 30% through caching strategies",
    ],
  },
  {
    role: "Teaching Assistant",
    company: "University CS Department",
    period: "2024 – 2025",
    bullets: [
      "Led weekly lab sections of 30+ students",
      "Created supplementary teaching materials and grading rubrics",
    ],
  },
];

const education = [
  {
    school: "University Name",
    degree: "B.S. Computer Science",
    period: "2022 – 2026",
    details: "GPA: 3.X / 4.0 • Dean's List",
  },
];

const skills = {
  Languages: ["TypeScript", "Python", "Java", "C++", "SQL"],
  Frameworks: ["React", "Next.js", "Node.js", "Three.js", "Tailwind CSS"],
  Tools: ["Git", "Docker", "AWS", "PostgreSQL", "Figma"],
};

export default function ResumePage() {
  return (
    <div className="pt-24 pb-16 max-w-3xl mx-auto px-6">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold">Resume</h1>
        <a
          href="/resume.pdf"
          className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
        >
          Download PDF
        </a>
      </div>

      {/* Education */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-neutral-300">
          Education
        </h2>
        {education.map((edu, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{edu.school}</h3>
                <p className="text-neutral-400 text-sm">{edu.degree}</p>
              </div>
              <span className="text-neutral-500 text-sm shrink-0 ml-4">
                {edu.period}
              </span>
            </div>
            <p className="text-neutral-500 text-sm mt-1">{edu.details}</p>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-neutral-300">
          Experience
        </h2>
        {experience.map((exp, i) => (
          <div key={i} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{exp.role}</h3>
                <p className="text-neutral-400 text-sm">{exp.company}</p>
              </div>
              <span className="text-neutral-500 text-sm shrink-0 ml-4">
                {exp.period}
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              {exp.bullets.map((b, j) => (
                <li key={j} className="text-neutral-400 text-sm pl-4 relative">
                  <span className="absolute left-0">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-neutral-300">Skills</h2>
        <div className="space-y-3">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <span className="text-sm font-medium text-neutral-300">
                {category}:{" "}
              </span>
              <span className="text-sm text-neutral-400">
                {items.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
