"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  buildDocumentDetailPath,
  buildDocumentsListPath,
  useDocumentSearchNav,
} from "@/components/documents/document-search-nav-context";
import {
  DocumentSearchFiltersDrawer,
  FiltersToolbarButton,
} from "@/components/documents/document-search-filters-sidebar";
import { DocumentSearchResultPanel } from "@/components/documents/document-search-result-panel";
import { useDocumentCatalog } from "@/lib/documents/use-document-catalog";
import {
  documentMatchesMetadataFilters,
  hasActiveMetadataFilters,
  type DocumentMetadataFilters,
} from "@/lib/document-search-filters";
import { getJobByNumber } from "@/lib/mock-jobs";

function formatVersion(version: string): string {
  return version.trim() ? version : "—";
}

export function DocumentSearchView() {
  const pathname = usePathname();
  const { query } = useDocumentSearchNav();
  const selectedDocumentId = pathname.match(/^\/documents\/([^/]+)$/)?.[1];
  const catalogState = useDocumentCatalog();
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [metadataFilters, setMetadataFilters] = useState<DocumentMetadataFilters>(
    {},
  );

  const onFilterChange = useCallback((fieldId: string, value: string) => {
    setMetadataFilters((prev) => {
      const next = { ...prev, [fieldId]: value };
      if (!value.trim()) {
        delete next[fieldId];
      }
      return next;
    });
  }, []);

  const allDocuments =
    catalogState.status === "ready" ? catalogState.catalog.documents : [];

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return allDocuments.filter((doc) => {
      const job = getJobByNumber(doc.jobId);
      if (!documentMatchesMetadataFilters(doc, metadataFilters, job)) {
        return false;
      }
      if (!needle) return true;
      const haystack =
        `${doc.title} ${doc.jobId} ${doc.customer} ${doc.category} ${doc.branch}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [allDocuments, metadataFilters, query]);

  const selectedDocument = useMemo(() => {
    if (!selectedDocumentId || catalogState.status !== "ready") {
      return undefined;
    }
    return catalogState.catalog.documents.find(
      (doc) => doc.id === selectedDocumentId,
    );
  }, [catalogState, selectedDocumentId]);

  const trimmedQuery = query.trim();
  const resultCountLabel = trimmedQuery
    ? `${results.length} Result${results.length === 1 ? "" : "s"} for '${trimmedQuery}'`
    : `${results.length} Result${results.length === 1 ? "" : "s"}`;

  const closePanelHref = buildDocumentsListPath(query);

  const filtersActive = filtersOpen || hasActiveMetadataFilters(metadataFilters);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
      <div className="flex min-h-0 flex-1 gap-4">
        <DocumentSearchFiltersDrawer
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filters={metadataFilters}
          onFilterChange={onFilterChange}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-zinc-100 px-4 py-3">
              <div className="justify-self-start">
                <FiltersToolbarButton
                  active={filtersActive}
                  onClick={() => setFiltersOpen((open) => !open)}
                />
              </div>
              <p className="text-center text-sm font-semibold text-zinc-900 sm:text-base">
                {resultCountLabel}
              </p>
              <label className="flex items-center justify-self-end gap-2 text-sm text-zinc-600">
                <span>Sort:</span>
                <select
                  defaultValue="relevance"
                  className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm outline-none focus:border-[#1a2744]/40"
                  aria-label="Sort results"
                >
                  <option value="relevance">Relevance</option>
                  <option value="modified">Created</option>
                  <option value="name">Document</option>
                </select>
              </label>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {catalogState.status === "loading" && (
                <p className="px-4 py-12 text-center text-sm text-zinc-500">
                  Loading documents…
                </p>
              )}
              {catalogState.status === "error" && (
                <p className="px-4 py-12 text-center text-sm text-red-600" role="alert">
                  {catalogState.message}
                </p>
              )}
              {catalogState.status === "ready" && (
                <table className="min-w-[480px] w-full text-left">
                  <thead className="sticky top-0 z-10 border-b border-zinc-100 bg-zinc-50/95">
                    <tr className="text-xs font-medium text-zinc-500">
                      <th className="px-4 py-3 font-medium">Document</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length > 0 ? (
                      results.map((doc) => {
                        const isSelected = doc.id === selectedDocumentId;
                        const href = buildDocumentDetailPath(doc.id, query);
                        return (
                          <tr
                            key={doc.id}
                            className={`border-b border-zinc-100 last:border-b-0 ${
                              isSelected ? "bg-sky-50/90" : "hover:bg-zinc-50/80"
                            }`}
                          >
                            <td className="px-4 py-3.5">
                              <Link
                                href={href}
                                className="text-sm font-medium text-zinc-900 outline-none hover:text-[#1a2744] focus-visible:ring-2 focus-visible:ring-[#1a2744]/30"
                                aria-current={isSelected ? "true" : undefined}
                              >
                                {doc.title}
                              </Link>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-zinc-900">
                              <Link href={href} tabIndex={-1} className="block">
                                {doc.category}
                              </Link>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-zinc-700">
                              <Link href={href} tabIndex={-1} className="block">
                                {formatVersion(doc.version)}
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-12 text-center text-sm text-zinc-500"
                        >
                          No documents match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-center gap-3 border-t border-zinc-100 px-4 py-3">
              <button
                type="button"
                disabled
                className="rounded p-1 text-zinc-300"
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-sm font-medium text-zinc-700">
                1
              </span>
              <button
                type="button"
                disabled
                className="rounded p-1 text-zinc-300"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>

          {selectedDocument && (
            <DocumentSearchResultPanel
              document={selectedDocument}
              closeHref={closePanelHref}
            />
          )}
        </div>
      </div>
    </div>
  );
}
