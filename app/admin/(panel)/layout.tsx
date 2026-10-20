import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminNav, AdminNavLinks } from "@/components/admin/AdminNav";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/admin/auth";
import { getAdmin } from "@/lib/auth/admin";

/**
 * Admin shell. The sidebar is static; everything that reads the session sits
 * behind <Suspense> (required with Cache Components). The proxy is the first
 * gate; AdminGate re-checks admin membership on the server for every request.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:grid lg:min-h-svh lg:grid-cols-[232px_1fr] lg:bg-[linear-gradient(to_right,var(--color-ink-950)_232px,transparent_232px)]">
      <aside className="bg-ink-950 px-4 py-4 text-ivory lg:sticky lg:top-0 lg:h-svh lg:px-5 lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Logo variant="dark" size="sm" showTagline={false} asLink={false} />
          <Link
            href="/"
            target="_blank"
            className="text-xs font-bold text-muted-on-dark hover:text-gold lg:mt-3 lg:block"
          >
            View site ↗
          </Link>
        </div>
        <div className="mt-4 lg:mt-8">
          <Suspense fallback={<AdminNavLinks />}>
            <AdminNav />
          </Suspense>
        </div>
      </aside>
      <div className="min-w-0">
        <Suspense fallback={<p className="p-8 text-sm text-muted">Loading…</p>}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </div>
    </div>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <>
      <header className="flex items-center justify-end gap-4 border-b border-line bg-white px-5 py-3 lg:px-8">
        <span className="truncate text-sm text-muted">{admin.user.email}</span>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </header>
      <main className="px-5 py-8 lg:px-8">{children}</main>
    </>
  );
}
