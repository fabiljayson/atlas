import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas — your calm command center",
  description:
    "Mail, calendar and tasks by urgency, a second brain over your files, evening check-ins, branded content and objectives — one calm dashboard with an AI chief of staff.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
