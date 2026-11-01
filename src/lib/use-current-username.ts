"use client";

import { sanitizeDisplayUsername } from "@/lib/username-format";
import { useEffect, useState } from "react";

const FALLBACK_USERNAME = "User";

export function useCurrentUsername(): {
  username: string;
  loading: boolean;
} {
  const [username, setUsername] = useState(FALLBACK_USERNAME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/current-user", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to resolve current user.");
        }
        const body = (await response.json()) as { username?: string };
        const resolved =
          typeof body.username === "string"
            ? sanitizeDisplayUsername(body.username)
            : "";
        if (!cancelled && resolved) {
          setUsername(resolved);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUsername(FALLBACK_USERNAME);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { username, loading };
}
