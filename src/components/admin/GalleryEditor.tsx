import { useEffect, useRef, useState } from "react";

import { Media } from "@/components/Media";
import type { GalleryCategory, GalleryItem } from "@/data/gallery";
import { MAX_UPLOAD_BATCH, uploadMedia } from "@/lib/adminApi";
import { isMediaFile } from "@/lib/media";
import { cn } from "@/lib/utils";

import { blankGalleryItem } from "./factories";
import { Checkbox, Field, Panel, Select, TextArea } from "./fields";
import { ImageField } from "./ImageField";

const categories: readonly GalleryCategory[] = [
  "Trail",
  "Circle",
  "Adventure",
  "Brotherhood",
  "Freetown",
];

function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function dimension(value: string): number {
  return Math.max(1, Math.round(Number(value) || 1));
}

export function GalleryEditor({
  gallery,
  onChange,
}: {
  gallery: GalleryItem[];
  onChange: (gallery: GalleryItem[]) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    gallery[0]?.id ?? null,
  );
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef(gallery);
  const selected = gallery.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    galleryRef.current = gallery;
  }, [gallery]);

  const patch = (changes: Partial<GalleryItem>) => {
    if (!selected) return;
    onChange(
      gallery.map((item) =>
        item.id === selected.id ? { ...item, ...changes } : item,
      ),
    );
  };

  const add = () => {
    const item = blankGalleryItem();
    onChange([item, ...gallery]);
    setSelectedId(item.id);
  };

  const remove = (id: string) => {
    const next = gallery.filter((item) => item.id !== id);
    onChange(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  };

  const bulkUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).filter(isMediaFile);
    if (files.length === 0) {
      setBulkError("Choose one or more image or video files.");
      if (bulkInputRef.current) bulkInputRef.current.value = "";
      return;
    }

    const chosen = files.slice(0, MAX_UPLOAD_BATCH);
    let notice =
      files.length > MAX_UPLOAD_BATCH
        ? `Only ${MAX_UPLOAD_BATCH} items can be uploaded at once, so the first ${chosen.length} will be added.`
        : null;

    setBulkBusy(true);
    setBulkProgress({ completed: 0, total: chosen.length });
    setBulkError(notice);

    try {
      const { media, errors } = await uploadMedia(chosen, (completed, total) =>
        setBulkProgress({ completed, total }),
      );

      const items = media.map((item) => ({
        ...blankGalleryItem(),
        image: item.url,
        width: item.width,
        height: item.height,
      }));

      if (items.length > 0) {
        onChange([...items, ...galleryRef.current]);
        setSelectedId(items[0].id);
      }

      if (errors.length > 0) {
        notice = [
          notice,
          `${errors.length} upload${errors.length === 1 ? "" : "s"} failed: ${errors[0]}`,
        ]
          .filter(Boolean)
          .join(" ");
      }
      setBulkError(notice);
    } finally {
      setBulkBusy(false);
      setBulkProgress(null);
      if (bulkInputRef.current) bulkInputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
      <div className="border border-ink/15 bg-warm-white">
        <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2.5">
          <h2 className="m-0 text-[0.72rem] font-black tracking-[0.1em] uppercase">
            Media ({gallery.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => bulkInputRef.current?.click()}
              disabled={bulkBusy}
              className="rounded-sm border border-ink/25 px-3 py-1.5 text-[0.62rem] font-black tracking-[0.08em] text-ink uppercase hover:border-gold-deep hover:bg-gold-bright/20 disabled:opacity-50"
            >
              {bulkBusy ? "Uploading…" : "+ Upload"}
            </button>
            <button
              type="button"
              onClick={add}
              disabled={bulkBusy}
              className="rounded-sm bg-ink px-3 py-1.5 text-[0.62rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal disabled:opacity-50"
            >
              + Add
            </button>
            <input
              ref={bulkInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                void bulkUpload(event.target.files);
              }}
            />
          </div>
        </div>
        {bulkBusy && bulkProgress ? (
          <p className="m-0 border-b border-ink/15 px-3 py-2 text-[0.68rem] font-semibold tracking-[0.06em] text-muted-gray uppercase">
            Uploading {bulkProgress.completed}/{bulkProgress.total}…
          </p>
        ) : null}
        {bulkError ? (
          <p className="m-0 border-b border-ink/15 px-3 py-2 text-[0.72rem] font-semibold text-red-600">
            {bulkError}
          </p>
        ) : null}
        <ul className="m-0 max-h-[32rem] list-none overflow-y-auto p-0">
          {gallery.map((item) => (
            <li
              key={item.id}
              className="flex items-stretch border-b border-ink/10 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-gold-bright/15",
                  selectedId === item.id && "bg-gold-bright/25",
                )}
              >
                {item.image ? (
                  <Media
                    src={item.image}
                    alt=""
                    className="h-10 w-10 shrink-0 border border-ink/15 object-cover"
                  />
                ) : (
                  <span className="h-10 w-10 shrink-0 border border-dashed border-ink/25" />
                )}
                <span className="min-w-0">
                  <span className="block truncate text-[0.78rem] font-semibold">
                    {item.caption || item.alt || "Untitled media"}
                  </span>
                  <span className="block text-[0.6rem] tracking-[0.06em] text-muted-gray uppercase">
                    {item.category}
                    {item.published ? " · live" : " · hidden"}
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-label={`Delete ${item.caption || item.alt || "media"}`}
                onClick={() => remove(item.id)}
                disabled={bulkBusy}
                className="px-3 text-lg leading-none text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                ×
              </button>
            </li>
          ))}
          {gallery.length === 0 ? (
            <li className="px-3 py-4 text-[0.8rem] text-muted-gray">
              No media yet.
            </li>
          ) : null}
        </ul>
      </div>

      {selected ? (
        <Panel
          title={`Editing: ${selected.caption || selected.alt || "Untitled media"}`}
          actions={
            <Checkbox
              label="Published"
              checked={selected.published}
              onChange={(checked) => patch({ published: checked })}
            />
          }
        >
          <ImageField
            label="Photograph or video"
            value={selected.image}
            allowVideo
            onChange={(url, width, height) =>
              patch({
                image: url,
                ...(width && height ? { width, height } : {}),
              })
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Alt text (describe the photo or video)"
              value={selected.alt}
              onChange={(value) => patch({ alt: value })}
            />
            <Select
              label="Category"
              value={selected.category}
              options={categories}
              onChange={(category) => patch({ category })}
            />
            <Field
              label="Hash number"
              value={selected.hashNumber ?? ""}
              onChange={(value) => patch({ hashNumber: nullable(value) })}
            />
            <Field
              label="Date"
              value={selected.date ?? ""}
              onChange={(value) => patch({ date: nullable(value) })}
            />
            <Field
              label="Location"
              value={selected.location ?? ""}
              onChange={(value) => patch({ location: nullable(value) })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Width (px)"
                type="number"
                value={String(selected.width)}
                onChange={(value) => patch({ width: dimension(value) })}
              />
              <Field
                label="Height (px)"
                type="number"
                value={String(selected.height)}
                onChange={(value) => patch({ height: dimension(value) })}
              />
            </div>
          </div>

          <TextArea
            label="Caption"
            value={selected.caption}
            onChange={(value) => patch({ caption: value })}
            rows={3}
          />

          <div className="flex flex-col gap-2 border-t border-ink/10 pt-3">
            <Checkbox
              label="Consent confirmed by everyone in this photo or video"
              checked={selected.consentConfirmed}
              onChange={(checked) => patch({ consentConfirmed: checked })}
            />
            <Checkbox
              label="Caption and alt text checked by a person"
              checked={selected.descriptionConfirmed}
              onChange={(checked) => patch({ descriptionConfirmed: checked })}
            />
            {!selected.consentConfirmed ? (
              <p className="m-0 text-[0.72rem] font-semibold text-red-700">
                Without consent confirmation this media stays hidden, even if it
                is marked published.
              </p>
            ) : null}
          </div>
        </Panel>
      ) : (
        <div className="border border-dashed border-ink/25 p-8 text-center text-[0.85rem] text-muted-gray">
          Select an item to edit it, or add a new one.
        </div>
      )}
    </div>
  );
}
