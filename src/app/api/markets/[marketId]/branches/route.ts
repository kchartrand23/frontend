import { getBranchesForMarketId } from "@/lib/business-context/business-context-repository";
import { isValidMarketId } from "@/lib/business-context/market-schema";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ marketId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { marketId: rawMarketId } = await context.params;
  const marketId = typeof rawMarketId === "string" ? rawMarketId.trim() : "";

  if (!isValidMarketId(marketId)) {
    return NextResponse.json({ error: "Invalid market id." }, { status: 400 });
  }

  try {
    const branches = await getBranchesForMarketId(marketId);
    return NextResponse.json({ branches });
  } catch (error) {
    console.error("GET /api/markets/[marketId]/branches failed", error);
    return NextResponse.json(
      { error: "Unable to load branches." },
      { status: 500 },
    );
  }
}
