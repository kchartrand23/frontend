"use client";

import { UsLbmLogo } from "@/components/auth/us-lbm-logo";
import {
  DOCUMENT_SEARCH_TYPE_OPTIONS,
  isDocumentSearchTypeFilter,
  type DocumentSearchTypeFilter,
} from "@/lib/document-types";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

type LandingHeroSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  documentType: DocumentSearchTypeFilter;
  onDocumentTypeChange: (value: DocumentSearchTypeFilter) => void;
  onSubmit: () => void;
};

export function LandingHeroSearch({
  query,
  onQueryChange,
  documentType,
  onDocumentTypeChange,
  onSubmit,
}: LandingHeroSearchProps) {
  return (
    <section className="bg-white pb-8 pt-8 text-center sm:pb-10 sm:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto flex justify-center">
          <UsLbmLogo variant="hero" className="h-[4.25rem] w-auto sm:h-[4.75rem]" />
        </div>

        <h1 className="mt-8 text-[1.625rem] font-bold leading-tight tracking-tight text-[#1a2744] sm:mt-10 sm:text-3xl">
          Find any document
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-500 sm:text-[0.9375rem]">
          Search across all jobs, customers, and document types.
        </p>

        <form
          className="mx-auto mt-8 max-w-xl sm:mt-10"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid grid-cols-[minmax(5.25rem,6.5rem)_minmax(0,1fr)] items-stretch gap-2 sm:gap-2.5">
            <div className="relative">
              <label className="sr-only" htmlFor="landing-document-type">
                Document type
              </label>
              <select
                id="landing-document-type"
                value={documentType}
                onChange={(e) => {
                  const next = e.target.value;
                  if (isDocumentSearchTypeFilter(next)) {
                    onDocumentTypeChange(next);
                  }
                }}
                className="h-11 w-full appearance-none rounded-lg border border-zinc-200 bg-zinc-50 py-0 pl-3.5 pr-8 text-left text-sm text-zinc-800 outline-none transition focus:border-zinc-300 focus:bg-white"
                aria-label="Document type"
              >
                {DOCUMENT_SEARCH_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>

            <label className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 transition focus-within:border-zinc-300 sm:px-3.5">
              <span className="sr-only">Search documents</span>
              <SearchIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-zinc-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search documents, jobs, customers..."
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                maxLength={200}
                autoComplete="off"
              />
            </label>
          </div>
        </form>
      </div>
    </section>
  );
}
