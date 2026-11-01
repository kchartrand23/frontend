/** Reference data when TESTONLY=true or MongoDB/backend market APIs are unavailable. */

export const FALLBACK_MARKETS = [
  { id: "30", name: "Raymond Building Supply" },
  { id: "8", name: "MSP-DAK Components" },
] as const;

export const FALLBACK_BRANCHES = [
  { id: "pompano-beach-facility", name: "Pompano Beach Facility", marketId: "30" },
  { id: "jetport-facility", name: "Jetport Facility", marketId: "30" },
  { id: "north-port-facility", name: "North Port Facility", marketId: "30" },
  { id: "naples-facility", name: "Naples Facility", marketId: "30" },
  { id: "north-fort-myers-facility", name: "North Fort Myers Facility", marketId: "30" },
  { id: "tampa-facility", name: "Tampa Facility", marketId: "30" },
  { id: "rbsc-corporate", name: "RBSC Corporate", marketId: "30" },
  { id: "jasper-facility", name: "Jasper Facility", marketId: "30" },
  { id: "gator-road-facility", name: "Gator Road Facility", marketId: "30" },
  { id: "the-design-studio", name: "The Design Studio", marketId: "30" },
  { id: "auburndale-truss", name: "Auburndale - Truss", marketId: "30" },
  { id: "deco-truss", name: "Deco Truss", marketId: "30" },
  { id: "rbs-pompano-distribution", name: "RBS Pompano Distribution", marketId: "30" },
  { id: "rbs-ft-myers-distribution", name: "RBS Ft. Myers Distribution", marketId: "30" },
  { id: "auburndale", name: "Auburndale", marketId: "30" },
  { id: "milton-truss", name: "Milton Truss", marketId: "30" },
  { id: "mullins-lumber", name: "Mullins Lumber", marketId: "30" },
  { id: "rbs-milton-lbm", name: "RBS Milton LBM", marketId: "30" },
  { id: "rbs-homestead", name: "RBS Homestead", marketId: "30" },
  { id: "llc-ccc-go", name: "LLC - CCC Go", marketId: "8" },
  { id: "llc-ccc-special-shop", name: "LLC - CCC Special Shop", marketId: "8" },
  { id: "ng-britton-panel", name: "NG - Britton Panel", marketId: "8" },
  { id: "wbs-green-bay-truss", name: "WBS - Green Bay Truss", marketId: "8" },
  { id: "llc-ccc-siding", name: "LLC - CCC Siding", marketId: "8" },
  { id: "llc-ccc-windows", name: "LLC - CCC Windows", marketId: "8" },
  { id: "msp-dak-components-admin", name: "MSP - DAK Components Admin", marketId: "8" },
  { id: "ng-britton-truss", name: "NG - Britton Truss", marketId: "8" },
  { id: "ng-rogers-panel", name: "NG - Rogers Panel", marketId: "8" },
  { id: "llc-ccc-production", name: "LLC - CCC Production", marketId: "8" },
  { id: "llc-ccc-remod-remed", name: "LLC - CCC Remod/Remed", marketId: "8" },
  { id: "llc-abc-chettek", name: "LLC - ABC Chetek", marketId: "8" },
  { id: "ng-rogers-truss", name: "NG - Rogers Truss", marketId: "8" },
  { id: "llc-ccc-service", name: "LLC - CCC Service", marketId: "8" },
  { id: "llc-ccc-finish", name: "LLC - CCC Finish", marketId: "8" },
  { id: "api-marshfield-panels", name: "API - Marshfield Panels", marketId: "8" },
  { id: "api-verona-office", name: "API - Verona Office", marketId: "8" },
  {
    id: "ng-mn-building-pros-rogers",
    name: "NG - MN - Building Pros - Rogers",
    marketId: "8",
  },
  { id: "api-marshfield-truss", name: "API - Marshfield Truss", marketId: "8" },
  { id: "ng-pipestone-truss", name: "NG - Pipestone Truss", marketId: "8" },
  { id: "la-hudson-wall-panels", name: "LA - Hudson Wall Panels", marketId: "8" },
  { id: "llc-villaume-industrial", name: "LLC - Villaume Industrial", marketId: "8" },
  { id: "llc-ccc-framing", name: "LLC - CCC Framing", marketId: "8" },
  { id: "api-admin", name: "API - Admin", marketId: "8" },
  { id: "llc-montrose", name: "LLC - Montrose", marketId: "8" },
  { id: "llc-villaume-truss", name: "LLC - Villaume Truss", marketId: "8" },
] as const;

export type MarketOption = {
  id: string;
  name: string;
};

export type BranchOption = {
  id: string;
  name: string;
  marketId: string;
};

export function getFallbackMarkets(): MarketOption[] {
  return FALLBACK_MARKETS.map((market) => ({ ...market }));
}

export function getFallbackBranchesForMarketId(marketId: string): BranchOption[] {
  return FALLBACK_BRANCHES.filter((branch) => branch.marketId === marketId).map(
    (branch) => ({ ...branch }),
  );
}

export function getFallbackBranchesForMarketName(
  marketName: string,
): BranchOption[] {
  const market = FALLBACK_MARKETS.find((entry) => entry.name === marketName);
  if (!market) return [];
  return getFallbackBranchesForMarketId(market.id);
}

export const OWNERS = [
  "John Doe",
  "Jane Smith",
  "Alex Rivera",
  "Unassigned",
] as const;

export type Owner = (typeof OWNERS)[number];
