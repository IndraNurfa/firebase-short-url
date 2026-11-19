import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Short URL",
  description:
    "Create a permanent short link, or a temporary one that stops working after five minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} min-h-[100dvh] bg-canvas`}>
        <header className="border-b border-hairline">
          <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-[-0.02em] text-primary">
              shorturl
            </Link>
            <a
              href="https://github.com/IndraNurfa/firebase-short-url"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-ink transition-colors hover:text-body"
            >
              Source
              <ArrowUpRight size={14} weight="bold" aria-hidden />
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
