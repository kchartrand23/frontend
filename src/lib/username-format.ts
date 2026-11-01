export const MAX_USERNAME_LENGTH = 120;

export function sanitizeDisplayUsername(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, MAX_USERNAME_LENGTH);
}
