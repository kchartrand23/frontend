import { parseDocumentItem, parseDocumentList } from "@/lib/documents/document-schema";
import type { DocumentCatalog } from "@/lib/documents/document-repository";
import type { DocumentItem } from "@/lib/mock-documents";

function getBackendApiBaseUrl(): string {
  const url = process.env.DMS_API_URL?.trim();
  if (!url) {
    throw new Error(
      "Missing DMS_API_URL. Set it in .env.local when TESTONLY=false.",
    );
  }
  return url.replace(/\/$/, "");
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error.trim();
    }
  } catch {
    // ignore
  }
  return "Backend request failed.";
}

export async function fetchCatalogFromBackend(): Promise<DocumentCatalog> {
  const response = await fetch(`${getBackendApiBaseUrl()}/documents`, {
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

export async function createDocumentOnBackend(
  formData: FormData,
): Promise<DocumentItem> {
  const response = await fetch(`${getBackendApiBaseUrl()}/documents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const body = (await response.json()) as { document?: unknown };
  const document = parseDocumentItem(body.document);
  if (!document) {
    throw new Error("Unable to save document.");
  }
  return document;
}

export async function fetchDocumentFromBackend(
  id: string,
): Promise<DocumentItem | null> {
  const response = await fetch(
    `${getBackendApiBaseUrl()}/documents/${encodeURIComponent(id)}`,
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
