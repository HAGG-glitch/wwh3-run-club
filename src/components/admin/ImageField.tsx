import { useRef, useState } from "react";

import { Media } from "@/components/Media";
import {
  MAX_UPLOAD_BATCH,
  uploadImage,
  uploadMedia,
} from "@/lib/adminApi";
import { isMediaFile } from "@/lib/media";

const buttonClass =
  "inline-flex items-center justify-center rounded-sm border border-ink/25 bg-pure-white px-3 py-2 text-[0.66rem] font-black tracking-[0.08em] uppercase text-ink transition-colors hover:border-gold-deep hover:bg-gold-bright/20 disabled:opacity-50";

export function ImageField({
  label,
  value,
  onChange,
  allowVideo = false,
}: {
  label: string;
  value: string;
  onChange: (url: string, width?: number, height?: number) => void;
  allowVideo?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const image = await uploadImage(file);
      onChange(image.url, image.width, image.height);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="text-[0.64rem] font-black tracking-[0.08em] text-ink/70 uppercase">
        {label}
      </span>
      <div className="mt-1 flex flex-col gap-3 sm:flex-row">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden border border-ink/15 bg-charcoal/5">
          {value ? (
            <Media src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-[0.6rem] text-muted-gray uppercase">
              {allowVideo ? "No media" : "No image"}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="url"
            value={value}
            placeholder="https://… or /gallery_photos/…"
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-sm border border-ink/20 bg-pure-white px-3 py-2 text-[0.85rem] text-ink outline-none focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/25"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={buttonClass}
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? "Uploading…" : allowVideo ? "Upload media" : "Upload photo"}
            </button>
            {value ? (
              <button
                type="button"
                className={buttonClass}
                onClick={() => onChange("")}
              >
                Remove
              </button>
            ) : null}
            <input
              ref={inputRef}
              type="file"
              accept={allowVideo ? "image/*,video/*" : "image/*"}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
          </div>
          {error ? (
            <p className="m-0 text-[0.72rem] font-semibold text-red-600">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function MultiImageField({
  label,
  values,
  onChange,
  max = MAX_UPLOAD_BATCH,
}: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).filter(isMediaFile);
    if (files.length === 0) {
      setError("Choose one or more image or video files.");
      resetInput();
      return;
    }

    const room = Math.max(0, max - values.length);
    if (room === 0) {
      setError(
        `This run is at the ${max} item limit. Remove one to add another.`,
      );
      resetInput();
      return;
    }

    const chosen = files.slice(0, room);
    let notice =
      files.length > room
        ? `Only ${room} slot${room === 1 ? "" : "s"} left, so ${chosen.length} of ${files.length} items will be uploaded.`
        : null;

    setBusy(true);
    setProgress({ completed: 0, total: chosen.length });
    setError(notice);

    try {
      const { media, errors } = await uploadMedia(chosen, (completed, total) =>
        setProgress({ completed, total }),
      );

      if (media.length > 0) {
        onChange([...values, ...media.map((item) => item.url)]);
      }

      if (errors.length > 0) {
        notice = [
          notice,
          `${errors.length} upload${errors.length === 1 ? "" : "s"} failed: ${errors[0]}`,
        ]
          .filter(Boolean)
          .join(" ");
      }
      setError(notice);
    } finally {
      setBusy(false);
      setProgress(null);
      resetInput();
    }
  };

  const atLimit = values.length >= max;
  const overLimit = values.length > max;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.64rem] font-black tracking-[0.08em] text-ink/70 uppercase">
          {label}
        </span>
        <span className="text-[0.64rem] font-bold text-muted-gray">
          {values.length}/{max}
        </span>
      </div>
      {values.length > 0 ? (
        <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {values.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative">
              <Media
                src={url}
                alt=""
                className="h-16 w-full border border-ink/15 object-cover"
              />
              <button
                type="button"
                aria-label={`Remove media ${index + 1}`}
                disabled={busy}
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="absolute top-0.5 right-0.5 grid size-5 place-items-center bg-ink/80 text-[0.7rem] font-black text-warm-white disabled:opacity-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-2">
        <textarea
          rows={3}
          value={values.join("\n")}
          placeholder="One image or video URL per line"
          onChange={(event) => {
            const urls = event.target.value
              .split(/\r?\n/)
              .map((line) => line.trim())
              .filter(Boolean);
            onChange(urls);
            setError(
              urls.length > max
                ? `This run is over the ${max} item limit by ${urls.length - max}.`
                : null,
            );
          }}
          className="w-full rounded-sm border border-ink/20 bg-pure-white px-3 py-2 text-[0.82rem] text-ink outline-none focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/25"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          disabled={busy || atLimit}
          onClick={() => inputRef.current?.click()}
        >
          {busy
            ? `Uploading ${progress?.completed ?? 0}/${progress?.total ?? 0}…`
            : overLimit
              ? "Over media limit"
              : atLimit
                ? "Media limit reached"
                : "Add photos / videos"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="sr-only"
          onChange={(event) => {
            void handleFiles(event.target.files);
          }}
        />
        {overLimit ? (
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              onChange(values.slice(0, max));
              setError(null);
            }}
          >
            Trim to {max}
          </button>
        ) : null}
        <span className="text-[0.68rem] text-muted-gray">
          {overLimit
            ? `Over the limit by ${values.length - max}.`
            : atLimit
              ? "Remove an item to upload more."
              : `Select up to ${max} photos or videos at once.`}
        </span>
      </div>
      {overLimit ? (
        <p className="m-0 mt-1 text-[0.72rem] font-semibold text-amber-700">
          This run has {values.length} items but the limit is {max}. It still
          shows the first {max}; trim or remove items before uploading more.
        </p>
      ) : null}
      {error ? (
        <p className="m-0 mt-1 text-[0.72rem] font-semibold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
