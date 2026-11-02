import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { EventsEditor } from "@/components/admin/EventsEditor";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { RunsEditor } from "@/components/admin/RunsEditor";
import { buildSeedContent, type SiteContent } from "@/data/contentModel";
import {
  fetchContent,
  getSession,
  login,
  logout,
  saveContent,
} from "@/lib/adminApi";
import { clearDraft, readDraft, writeDraft } from "@/lib/offlineStore";
import { cn } from "@/lib/utils";

type AuthState = "checking" | "out" | "in";
type Tab = "runs" | "events" | "gallery";
type SyncState =
  | "loading"
  | "synced"
  | "unsaved"
  | "saving"
  | "pending"
  | "seed";

const SYNC_LABELS: Record<SyncState, string> = {
  loading: "Loading…",
  synced: "All changes saved",
  unsaved: "Unsaved changes",
  saving: "Saving…",
  pending: "Waiting to sync",
  seed: "Offline sample content",
};

const SYNC_STYLES: Record<SyncState, string> = {
  loading: "bg-ink/10 text-ink",
  synced: "bg-emerald-600/15 text-emerald-800",
  unsaved: "bg-gold-bright/40 text-ink",
  saving: "bg-sky-600/15 text-sky-800",
  pending: "bg-red-600/15 text-red-800",
  seed: "bg-ink/10 text-ink",
};

const primaryButton =
  "inline-flex items-center justify-center rounded-sm bg-ink px-4 py-2.5 text-[0.68rem] font-black tracking-[0.1em] uppercase text-warm-white transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50";

const ghostButton =
  "inline-flex items-center justify-center rounded-sm border border-ink/25 bg-pure-white px-3 py-2 text-[0.64rem] font-black tracking-[0.08em] uppercase text-ink transition-colors hover:border-gold-deep hover:bg-gold-bright/20 disabled:opacity-50";

export function AdminPage() {
  const [auth, setAuth] = useState<AuthState>("checking");

  useEffect(() => {
    let cancelled = false;
    void getSession().then((authenticated) => {
      if (!cancelled) setAuth(authenticated ? "in" : "out");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (auth === "checking") {
    return (
      <main className="grid min-h-[60vh] place-items-center px-4">
        <p className="text-[0.8rem] font-semibold tracking-[0.08em] text-muted-gray uppercase">
          Checking session…
        </p>
      </main>
    );
  }

  if (auth === "out") {
    return <LoginScreen onSignedIn={() => setAuth("in")} />;
  }

  return <AdminDashboard onSignedOut={() => setAuth("out")} />;
}

function LoginScreen({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    const result = await login(password);
    setBusy(false);
    if (result.ok) {
      setPassword("");
      onSignedIn();
    } else {
      setError(result.error);
    }
  };

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
      <form
        onSubmit={submit}
        className="w-full border border-ink/15 bg-warm-white p-6 shadow-sm sm:p-8"
      >
        <p className="m-0 text-[0.6rem] font-black tracking-[0.16em] text-gold-deep uppercase">
          West West Hash House Harriers
        </p>
        <h1 className="mt-2 mb-1 text-2xl font-black tracking-tight uppercase">
          Admin sign in
        </h1>
        <p className="mt-0 mb-6 text-[0.85rem] leading-relaxed text-muted-gray">
          Enter the club password to edit runs, events and gallery photos.
        </p>

        <label className="block" htmlFor="admin-password">
          <span className="text-[0.64rem] font-black tracking-[0.08em] text-ink/70 uppercase">
            Password
          </span>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-pure-white px-3 py-2.5 text-[0.95rem] text-ink outline-none focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/25"
          />
        </label>

        {error ? (
          <p
            role="alert"
            className="mt-3 mb-0 rounded-sm bg-red-600/10 px-3 py-2 text-[0.78rem] font-semibold text-red-800"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || !password}
          className={`${primaryButton} mt-5 w-full`}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <Link
          to="/"
          className="mt-4 block text-center text-[0.66rem] font-black tracking-[0.08em] text-muted-gray uppercase hover:text-ink"
        >
          ← Back to the site
        </Link>
        <p className="mt-5 mb-0 text-center text-[0.68rem] leading-relaxed text-muted-gray">
          Offline? Open /admin at any time to edit drafts already saved on this
          device; they sync when you reconnect.
        </p>
      </form>
    </main>
  );
}

function AdminDashboard({ onSignedOut }: { onSignedOut: () => void }) {
  const [content, setContent] = useState<SiteContent>(() => buildSeedContent());
  const [sync, setSync] = useState<SyncState>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("runs");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const draft = readDraft();
      if (draft) {
        if (cancelled) return;
        setContent(draft.content);
        setSync(draft.pending ? "pending" : "unsaved");
        setMessage(
          draft.pending
            ? "You have changes waiting to sync from this device."
            : "Loaded unsaved changes from this device.",
        );
        return;
      }
      const remote = await fetchContent();
      if (cancelled) return;
      if (remote) {
        setContent(remote);
        setSync("synced");
        setLastSaved(new Date());
      } else {
        setSync("seed");
        setMessage(
          "Could not reach the server. Showing the built-in sample content — edits stay on this device until it reconnects.",
        );
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((next: SiteContent) => {
    setContent(next);
    writeDraft(next, false);
    setSync((previous) => (previous === "saving" ? previous : "unsaved"));
    setMessage(null);
  }, []);

  const save = useCallback(async () => {
    const current = contentRef.current;
    setSync("saving");
    setMessage(null);
    writeDraft(current, true);
    try {
      const result = await saveContent(current);
      if (contentRef.current === current) {
        clearDraft();
        setSync("synced");
        setContent((previous) => ({
          ...previous,
          version: result.version,
          updatedAt: result.updatedAt,
        }));
        setLastSaved(new Date(result.updatedAt));
        setMessage("Saved. The public site refreshes within about 30 seconds.");
      } else {
        writeDraft(contentRef.current, false);
        setSync("unsaved");
        setMessage(
          "Saved the earlier edits. Newer changes made during the save are still unsaved.",
        );
      }
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : "Save failed.";
      setSync("pending");
      setMessage(
        `${detail} Your changes are kept on this device and retry automatically.`,
      );
    }
  }, []);

  useEffect(() => {
    const retry = () => {
      if (sync === "pending" && navigator.onLine) void save();
    };
    const interval = window.setInterval(retry, 20000);
    window.addEventListener("online", retry);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("online", retry);
    };
  }, [sync, save]);

  const reload = async () => {
    const remote = await fetchContent();
    if (!remote) {
      setMessage("Could not reach the server. Keeping the copy on this device.");
      return;
    }
    clearDraft();
    setContent(remote);
    setSync("synced");
    setLastSaved(new Date());
    setMessage("Reloaded the latest content from the server.");
  };

  const signOut = async () => {
    await logout();
    onSignedOut();
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "runs", label: "Runs", count: content.runs.length },
    { id: "events", label: "Events", count: content.events.length },
    { id: "gallery", label: "Photos", count: content.gallery.length },
  ];

  return (
    <main className="mx-auto max-w-[84rem] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/15 pb-5">
        <div>
          <p className="m-0 text-[0.6rem] font-black tracking-[0.16em] text-gold-deep uppercase">
            West West Hash House Harriers
          </p>
          <h1 className="mt-1 mb-0 text-2xl font-black tracking-tight uppercase sm:text-3xl">
            Content admin
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1.5 text-[0.6rem] font-black tracking-[0.08em] uppercase",
              SYNC_STYLES[sync],
            )}
          >
            {SYNC_LABELS[sync]}
          </span>
          <button type="button" className={ghostButton} onClick={() => void reload()}>
            Reload
          </button>
          <button type="button" className={ghostButton} onClick={() => void signOut()}>
            Sign out
          </button>
          <button
            type="button"
            className={primaryButton}
            disabled={sync === "saving" || sync === "loading"}
            onClick={() => void save()}
          >
            Save changes
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Content sections" className="flex flex-wrap gap-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-sm px-3 py-2 text-[0.66rem] font-black tracking-[0.08em] uppercase transition-colors",
                tab === item.id
                  ? "bg-ink text-warm-white"
                  : "border border-ink/15 bg-warm-white text-ink hover:border-gold-deep",
              )}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-[0.66rem] text-muted-gray">
          {lastSaved ? (
            <span>Last saved {lastSaved.toLocaleTimeString()}</span>
          ) : null}
          <Link to="/" className="font-black uppercase hover:text-ink">
            View site →
          </Link>
        </div>
      </div>

      {message ? (
        <p className="mt-4 mb-0 rounded-sm border border-ink/15 bg-warm-white px-3 py-2 text-[0.78rem] leading-relaxed text-ink">
          {message}
        </p>
      ) : null}

      <div className="mt-6">
        {tab === "runs" ? (
          <RunsEditor
            runs={content.runs}
            onChange={(runs) => update({ ...content, runs })}
          />
        ) : null}
        {tab === "events" ? (
          <EventsEditor
            events={content.events}
            onChange={(events) => update({ ...content, events })}
          />
        ) : null}
        {tab === "gallery" ? (
          <GalleryEditor
            gallery={content.gallery}
            onChange={(gallery) => update({ ...content, gallery })}
          />
        ) : null}
      </div>
    </main>
  );
}
