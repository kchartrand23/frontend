import { DOCUMENT_METADATA_FILTER_FIELDS } from "@/lib/document-metadata-filter-fields";
import type { DocumentItem } from "@/lib/mock-documents";
import type { JobItem } from "@/lib/mock-jobs";

export type DocumentMetadataFilters = Record<string, string>;

export type LandingSearchFilters = {
  documentType: string;
  customer: string;
  location: string;
  owner: string;
  dateRange: string;
  relatedTo: string;
};

export const EMPTY_LANDING_SEARCH_FILTERS: LandingSearchFilters = {
  documentType: "",
  customer: "",
  location: "",
  owner: "",
  dateRange: "",
  relatedTo: "",
};

function metadataValueIncludes(
  haystack: string,
  needle: string,
  inputType?: "text" | "date",
): boolean {
  const hay = haystack.toLowerCase();
  const need = needle.toLowerCase();
  if (inputType === "date") {
    return hay.includes(need) || hay === need;
  }
  return hay.includes(need);
}

function resolveMetadataValuesForFilter(
  document: DocumentItem,
  job?: JobItem | null,
): Record<string, string> {
  const retentionDisplay = document.retentionPolicy.replace(/\s—\s/g, " - ");

  return {
    fileName: document.title,
    documentType: document.category,
    versionNumber: document.version,
    status: document.status?.trim() || "Active",
    market: document.market,
    branch: document.branch,
    division: document.division ?? "",
    customerName: document.customer,
    customerCode: document.customerCode ?? "",
    jobName: document.jobName ?? job?.jobName ?? "",
    jobId: document.jobId,
    lotNumber: document.lotNumber ?? "",
    communityName: document.communityName ?? "",
    jobAddress: document.jobAddress ?? job?.address ?? "",
    modelName: document.modelName ?? "",
    attachmentId: document.attachmentId ?? "",
    docOriginationSystem: document.docOriginationSystem ?? "",
    component: document.component ?? "",
    productSku: document.productSku ?? "",
    orderDeliveryDate: document.orderDeliveryDate ?? "",
    insideSalesRep: document.insideSalesRep ?? "",
    outsideSalesRep: document.outsideSalesRep ?? "",
    takenBy: document.takenBy ?? "",
    vendorName: document.vendorName ?? "",
    documentNumber: document.documentNumber ?? "",
    owner: document.owner,
    retentionPolicy: retentionDisplay,
    tags: document.tags ?? "",
    location: document.location ?? job?.location ?? "",
    marketSegment: document.marketSegment ?? "",
    createdDate: document.uploadedOn,
    folder: document.folderId,
  };
}

export function documentMatchesMetadataFilters(
  document: DocumentItem,
  filters: DocumentMetadataFilters,
  job?: JobItem | null,
): boolean {
  const values = resolveMetadataValuesForFilter(document, job);

  for (const [fieldId, rawValue] of Object.entries(filters)) {
    const needle = rawValue.trim();
    if (!needle) continue;

    const field = DOCUMENT_METADATA_FILTER_FIELDS.find((f) => f.id === fieldId);
    const haystack = values[fieldId] ?? "";
    if (
      !metadataValueIncludes(haystack, needle, field?.inputType ?? "text")
    ) {
      return false;
    }
  }

  return true;
}

export function hasActiveMetadataFilters(
  filters: DocumentMetadataFilters,
): boolean {
  return Object.values(filters).some((value) => value.trim().length > 0);
}

export function documentMatchesLandingSearchFilters(
  document: DocumentItem,
  filters: LandingSearchFilters,
): boolean {
  if (filters.documentType && document.category !== filters.documentType) {
    return false;
  }

  const customer = filters.customer.trim().toLowerCase();
  if (customer && !document.customer.toLowerCase().includes(customer)) {
    return false;
  }

  const location = filters.location.trim().toLowerCase();
  if (location && !(document.location ?? "").toLowerCase().includes(location)) {
    return false;
  }

  const owner = filters.owner.trim().toLowerCase();
  if (owner && !document.owner.toLowerCase().includes(owner)) {
    return false;
  }

  const dateRange = filters.dateRange.trim().toLowerCase();
  if (dateRange) {
    const dateHaystack =
      `${document.uploadedOn} ${document.dateLabel}`.toLowerCase();
    if (!dateHaystack.includes(dateRange)) {
      return false;
    }
  }

  const relatedTo = filters.relatedTo.trim().toLowerCase();
  if (relatedTo) {
    const relatedHaystack =
      `${document.jobId} ${document.title} ${document.customer}`.toLowerCase();
    if (!relatedHaystack.includes(relatedTo)) {
      return false;
    }
  }

  return true;
}

export function hasActiveLandingSearchFilters(
  filters: LandingSearchFilters,
): boolean {
  return (
    Boolean(filters.documentType) ||
    filters.customer.trim().length > 0 ||
    filters.location.trim().length > 0 ||
    filters.owner.trim().length > 0 ||
    filters.dateRange.trim().length > 0 ||
    filters.relatedTo.trim().length > 0
  );
}
