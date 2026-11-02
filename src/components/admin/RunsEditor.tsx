import { useState } from "react";

import type { HashRun, RunStatus } from "@/data/runs";
import { slugify } from "@/data/contentModel";
import { cn } from "@/lib/utils";

import { blankRun } from "./factories";
import { Checkbox, Field, Panel, Select, TextArea } from "./fields";
import { ImageField, MultiImageField } from "./ImageField";

const statuses: readonly RunStatus[] = ["draft", "upcoming", "completed"];

function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function RunsEditor({
  runs,
  onChange,
}: {
  runs: HashRun[];
  onChange: (runs: HashRun[]) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    runs[0]?.id ?? null,
  );
  const selected = runs.find((run) => run.id === selectedId) ?? null;

  const patch = (changes: Partial<HashRun>) => {
    if (!selected) return;
    onChange(
      runs.map((run) =>
        run.id === selected.id ? { ...run, ...changes } : run,
      ),
    );
  };

  const add = () => {
    const run = blankRun();
    onChange([run, ...runs]);
    setSelectedId(run.id);
  };

  const remove = (id: string) => {
    const next = runs.filter((run) => run.id !== id);
    onChange(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
      <div className="border border-ink/15 bg-warm-white">
        <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2.5">
          <h2 className="m-0 text-[0.72rem] font-black tracking-[0.1em] uppercase">
            Runs ({runs.length})
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
          {runs.map((run) => (
            <li
              key={run.id}
              className="flex items-stretch border-b border-ink/10 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setSelectedId(run.id)}
                className={cn(
                  "min-w-0 flex-1 px-3 py-3 text-left transition-colors hover:bg-gold-bright/15",
                  selectedId === run.id && "bg-gold-bright/25",
                )}
              >
                <span className="block truncate text-[0.82rem] font-bold uppercase">
                  {run.title}
                </span>
                <span className="block text-[0.6rem] tracking-[0.06em] text-muted-gray uppercase">
                  {run.status}
                  {run.published ? " · live" : " · hidden"}
                </span>
              </button>
              <button
                type="button"
                aria-label={`Delete ${run.title}`}
                onClick={() => remove(run.id)}
                className="px-3 text-lg leading-none text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </li>
          ))}
          {runs.length === 0 ? (
            <li className="px-3 py-4 text-[0.8rem] text-muted-gray">
              No runs yet.
            </li>
          ) : null}
        </ul>
      </div>

      {selected ? (
        <Panel
          title={`Editing: ${selected.title || "Untitled run"}`}
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
              label="Hash number"
              value={selected.hashNumber ?? ""}
              onChange={(value) => patch({ hashNumber: nullable(value) })}
            />
            <Field
              label="Date (e.g. 2 October 2026)"
              value={selected.date ?? ""}
              onChange={(value) => patch({ date: nullable(value) })}
            />
            <Field
              label="Start time"
              value={selected.startTime ?? ""}
              onChange={(value) => patch({ startTime: nullable(value) })}
            />
            <Field
              label="Meeting location"
              value={selected.meetingLocation ?? ""}
              onChange={(value) => patch({ meetingLocation: nullable(value) })}
            />
            <Field
              label="Distance"
              value={selected.distance ?? ""}
              onChange={(value) => patch({ distance: nullable(value) })}
            />
            <Field
              label="Difficulty"
              value={selected.difficulty ?? ""}
              onChange={(value) => patch({ difficulty: nullable(value) })}
            />
            <Field
              label="Terrain"
              value={selected.terrain ?? ""}
              onChange={(value) => patch({ terrain: nullable(value) })}
            />
            <Field
              label="Hares (comma separated)"
              value={selected.hares.join(", ")}
              onChange={(value) =>
                patch({
                  hares: value
                    .split(",")
                    .map((hare) => hare.trim())
                    .filter(Boolean),
                })
              }
            />
            <Select
              label="Status"
              value={selected.status}
              options={statuses}
              onChange={(status) => patch({ status })}
            />
          </div>

          <TextArea
            label="Summary"
            value={selected.summary}
            onChange={(value) => patch({ summary: value })}
            rows={3}
          />

          <TextArea
            label="Story (blank line between paragraphs)"
            value={selected.story.join("\n\n")}
            onChange={(value) =>
              patch({
                story: value
                  .split(/\n\s*\n/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean),
              })
            }
            rows={6}
          />

          <TextArea
            label="Memorable moments (one per line)"
            value={selected.memorableMoments.join("\n")}
            onChange={(value) =>
              patch({
                memorableMoments: value
                  .split(/\r?\n/)
                  .map((moment) => moment.trim())
                  .filter(Boolean),
              })
            }
            rows={3}
          />

          <ImageField
            label="Cover image"
            value={selected.coverImage}
            onChange={(url) => patch({ coverImage: url })}
          />

          <MultiImageField
            label="Run photographs"
            values={selected.galleryImages}
            onChange={(urls) => patch({ galleryImages: urls })}
          />
        </Panel>
      ) : (
        <div className="border border-dashed border-ink/25 p-8 text-center text-[0.85rem] text-muted-gray">
          Select a run to edit it, or add a new one.
        </div>
      )}
    </div>
  );
}
