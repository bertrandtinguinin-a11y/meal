import type { Metadata, Viewport } from "next";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEAL - Monitoring & Evaluation with AI Logic",
  description: "Suivi de KPIs intelligent avec IA — Dashboard mobile PWA",
  manifest: "/manifest.json",
  applicationName: "MEAL",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "MEAL" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#14130E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
