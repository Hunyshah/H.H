"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { signIn } from "@/lib/actions/admin/auth";
import { initialFormState } from "@/lib/actions/admin/state";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initialFormState);
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.message && (
        <p role="alert" className="rounded-xs bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="min-h-11">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
