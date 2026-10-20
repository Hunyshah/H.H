"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";

/** Destructive action with a confirmation prompt. */
export function DeleteButton({
  action,
  label,
  confirmText,
}: {
  action: () => Promise<unknown>;
  label: string;
  confirmText: string;
}) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="destructive"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmText)) start(async () => void (await action()));
      }}
    >
      {pending ? "Deleting…" : label}
    </Button>
  );
}
