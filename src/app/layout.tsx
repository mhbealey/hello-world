import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0D0F",
};

export const metadata: Metadata = {
  title: "AlphaEdge",
  description: "Trade like a hedge fund without being one",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AlphaEdge",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').then(function(reg){reg.update()});caches.keys().then(function(keys){keys.forEach(function(k){if(k!=='alphaedge-v2')caches.delete(k)})})})}`,
          }}
        />
      </body>
    </html>
  );
}
