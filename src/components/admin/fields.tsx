import type { ReactNode } from "react";

const inputClass =
  "mt-1 w-full rounded-sm border border-ink/20 bg-pure-white px-3 py-2 text-[0.9rem] text-ink outline-none transition-colors focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/25";

function labelId(label: string): string {
  return `admin-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const id = labelId(label);
  return (
    <label className="block" htmlFor={id}>
      <span className="text-[0.64rem] font-black tracking-[0.08em] text-ink/70 uppercase">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  const id = labelId(label);
  return (
    <label className="block" htmlFor={id}>
      <span className="text-[0.64rem] font-black tracking-[0.08em] text-ink/70 uppercase">
        {label}
      </span>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} resize-y leading-relaxed`}
      />
      {hint ? (
        <span className="mt-1 block text-[0.68rem] text-muted-gray">{hint}</span>
      ) : null}
    </label>
  );
}

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
}) {
  const id = labelId(label);
  return (
    <label className="block" htmlFor={id}>
      <span className="text-[0.64rem] font-black tracking-[0.08em] text-ink/70 uppercase">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[0.82rem] font-semibold text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-gold-deep"
      />
      {label}
    </label>
  );
}

export function Panel({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="border border-ink/15 bg-warm-white">
      <div className="flex items-center justify-between gap-3 border-b border-ink/15 px-4 py-3">
        <h2 className="m-0 text-[0.72rem] font-black tracking-[0.1em] uppercase">
          {title}
        </h2>
        {actions}
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}
