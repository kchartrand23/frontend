/** Whitelist of file types permitted for document upload. */

export const UPLOAD_ALLOWED_FILE_EXTENSIONS = [
  "bmp",
  "csv",
  "doc",
  "docx",
  "eml",
  "gif",
  "heic",
  "htm",
  "html",
  "jfif",
  "jpeg",
  "jpg",
  "lnk",
  "mov",
  "msg",
  "pdf",
  "png",
  "pptx",
  "rtf",
  "tif",
  "tiff",
  "tmp",
  "txt",
  "vcf",
  "xls",
  "xlsx",
  "xml",
  "zip",
] as const;

export type UploadAllowedFileExtension =
  (typeof UPLOAD_ALLOWED_FILE_EXTENSIONS)[number];

/** Known MIME types for whitelisted uploads (extension is primary). */
export const UPLOAD_ALLOWED_MIME_TYPES = [
  "application/msword",
  "application/octet-stream",
  "application/pdf",
  "application/rtf",
  "application/vnd.ms-excel",
  "application/vnd.ms-outlook",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/xml",
  "application/zip",
  "image/bmp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/x-ms-bmp",
  "message/rfc822",
  "text/csv",
  "text/html",
  "text/plain",
  "text/rtf",
  "text/vcard",
  "text/xml",
  "text/x-vcard",
  "video/quicktime",
] as const;

const EXTENSION_SET = new Set<string>(UPLOAD_ALLOWED_FILE_EXTENSIONS);
const MIME_SET = new Set<string>(
  UPLOAD_ALLOWED_MIME_TYPES.map((m) => m.toLowerCase()),
);

export function uploadFileExtension(name: string): string {
  const parts = name.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1]!.toLowerCase();
}

export function isAllowedUploadFileExtension(
  extension: string,
): extension is UploadAllowedFileExtension {
  return EXTENSION_SET.has(extension.toLowerCase());
}

export function isAllowedUploadMimeType(mimeType: string): boolean {
  const normalized = mimeType.trim().toLowerCase();
  if (!normalized) return true;
  return MIME_SET.has(normalized);
}

export function isAllowedUploadFile(file: File): boolean {
  if (!file.name.trim()) return false;
  const ext = uploadFileExtension(file.name);
  if (!isAllowedUploadFileExtension(ext)) return false;
  if (file.type && !isAllowedUploadMimeType(file.type)) return false;
  return true;
}

const ACCEPT_EXTENSION_LIST = UPLOAD_ALLOWED_FILE_EXTENSIONS.map(
  (ext) => `.${ext}`,
).join(",");

export const UPLOAD_FILE_INPUT_ACCEPT = `${ACCEPT_EXTENSION_LIST},${UPLOAD_ALLOWED_MIME_TYPES.join(",")}`;

export const UPLOAD_ALLOWED_TYPES_LABEL =
  UPLOAD_ALLOWED_FILE_EXTENSIONS.map((ext) => ext.toUpperCase()).join(", ");

/** Native file picker groups (Chromium / Edge). */
export const UPLOAD_FILE_PICKER_ACCEPT_TYPES = [
  {
    description: "Allowed documents and media",
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/zip": [".zip"],
      "application/vnd.ms-outlook": [".msg"],
      "message/rfc822": [".eml"],
      "text/plain": [".txt", ".rtf", ".vcf", ".tmp", ".xml"],
      "text/html": [".htm", ".html"],
      "text/csv": [".csv"],
      "image/jpeg": [".jpg", ".jpeg", ".jfif"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
      "image/tiff": [".tif", ".tiff"],
      "image/heic": [".heic"],
      "video/quicktime": [".mov"],
      "application/octet-stream": [".lnk", ".tmp"],
    },
  },
] as const;
