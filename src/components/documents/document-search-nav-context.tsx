"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  DOCUMENT_SEARCH_TYPE_OPTIONS,
  isDocumentSearchTypeFilter,
  type DocumentSearchTypeFilter,
} from "@/lib/document-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const DOCUMENT_SEARCH_SCOPE_OPTIONS = DOCUMENT_SEARCH_TYPE_OPTIONS;
export type DocumentSearchScope = DocumentSearchTypeFilter;

export function buildDocumentsListPath(query: string) {
  const trimmed = query.trim();
  return trimmed
    ? `/documents?q=${encodeURIComponent(trimmed)}`
    : "/documents";
}

export function buildDocumentDetailPath(id: string, query: string) {
  const trimmed = query.trim();
  const base = `/documents/${encodeURIComponent(id)}`;
  return trimmed ? `${base}?q=${encodeURIComponent(trimmed)}` : base;
}

type DocumentSearchNavContextValue = {
  query: string;
  setQuery: (value: string) => void;
  scope: DocumentSearchScope;
  setScope: (value: DocumentSearchScope) => void;
  submitSearch: () => void;
};

const DocumentSearchNavContext =
  createContext<DocumentSearchNavContextValue | null>(null);

export function DocumentSearchNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQueryState] = useState("");
  const [scope, setScopeState] = useState<DocumentSearchScope>("All");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q.length <= 200) {
      setQueryState(q);
    }
  }, [searchParams]);

  const setQuery = useCallback((value: string) => {
    setQueryState(value.slice(0, 200));
  }, []);

  const setScope = useCallback((value: DocumentSearchScope) => {
    if (isDocumentSearchTypeFilter(value)) {
      setScopeState(value);
    }
  }, []);

  const submitSearch = useCallback(() => {
    router.push(buildDocumentsListPath(query));
  }, [query, router]);

  const value = useMemo(
    () => ({ query, setQuery, scope, setScope, submitSearch }),
    [query, setQuery, scope, setScope, submitSearch],
  );

  return (
    <DocumentSearchNavContext.Provider value={value}>
      {children}
    </DocumentSearchNavContext.Provider>
  );
}

export function useDocumentSearchNav() {
  const context = useContext(DocumentSearchNavContext);
  if (!context) {
    throw new Error(
      "useDocumentSearchNav must be used within DocumentSearchNavProvider",
    );
  }
  return context;
}
