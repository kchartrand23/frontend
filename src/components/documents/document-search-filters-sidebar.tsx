"use client";

import { useEffect, useState } from "react";
import {
  DOCUMENT_METADATA_FILTER_FIELDS,
  type DocumentMetadataFilterField,
} from "@/lib/document-metadata-filter-fields";

function FilterFieldInput({
  field,
  value,
  onChange,
}: {
  field: DocumentMetadataFilterField;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputType = field.inputType ?? "text";
  const maxLength = field.maxLength ?? 80;

  return (
    <input
      type={inputType}
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        if (inputType === "text" && next.length > maxLength) return;
        onChange(next);
      }}
      placeholder={`Filter ${field.label.toLowerCase()}...`}
      maxLength={inputType === "text" ? maxLength : undefined}
      className="w-full rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#1a2744]/40 focus:ring-1 focus:ring-[#1a2744]/15"
      aria-label={`Filter by ${field.label}`}
    />
  );
}

function FilterSection({
  field,
  value,
  onChange,
}: {
  field: DocumentMetadataFilterField;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(field.id === "documentType");

  return (
    <div className="border-b border-zinc-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-zinc-800"
        aria-expanded={open}
      >
        {field.label}
        <svg
          className={`h-4 w-4 shrink-0 text-zinc-400 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-3">
          <FilterFieldInput field={field} value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

function FiltersPanelContent({
  onClose,
  filters,
  onFilterChange,
}: {
  onClose: () => void;
  filters: Record<string, string>;
  onFilterChange: (fieldId: string, value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-bold text-zinc-900">Filters</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Close filters"
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
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {DOCUMENT_METADATA_FILTER_FIELDS.map((field) => (
          <FilterSection
            key={field.id}
            field={field}
            value={filters[field.id] ?? ""}
            onChange={(value) => onFilterChange(field.id, value)}
          />
        ))}
      </div>
    </div>
  );
}

type DocumentSearchFiltersDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Record<string, string>;
  onFilterChange: (fieldId: string, value: string) => void;
};

export function DocumentSearchFiltersDrawer({
  open,
  onOpenChange,
  filters,
  onFilterChange,
}: DocumentSearchFiltersDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-zinc-900/20 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={() => onOpenChange(false)}
      />

      <aside
        id="document-search-filters-drawer"
        className={`fixed inset-y-0 left-0 z-50 w-[min(100%,20rem)] border-r border-zinc-200 bg-white shadow-lg transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-auto lg:max-h-none lg:shrink-0 lg:shadow-none ${
          open
            ? "translate-x-0 lg:block lg:w-64 lg:rounded-lg lg:border lg:border-zinc-200 lg:shadow-sm"
            : "pointer-events-none -translate-x-full lg:hidden"
        }`}
        aria-hidden={!open}
      >
        <FiltersPanelContent
          onClose={() => onOpenChange(false)}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </aside>
    </>
  );
}

export function FiltersToolbarButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition ${
        active
          ? "border-[#1a2744]/30 bg-sky-50 text-[#1a2744]"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
      aria-expanded={active}
      aria-controls="document-search-filters-drawer"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      Filters
    </button>
  );
}
