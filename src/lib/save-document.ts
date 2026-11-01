import { parseDocumentItem } from "@/lib/documents/document-schema";
import type { DocumentType } from "@/lib/document-types";
import type { DocumentItem } from "@/lib/mock-documents";
import { sanitizeTextInput } from "@/lib/upload-validation";

export type SaveDocumentMetadata = {
  title: string;
  documentType: DocumentType;
  jobId: string;
  jobName: string;
  customer: string;
  market: string;
  branch: string;
  location: string;
  retentionPolicy: string;
  owner: string;
  tags: string;
  versionNumber: string;
  documentStatus: string;
  division: string;
  customerCode: string;
  lotNumber: string;
  communityName: string;
  jobAddress: string;
  modelName: string;
  attachmentId: string;
  docOriginationSystem: string;
  component: string;
  productSku: string;
  orderDeliveryDate: string;
  insideSalesRep: string;
  outsideSalesRep: string;
  takenBy: string;
  vendorName: string;
  documentNumber: string;
};

function metadataPayload(metadata: SaveDocumentMetadata): Record<string, string> {
  return {
    title: sanitizeTextInput(metadata.title, 200),
    documentType: sanitizeTextInput(metadata.documentType, 80),
    jobId: sanitizeTextInput(metadata.jobId, 20),
    jobName: sanitizeTextInput(metadata.jobName, 120),
    customer: sanitizeTextInput(metadata.customer, 120),
    market: sanitizeTextInput(metadata.market, 80),
    branch: sanitizeTextInput(metadata.branch, 120),
    location: sanitizeTextInput(metadata.location, 120),
    retentionPolicy: sanitizeTextInput(metadata.retentionPolicy, 120),
    owner: sanitizeTextInput(metadata.owner, 120),
    tags: sanitizeTextInput(metadata.tags, 500),
    versionNumber: sanitizeTextInput(metadata.versionNumber, 20),
    documentStatus: sanitizeTextInput(metadata.documentStatus, 80),
    division: sanitizeTextInput(metadata.division, 120),
    customerCode: sanitizeTextInput(metadata.customerCode, 40),
    lotNumber: sanitizeTextInput(metadata.lotNumber, 40),
    communityName: sanitizeTextInput(metadata.communityName, 120),
    jobAddress: sanitizeTextInput(metadata.jobAddress, 200),
    modelName: sanitizeTextInput(metadata.modelName, 120),
    attachmentId: sanitizeTextInput(metadata.attachmentId, 80),
    docOriginationSystem: sanitizeTextInput(metadata.docOriginationSystem, 120),
    component: sanitizeTextInput(metadata.component, 120),
    productSku: sanitizeTextInput(metadata.productSku, 80),
    orderDeliveryDate: sanitizeTextInput(metadata.orderDeliveryDate, 40),
    insideSalesRep: sanitizeTextInput(metadata.insideSalesRep, 120),
    outsideSalesRep: sanitizeTextInput(metadata.outsideSalesRep, 120),
    takenBy: sanitizeTextInput(metadata.takenBy, 120),
    vendorName: sanitizeTextInput(metadata.vendorName, 120),
    documentNumber: sanitizeTextInput(metadata.documentNumber, 80),
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error.trim();
    }
  } catch {
    // ignore
  }
  return "Unable to save document.";
}

export async function saveDocumentWithFile(
  file: File,
  metadata: SaveDocumentMetadata,
): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("metadata", JSON.stringify(metadataPayload(metadata)));

  const response = await fetch("/api/documents", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const body = (await response.json()) as { document?: unknown };
  const document = parseDocumentItem(body.document);
  if (!document) {
    throw new Error("Unable to save document.");
  }
  return document;
}
