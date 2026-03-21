import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlphaEdge",
  description: "Trade like a hedge fund without being one",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
