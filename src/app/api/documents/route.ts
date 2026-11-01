import { getDocumentCatalog } from "@/lib/documents/document-repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const catalog = await getDocumentCatalog();
    return NextResponse.json(catalog);
  } catch (error) {
    console.error("GET /api/documents failed", error);
    return NextResponse.json(
      { error: "Unable to load documents." },
      { status: 500 },
    );
  }
}
