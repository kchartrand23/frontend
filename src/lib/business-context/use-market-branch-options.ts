"use client";

import {
  fetchBranchesForMarketClient,
  fetchMarketsClient,
} from "@/lib/business-context/client-api";
import { isValidMarketId } from "@/lib/business-context/market-schema";
import {
  getFallbackBranchesForMarketId,
  getFallbackMarkets,
  type BranchOption,
  type MarketOption,
} from "@/lib/business-context-options";
import { useCallback, useEffect, useRef, useState } from "react";

export function useMarketBranchOptions() {
  const [markets, setMarkets] = useState<MarketOption[]>([]);
  const [branchesByMarketId, setBranchesByMarketId] = useState<
    Record<string, BranchOption[]>
  >({});
  const branchesByMarketIdRef = useRef(branchesByMarketId);
  branchesByMarketIdRef.current = branchesByMarketId;

  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [loadingBranchesFor, setLoadingBranchesFor] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingMarkets(true);
    setError(null);

    fetchMarketsClient()
      .then((loaded) => {
        if (cancelled) return;
        setMarkets(loaded);
        if (loaded.length === 0) {
          setError("No divisions are configured.");
        }
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        console.error("Divisions API failed; using frontend fallback.", loadError);
        setMarkets(getFallbackMarkets());
        setError(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingMarkets(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadBranchesForMarketId = useCallback(async (marketId: string) => {
    const id = marketId.trim();
    if (!isValidMarketId(id)) return;
    if (branchesByMarketIdRef.current[id] !== undefined) return;

    setLoadingBranchesFor(id);
    setError(null);
    try {
      const branches = await fetchBranchesForMarketClient(id);
      setBranchesByMarketId((current) => ({
        ...current,
        [id]: branches,
      }));
    } catch (loadError: unknown) {
      console.error(
        "Branches API failed; using frontend fallback.",
        loadError,
      );
      setBranchesByMarketId((current) => ({
        ...current,
        [id]: getFallbackBranchesForMarketId(id),
      }));
    } finally {
      setLoadingBranchesFor(null);
    }
  }, []);

  const getMarketById = useCallback(
    (marketId: string): MarketOption | undefined => {
      const id = marketId.trim();
      if (!id) return undefined;
      return markets.find((market) => market.id === id);
    },
    [markets],
  );

  const getMarketByName = useCallback(
    (marketName: string): MarketOption | undefined => {
      const trimmed = marketName.trim();
      if (!trimmed) return undefined;
      return markets.find((market) => market.name === trimmed);
    },
    [markets],
  );

  const getBranchesForMarketId = useCallback(
    (marketId: string): BranchOption[] => {
      const id = marketId.trim();
      if (!id) return [];
      return branchesByMarketId[id] ?? [];
    },
    [branchesByMarketId],
  );

  const getBranchesForMarketName = useCallback(
    (marketName: string): BranchOption[] => {
      const market = getMarketByName(marketName);
      if (!market) return [];
      return getBranchesForMarketId(market.id);
    },
    [getMarketByName, getBranchesForMarketId],
  );

  const branchIsValid = useCallback(
    (marketId: string, branchName: string): boolean => {
      const trimmed = branchName.trim();
      if (!trimmed) return false;
      return getBranchesForMarketId(marketId).some(
        (branch) => branch.name === trimmed,
      );
    },
    [getBranchesForMarketId],
  );

  return {
    /** Divisions (Mongo `markets` collection; ids e.g. 30, 8). */
    divisions: markets,
    loadingDivisions: loadingMarkets,
    loadingBranchesFor,
    error,
    getDivisionById: getMarketById,
    getDivisionByName: getMarketByName,
    getBranchesForDivisionId: getBranchesForMarketId,
    getBranchesForDivisionName: getBranchesForMarketName,
    branchIsValidForDivisionId: branchIsValid,
    loadBranchesForDivisionId: loadBranchesForMarketId,
  };
}
