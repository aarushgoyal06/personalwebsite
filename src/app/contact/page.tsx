import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Aarush Goyal",
  description: "Get in touch with Aarush Goyal.",
};

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

      <form
        action="https://formspree.io/f/YOUR_FORM_ID"
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
            className="w-full px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all"
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
            className="w-full px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all"
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
            className="w-full px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all resize-none"
            placeholder="What's on your mind?"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
        >
          Send Message
        </button>
      </form>

      <div className="border-t border-blue-500/10 pt-8">
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/15 hover:bg-blue-500/10 transition-colors text-sm text-slate-300 hover:text-blue-300"
            >
              <span className="font-mono text-xs text-blue-400">{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
