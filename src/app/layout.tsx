import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SiteThemeHydration from "@/components/SiteThemeHydration";

export const metadata: Metadata = {
  title: {
    default: "Aarush Goyal",
    template: "%s | Aarush Goyal",
  },
  description:
    "Personal website of Aarush Goyal — developer, builder, and creative coder.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://aarushgoyal.com"
  ),
  openGraph: {
    title: "Aarush Goyal",
    description:
      "Developer, builder, and creative coder. Explore my projects, blog, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aarush Goyal",
    description:
      "Developer, builder, and creative coder. Explore my projects, blog, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SiteThemeHydration />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
