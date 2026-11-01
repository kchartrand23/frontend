/**
 * When TESTONLY is true, the app serves mock document data.
 * When false, documents are loaded via the backend API (requires DMS_API_URL).
 */
export function isTestOnly(): boolean {
  const raw = process.env.TESTONLY?.trim().toLowerCase();
  if (!raw) return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return raw === "true" || raw === "1" || raw === "yes";
}
