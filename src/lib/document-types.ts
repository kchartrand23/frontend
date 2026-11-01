export const DOCUMENT_TYPES = [
  "Plan",
  "Estimate",
  "Photo",
  "Specification",
  "Contract",
  "Quote",
  "Sales Order",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DEFAULT_UPLOAD_DOCUMENT_TYPE: DocumentType = DOCUMENT_TYPES[0];

export function isDocumentType(value: string): value is DocumentType {
  return (DOCUMENT_TYPES as readonly string[]).includes(value);
}

/** Best-effort type from upload file name; falls back to default. */
export function inferUploadDocumentTypeFromFileName(
  fileName: string,
): DocumentType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "jpg" || ext === "jpeg" || ext === "png") {
    return "Photo";
  }
  return DEFAULT_UPLOAD_DOCUMENT_TYPE;
}

/** Document search header dropdown: all types plus “All”. */
export const DOCUMENT_SEARCH_TYPE_OPTIONS = [
  "All",
  ...DOCUMENT_TYPES,
] as const;

export type DocumentSearchTypeFilter =
  (typeof DOCUMENT_SEARCH_TYPE_OPTIONS)[number];

export function isDocumentSearchTypeFilter(
  value: string,
): value is DocumentSearchTypeFilter {
  return (DOCUMENT_SEARCH_TYPE_OPTIONS as readonly string[]).includes(value);
}
