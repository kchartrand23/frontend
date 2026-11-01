import { parseDocumentItem, parseDocumentList } from "@/lib/documents/document-schema";
import type { DocumentItem } from "@/lib/mock-documents";

export type DocumentCatalogResponse = {
  documents: DocumentItem[];
  recent: DocumentItem[];
  related: DocumentItem[];
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error.trim();
    }
  } catch {
    // ignore parse errors
  }
  return "Request failed.";
}

export async function fetchDocumentCatalog(): Promise<DocumentCatalogResponse> {
  const response = await fetch("/api/documents", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const body = (await response.json()) as {
    documents?: unknown;
    recent?: unknown;
    related?: unknown;
  };

  return {
    documents: parseDocumentList(body.documents),
    recent: parseDocumentList(body.recent),
    related: parseDocumentList(body.related),
  };
}

export async function fetchDocumentById(id: string): Promise<DocumentItem | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;

  const response = await fetch(
    `/api/documents/${encodeURIComponent(trimmed)}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const body = (await response.json()) as { document?: unknown };
  return parseDocumentItem(body.document);
}
