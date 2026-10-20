"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { saveService } from "@/lib/actions/admin/content";
import { slugify } from "@/lib/slug";

import { FieldError, FormMessage } from "./FieldError";
import { useFormAction } from "./useFormAction";

type Faq = { q: string; a: string };
type Props = {
  service?: {
    id: string;
    title: string;
    slug: string;
    short: string | null;
    body: string | null;
    faq: Faq[];
    sort_order: number;
  };
};

export function ServiceForm({ service }: Props) {
  const { state, pending, onSubmit } = useFormAction(saveService);
  const err = state.fieldErrors ?? {};
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(service));
  const [faq, setFaq] = useState<Faq[]>(service?.faq ?? []);

  const setItem = (i: number, patch: Partial<Faq>) =>
    setFaq((list) => list.map((f, j) => (j === i ? { ...f, ...patch } : f)));

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      {service && <input type="hidden" name="id" value={service.id} />}
      <input
        type="hidden"
        name="faq"
        value={JSON.stringify(faq.filter((f) => f.q.trim() || f.a.trim()))}
      />
      <Card>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={service?.title ?? ""}
              onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
              aria-invalid={err.title ? true : undefined}
            />
            <FieldError message={err.title} />
          </div>
          <div>
            <Label htmlFor="slug">URL slug (/services/…)</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value) || e.target.value.toLowerCase());
              }}
              aria-invalid={err.slug ? true : undefined}
            />
            <FieldError message={err.slug} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="short">Short description (cards and search results)</Label>
            <Textarea id="short" name="short" rows={2} defaultValue={service?.short ?? ""} />
            <FieldError message={err.short} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="body">What is included (Markdown)</Label>
            <Textarea
              id="body"
              name="body"
              rows={10}
              defaultValue={service?.body ?? ""}
              className="font-mono text-sm"
            />
            <FieldError message={err.body} />
          </div>
          <div>
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={service?.sort_order ?? 0}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>FAQ</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFaq((l) => [...l, { q: "", a: "" }])}
          >
            Add question
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {faq.length === 0 && (
            <p className="text-sm text-muted">
              No questions yet. FAQs also appear as rich results in Google.
            </p>
          )}
          {faq.map((f, i) => (
            <div key={i} className="grid gap-2 rounded-xs border border-line p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor={`faq-q-${i}`} className="text-xs">
                    Question {i + 1}
                  </Label>
                  <Input
                    id={`faq-q-${i}`}
                    value={f.q}
                    onChange={(e) => setItem(i, { q: e.target.value })}
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Move question ${i + 1} up`}
                  disabled={i === 0}
                  onClick={() =>
                    setFaq((l) => {
                      const n = [...l];
                      [n[i - 1], n[i]] = [n[i]!, n[i - 1]!];
                      return n;
                    })
                  }
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-800"
                  onClick={() => setFaq((l) => l.filter((_, j) => j !== i))}
                >
                  Remove
                </Button>
              </div>
              <div>
                <Label htmlFor={`faq-a-${i}`} className="text-xs">
                  Answer
                </Label>
                <Textarea
                  id={`faq-a-${i}`}
                  rows={2}
                  value={f.a}
                  onChange={(e) => setItem(i, { a: e.target.value })}
                />
              </div>
            </div>
          ))}
          {err.faq && (
            <FieldError message="Each question needs at least 3 characters and an answer." />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : service ? "Save changes" : "Create service"}
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
