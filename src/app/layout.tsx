import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "MEAL-Pro — Monitoring & Evaluation",
  description: "Suivi terrain, collecte de données & analyse personnalisée",
  manifest: "/manifest.json",
  applicationName: "MEAL-Pro",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "MEAL-Pro" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#15803d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem("meal_dark");
                if (t === "true") document.documentElement.classList.add("dark");
              } catch {}
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
