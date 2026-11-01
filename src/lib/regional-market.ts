/** Regional market labels (read-only on upload; stored on document `market`). */

export const REGIONAL_MARKETS = ["East", "South", "West"] as const;

export type RegionalMarket = (typeof REGIONAL_MARKETS)[number];

const REGIONAL_MARKET_SET = new Set<string>(REGIONAL_MARKETS);

/** Division ids match Mongo `markets` collection (same as former market ids). */
const DIVISION_ID_TO_REGIONAL_MARKET: Record<string, RegionalMarket> = {
  "30": "South",
  "8": "West",
};

const DIVISION_NAME_TO_REGIONAL_MARKET: Record<string, RegionalMarket> = {
  "Raymond Building Supply": "South",
  "MSP-DAK Components": "West",
};

export function isRegionalMarket(value: string): value is RegionalMarket {
  return REGIONAL_MARKET_SET.has(value.trim());
}

export function getRegionalMarketForDivisionId(
  divisionId: string,
): RegionalMarket | "" {
  const id = divisionId.trim();
  if (!id) return "";
  return DIVISION_ID_TO_REGIONAL_MARKET[id] ?? "";
}

export function getRegionalMarketForDivisionName(
  divisionName: string,
): RegionalMarket | "" {
  const name = divisionName.trim();
  if (!name) return "";
  return DIVISION_NAME_TO_REGIONAL_MARKET[name] ?? "";
}

/** Legacy documents may still have the division name in `market`. */
export function resolveRegionalMarketForDocument(document: {
  market?: string;
  division?: string;
}): RegionalMarket | "" {
  const market = document.market?.trim() ?? "";
  if (isRegionalMarket(market)) return market;

  const fromDivision = getRegionalMarketForDivisionName(document.division ?? "");
  if (fromDivision) return fromDivision;

  return getRegionalMarketForDivisionName(market);
}

export function resolveDivisionDisplayName(document: {
  market?: string;
  division?: string;
}): string {
  const division = document.division?.trim() ?? "";
  if (division) return division;

  const market = document.market?.trim() ?? "";
  if (market && !isRegionalMarket(market)) return market;

  return "";
}
