"use client";

import { useState, type ReactNode } from "react";
import { downloadDocumentWithSaveDialog } from "@/lib/download-document";
import type { DocumentItem } from "@/lib/mock-documents";

type DocumentDownloadButtonProps = {
  document: DocumentItem;
  versionLabel?: string;
  className?: string;
  children?: ReactNode;
};

export function DocumentDownloadButton({
  document,
  versionLabel,
  className,
  children = "Download",
}: DocumentDownloadButtonProps) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      className={className}
      onClick={async () => {
        setBusy(true);
        try {
          await downloadDocumentWithSaveDialog(document, { versionLabel });
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Saving…" : children}
    </button>
  );
}
