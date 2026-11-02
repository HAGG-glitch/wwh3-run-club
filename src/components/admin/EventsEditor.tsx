import { useState } from "react";

import type { ClubEvent, EventStatus } from "@/data/events";
import { slugify } from "@/data/contentModel";
import { cn } from "@/lib/utils";

import { blankEvent } from "./factories";
import { Checkbox, Field, Panel, Select, TextArea } from "./fields";
import { ImageField } from "./ImageField";

const statuses: readonly EventStatus[] = [
  "draft",
  "scheduled",
  "completed",
  "cancelled",
];

function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function EventsEditor({
  events,
  onChange,
}: {
  events: ClubEvent[];
  onChange: (events: ClubEvent[]) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    events[0]?.id ?? null,
  );
  const selected = events.find((event) => event.id === selectedId) ?? null;

  const patch = (changes: Partial<ClubEvent>) => {
    if (!selected) return;
    onChange(
      events.map((event) =>
        event.id === selected.id ? { ...event, ...changes } : event,
      ),
    );
  };

  const add = () => {
    const event = blankEvent();
    onChange([event, ...events]);
    setSelectedId(event.id);
  };

  const remove = (id: string) => {
    const next = events.filter((event) => event.id !== id);
    onChange(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
      <div className="border border-ink/15 bg-warm-white">
        <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2.5">
          <h2 className="m-0 text-[0.72rem] font-black tracking-[0.1em] uppercase">
            Events ({events.length})
          </h2>
          <button
            type="button"
            onClick={add}
            className="rounded-sm bg-ink px-3 py-1.5 text-[0.62rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-charcoal"
          >
            + Add
          </button>
        </div>
        <ul className="m-0 list-none p-0">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-stretch border-b border-ink/10 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setSelectedId(event.id)}
                className={cn(
                  "min-w-0 flex-1 px-3 py-3 text-left transition-colors hover:bg-gold-bright/15",
                  selectedId === event.id && "bg-gold-bright/25",
                )}
              >
                <span className="block truncate text-[0.82rem] font-bold uppercase">
                  {event.title}
                </span>
                <span className="block text-[0.6rem] tracking-[0.06em] text-muted-gray uppercase">
                  {event.status}
                  {event.published ? " · live" : " · hidden"}
                </span>
              </button>
              <button
                type="button"
                aria-label={`Delete ${event.title}`}
                onClick={() => remove(event.id)}
                className="px-3 text-lg leading-none text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </li>
          ))}
          {events.length === 0 ? (
            <li className="px-3 py-4 text-[0.8rem] text-muted-gray">
              No events yet.
            </li>
          ) : null}
        </ul>
      </div>

      {selected ? (
        <Panel
          title={`Editing: ${selected.title || "Untitled event"}`}
          actions={
            <Checkbox
              label="Published"
              checked={selected.published}
              onChange={(checked) => patch({ published: checked })}
            />
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              value={selected.title}
              onChange={(value) => patch({ title: value })}
            />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Field
                  label="Slug (URL)"
                  value={selected.slug}
                  onChange={(value) => patch({ slug: value })}
                />
              </div>
              <button
                type="button"
                onClick={() => patch({ slug: slugify(selected.title) })}
                className="mb-0.5 rounded-sm border border-ink/25 px-2 py-2 text-[0.6rem] font-black uppercase hover:border-gold-deep"
              >
                From title
              </button>
            </div>
            <Field
              label="Date (e.g. 14 March 2026)"
              value={selected.date ?? ""}
              onChange={(value) => patch({ date: nullable(value) })}
            />
            <Field
              label="Time"
              value={selected.time ?? ""}
              onChange={(value) => patch({ time: nullable(value) })}
            />
            <Field
              label="Location"
              value={selected.location ?? ""}
              onChange={(value) => patch({ location: nullable(value) })}
            />
            <Field
              label="Registration link"
              value={selected.registrationLink ?? ""}
              onChange={(value) => patch({ registrationLink: nullable(value) })}
            />
            <Field
              label="Linked run slug"
              value={selected.runSlug ?? ""}
              onChange={(value) => patch({ runSlug: nullable(value) })}
            />
            <Select
              label="Status"
              value={selected.status}
              options={statuses}
              onChange={(status) => patch({ status })}
            />
          </div>

          <TextArea
            label="Description"
            value={selected.description}
            onChange={(value) => patch({ description: value })}
            rows={4}
          />

          <ImageField
            label="Cover image"
            value={selected.coverImage ?? ""}
            onChange={(url) => patch({ coverImage: url || null })}
          />
        </Panel>
      ) : (
        <div className="border border-dashed border-ink/25 p-8 text-center text-[0.85rem] text-muted-gray">
          Select an event to edit it, or add a new one.
        </div>
      )}
    </div>
  );
}
