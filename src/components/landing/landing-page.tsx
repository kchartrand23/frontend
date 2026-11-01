"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { UploadSuccessBanner } from "@/components/upload/upload-success-banner";
import { useDocumentCatalog } from "@/lib/documents/use-document-catalog";
import type { DocumentSearchTypeFilter } from "@/lib/document-types";
import { DocumentCard } from "./document-card";
import { LandingHeroSearch } from "./landing-hero-search";

export function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [documentType, setDocumentType] =
    useState<DocumentSearchTypeFilter>("All");
  const [uploadSuccessVisible, setUploadSuccessVisible] = useState(false);
  const catalogState = useDocumentCatalog();

  const recentDocuments =
    catalogState.status === "ready" ? catalogState.catalog.recent : [];
  const relatedDocuments =
    catalogState.status === "ready" ? catalogState.catalog.related : [];

  useEffect(() => {
    if (searchParams.get("upload") !== "success") return;
    setUploadSuccessVisible(true);
    router.replace("/", { scroll: false });
  }, [searchParams, router]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredRecent = useMemo(() => {
    return recentDocuments.filter((doc) => {
      if (documentType !== "All" && doc.category !== documentType) {
        return false;
      }
      if (!normalizedQuery) return true;
      const haystack =
        `${doc.title} ${doc.jobId} ${doc.customer} ${doc.category}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [documentType, normalizedQuery, recentDocuments]);

  return (
    <div className="min-h-full bg-white text-zinc-900">
      <AppHeader />

      <LandingHeroSearch
        query={query}
        onQueryChange={setQuery}
        documentType={documentType}
        onDocumentTypeChange={setDocumentType}
        onSubmit={() => {
          const trimmed = query.trim();
          router.push(
            trimmed
              ? `/documents?q=${encodeURIComponent(trimmed)}`
              : "/documents",
          );
        }}
      />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        {uploadSuccessVisible && (
          <UploadSuccessBanner onDismiss={() => setUploadSuccessVisible(false)} />
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              Recent Documents
            </h2>
            <a
              href="/documents"
              className="text-sm font-medium text-[#5A4AF4] hover:text-[#4a3ae0]"
            >
              View all
            </a>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            {catalogState.status === "loading" && (
              <p className="px-4 py-8 text-center text-sm text-zinc-500">
                Loading documents…
              </p>
            )}
            {catalogState.status === "error" && (
              <p className="px-4 py-8 text-center text-sm text-red-600" role="alert">
                {catalogState.message}
              </p>
            )}
            {catalogState.status === "ready" && filteredRecent.length > 0 ? (
              filteredRecent.map((doc) => {
                const trimmedQuery = query.trim();
                const docHref = trimmedQuery
                  ? `/documents/${doc.id}?q=${encodeURIComponent(trimmedQuery)}`
                  : `/documents/${doc.id}`;
                return (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  variant="row"
                  href={docHref}
                />
                );
              })
            ) : catalogState.status === "ready" ? (
              <p className="px-4 py-8 text-center text-sm text-zinc-500">
                No documents match your search or document type.
              </p>
            ) : null}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              Documents related to me
            </h2>
            <a
              href="#"
              className="text-sm font-medium text-[#5A4AF4] hover:text-[#4a3ae0]"
            >
              View all
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {catalogState.status === "ready" &&
            relatedDocuments.length === 0 ? (
              <p className="col-span-full px-4 py-6 text-center text-sm text-zinc-500">
                No related documents yet.
              </p>
            ) : null}
            {catalogState.status === "ready" &&
            relatedDocuments.map((doc) => {
              const trimmedQuery = query.trim();
              const docHref = trimmedQuery
                ? `/documents/${doc.id}?q=${encodeURIComponent(trimmedQuery)}`
                : `/documents/${doc.id}`;
              return (
              <DocumentCard
                key={doc.id}
                document={doc}
                variant="card"
                href={docHref}
              />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
