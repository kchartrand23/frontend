/** Metadata fields available for document search filters (matches upload wizard; no external sharing). */

export type DocumentMetadataFilterField = {
  id: string;
  label: string;
  maxLength?: number;
  inputType?: "text" | "date";
};

export const DOCUMENT_METADATA_FILTER_FIELDS: readonly DocumentMetadataFilterField[] =
  [
    { id: "fileName", label: "File Name", maxLength: 200 },
    { id: "documentType", label: "Document Type", maxLength: 80 },
    { id: "versionNumber", label: "Version Number", maxLength: 20 },
    { id: "status", label: "Status", maxLength: 80 },
    { id: "retentionPolicy", label: "Retention Policy", maxLength: 120 },
    { id: "division", label: "Division", maxLength: 120 },
    { id: "market", label: "Market", maxLength: 80 },
    { id: "branch", label: "Branch", maxLength: 120 },
    { id: "customerName", label: "Customer Name", maxLength: 120 },
    { id: "customerCode", label: "Customer Code", maxLength: 40 },
    { id: "jobName", label: "Job Name", maxLength: 120 },
    { id: "jobId", label: "Job ID", maxLength: 10 },
    { id: "jobAddress", label: "Job Address", maxLength: 200 },
    { id: "lotNumber", label: "Lot Number", maxLength: 40 },
    { id: "communityName", label: "Community Name", maxLength: 120 },
    { id: "modelName", label: "Model Name", maxLength: 120 },
    { id: "outsideSalesRep", label: "Outside Sales Rep", maxLength: 120 },
    { id: "insideSalesRep", label: "Inside Sales Rep", maxLength: 120 },
    { id: "component", label: "Component", maxLength: 120 },
    { id: "productSku", label: "Product SKU", maxLength: 80 },
    {
      id: "orderDeliveryDate",
      label: "Order Delivery Date",
      inputType: "date",
    },
    { id: "takenBy", label: "Taken By", maxLength: 120 },
    { id: "vendorName", label: "Vendor Name", maxLength: 120 },
    { id: "documentNumber", label: "Document Number", maxLength: 80 },
    { id: "owner", label: "Owner", maxLength: 120 },
    { id: "attachmentId", label: "Attachment ID", maxLength: 80 },
    {
      id: "docOriginationSystem",
      label: "Document Origination System",
      maxLength: 120,
    },
    { id: "tags", label: "Tags", maxLength: 500 },
    { id: "location", label: "Location", maxLength: 120 },
    { id: "marketSegment", label: "Market Segment", maxLength: 80 },
    { id: "createdDate", label: "Created Date", inputType: "date" },
    { id: "folder", label: "Folder ID", maxLength: 120 },
  ] as const;
