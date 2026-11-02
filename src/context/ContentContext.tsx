import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import {
  buildSeedContent,
  normaliseContent,
  type SiteContent,
} from "@/data/contentModel";

import { ContentContext } from "./contentState";

/** How often a visitor's page re-checks for new published content. */
const POLL_MS = 30_000;

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => buildSeedContent());
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<"seed" | "remote">("seed");
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/content", { cache: "no-store" });
      if (!response.ok) return;
      const body = (await response.json()) as { content?: unknown };
      const next = normaliseContent(body.content);
      if (next && mounted.current) {
        setContent(next);
        setSource("remote");
      }
    } catch {
      /* Offline or functions not configured: keep the content we have. */
    } finally {
      if (mounted.current) setReady(true);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    /* Tests render from the seed and must not fire network requests. */
    if (import.meta.env.MODE === "test") {
      setReady(true);
      return () => {
        mounted.current = false;
      };
    }

    void refresh();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, POLL_MS);

    const onOnline = () => void refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted.current = false;
      window.clearInterval(interval);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return (
    <ContentContext.Provider value={{ content, ready, source, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}
