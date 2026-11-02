import { useContext } from "react";

import { ContentContext, type ContentContextValue } from "./contentState";

export function useContent(): ContentContextValue {
  return useContext(ContentContext);
}
