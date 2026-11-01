import { getMarkets } from "@/lib/business-context/business-context-repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const markets = await getMarkets();
    return NextResponse.json({ markets });
  } catch (error) {
    console.error("GET /api/markets failed", error);
    return NextResponse.json(
      { error: "Unable to load markets." },
      { status: 500 },
    );
  }
}
