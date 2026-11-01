import { sanitizeDisplayUsername } from "@/lib/username-format";

/** @deprecated Prefer useCurrentUsername() so the OS full name is resolved on the server. */
export function getCurrentUsername(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CURRENT_USERNAME?.trim();
  if (!fromEnv) return "User";
  return sanitizeDisplayUsername(fromEnv);
}
