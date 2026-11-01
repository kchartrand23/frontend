import { isValidDocumentId } from "@/lib/documents/document-schema";

const DOCUMENTS_RETURN_PREFIX = "/documents";

/** Restrict return URLs to in-app document routes (open-redirect safe). */
export function sanitizeShareReturnTo(
  value: string | null | undefined,
): string {
  if (!value) {
    return DOCUMENTS_RETURN_PREFIX;
  }

  let decoded = value.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return DOCUMENTS_RETURN_PREFIX;
  }

  if (!decoded.startsWith(DOCUMENTS_RETURN_PREFIX)) {
    return DOCUMENTS_RETURN_PREFIX;
  }
  if (decoded.startsWith("//") || decoded.includes("://")) {
    return DOCUMENTS_RETURN_PREFIX;
  }

  return decoded;
}

export function sanitizeShareDocumentId(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  let decoded = value.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }

  if (!isValidDocumentId(decoded)) {
    return null;
  }

  return decoded;
}

export function buildSharePagePath(
  returnTo: string,
  documentId?: string,
): string {
  const safeReturnTo = sanitizeShareReturnTo(returnTo);
  const params = new URLSearchParams();
  params.set("returnTo", safeReturnTo);

  const safeDocumentId = documentId
    ? sanitizeShareDocumentId(documentId)
    : null;
  if (safeDocumentId) {
    params.set("documentId", safeDocumentId);
  }

  return `/share2?${params.toString()}`;
}
