"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { setProjectFlag } from "@/lib/actions/admin/projects";

/** Published / Featured switches in the project list (save immediately). */
export function ProjectToggles({
  id,
  title,
  published,
  featured,
}: {
  id: string;
  title: string;
  published: boolean;
  featured: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState({ is_published: published, is_featured: featured });
  const [pending, start] = useTransition();

  const toggle = (flag: "is_published" | "is_featured") => {
    const value = !state[flag];
    setState((s) => ({ ...s, [flag]: value }));
    start(async () => {
      const res = await setProjectFlag(id, flag, value);
      if (!res.ok) setState((s) => ({ ...s, [flag]: !value }));
      router.refresh();
    });
  };

  return (
    <div className="flex gap-4">
      {(
        [
          ["is_published", "Published"],
          ["is_featured", "Featured"],
        ] as const
      ).map(([flag, label]) => (
        <label
          key={flag}
          className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold"
        >
          <input
            type="checkbox"
            className="size-4 accent-ink-950"
            checked={state[flag]}
            disabled={pending}
            onChange={() => toggle(flag)}
            aria-label={`${label}: ${title}`}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
