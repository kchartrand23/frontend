import { getDocumentById } from "@/lib/documents/document-repository";
import { isValidDocumentId } from "@/lib/documents/document-schema";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const trimmed = id.trim();

  if (!isValidDocumentId(trimmed)) {
    return NextResponse.json({ error: "Invalid document id." }, { status: 400 });
  }

  try {
    const document = await getDocumentById(trimmed);
    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }
    return NextResponse.json({ document });
  } catch (error) {
    console.error("GET /api/documents/[id] failed", error);
    return NextResponse.json(
      { error: "Unable to load document." },
      { status: 500 },
    );
  }
}
