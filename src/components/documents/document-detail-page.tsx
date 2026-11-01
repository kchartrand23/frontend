"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { DocumentDownloadButton } from "@/components/documents/document-download-button";
import {
  buildDocumentDetailPath,
} from "@/components/documents/document-search-nav-context";
import { buildSharePagePath } from "@/lib/share-navigation";
import { CategoryTag } from "@/components/landing/category-tag";
import { FileTypeIcon } from "@/components/landing/file-type-icon";
import {
  documentFileName,
  getDocumentVersionHistory,
  type DocumentItem,
  type DocumentVersionEntry,
} from "@/lib/mock-documents";
import { getDocumentMetadataRows } from "@/lib/document-metadata-display";
import { getJobByNumber, type JobItem } from "@/lib/mock-jobs";

const DETAIL_TABS = ["Overview", "Preview", "Metadata", "Versions"] as const;

type DetailTab = (typeof DETAIL_TABS)[number];

type DocumentDetailBodyProps = {
  document: DocumentItem;
  job: JobItem;
  variant: "page" | "panel";
};

function previewCaption(document: DocumentItem): string {
  if (document.category === "Plan") {
    return `Floor plan preview – ${document.title}`;
  }
  if (document.category === "Photo") {
    return `Photo preview – ${document.title}`;
  }
  return `Document preview – ${document.title}`;
}

function FloorPlanPreviewArt() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="h-full w-full text-zinc-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden
    >
      <rect x="24" y="20" width="272" height="180" rx="2" />
      <path d="M24 110h272M160 20v180" />
      <rect x="40" y="36" width="48" height="32" rx="1" />
      <rect x="108" y="36" width="40" height="56" rx="1" />
      <rect x="232" y="36" width="48" height="40" rx="1" />
      <rect x="40" y="128" width="96" height="56" rx="1" />
      <rect x="168" y="128" width="112" height="56" rx="1" />
      <path d="M148 148h24v16h-24z" />
      <circle cx="200" cy="156" r="8" />
    </svg>
  );
}

function PhotoPreviewArt() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="h-full w-full text-zinc-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden
    >
      <rect x="40" y="30" width="240" height="160" rx="4" />
      <circle cx="110" cy="90" r="24" />
      <path d="M56 170l64-48 48 36 32-24 64 52" />
    </svg>
  );
}

function DocumentPreviewArt({ category }: { category: DocumentItem["category"] }) {
  if (category === "Photo") return <PhotoPreviewArt />;
  return <FloorPlanPreviewArt />;
}

export function DocumentMetadataTab({
  document,
  job,
}: {
  document: DocumentItem;
  job?: JobItem | null;
}) {
  const resolvedJob = job === undefined ? getJobByNumber(document.jobId) : job;
  const rows = getDocumentMetadataRows(document, resolvedJob);

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-xs font-medium text-zinc-500">{row.label}</dt>
          <dd className="mt-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function VersionTimelineItem({
  document,
  entry,
  isLast,
}: {
  document: DocumentItem;
  entry: DocumentVersionEntry;
  isLast: boolean;
}) {
  return (
    <li className="relative flex gap-3 pb-6 last:pb-0">
      {!isLast && (
        <span
          className="absolute left-[13px] top-8 bottom-0 w-px bg-zinc-200"
          aria-hidden
        />
      )}
      <div
        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
          entry.isCurrent
            ? "bg-[#5A4AF4] text-white"
            : "border-2 border-zinc-200 bg-white text-zinc-500"
        }`}
      >
        {entry.versionLabel}
      </div>
      <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {entry.versionLabel}
            </span>
            {entry.isCurrent && (
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                Current
              </span>
            )}
          </div>
          {!entry.isCurrent && (
            <DocumentDownloadButton
              document={document}
              versionLabel={entry.versionLabel}
              className="shrink-0 text-xs font-medium text-[#5A4AF4] hover:text-[#4a3ae0] disabled:opacity-60"
            />
          )}
        </div>
        <p className="mt-2 text-sm text-zinc-700">{entry.comment}</p>
        <p className="mt-2 text-xs text-zinc-500">
          {entry.author} · {entry.date} · {entry.fileSize}
        </p>
      </div>
    </li>
  );
}

export function DocumentVersionsTab({ document }: { document: DocumentItem }) {
  const versions = getDocumentVersionHistory(document);
  const versionLabel =
    versions.length === 1 ? "1 version" : `${versions.length} versions`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900">Version History</h3>
        <span className="text-xs text-zinc-500">{versionLabel}</span>
      </div>
      <ol className="list-none">
        {versions.map((entry, index) => (
          <VersionTimelineItem
            key={`${entry.versionLabel}-${entry.date}`}
            document={document}
            entry={entry}
            isLast={index === versions.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}

export function DocumentPreviewTab({
  document,
  job,
  hideCategoryIcon = false,
}: {
  document: DocumentItem;
  job: JobItem;
  hideCategoryIcon?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100/80">
      <div className="relative border-b border-zinc-200/80 bg-zinc-50 px-4 py-5 text-center">
        {!hideCategoryIcon && (
          <div className="absolute right-3 top-3 text-zinc-400">
            <FileTypeIcon category={document.category} />
          </div>
        )}
        <p
          className={`text-sm font-semibold text-zinc-900 ${hideCategoryIcon ? "" : "pr-8"}`}
        >
          {document.title}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {document.customer} · Job {job.jobNumber}
        </p>
      </div>
      <div className="border-b border-zinc-200/80 bg-white p-4">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <DocumentPreviewArt category={document.category} />
        </div>
      </div>
      <p className="px-4 py-3 text-center text-xs text-zinc-500">
        {previewCaption(document)}
      </p>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 py-2.5 text-sm last:border-b-0">
      <dt className="shrink-0 text-zinc-500">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-zinc-900">{children}</dd>
    </div>
  );
}

function DocumentDetailBody({ document, job, variant }: DocumentDetailBodyProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const shareHref = buildSharePagePath(
    buildDocumentDetailPath(document.id, query),
    document.id,
  );
  const [activeTab, setActiveTab] = useState<DetailTab>("Overview");
  const fileName = documentFileName(document);
  const versionTabLabel =
    document.versionCount > 1
      ? `Versions (${document.versionCount})`
      : "Versions";

  const shellClassName =
    variant === "panel"
      ? "flex w-full shrink-0 flex-col border-t border-zinc-100 bg-zinc-50/30 lg:w-[340px] lg:border-t-0 lg:border-l"
      : "flex flex-col";

  return (
    <div className={shellClassName}>
      <div className="border-b border-zinc-100 bg-white p-4">
        <div className="flex gap-3">
          <FileTypeIcon category={document.category} />
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
              {document.title}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <CategoryTag category={document.category} />
              <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                {document.version} – Current
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-zinc-100 bg-white px-2">
        {DETAIL_TABS.map((tab) => {
          const label = tab === "Versions" ? versionTabLabel : tab;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-xs font-medium transition sm:text-sm ${
                isActive
                  ? "border-b-2 border-[#5A4AF4] text-[#5A4AF4]"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Overview" && (
          <dl className="rounded-xl border border-zinc-200 bg-white px-4 py-1">
            <DetailRow label="File">{fileName}</DetailRow>
            <DetailRow label="Type">{document.category}</DetailRow>
            <DetailRow label="Related to">Job {document.jobId}</DetailRow>
            <DetailRow label="Customer">{document.customer}</DetailRow>
            <DetailRow label="Location">{document.location}</DetailRow>
            <DetailRow label="Uploaded by">{document.owner}</DetailRow>
            <DetailRow label="Uploaded">{document.uploadedOn}</DetailRow>
            <DetailRow label="Retention">{document.retentionPolicy}</DetailRow>
            <DetailRow label="Version">
              {document.version} – Current
            </DetailRow>
          </dl>
        )}

        {activeTab === "Preview" && (
          <DocumentPreviewTab document={document} job={job} />
        )}

        {activeTab === "Metadata" && (
          <DocumentMetadataTab document={document} job={job} />
        )}

        {activeTab === "Versions" && (
          <DocumentVersionsTab document={document} />
        )}
      </div>

      <div className="border-t border-zinc-100 bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Actions
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Open
          </button>
          <DocumentDownloadButton
            document={document}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          />
          <Link
            href={shareHref}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#5A4AF4] px-3 py-2 text-sm font-medium text-white hover:bg-[#4a3ae0]"
          >
            Share
          </Link>
        </div>
      </div>
    </div>
  );
}

type DocumentDetailPageProps = {
  document: DocumentItem;
};

export function DocumentDetailPage({ document }: DocumentDetailPageProps) {
  const job = getJobByNumber(document.jobId);

  if (!job) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-zinc-600">
        Related job could not be loaded.
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-4 sm:px-6">
      <DocumentDetailBody document={document} job={job} variant="page" />
    </main>
  );
}

type DocumentDetailPanelProps = {
  document: DocumentItem;
  job: JobItem;
};

export function DocumentDetailPanel({
  document,
  job,
}: DocumentDetailPanelProps) {
  return (
    <aside aria-label="Document details">
      <DocumentDetailBody document={document} job={job} variant="panel" />
    </aside>
  );
}
