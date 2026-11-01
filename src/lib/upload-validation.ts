import {
  isAllowedUploadFile,
  isAllowedUploadFileExtension,
  isAllowedUploadMimeType,
  UPLOAD_ALLOWED_TYPES_LABEL,
  uploadFileExtension,
} from "@/lib/upload-allowed-file-types";

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export type FileValidationErrorCode =
  | "TYPE_NOT_ALLOWED"
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_NAME";

export type FileValidationResult =
  | { ok: true }
  | { ok: false; code: FileValidationErrorCode; message: string };

export function validateUploadFile(file: File): FileValidationResult {
  if (!file.name.trim()) {
    return {
      ok: false,
      code: "INVALID_NAME",
      message: "File name is required.",
    };
  }

  const ext = uploadFileExtension(file.name);
  if (!isAllowedUploadFileExtension(ext)) {
    return {
      ok: false,
      code: "TYPE_NOT_ALLOWED",
      message: "Document Type is not allowed",
    };
  }

  if (file.type && !isAllowedUploadMimeType(file.type)) {
    return {
      ok: false,
      code: "TYPE_NOT_ALLOWED",
      message: "Document Type is not allowed",
    };
  }

  if (!isAllowedUploadFile(file)) {
    return {
      ok: false,
      code: "TYPE_NOT_ALLOWED",
      message: "Document Type is not allowed",
    };
  }

  if (file.size <= 0) {
    return { ok: false, code: "EMPTY_FILE", message: "File is empty." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      code: "FILE_TOO_LARGE",
      message: "File must be 100 MB or smaller.",
    };
  }

  return { ok: true };
}

export function sanitizeTextInput(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function validateJobId(value: string): FileValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, code: "INVALID_NAME", message: "Job ID is required." };
  }
  if (!/^\d{1,10}$/.test(trimmed)) {
    return {
      ok: false,
      code: "INVALID_NAME",
      message: "Job ID must be numeric (up to 10 digits).",
    };
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
    return {
      ok: false,
      code: "INVALID_NAME",
      message: `${label} is required.`,
    };
  }
  return { ok: true };
}

export function validateOptionalText(
  value: string,
  maxLength: number,
): FileValidationResult {
  if (value.length > maxLength) {
    return {
      ok: false,
      code: "INVALID_NAME",
      message: `Must be ${maxLength} characters or fewer.`,
    };
  }
  return { ok: true };
}

export function validateTags(value: string): FileValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: true };
  if (trimmed.length > 500) {
    return {
      ok: false,
      code: "INVALID_NAME",
      message: "Tags must be 500 characters or fewer.",
    };
  }
  if (!/^[\w\s,.\-/#&]+$/iu.test(trimmed)) {
    return {
      ok: false,
      code: "INVALID_NAME",
      message: "Tags may only contain letters, numbers, spaces, and commas.",
    };
  }
  return { ok: true };
}

export { UPLOAD_ALLOWED_TYPES_LABEL };
