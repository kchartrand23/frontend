const DEFAULT_USERNAME = "John Doe";
const MAX_USERNAME_LENGTH = 120;

/** Display name for the signed-in user until real auth is connected. */
export function getCurrentUsername(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CURRENT_USERNAME?.trim();
  if (!fromEnv) return DEFAULT_USERNAME;
  return fromEnv.slice(0, MAX_USERNAME_LENGTH);
}
