import type { BranchOption, MarketOption } from "@/lib/business-context-options";

const MARKET_ID_PATTERN = /^[a-z0-9_-]{1,64}$/;

export function isValidMarketId(id: string): boolean {
  return MARKET_ID_PATTERN.test(id);
}

export function parseMarketOption(value: unknown): MarketOption | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id.trim() : "";
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!isValidMarketId(id) || !name) return null;
  return { id, name: name.slice(0, 80) };
}

export function parseMarketList(value: unknown): MarketOption[] {
  if (!Array.isArray(value)) return [];
  const markets: MarketOption[] = [];
  for (const entry of value) {
    const parsed = parseMarketOption(entry);
    if (parsed) markets.push(parsed);
  }
  return markets;
}

export function parseBranchOption(value: unknown): BranchOption | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id.trim() : "";
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const marketId =
    typeof row.marketId === "string" ? row.marketId.trim() : "";
  if (!isValidMarketId(id) || !isValidMarketId(marketId) || !name) return null;
  return {
    id,
    name: name.slice(0, 120),
    marketId,
  };
}

export function parseBranchList(value: unknown): BranchOption[] {
  if (!Array.isArray(value)) return [];
  const branches: BranchOption[] = [];
  for (const entry of value) {
    const parsed = parseBranchOption(entry);
    if (parsed) branches.push(parsed);
  }
  return branches;
}
