import type { DocumentCategory } from "@/lib/mock-documents";

const ICON_TONE: Record<DocumentCategory, string> = {
  Plan: "bg-sky-50 text-sky-600",
  Estimate: "bg-amber-50 text-amber-600",
  Photo: "bg-pink-50 text-pink-600",
  Specification: "bg-emerald-50 text-emerald-600",
  Contract: "bg-violet-50 text-violet-600",
  Quote: "bg-orange-50 text-orange-600",
  "Sales Order": "bg-teal-50 text-teal-600",
};

export function FileTypeIcon({ category }: { category: DocumentCategory }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ICON_TONE[category]}`}
      aria-hidden
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
  );
}
