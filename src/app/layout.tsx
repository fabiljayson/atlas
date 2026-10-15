import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas — your calm command center",
  description:
    "Mail, calendar and tasks by urgency, a second brain over your files, evening check-ins, branded content and objectives — one calm dashboard with an AI chief of staff.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        {/* Site-wide decorative backdrop: sits above the body gradient, below all content. */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <Image
            src="/hero-background.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-15"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 70%, transparent) 0%, color-mix(in srgb, var(--color-bg) 45%, transparent) 100%)",
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
