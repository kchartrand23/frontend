import Link from "next/link";
import type { DocumentItem } from "@/lib/mock-documents";

type DocumentCardProps = {
  document: DocumentItem;
  variant?: "row" | "card";
  href?: string;
  openInNewWindow?: boolean;
};

export function DocumentCard({
  document,
  variant = "row",
  href,
  openInNewWindow = false,
}: DocumentCardProps) {
  const subtitle = `Job ${document.jobId} · ${document.customer}`;

  if (variant === "card") {
    const cardContent = (
      <>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-zinc-900">
              {document.title}
            </h3>
            <span className="shrink-0 text-sm text-zinc-900">
              {document.category}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-zinc-500">{subtitle}</p>
          <p className="mt-3 text-xs text-zinc-400">{document.dateLabel}</p>
        </div>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          target={openInNewWindow ? "_blank" : undefined}
          rel={openInNewWindow ? "noopener noreferrer" : undefined}
          className="flex min-w-0 flex-1 gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          {cardContent}
        </Link>
      );
    }

    return (
      <article className="flex flex-1 min-w-0 gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        {cardContent}
      </article>
    );
  }

  const rowContent = (
    <>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-zinc-900">
          {document.title}
        </h3>
        <p className="truncate text-xs text-zinc-500">{subtitle}</p>
      </div>
      <span className="shrink-0 text-sm text-zinc-900">{document.category}</span>
      <time className="shrink-0 text-xs text-zinc-400 tabular-nums">
        {document.dateLabel}
      </time>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={openInNewWindow ? "_blank" : undefined}
        rel={openInNewWindow ? "noopener noreferrer" : undefined}
        className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3.5 transition last:border-b-0 hover:bg-zinc-50"
      >
        {rowContent}
      </Link>
    );
  }

  return (
    <article className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3.5 last:border-b-0">
      {rowContent}
    </article>
  );
}
