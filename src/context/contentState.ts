import { createContext } from "react";

import { buildSeedContent, type SiteContent } from "@/data/contentModel";

export type ContentContextValue = {
  content: SiteContent;
  ready: boolean;
  source: "seed" | "remote";
  refresh: () => Promise<void>;
};

/**
 * Default value is the seed, so a component rendered without the provider
 * (for example in a unit test) still has real club data to show.
 */
export const contentContextDefault: ContentContextValue = {
  content: buildSeedContent(),
  ready: true,
  source: "seed",
  refresh: async () => {},
};

export const ContentContext = createContext<ContentContextValue>(
  contentContextDefault,
);
