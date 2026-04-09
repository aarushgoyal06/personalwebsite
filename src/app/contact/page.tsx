import { Metadata } from "next";
import { getFormspreeFormAction } from "@/lib/formspree";

export const metadata: Metadata = {
  title: "Contact | Aarush Goyal",
  description: "Get in touch with Aarush Goyal.",
};

const formAction = getFormspreeFormAction();

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/aarushgoyal06",
    icon: "GH",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aarushgoyal/",
    icon: "LI",
  },
  {
    label: "Email",
    href: "mailto:goyalaarush6@gmail.com",
    icon: "@",
  },
];

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16 max-w-2xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="text-slate-400 mb-12">
        Want to work together, have a question, or just want to say hi? Send me
        a message.
      </p>

      {formAction ? (
        <form
          action={formAction}
          method="POST"
          className="space-y-6 mb-16"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="name"
              className="w-full px-4 py-3 rounded-lg bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_38%,transparent)] focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_38%,transparent)] focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 rounded-lg bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_38%,transparent)] focus:border-transparent transition-all resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[color-mix(in_srgb,var(--accent)_68%,black)] text-white font-medium hover:bg-[color-mix(in_srgb,var(--accent)_78%,black)] transition-colors"
          >
            Send Message
          </button>
        </form>
      ) : (
        <div className="mb-16 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          <p className="font-medium text-amber-100/95 mb-1">
            Contact form is not configured yet
          </p>
          <p className="text-amber-200/80">
            Add{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs text-[var(--accent)]">
              NEXT_PUBLIC_FORMSPREE_FORM_ID
            </code>{" "}
            to your environment (local{" "}
            <code className="font-mono text-xs">.env.local</code> and Vercel →
            Environment Variables) with your Formspree form ID from{" "}
            <a
              href="https://formspree.io"
              className="text-[var(--accent)] underline underline-offset-2 hover:opacity-90"
              target="_blank"
              rel="noopener noreferrer"
            >
              formspree.io
            </a>
            . Until then, use email below.
          </p>
        </div>
      )}

      <div className="border-t border-[color-mix(in_srgb,var(--accent)_16%,transparent)] pt-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-300">
          Find me elsewhere
        </h2>
        <div className="flex gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] transition-colors text-sm text-slate-300 hover:text-[var(--accent)]"
            >
              <span className="font-mono text-xs text-[var(--accent)]">{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
