import type React from "react";
import Link from "next/link";
import { ThemeSwitcher } from "../../components/theme-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header minimalista para auth */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold">
            petly
          </Link>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Contenido centrado */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
