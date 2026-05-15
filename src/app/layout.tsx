import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeBuilder — Free Resume Builder for Students",
  description: "Build professional resumes for free. Live preview, PDF export, 3 templates. No sign-up required.",
  keywords: ["resume builder", "free resume", "student resume", "fresher resume", "CV builder", "PDF resume"],
  openGraph: {
    title: "ResumeBuilder — Free Resume Builder for Students",
    description: "Build professional resumes for free. Live preview, PDF export, 3 templates. No sign-up required.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeBuilder — Free Resume Builder for Students",
    description: "Build professional resumes for free. Live preview, PDF export, 3 templates. No sign-up required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
