"use client";

import Link from "next/link";
import { useState } from "react";
import {
  buildDocumentDetailPath,
  useDocumentSearchNav,
} from "@/components/documents/document-search-nav-context";
import { buildSharePagePath } from "@/lib/share-navigation";
import { DocumentDownloadButton } from "@/components/documents/document-download-button";
import {
  DocumentMetadataTab,
  DocumentPreviewTab,
  DocumentVersionsTab,
} from "@/components/documents/document-detail-page";
import type { DocumentItem } from "@/lib/mock-documents";
import { getJobByNumber } from "@/lib/mock-jobs";

const RESULT_TABS = ["Preview", "Document Details", "Version History"] as const;
type ResultTab = (typeof RESULT_TABS)[number];

type DocumentSearchResultPanelProps = {
  document: DocumentItem;
  closeHref: string;
};

export function DocumentSearchResultPanel({
  document,
  closeHref,
}: DocumentSearchResultPanelProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>("Preview");
  const { query } = useDocumentSearchNav();
  const job = getJobByNumber(document.jobId);
  const shareHref = buildSharePagePath(
    buildDocumentDetailPath(document.id, query),
    document.id,
  );
  const versionTabLabel =
    document.versionCount > 1
      ? `Version History (${document.versionCount})`
      : "Version History";

  if (!job) {
    return (
      <aside className="flex h-full w-full flex-col border-l border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        Unable to load document details.
      </aside>
    );
  }

  return (
    <aside
      className="flex max-h-[calc(100vh-5.5rem)] w-full max-w-md shrink-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm lg:w-[min(100%,22rem)] xl:w-[26rem]"
      aria-label="Document details"
    >
      <div className="flex shrink-0 items-start justify-end border-b border-zinc-100 px-4 py-3">
        <Link
          href={closeHref}
          className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Close document details"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>
      </div>

      <div className="shrink-0 px-4 pb-4">
        <p className="text-sm font-medium text-zinc-900">{document.category}</p>
        <h2 className="mt-2 text-lg font-bold leading-snug text-zinc-900">
          {document.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {document.uploadedOn} · {document.version}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={shareHref}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Share
          </Link>
          <DocumentDownloadButton
            document={document}
            className="inline-flex items-center justify-center rounded-lg bg-[#1a2744] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#152038] disabled:opacity-60"
          />
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Internal Share and Download allowed. External sharing is off.
        </p>
      </div>

      <div className="flex shrink-0 border-b border-zinc-100 px-2">
        {RESULT_TABS.map((tab) => {
          const label = tab === "Version History" ? versionTabLabel : tab;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-xs font-medium sm:text-sm ${
                isActive
                  ? "border-b-2 border-[#1a2744] text-[#1a2744]"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === "Preview" && (
          <div>
            <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
              <span>Page 1 of {Math.max(document.versionCount, 1)}</span>
              <span>100% · Fit page</span>
            </div>
            <DocumentPreviewTab
              document={document}
              job={job}
              hideCategoryIcon
            />
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Roof framing notes
            </p>
          </div>
        )}
        {activeTab === "Document Details" && (
          <DocumentMetadataTab document={document} job={job} />
        )}
        {activeTab === "Version History" && (
          <DocumentVersionsTab document={document} />
        )}
      </div>
    </aside>
  );
}
