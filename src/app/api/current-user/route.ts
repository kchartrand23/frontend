import { resolveOperatingSystemUserFullName } from "@/lib/os-display-name.server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const username = resolveOperatingSystemUserFullName();
    return NextResponse.json({ username });
  } catch (error) {
    console.error("GET /api/current-user failed", error);
    return NextResponse.json(
      { error: "Unable to resolve current user." },
      { status: 500 },
    );
  }
}
