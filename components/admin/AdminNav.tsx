"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/settings", label: "Settings" },
];

/** Highlights the current section. Wrap in <Suspense> (it reads the URL). */
export function AdminNav() {
  return <AdminNavLinks pathname={usePathname()} />;
}

/** Same links without an active state: the prerendered Suspense fallback. */
export function AdminNavLinks({ pathname = "" }: { pathname?: string }) {
  return (
    <nav aria-label="Admin">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {items.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-10 items-center rounded-xs px-3 text-sm font-bold whitespace-nowrap transition-colors",
                  active
                    ? "bg-gold text-ink-950"
                    : "text-muted-on-dark hover:bg-ink-900 hover:text-ivory",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
