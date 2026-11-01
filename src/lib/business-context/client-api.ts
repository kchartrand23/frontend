import {
  parseBranchList,
  parseMarketList,
} from "@/lib/business-context/market-schema";
import type { BranchOption, MarketOption } from "@/lib/business-context-options";

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error.trim();
    }
  } catch {
    // ignore
  }
  return "Unable to load options.";
}

export async function fetchMarketsClient(): Promise<MarketOption[]> {
  const response = await fetch("/api/markets", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  const body = (await response.json()) as { markets?: unknown };
  return parseMarketList(body.markets);
}

export async function fetchBranchesForMarketClient(
  marketId: string,
): Promise<BranchOption[]> {
  const response = await fetch(
    `/api/markets/${encodeURIComponent(marketId)}/branches`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  const body = (await response.json()) as { branches?: unknown };
  return parseBranchList(body.branches);
}
