"use client";

import { useSearchParams } from "next/navigation";
import { sanitizeShareReturnTo } from "@/lib/share-navigation";

export function useShareReturnHref(): string {
  const searchParams = useSearchParams();
  return sanitizeShareReturnTo(searchParams.get("returnTo"));
}
