const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "docx",
  "xlsx",
  "jpg",
  "jpeg",
  "png",
]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
]);

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export type FileValidationResult =
  | { ok: true }
  | { ok: false; message: string };

function extensionOf(name: string): string {
  const parts = name.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1]!.toLowerCase();
}

export function validateUploadFile(file: File): FileValidationResult {
  if (!file.name.trim()) {
    return { ok: false, message: "File name is required." };
  }

  const ext = extensionOf(file.name);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      ok: false,
      message: "Allowed types: PDF, DOCX, XLSX, JPG, PNG.",
    };
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return { ok: false, message: "File type is not allowed." };
  }

  if (file.size <= 0) {
    return { ok: false, message: "File is empty." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "File must be 100 MB or smaller." };
  }

  return { ok: true };
}

export function sanitizeTextInput(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function validateJobId(value: string): FileValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, message: "Job ID is required." };
  }
  if (!/^\d{1,10}$/.test(trimmed)) {
    return { ok: false, message: "Job ID must be numeric (up to 10 digits)." };
  }
  return { ok: true };
}

export function validateRequiredText(
  value: string,
  label: string,
  maxLength: number,
): FileValidationResult {
  const trimmed = sanitizeTextInput(value, maxLength);
  if (!trimmed) {
    return { ok: false, message: `${label} is required.` };
  }
  return { ok: true };
}

export function validateOptionalText(
  value: string,
  maxLength: number,
): FileValidationResult {
  if (value.length > maxLength) {
    return { ok: false, message: `Must be ${maxLength} characters or fewer.` };
  }
  return { ok: true };
}

export function validateTags(value: string): FileValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: true };
  if (trimmed.length > 500) {
    return { ok: false, message: "Tags must be 500 characters or fewer." };
  }
  if (!/^[\w\s,.\-/#&]+$/iu.test(trimmed)) {
    return {
      ok: false,
      message: "Tags may only contain letters, numbers, spaces, and commas.",
    };
  }
  return { ok: true };
}
