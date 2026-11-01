import type { DocumentCategory } from "@/lib/mock-documents";

const TAG_STYLES: Record<DocumentCategory, string> = {
  Plan: "bg-sky-100 text-sky-800",
  Estimate: "bg-amber-100 text-amber-900",
  Photo: "bg-pink-100 text-pink-800",
  Specification: "bg-emerald-100 text-emerald-800",
  Contract: "bg-violet-100 text-violet-800",
  Quote: "bg-orange-100 text-orange-900",
  "Sales Order": "bg-teal-100 text-teal-900",
};

export function CategoryTag({ category }: { category: DocumentCategory }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${TAG_STYLES[category]}`}
    >
      {category}
    </span>
  );
}
