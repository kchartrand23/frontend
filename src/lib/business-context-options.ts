export const MARKETS = ["Florida"] as const;

export type Market = (typeof MARKETS)[number];

export const BRANCHES = [
  "Pompano Beach Facility",
  "Jetport Facility",
  "North Port Facility",
  "Naples Facility",
  "North Fort Myers Facility",
  "Tampa Facility",
  "RBSC Corporate",
  "Jasper Facility",
  "Gator Road Facility",
  "The Design Studio",
  "Auburndale - Truss",
  "Deco Truss",
  "RBS Pompano Distribution",
  "RBS Ft. Myers Distribution",
  "Auburndale",
  "Milton Truss",
  "Mullins Lumber",
  "RBS Milton LBM",
  "RBS Homestead",
] as const;

export type Branch = (typeof BRANCHES)[number];

export const DEFAULT_BRANCH: Branch = BRANCHES[0];

/** Branches available per market (extend when new markets are added). */
export const BRANCHES_BY_MARKET: Record<Market, readonly Branch[]> = {
  Florida: BRANCHES,
};

export function isMarket(value: string): value is Market {
  return (MARKETS as readonly string[]).includes(value);
}

export function isBranch(value: string): value is Branch {
  return (BRANCHES as readonly string[]).includes(value);
}

export function getBranchesForMarket(market: Market): readonly Branch[] {
  return BRANCHES_BY_MARKET[market];
}

export const OWNERS = [
  "John Doe",
  "Jane Smith",
  "Alex Rivera",
  "Unassigned",
] as const;

export type Owner = (typeof OWNERS)[number];
