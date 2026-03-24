"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-neutral-500">
      <div className="max-w-6xl mx-auto px-6">
        &copy; {new Date().getFullYear()} Aarush Goyal. All rights reserved.
      </div>
    </footer>
  );
}
