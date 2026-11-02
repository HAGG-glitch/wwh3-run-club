import { useRef, useState } from "react";

import { uploadImage } from "@/lib/adminApi";

const buttonClass =
  "inline-flex items-center justify-center rounded-sm border border-ink/25 bg-pure-white px-3 py-2 text-[0.66rem] font-black tracking-[0.08em] uppercase text-ink transition-colors hover:border-gold-deep hover:bg-gold-bright/20 disabled:opacity-50";

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string, width?: number, height?: number) => void;
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

            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-[0.6rem] text-muted-gray uppercase">No image</span>
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
              {busy ? "Uploading…" : "Upload photo"}
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
              accept="image/*"
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
}: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const image = await uploadImage(file);
      onChange([...values, image.url]);
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
      {values.length > 0 ? (
        <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {values.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative">
              <img
                src={url}
                alt=""
                className="h-16 w-full border border-ink/15 object-cover"
              />
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="absolute top-0.5 right-0.5 grid size-5 place-items-center bg-ink/80 text-[0.7rem] font-black text-warm-white"
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
          placeholder="One image URL per line"
          onChange={(event) =>
            onChange(
              event.target.value
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
          className="w-full rounded-sm border border-ink/20 bg-pure-white px-3 py-2 text-[0.82rem] text-ink outline-none focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/25"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Add photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        {error ? (
          <span className="text-[0.72rem] font-semibold text-red-600">{error}</span>
        ) : null}
      </div>
    </div>
  );
}
