/**
 * When TESTONLY is true, the app uses in-memory mock documents and fallback
 * market/branch lists (no MongoDB).
 * When false, documents and market/branch options load via the backend API
 * (requires DMS_API_URL in .env.local).
 */
export function isTestOnly(): boolean {
  const raw = process.env.TESTONLY?.trim().toLowerCase();
  if (!raw) return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return raw === "true" || raw === "1" || raw === "yes";
}
