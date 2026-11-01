"use client";

import { useEffect, useState } from "react";
import {
  fetchDocumentCatalog,
  type DocumentCatalogResponse,
} from "@/lib/documents/client-api";

type CatalogState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; catalog: DocumentCatalogResponse };

export function useDocumentCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchDocumentCatalog()
      .then((catalog) => {
        if (!cancelled) setState({ status: "ready", catalog });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Unable to load documents.";
        setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
