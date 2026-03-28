export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[color-mix(in_srgb,var(--accent)_12%,transparent)] py-8 text-center text-sm text-slate-500">
      <div className="max-w-6xl mx-auto px-6">
        &copy; {new Date().getFullYear()} Aarush Goyal. All rights reserved.
      </div>
    </footer>
  );
}
