import { DOCUMENT_METADATA_FILTER_FIELDS } from "@/lib/document-metadata-filter-fields";
import type { DocumentItem } from "@/lib/mock-documents";
import type { JobItem } from "@/lib/mock-jobs";

export const DEFAULT_DOCUMENT_STATUS = "Active";

export type DocumentMetadataRow = {
  label: string;
  value: string;
};

function displayOrDash(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function formatCreatedDate(uploadedOn: string): string {
  const parsed = Date.parse(uploadedOn);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return displayOrDash(uploadedOn);
}

function resolveMetadataValues(
  document: DocumentItem,
  job?: JobItem | null,
): Record<string, string> {
  const retentionDisplay = document.retentionPolicy.replace(/\s—\s/g, " - ");

  return {
    fileName: document.title,
    documentType: document.category,
    versionNumber: document.version,
    status: document.status?.trim() || DEFAULT_DOCUMENT_STATUS,
    market: displayOrDash(document.market),
    branch: displayOrDash(document.branch),
    division: displayOrDash(document.division),
    customerName: document.customer,
    customerCode: displayOrDash(document.customerCode),
    jobName: displayOrDash(document.jobName ?? job?.jobName),
    jobId: document.jobId,
    lotNumber: displayOrDash(document.lotNumber),
    communityName: displayOrDash(document.communityName),
    jobAddress: displayOrDash(document.jobAddress ?? job?.address),
    modelName: displayOrDash(document.modelName),
    attachmentId: displayOrDash(document.attachmentId),
    docOriginationSystem: displayOrDash(document.docOriginationSystem),
    component: displayOrDash(document.component),
    productSku: displayOrDash(document.productSku),
    orderDeliveryDate: displayOrDash(document.orderDeliveryDate),
    insideSalesRep: displayOrDash(document.insideSalesRep),
    outsideSalesRep: displayOrDash(document.outsideSalesRep),
    takenBy: displayOrDash(document.takenBy),
    vendorName: displayOrDash(document.vendorName),
    documentNumber: displayOrDash(document.documentNumber),
    owner: document.owner,
    retentionPolicy: retentionDisplay,
    tags: displayOrDash(document.tags),
    location: displayOrDash(document.location ?? job?.location),
    marketSegment: displayOrDash(document.marketSegment),
    createdDate: formatCreatedDate(document.uploadedOn),
    folder: displayOrDash(document.folderId),
  };
}

export function getDocumentMetadataRows(
  document: DocumentItem,
  job?: JobItem | null,
): DocumentMetadataRow[] {
  const values = resolveMetadataValues(document, job);

  const rows = DOCUMENT_METADATA_FILTER_FIELDS.map((field) => ({
    label: field.label,
    value: values[field.id] ?? "—",
  }));

  rows.push({
    label: "File Size",
    value: displayOrDash(document.fileSize),
  });

  return rows;
}

export type UploadMetadataSnapshot = {
  sourceFileName: string;
  sourceFileSizeBytes: number;
  title: string;
  documentType: string;
  versionNumber: string;
  documentStatus: string;
  market: string;
  branch: string;
  division: string;
  customer: string;
  customerCode: string;
  jobName: string;
  jobId: string;
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
  owner: string;
  retentionPolicy: string;
  tags: string;
  location: string;
};

function formatBytesForDisplay(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getUploadReviewMetadataRows(
  snapshot: UploadMetadataSnapshot,
): DocumentMetadataRow[] {
  const retentionDisplay = snapshot.retentionPolicy.replace(/\s—\s/g, " - ");

  const values: Record<string, string> = {
    fileName: displayOrDash(snapshot.title) !== "—" ? snapshot.title.trim() : snapshot.sourceFileName,
    documentType: snapshot.documentType,
    versionNumber: displayOrDash(snapshot.versionNumber),
    status: snapshot.documentStatus.trim() || DEFAULT_DOCUMENT_STATUS,
    market: displayOrDash(snapshot.market),
    branch: displayOrDash(snapshot.branch),
    division: displayOrDash(snapshot.division),
    customerName: displayOrDash(snapshot.customer),
    customerCode: displayOrDash(snapshot.customerCode),
    jobName: displayOrDash(snapshot.jobName),
    jobId: displayOrDash(snapshot.jobId),
    lotNumber: displayOrDash(snapshot.lotNumber),
    communityName: displayOrDash(snapshot.communityName),
    jobAddress: displayOrDash(snapshot.jobAddress),
    modelName: displayOrDash(snapshot.modelName),
    attachmentId: displayOrDash(snapshot.attachmentId),
    docOriginationSystem: displayOrDash(snapshot.docOriginationSystem),
    component: displayOrDash(snapshot.component),
    productSku: displayOrDash(snapshot.productSku),
    orderDeliveryDate: displayOrDash(snapshot.orderDeliveryDate),
    insideSalesRep: displayOrDash(snapshot.insideSalesRep),
    outsideSalesRep: displayOrDash(snapshot.outsideSalesRep),
    takenBy: displayOrDash(snapshot.takenBy),
    vendorName: displayOrDash(snapshot.vendorName),
    documentNumber: displayOrDash(snapshot.documentNumber),
    owner: displayOrDash(snapshot.owner),
    retentionPolicy: retentionDisplay,
    tags: displayOrDash(snapshot.tags),
    location: displayOrDash(snapshot.location),
    marketSegment: "—",
    createdDate: "—",
    folder: "—",
  };

  const rows: DocumentMetadataRow[] = [
    { label: "Source file", value: snapshot.sourceFileName },
    ...DOCUMENT_METADATA_FILTER_FIELDS.map((field) => ({
      label: field.label,
      value: values[field.id] ?? "—",
    })),
    {
      label: "File Size",
      value: formatBytesForDisplay(snapshot.sourceFileSizeBytes),
    },
  ];

  return rows;
}
