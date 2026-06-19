"use client";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import SidebarLayout from "@/components/SidebarLayout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarLayout>{children}</SidebarLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}
