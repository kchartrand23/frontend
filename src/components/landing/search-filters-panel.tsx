"use client";

import type { ReactNode } from "react";
import { DOCUMENT_TYPES } from "@/lib/document-types";
import {
  EMPTY_LANDING_SEARCH_FILTERS,
  type LandingSearchFilters,
} from "@/lib/document-search-filters";

export type SearchFiltersState = LandingSearchFilters;

export const EMPTY_SEARCH_FILTERS = EMPTY_LANDING_SEARCH_FILTERS;

const filterFieldClassName =
  "mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#5A4AF4]/40 focus:ring-2 focus:ring-[#5A4AF4]/20";

type SearchFiltersPanelProps = {
  filters: SearchFiltersState;
  onChange: (next: SearchFiltersState) => void;
};

function FilterLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-left text-xs font-medium text-zinc-600">
      {children}
    </label>
  );
}

export function SearchFiltersPanel({ filters, onChange }: SearchFiltersPanelProps) {
  const setField = <K extends keyof SearchFiltersState>(
    key: K,
    value: SearchFiltersState[K],
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <FilterLabel htmlFor="filter-document-type">Document Type</FilterLabel>
          <select
            id="filter-document-type"
            value={filters.documentType}
            onChange={(e) => setField("documentType", e.target.value)}
            className={filterFieldClassName}
          >
            <option value="">Any type</option>
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FilterLabel htmlFor="filter-customer">Customer</FilterLabel>
          <input
            id="filter-customer"
            type="text"
            value={filters.customer}
            onChange={(e) => setField("customer", e.target.value.slice(0, 120))}
            placeholder="Any customer"
            maxLength={120}
            autoComplete="off"
            className={filterFieldClassName}
          />
        </div>
        <div>
          <FilterLabel htmlFor="filter-location">Location</FilterLabel>
          <input
            id="filter-location"
            type="text"
            value={filters.location}
            onChange={(e) => setField("location", e.target.value.slice(0, 120))}
            placeholder="Any location"
            maxLength={120}
            autoComplete="off"
            className={filterFieldClassName}
          />
        </div>
        <div>
          <FilterLabel htmlFor="filter-owner">Owner</FilterLabel>
          <input
            id="filter-owner"
            type="text"
            value={filters.owner}
            onChange={(e) => setField("owner", e.target.value.slice(0, 120))}
            placeholder="Any owner"
            maxLength={120}
            autoComplete="off"
            className={filterFieldClassName}
          />
        </div>
        <div>
          <FilterLabel htmlFor="filter-date-range">Date Range</FilterLabel>
          <input
            id="filter-date-range"
            type="text"
            value={filters.dateRange}
            onChange={(e) => setField("dateRange", e.target.value.slice(0, 80))}
            placeholder="Any date"
            maxLength={80}
            autoComplete="off"
            className={filterFieldClassName}
          />
        </div>
        <div>
          <FilterLabel htmlFor="filter-related-to">Related To</FilterLabel>
          <input
            id="filter-related-to"
            type="text"
            value={filters.relatedTo}
            onChange={(e) => setField("relatedTo", e.target.value.slice(0, 80))}
            placeholder="Job, SO..."
            maxLength={80}
            autoComplete="off"
            className={filterFieldClassName}
          />
        </div>
      </div>
    </div>
  );
}
