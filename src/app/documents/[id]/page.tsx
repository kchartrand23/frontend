import { isTestOnly } from "@/lib/config";
import { getDocumentById } from "@/lib/documents/document-repository";
import { ALL_DOCUMENTS } from "@/lib/mock-documents";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  if (!isTestOnly()) {
    return [];
  }
  return ALL_DOCUMENTS.map((doc) => ({ id: doc.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const doc = await getDocumentById(id);
  if (!doc) {
    return { title: "Document — Document Management Service" };
  }
  return {
    title: `${doc.title} — Document Management Service`,
  };
}

export default async function DocumentPage({ params }: PageProps) {
  const { id } = await params;
  const doc = await getDocumentById(id);
  if (!doc) notFound();

  return null;
}
