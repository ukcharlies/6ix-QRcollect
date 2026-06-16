import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "6ix QR Forms",
  description: "Create dynamic QR forms and collect responses.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
