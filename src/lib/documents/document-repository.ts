import { isTestOnly } from "@/lib/config";
import {
  fetchCatalogFromBackend,
  fetchDocumentFromBackend,
} from "@/lib/documents/document-backend-client";
import { isValidDocumentId } from "@/lib/documents/document-schema";
import type { DocumentItem } from "@/lib/mock-documents";
import {
  ALL_DOCUMENTS,
  getDocumentById as getMockDocumentById,
  RECENT_DOCUMENTS,
  RELATED_DOCUMENTS,
} from "@/lib/mock-documents";

export type DocumentCatalog = {
  documents: DocumentItem[];
  recent: DocumentItem[];
  related: DocumentItem[];
};

export async function getDocumentCatalog(): Promise<DocumentCatalog> {
  if (isTestOnly()) {
    return {
      documents: ALL_DOCUMENTS,
      recent: RECENT_DOCUMENTS,
      related: RELATED_DOCUMENTS,
    };
  }

  return fetchCatalogFromBackend();
}

export async function listAllDocuments(): Promise<DocumentItem[]> {
  const catalog = await getDocumentCatalog();
  return catalog.documents;
}

export async function getDocumentById(
  id: string,
): Promise<DocumentItem | null> {
  if (!isValidDocumentId(id)) return null;

  if (isTestOnly()) {
    return getMockDocumentById(id) ?? null;
  }

  return fetchDocumentFromBackend(id);
}
