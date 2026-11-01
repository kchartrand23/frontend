import {
  fetchBranchesFromBackend,
  fetchMarketsFromBackend,
} from "@/lib/business-context/business-context-backend-client";
import { isValidMarketId } from "@/lib/business-context/market-schema";
import {
  getFallbackBranchesForMarketId,
  getFallbackMarkets,
  type BranchOption,
  type MarketOption,
} from "@/lib/business-context-options";
import { isTestOnly } from "@/lib/config";

export async function getMarkets(): Promise<MarketOption[]> {
  if (isTestOnly()) {
    return getFallbackMarkets();
  }
  try {
    return await fetchMarketsFromBackend();
  } catch (error) {
    console.error("Markets backend unavailable; using frontend fallback.", error);
    return getFallbackMarkets();
  }
}

export async function getBranchesForMarketId(
  marketId: string,
): Promise<BranchOption[]> {
  if (!isValidMarketId(marketId)) return [];
  if (isTestOnly()) {
    return getFallbackBranchesForMarketId(marketId);
  }
  try {
    return await fetchBranchesFromBackend(marketId);
  } catch (error) {
    console.error(
      "Branches backend unavailable; using frontend fallback.",
      error,
    );
    return getFallbackBranchesForMarketId(marketId);
  }
}
