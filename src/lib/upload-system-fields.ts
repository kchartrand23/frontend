/** System-assigned upload metadata (read-only in the wizard). */

export const UPLOAD_DOC_ORIGINATION_SYSTEM = "Document Management Service";

export function createUploadAttachmentId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 32);
  }
  return `att-${Date.now().toString(36)}`.slice(0, 32);
}
