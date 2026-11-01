import { execFileSync } from "node:child_process";
import os from "node:os";
import { sanitizeDisplayUsername } from "@/lib/username-format";

function usernameFromEnv(): string | null {
  const explicit =
    process.env.DMS_CURRENT_USERNAME?.trim() ||
    process.env.NEXT_PUBLIC_CURRENT_USERNAME?.trim();
  if (!explicit) return null;
  return sanitizeDisplayUsername(explicit);
}

function resolveWindowsFullName(): string | null {
  try {
    const script = [
      "$ErrorActionPreference = 'SilentlyContinue'",
      "$account = $env:USERNAME",
      "$local = Get-LocalUser -Name $account",
      "if ($local -and $local.FullName) { Write-Output $local.FullName; exit 0 }",
      "$wmi = Get-CimInstance Win32_UserAccount -Filter \"Name='$account' and LocalAccount='True'\"",
      "if ($wmi -and $wmi.FullName) { Write-Output $wmi.FullName; exit 0 }",
      "$line = net user $account | Select-String -Pattern '^Full Name'",
      "if ($line) { Write-Output ($line.ToString() -replace '^Full Name\\s+', '').Trim() }",
    ].join("; ");

    const output = execFileSync(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", script],
      {
        encoding: "utf8",
        timeout: 8000,
        windowsHide: true,
      },
    ).trim();

    return output ? sanitizeDisplayUsername(output) : null;
  } catch {
    return null;
  }
}

function resolveUnixFullName(): string | null {
  try {
    if (process.platform === "darwin") {
      const output = execFileSync("id", ["-F"], {
        encoding: "utf8",
        timeout: 5000,
      }).trim();
      return output ? sanitizeDisplayUsername(output) : null;
    }

    const login = os.userInfo().username;
    const output = execFileSync("getent", ["passwd", login], {
      encoding: "utf8",
      timeout: 5000,
    }).trim();
    const gecos = output.split(":")[4]?.split(",")[0]?.trim() ?? "";
    return gecos ? sanitizeDisplayUsername(gecos) : null;
  } catch {
    return null;
  }
}

/** Server-only: signed-in display name from env override or OS account full name. */
export function resolveOperatingSystemUserFullName(): string {
  const fromEnv = usernameFromEnv();
  if (fromEnv) return fromEnv;

  const fromOs =
    process.platform === "win32"
      ? resolveWindowsFullName()
      : resolveUnixFullName();
  if (fromOs) return fromOs;

  const login = os.userInfo().username?.trim();
  if (login) return sanitizeDisplayUsername(login);

  return "User";
}
