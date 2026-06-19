import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEAL - Monitoring & Evaluation",
  description: "Suivi des KPIs avec Intelligence Artificielle",
  manifest: "/manifest.json",
  applicationName: "MEAL",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "MEAL" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#15803d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--card)]/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2 text-lg font-bold text-[var(--primary)]">
              <span className="text-2xl">📊</span> MEAL
            </a>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                Dashboard
              </a>
              <button
                id="theme-toggle"
                className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
                aria-label="Changer le thème"
              >
                🌙
              </button>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl px-4 py-6">
          {children}
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem('dark') === 'true') {
                document.documentElement.classList.add('dark');
              }
              document.getElementById('theme-toggle')?.addEventListener('click', () => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('dark', isDark);
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
