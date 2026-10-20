"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import {
  addProjectImages,
  addProjectVideo,
  deleteMedia,
  reorderMedia,
  setCover,
  updateMedia,
} from "@/lib/actions/admin/projects";
import { compressImage } from "@/lib/image/compress";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Enums } from "@/lib/supabase/database.types";
import { PROJECT_IMAGES_BUCKET } from "@/lib/supabase/storage";
import { youTubeId } from "@/lib/video";
import { cn } from "@/lib/utils";

type Phase = Enums<"media_phase">;

export type AdminMedia = {
  id: string;
  type: Enums<"media_type">;
  storagePath: string | null;
  url: string | null;
  videoUrl: string | null;
  alt: string | null;
  caption: string | null;
  phase: Phase;
};

type Staged = {
  key: string;
  name: string;
  preview: string;
  blob: Blob;
  type: string;
  alt: string;
  caption: string;
  phase: Phase;
};

const phases: { value: Phase; label: string }[] = [
  { value: "before", label: "Before" },
  { value: "progress", label: "Construction" },
  { value: "after", label: "Completed" },
];

const MAX_FILES = 40;

export function MediaManager({
  projectId,
  media,
  coverPath,
}: {
  projectId: string;
  media: AdminMedia[];
  coverPath: string | null;
}) {
  const router = useRouter();
  const [items, setItems] = useState(media);
  const [staged, setStaged] = useState<Staged[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  // Server data wins after every refresh (derived-state pattern, no effect).
  const [prevMedia, setPrevMedia] = useState(media);
  if (media !== prevMedia) {
    setPrevMedia(media);
    setItems(media);
  }

  // Release preview URLs of staged files on unmount.
  const stagedRef = useRef(staged);
  useEffect(() => {
    stagedRef.current = staged;
  }, [staged]);
  useEffect(() => () => stagedRef.current.forEach((s) => URL.revokeObjectURL(s.preview)), []);
  const unstage = (keys?: string[]) =>
    setStaged((list) => {
      const drop = list.filter((x) => !keys || keys.includes(x.key));
      drop.forEach((x) => URL.revokeObjectURL(x.preview));
      return keys ? list.filter((x) => !keys.includes(x.key)) : [];
    });

  const run = (label: string, fn: () => Promise<{ ok: boolean; message?: string }>) =>
    start(async () => {
      setError(null);
      setBusy(label);
      try {
        const res = await fn();
        if (!res.ok) setError(res.message ?? "Something went wrong.");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setBusy(null);
      }
    });

  // ---- Staging (compress first, require alt text before upload) ----
  const stageFiles = async (files: FileList | File[]) => {
    const list = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_FILES);
    if (!list.length) return;
    setError(null);
    setBusy(`Compressing ${list.length} image${list.length > 1 ? "s" : ""}…`);
    const out: Staged[] = [];
    for (const file of list) {
      try {
        const c = await compressImage(file);
        out.push({
          key: crypto.randomUUID(),
          name: file.name,
          preview: URL.createObjectURL(c.blob),
          blob: c.blob,
          type: c.type,
          alt: "",
          caption: "",
          phase: "after",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : `${file.name} could not be read.`);
      }
    }
    setStaged((s) => [...s, ...out]);
    setBusy(null);
  };

  const updateStaged = (key: string, patch: Partial<Staged>) =>
    setStaged((s) => s.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const missingAlt = staged.filter((s) => s.alt.trim().length < 3).length;

  const upload = () =>
    run("Uploading…", async () => {
      const supabase = createSupabaseBrowserClient();
      const uploaded = [];
      for (const [i, s] of staged.entries()) {
        setBusy(`Uploading ${i + 1} of ${staged.length}…`);
        const ext = s.type === "image/webp" ? "webp" : "jpg";
        const path = `projects/${projectId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(PROJECT_IMAGES_BUCKET)
          .upload(path, s.blob, { contentType: s.type, cacheControl: "31536000", upsert: false });
        if (upErr) return { ok: false, message: `${s.name}: ${upErr.message}` };
        uploaded.push({
          storage_path: path,
          alt: s.alt.trim(),
          caption: s.caption.trim() || null,
          phase: s.phase,
        });
      }
      const res = await addProjectImages(projectId, uploaded);
      if (res.ok) unstage();
      return res;
    });

  // ---- Ordering ----
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    setItems(next);
    run("Saving order…", () =>
      reorderMedia(
        projectId,
        next.map((m) => m.id),
      ),
    );
  };

  // ---- Video ----
  const [video, setVideo] = useState({ url: "", caption: "", phase: "after" as Phase });
  const videoValid = youTubeId(video.url) !== null;

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>Photos & videos</CardTitle>
        <span aria-live="polite" className="text-sm text-muted">
          {busy ?? (pending ? "Working…" : `${items.length} item${items.length === 1 ? "" : "s"}`)}
        </span>
      </CardHeader>
      <CardContent className="grid gap-6">
        {error && (
          <p role="alert" className="rounded-xs bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            if (dragId) return;
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            if (dragId) return;
            e.preventDefault();
            setDragOver(false);
            void stageFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xs border-2 border-dashed p-8 text-center transition-colors",
            dragOver ? "border-gold bg-gold/10" : "border-line bg-ivory",
          )}
        >
          <p className="font-bold">Drag photos here</p>
          <p className="text-sm text-muted">
            JPG, PNG or WebP. Resized to 2400 px and converted to WebP before upload.
          </p>
          <Button
            variant="outline"
            onClick={() => fileInput.current?.click()}
            disabled={Boolean(busy)}
          >
            Choose photos
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              if (e.target.files) void stageFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {/* Staged uploads */}
        {staged.length > 0 && (
          <div className="rounded-xs border border-gold/60 bg-gold/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-bold">
                Ready to upload: {staged.length} ·{" "}
                <span className="font-normal text-muted">alt text is required for every photo</span>
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="bulk-phase" className="mb-0 text-xs">
                  Set all to
                </Label>
                <Select
                  id="bulk-phase"
                  className="min-h-8 w-36 text-sm"
                  value=""
                  onChange={(e) =>
                    setStaged((s) => s.map((x) => ({ ...x, phase: e.target.value as Phase })))
                  }
                >
                  <option value="" disabled>
                    Phase…
                  </option>
                  {phases.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <ul className="mt-4 grid gap-3">
              {staged.map((s) => (
                <li
                  key={s.key}
                  className="grid gap-3 rounded-xs bg-white p-3 sm:grid-cols-[96px_1fr]"
                >
                  <Image
                    src={s.preview}
                    alt=""
                    width={96}
                    height={72}
                    unoptimized
                    className="h-18 w-24 rounded-xs object-cover"
                  />
                  <div className="grid gap-2 md:grid-cols-[1fr_1fr_170px_auto]">
                    <div>
                      <Label htmlFor={`alt-${s.key}`} className="text-xs">
                        Alt text (describe the photo) *
                      </Label>
                      <Input
                        id={`alt-${s.key}`}
                        value={s.alt}
                        aria-invalid={s.alt.trim().length < 3 ? true : undefined}
                        placeholder="e.g. Steel frame of the production hall"
                        onChange={(e) => updateStaged(s.key, { alt: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cap-${s.key}`} className="text-xs">
                        Caption (optional)
                      </Label>
                      <Input
                        id={`cap-${s.key}`}
                        value={s.caption}
                        onChange={(e) => updateStaged(s.key, { caption: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ph-${s.key}`} className="text-xs">
                        Phase
                      </Label>
                      <Select
                        id={`ph-${s.key}`}
                        value={s.phase}
                        onChange={(e) => updateStaged(s.key, { phase: e.target.value as Phase })}
                      >
                        {phases.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-end"
                      aria-label={`Remove ${s.name}`}
                      onClick={() => unstage([s.key])}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="gold" onClick={upload} disabled={Boolean(busy) || missingAlt > 0}>
                Upload {staged.length} photo{staged.length > 1 ? "s" : ""}
              </Button>
              {missingAlt > 0 && (
                <span className="text-sm text-amber-800">{missingAlt} still need alt text.</span>
              )}
              <Button variant="ghost" onClick={() => unstage()} disabled={Boolean(busy)}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Existing media */}
        {items.length > 0 && (
          <ol className="grid gap-3" aria-label="Project media, in display order">
            {items.map((m, i) => (
              <MediaRow
                key={m.id}
                media={m}
                index={i}
                total={items.length}
                isCover={Boolean(m.storagePath && m.storagePath === coverPath)}
                disabled={Boolean(busy)}
                dragging={dragId === m.id}
                onDragStart={() => setDragId(m.id)}
                onDragEnd={() => setDragId(null)}
                onDropOn={() => {
                  if (!dragId) return;
                  move(
                    items.findIndex((x) => x.id === dragId),
                    i,
                  );
                  setDragId(null);
                }}
                onMove={(dir) => move(i, i + dir)}
                onSave={(patch) => run("Saving…", () => updateMedia(m.id, patch))}
                onCover={() =>
                  m.storagePath && run("Setting cover…", () => setCover(projectId, m.storagePath!))
                }
                onDelete={() => {
                  if (confirm("Delete this item? This cannot be undone."))
                    run("Deleting…", () => deleteMedia(m.id));
                }}
              />
            ))}
          </ol>
        )}

        {/* Add video */}
        <form
          className="grid gap-3 rounded-xs border border-line p-4 md:grid-cols-[2fr_1.4fr_160px_auto] md:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (!videoValid) return;
            run("Adding video…", async () => {
              const res = await addProjectVideo(projectId, {
                video_url: video.url,
                caption: video.caption || null,
                phase: video.phase,
              });
              if (res.ok) setVideo({ url: "", caption: "", phase: "after" });
              return res;
            });
          }}
        >
          <div>
            <Label htmlFor="video-url">YouTube link</Label>
            <Input
              id="video-url"
              type="url"
              placeholder="https://youtu.be/… (unlisted is fine)"
              value={video.url}
              aria-invalid={video.url && !videoValid ? true : undefined}
              onChange={(e) => setVideo({ ...video, url: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="video-caption">Caption</Label>
            <Input
              id="video-caption"
              value={video.caption}
              onChange={(e) => setVideo({ ...video, caption: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="video-phase">Phase</Label>
            <Select
              id="video-phase"
              value={video.phase}
              onChange={(e) => setVideo({ ...video, phase: e.target.value as Phase })}
            >
              {phases.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" variant="outline" disabled={!videoValid || Boolean(busy)}>
            Add video
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type MediaRowProps = {
  media: AdminMedia;
  index: number;
  total: number;
  isCover: boolean;
  disabled: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropOn: () => void;
  onMove: (dir: -1 | 1) => void;
  onSave: (patch: { alt?: string; caption?: string | null; phase?: Phase }) => void;
  onCover: () => void;
  onDelete: () => void;
};

function MediaRow({
  media,
  index,
  total,
  isCover,
  disabled,
  dragging,
  onDragStart,
  onDragEnd,
  onDropOn,
  onMove,
  onSave,
  onCover,
  onDelete,
}: MediaRowProps) {
  const [alt, setAlt] = useState(media.alt ?? "");
  const [caption, setCaption] = useState(media.caption ?? "");
  const dirty = alt !== (media.alt ?? "") || caption !== (media.caption ?? "");
  const thumb =
    media.type === "image"
      ? media.url
      : media.videoUrl && youTubeId(media.videoUrl)
        ? `https://i.ytimg.com/vi/${youTubeId(media.videoUrl)}/mqdefault.jpg`
        : null;

  return (
    <li
      draggable={!disabled}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDropOn();
      }}
      className={cn(
        "grid gap-3 rounded-xs border border-line bg-white p-3 sm:grid-cols-[auto_120px_1fr]",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-center gap-1 sm:flex-col sm:justify-center">
        <span
          aria-hidden="true"
          className="hidden cursor-grab px-1 text-muted select-none sm:block"
          title="Drag to reorder"
        >
          ⋮⋮
        </span>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Move up"
          disabled={disabled || index === 0}
          onClick={() => onMove(-1)}
        >
          ↑
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Move down"
          disabled={disabled || index === total - 1}
          onClick={() => onMove(1)}
        >
          ↓
        </Button>
      </div>
      <div className="relative h-[90px] w-[120px] overflow-hidden rounded-xs bg-ink-900">
        {thumb && (
          <Image src={thumb} alt="" fill sizes="120px" unoptimized className="object-cover" />
        )}
        <span className="absolute top-1 left-1 flex gap-1">
          {media.type === "video" && <Badge variant="dark">Video</Badge>}
          {isCover && <Badge variant="gold">Cover</Badge>}
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_150px] md:items-end">
        <div>
          <Label htmlFor={`m-alt-${media.id}`} className="text-xs">
            {media.type === "image" ? "Alt text *" : "Title"}
          </Label>
          <Input
            id={`m-alt-${media.id}`}
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            aria-invalid={media.type === "image" && alt.trim().length < 3 ? true : undefined}
          />
        </div>
        <div>
          <Label htmlFor={`m-cap-${media.id}`} className="text-xs">
            Caption
          </Label>
          <Input
            id={`m-cap-${media.id}`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`m-ph-${media.id}`} className="text-xs">
            Phase
          </Label>
          <Select
            id={`m-ph-${media.id}`}
            value={media.phase}
            disabled={disabled}
            onChange={(e) => onSave({ phase: e.target.value as Phase })}
          >
            {phases.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-3">
          {dirty && (
            <Button
              size="sm"
              disabled={disabled || (media.type === "image" && alt.trim().length < 3)}
              onClick={() => onSave({ alt, caption: caption || null })}
            >
              Save text
            </Button>
          )}
          {media.type === "image" && !isCover && (
            <Button size="sm" variant="outline" disabled={disabled} onClick={onCover}>
              Set as cover
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-red-800"
            disabled={disabled}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}
