import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-sm font-bold text-slate-950">
            <span className="grid size-9 place-items-center rounded-md bg-slate-950 text-white">QR</span>
            <span>6ix QR Forms</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">
            New form
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
