import {
  parseBranchList,
  parseMarketList,
} from "@/lib/business-context/market-schema";
import type { BranchOption, MarketOption } from "@/lib/business-context-options";

function getBackendApiBaseUrl(): string {
  const url = process.env.DMS_API_URL?.trim();
  if (!url) {
    throw new Error(
      "Missing DMS_API_URL. Set it in .env.local when TESTONLY=false.",
    );
  }
  return url.replace(/\/$/, "");
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error.trim();
    }
  } catch {
    // ignore
  }
  return "Backend request failed.";
}

export async function fetchMarketsFromBackend(): Promise<MarketOption[]> {
  const response = await fetch(`${getBackendApiBaseUrl()}/markets`, {
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

export async function fetchBranchesFromBackend(
  marketId: string,
): Promise<BranchOption[]> {
  const response = await fetch(
    `${getBackendApiBaseUrl()}/markets/${encodeURIComponent(marketId)}/branches`,
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
