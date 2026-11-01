"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDocumentById } from "@/lib/documents/client-api";
import { documentFileName } from "@/lib/mock-documents";
import { sanitizeShareDocumentId } from "@/lib/share-navigation";

export function useShareDocumentFileName(): {
  fileName: string;
  loading: boolean;
} {
  const searchParams = useSearchParams();
  const documentId = sanitizeShareDocumentId(searchParams.get("documentId"));
  const [fileName, setFileName] = useState("Document");
  const [loading, setLoading] = useState(Boolean(documentId));

  useEffect(() => {
    if (!documentId) {
      setFileName("Document");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchDocumentById(documentId)
      .then((document) => {
        if (cancelled) return;
        setFileName(document ? documentFileName(document) : "Document");
      })
      .catch(() => {
        if (!cancelled) setFileName("Document");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  return { fileName, loading };
}
