import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Aarush Goyal",
  description: "Get in touch with Aarush Goyal.",
};

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/aarushgoyal",
    icon: "GH",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/aarushgoyal",
    icon: "LI",
  },
  {
    label: "Email",
    href: "mailto:hello@aarushgoyal.com",
    icon: "@",
  },
];

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16 max-w-2xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="text-neutral-400 mb-12">
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
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all resize-none"
            placeholder="What's on your mind?"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
        >
          Send Message
        </button>
      </form>

      <div className="border-t border-white/10 pt-8">
        <h2 className="text-lg font-semibold mb-4 text-neutral-300">
          Find me elsewhere
        </h2>
        <div className="flex gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm text-neutral-300 hover:text-white"
            >
              <span className="font-mono text-xs">{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
