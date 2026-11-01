"use client";

import Link from "next/link";
import { UsLbmLogo } from "@/components/auth/us-lbm-logo";
import { HeaderToolbarActions } from "@/components/layout/header-toolbar-actions";
import { useDocumentSearchNav } from "@/components/documents/document-search-nav-context";

export function DocumentSearchHeader() {
  const { query, setQuery, submitSearch } = useDocumentSearchNav();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white">
      <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="U.S. LBM home">
          <UsLbmLogo className="h-10 w-auto sm:h-11" />
        </Link>

        <div
          className="hidden h-9 w-px shrink-0 bg-zinc-200 md:block"
          aria-hidden
        />

        <form
          className="flex min-w-0 flex-1 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch();
          }}
        >
          <div className="relative flex min-w-0 flex-1 items-center rounded-lg border border-zinc-200 bg-white">
            <svg
              className="pointer-events-none absolute left-3 h-5 w-5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={200}
              className="w-full min-w-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none sm:pr-44"
              aria-label="Search documents"
            />
            <span className="pointer-events-none absolute right-3 hidden text-xs text-zinc-400 sm:inline">
              Use &apos;+&apos; and keywords
            </span>
          </div>
        </form>

        <HeaderToolbarActions />
      </div>
    </header>
  );
}
