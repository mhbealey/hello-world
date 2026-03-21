import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PE Cybersecurity Governance",
  description: "Private equity cybersecurity governance platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
