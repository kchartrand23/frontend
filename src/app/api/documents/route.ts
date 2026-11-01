import { createDocumentOnBackend } from "@/lib/documents/document-backend-client";
import { getDocumentCatalog } from "@/lib/documents/document-repository";
import { isTestOnly } from "@/lib/config";
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

export async function POST(request: Request) {
  if (isTestOnly()) {
    return NextResponse.json(
      {
        error:
          "Document save requires live API mode. Set TESTONLY=false and configure the backend.",
      },
      { status: 503 },
    );
  }

  try {
    const incoming = await request.formData();
    const file = incoming.get("file");
    const metadata = incoming.get("metadata");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }
    if (typeof metadata !== "string" || !metadata.trim()) {
      return NextResponse.json(
        { error: "Document metadata is required." },
        { status: 400 },
      );
    }

    const outbound = new FormData();
    outbound.append("file", file, file.name);
    outbound.append("metadata", metadata);

    const document = await createDocumentOnBackend(outbound);
    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents failed", error);
    const message =
      error instanceof Error && error.message.trim()
        ? error.message.trim()
        : "Unable to save document.";
    const status =
      message === "Document Type is not allowed." ||
      message === "File is empty." ||
      message === "File must be 100 MB or smaller." ||
      message === "File name is required." ||
      message === "Invalid document metadata." ||
      message === "A file is required." ||
      message === "Document metadata is required."
        ? 400
        : 500;
    if (status >= 500) {
      return NextResponse.json(
        { error: "Unable to save document." },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: message }, { status });
  }
}
