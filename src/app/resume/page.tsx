import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Aarush Goyal",
  description: "Education, experience, and skills.",
};

const experience = [
  {
    role: "Software Engineer Consultant",
    company: "JPMorganChase",
    location: "Wilmington, DE",
    period: "May 2025 – Aug 2025",
    bullets: [
      "Developed an AWS Lambda function in Python to automate payment reconciliation workflows, reducing manual processing time by 35% and improving transaction accuracy.",
      "Built and configured the Lambda using Jules, then deployed it via Spinnaker using CI/CD best practices to ensure secure, reliable production releases.",
      "Collaborated in an Agile Scrum environment, using Jira to manage sprint tasks, track progress, and coordinate deliverables across a cross-functional engineering team.",
    ],
  },
  {
    role: "Cybersecurity Intern",
    company: "Community Powered Federal Credit Union",
    location: "Bear, DE",
    period: "Sept 2024 – May 2025",
    bullets: [
      "Created the 2025 fiscal year budget using Wisdom, aligning spending with risk assessments, compliance requirements, and projected technology upgrades.",
      "Configured and maintained Cisco Meraki routers, firewalls, and access points, optimizing network segmentation and improving system security posture.",
      "Assisted in developing incident response and disaster recovery playbooks, ensuring preparedness for ransomware, phishing, and insider threat scenarios.",
    ],
  },
  {
    role: "Member Services Representative",
    company: "Community Powered Federal Credit Union",
    location: "Bear, DE",
    period: "June 2022 – Sept 2024",
    bullets: [
      "Delivered frontline financial services to an average of 50+ members daily, managing transactions, account openings, and loan processing with 100% accuracy.",
      "Guided members through digital banking platforms and mobile applications, increasing online engagement and reducing in-branch wait times by 15%.",
      "Built rapport with a diverse customer base through personalized financial recommendations, resulting in repeat business and positive member satisfaction scores.",
    ],
  },
];

const education = [
  {
    school: "University of Delaware",
    location: "Newark, DE",
    degree: "B.S. Computer Science, B.S. Mathematics",
    period: "Aug 2024 – May 2027",
    details: "3.96 GPA · Trustee Scholar · Honors",
    coursework:
      "Calculus III, Intro to Systems Programming, Data Structures, Machine Organization & Assembly Language, Discrete Math, Linear Algebra, Intro to SWE, Automata Theory",
  },
];

const activities = [
  {
    name: "Sensify Lab · VIP Research Assistant",
    period: "Jan 2025 – Present",
    description:
      "Built and iterated on prompt-engineered LLM workflows and UI components to support research-driven applications.",
  },
  {
    name: "Delta Kappa Epsilon · Fraternity",
    period: "Sept 2024 – Present",
    description:
      "Recruitment Chair (Spring '25) — founded and doubled chapter size from 8 to 20 in one year. Health and Safety Chair (Spring '26) — oversaw risk management policies and event compliance.",
  },
  {
    name: "Kamaal · Bollywood Dance Team",
    period: "Sept 2024 – Present",
    description:
      "Practiced Bollywood dance six hours a week in a team setting to perform throughout the year.",
  },
];

const skills = {
  Languages: ["Python", "C", "TypeScript", "Java", "C++", "JavaScript", "HTML", "CSS"],
  Certifications: ["AWS Certified Cloud Practitioner"],
  "Developer Tools": ["VS Code", "CLion"],
};

export default function ResumePage() {
  return (
    <div className="pt-24 pb-16 max-w-3xl mx-auto px-6">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold">Resume</h1>
        <a
          href="/Aarush_s_Resume.pdf"
          target="_blank"
          className="text-sm px-4 py-2 rounded-lg border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-colors"
        >
          Download PDF
        </a>
      </div>

      {/* Education */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">Education</h2>
        {education.map((edu, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{edu.school}</h3>
                <p className="text-slate-400 text-sm">{edu.degree}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-slate-500 text-sm block">{edu.period}</span>
                <span className="text-slate-600 text-xs">{edu.location}</span>
              </div>
            </div>
            <p className="text-blue-400/80 text-sm mt-1">{edu.details}</p>
            <p className="text-slate-500 text-xs mt-1">
              <span className="text-slate-400">Coursework:</span> {edu.coursework}
            </p>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">Experience</h2>
        {experience.map((exp, i) => (
          <div key={i} className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{exp.role}</h3>
                <p className="text-slate-400 text-sm">{exp.company}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-slate-500 text-sm block">{exp.period}</span>
                <span className="text-slate-600 text-xs">{exp.location}</span>
              </div>
            </div>
            <ul className="mt-2 space-y-1.5">
              {exp.bullets.map((b, j) => (
                <li key={j} className="text-slate-400 text-sm pl-4 relative">
                  <span className="absolute left-0 text-blue-500">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Activities */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">Activities</h2>
        {activities.map((act, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white text-sm">{act.name}</h3>
              <span className="text-slate-500 text-sm shrink-0 ml-4">
                {act.period}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{act.description}</p>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-blue-300">
          Technical Skills
        </h2>
        <div className="space-y-3">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <span className="text-sm font-medium text-slate-300">
                {category}:{" "}
              </span>
              <span className="text-sm text-slate-400">
                {items.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
