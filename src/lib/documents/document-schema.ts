import { DOCUMENT_TYPES } from "@/lib/document-types";
import type {
  DocumentItem,
  DocumentVersionEntry,
} from "@/lib/mock-documents";

const DOCUMENT_TYPE_SET = new Set<string>(DOCUMENT_TYPES);

const ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

function isVersionEntry(value: unknown): value is DocumentVersionEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.versionLabel === "string" &&
    typeof entry.isCurrent === "boolean" &&
    typeof entry.comment === "string" &&
    typeof entry.author === "string" &&
    typeof entry.date === "string" &&
    typeof entry.fileSize === "string"
  );
}

export function isValidDocumentId(id: string): boolean {
  return ID_PATTERN.test(id);
}

export function parseDocumentItem(value: unknown): DocumentItem | null {
  if (!value || typeof value !== "object") return null;
  const doc = value as Record<string, unknown>;

  const id = typeof doc.id === "string" ? doc.id.trim() : "";
  const title = typeof doc.title === "string" ? doc.title.trim() : "";
  const jobId = typeof doc.jobId === "string" ? doc.jobId.trim() : "";
  const customer = typeof doc.customer === "string" ? doc.customer.trim() : "";
  const category = typeof doc.category === "string" ? doc.category : "";
  const dateLabel = typeof doc.dateLabel === "string" ? doc.dateLabel : "";
  const version = typeof doc.version === "string" ? doc.version : "";
  const market = typeof doc.market === "string" ? doc.market : "";
  const branch = typeof doc.branch === "string" ? doc.branch : "";
  const location = typeof doc.location === "string" ? doc.location : "";
  const owner = typeof doc.owner === "string" ? doc.owner : "";
  const folderId = typeof doc.folderId === "string" ? doc.folderId : "";
  const uploadedOn = typeof doc.uploadedOn === "string" ? doc.uploadedOn : "";
  const retentionPolicy =
    typeof doc.retentionPolicy === "string" ? doc.retentionPolicy : "";
  const marketSegment =
    typeof doc.marketSegment === "string" ? doc.marketSegment : "";
  const fileSize = typeof doc.fileSize === "string" ? doc.fileSize : "";
  const tags = typeof doc.tags === "string" ? doc.tags : "";
  const versionCount =
    typeof doc.versionCount === "number" && Number.isFinite(doc.versionCount)
      ? doc.versionCount
      : 1;

  if (
    !isValidDocumentId(id) ||
    !title ||
    !jobId ||
    !customer ||
    !DOCUMENT_TYPE_SET.has(category)
  ) {
    return null;
  }

  let versionHistory: DocumentVersionEntry[] | undefined;
  if (Array.isArray(doc.versionHistory)) {
    const parsed = doc.versionHistory.filter(isVersionEntry);
    if (parsed.length > 0) versionHistory = parsed;
  }

  const optStr = (key: string, max: number) => {
    const v = doc[key];
    return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
  };

  return {
    id,
    title: title.slice(0, 200),
    jobId: jobId.slice(0, 20),
    customer: customer.slice(0, 120),
    category: category as DocumentItem["category"],
    dateLabel: dateLabel.slice(0, 40),
    version: version.slice(0, 20),
    market: market.slice(0, 80),
    branch: branch.slice(0, 120),
    location: location.slice(0, 120),
    owner: owner.slice(0, 120),
    folderId: folderId.slice(0, 120),
    uploadedOn: uploadedOn.slice(0, 40),
    retentionPolicy: retentionPolicy.slice(0, 120),
    versionCount,
    marketSegment: marketSegment.slice(0, 80),
    fileSize: fileSize.slice(0, 40),
    tags: tags.slice(0, 500),
    versionHistory,
    status: optStr("status", 80),
    division: optStr("division", 120),
    customerCode: optStr("customerCode", 40),
    jobName: optStr("jobName", 120),
    lotNumber: optStr("lotNumber", 40),
    communityName: optStr("communityName", 120),
    jobAddress: optStr("jobAddress", 200),
    modelName: optStr("modelName", 120),
    attachmentId: optStr("attachmentId", 80),
    docOriginationSystem: optStr("docOriginationSystem", 120),
    component: optStr("component", 120),
    productSku: optStr("productSku", 80),
    orderDeliveryDate: optStr("orderDeliveryDate", 40),
    insideSalesRep: optStr("insideSalesRep", 120),
    outsideSalesRep: optStr("outsideSalesRep", 120),
    takenBy: optStr("takenBy", 120),
    vendorName: optStr("vendorName", 120),
    documentNumber: optStr("documentNumber", 80),
  };
}

export function parseDocumentList(value: unknown): DocumentItem[] {
  if (!Array.isArray(value)) return [];
  const items: DocumentItem[] = [];
  for (const entry of value) {
    const parsed = parseDocumentItem(entry);
    if (parsed) items.push(parsed);
  }
  return items;
}
