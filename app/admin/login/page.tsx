import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-ink-950 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo variant="dark" size="md" />
        </div>
        <div className="rounded-xs bg-ivory p-7">
          <h1 className="text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1 mb-6 text-sm text-muted">Only authorised H.H Associate staff.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
