"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/studio")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          AG
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 text-sm">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`transition-colors hover:text-white ${
                  pathname === href ? "text-white" : "text-neutral-400"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-neutral-400 hover:text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {open ? (
              <path d="M5 5l10 10M15 5l-10 10" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-md">
          <ul className="flex flex-col py-4 px-6 gap-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block py-2 text-sm transition-colors hover:text-white ${
                    pathname === href ? "text-white" : "text-neutral-400"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
