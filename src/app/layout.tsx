import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Naukri Clone - Jobs, Recruitment, Career, Employment",
  description:
    "Search and apply to jobs across India. A full stack Naukri.com replica built with Next.js, Prisma and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-naukri-ink antialiased">{children}</body>
    </html>
  );
}
