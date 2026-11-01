import type { DocumentType } from "@/lib/document-types";

export type DocumentCategory = DocumentType;

export type DocumentVersionEntry = {
  versionLabel: string;
  isCurrent: boolean;
  comment: string;
  author: string;
  date: string;
  fileSize: string;
};

export type DocumentItem = {
  id: string;
  title: string;
  jobId: string;
  customer: string;
  category: DocumentCategory;
  dateLabel: string;
  version: string;
  market: string;
  branch: string;
  location: string;
  owner: string;
  folderId: string;
  uploadedOn: string;
  retentionPolicy: string;
  versionCount: number;
  marketSegment: string;
  fileSize: string;
  tags: string;
  versionHistory?: DocumentVersionEntry[];
  status?: string;
  division?: string;
  customerCode?: string;
  jobName?: string;
  lotNumber?: string;
  communityName?: string;
  jobAddress?: string;
  modelName?: string;
  attachmentId?: string;
  docOriginationSystem?: string;
  component?: string;
  productSku?: string;
  orderDeliveryDate?: string;
  insideSalesRep?: string;
  outsideSalesRep?: string;
  takenBy?: string;
  vendorName?: string;
  documentNumber?: string;
};

export const CATEGORY_FILTERS = [
  "All",
  "Plans",
  "Estimates",
  "Photos",
  "Specifications",
  "Contracts",
  "Quotes",
  "Sales Orders",
] as const;

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export const RECENT_DOCUMENTS: DocumentItem[] = [
  {
    id: "1",
    title: "Smith Residence Floor Plans",
    jobId: "19282",
    customer: "Smith Homes",
    category: "Plan",
    dateLabel: "Aug 28",
    version: "v4",
    market: "Florida",
    branch: "Tampa Facility",
    location: "Tampa, FL",
    owner: "John Doe",
    folderId: "plans-architectural-revised",
    uploadedOn: "Aug 28, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 4,
    marketSegment: "Residential",
    fileSize: "4.1 MB",
    tags: "architectural, floor plan",
  },
  {
    id: "2",
    title: "Kitchen Remodel Estimate",
    jobId: "18401",
    customer: "Johnson Co.",
    category: "Estimate",
    dateLabel: "Aug 27",
    version: "v2",
    market: "Florida",
    branch: "North Port Facility",
    location: "Orlando, FL",
    owner: "Sarah Kim",
    folderId: "quotes",
    uploadedOn: "Aug 27, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 2,
    marketSegment: "Residential",
    fileSize: "1.2 MB",
    tags: "estimate, kitchen",
  },
  {
    id: "3",
    title: "Delivery Photo – Framing Materials",
    jobId: "19282",
    customer: "Smith Homes",
    category: "Photo",
    dateLabel: "Jul 21",
    version: "v1",
    market: "Florida",
    branch: "Tampa Facility",
    location: "Tampa, FL",
    owner: "Mike Torres",
    folderId: "photos",
    uploadedOn: "Jul 21, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 1,
    marketSegment: "Residential",
    fileSize: "3.6 MB",
    tags: "photo, framing",
  },
  {
    id: "7",
    title: "Foundation Plan – Original",
    jobId: "19282",
    customer: "Smith Homes",
    category: "Plan",
    dateLabel: "Jun 22",
    version: "v1",
    market: "Florida",
    branch: "Tampa Facility",
    location: "Tampa, FL",
    owner: "Sarah Kim",
    folderId: "plans-architectural-original",
    uploadedOn: "Jun 22, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 1,
    marketSegment: "Residential",
    fileSize: "2.1 MB",
    tags: "architectural, foundation",
  },
  {
    id: "8",
    title: "Elevation Drawings",
    jobId: "19282",
    customer: "Smith Homes",
    category: "Plan",
    dateLabel: "Aug 28",
    version: "v2",
    market: "Florida",
    branch: "Tampa Facility",
    location: "Tampa, FL",
    owner: "John Doe",
    folderId: "plans-architectural-original",
    uploadedOn: "Aug 20, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 2,
    marketSegment: "Residential",
    fileSize: "2.8 MB",
    tags: "architectural, elevation",
    versionHistory: [
      {
        versionLabel: "v2",
        isCurrent: true,
        comment: "Updated east elevation",
        author: "John Doe",
        date: "Aug 28, 2024",
        fileSize: "2.8 MB",
      },
      {
        versionLabel: "v1",
        isCurrent: false,
        comment: "Initial elevations",
        author: "John Doe",
        date: "Jul 05, 2024",
        fileSize: "2.5 MB",
      },
    ],
  },
  {
    id: "9",
    title: "Sales Order — Smith Residence",
    jobId: "19282",
    customer: "Smith Homes",
    category: "Sales Order",
    dateLabel: "Sep 03",
    version: "v1",
    market: "Florida",
    branch: "Tampa Facility",
    location: "Tampa, FL",
    owner: "Sarah Kim",
    folderId: "sales-orders",
    uploadedOn: "Sep 03, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 1,
    marketSegment: "Residential",
    fileSize: "420 KB",
    tags: "sales order, cabinets",
  },
  {
    id: "4",
    title: "HVAC Specifications",
    jobId: "17655",
    customer: "Metro Build",
    category: "Specification",
    dateLabel: "Aug 24",
    version: "v3",
    market: "Florida",
    branch: "Jetport Facility",
    location: "Miami, FL",
    owner: "John Doe",
    folderId: "specifications",
    uploadedOn: "Aug 24, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 3,
    marketSegment: "Commercial",
    fileSize: "1.9 MB",
    tags: "hvac, specification",
  },
];

export const RELATED_DOCUMENTS: DocumentItem[] = [
  {
    id: "5",
    title: "Bid Request – Smith Residence",
    jobId: "19282",
    customer: "Smith Homes",
    category: "Estimate",
    dateLabel: "Aug 02",
    version: "v1",
    market: "Florida",
    branch: "Tampa Facility",
    location: "Tampa, FL",
    owner: "Sarah Kim",
    folderId: "quotes",
    uploadedOn: "Aug 02, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 1,
    marketSegment: "Residential",
    fileSize: "890 KB",
    tags: "bid, exterior",
  },
  {
    id: "6",
    title: "Material Quote — Cabinets",
    jobId: "18401",
    customer: "Johnson Co.",
    category: "Quote",
    dateLabel: "Aug 21",
    version: "v2",
    market: "Florida",
    branch: "North Port Facility",
    location: "Orlando, FL",
    owner: "Sarah Kim",
    folderId: "quotes",
    uploadedOn: "Aug 21, 2024",
    retentionPolicy: "Job Files — 7 Years",
    versionCount: 2,
    marketSegment: "Residential",
    fileSize: "640 KB",
    tags: "quote, cabinets",
  },
];

export function getDocumentVersionHistory(
  doc: DocumentItem,
): DocumentVersionEntry[] {
  if (doc.versionHistory && doc.versionHistory.length > 0) {
    return doc.versionHistory;
  }
  return [
    {
      versionLabel: doc.version,
      isCurrent: true,
      comment: "Current version",
      author: doc.owner,
      date: doc.uploadedOn,
      fileSize: doc.fileSize,
    },
  ];
}

export function documentFileName(doc: DocumentItem): string {
  const base = doc.title.replace(/[^\w\s–-]/g, "").trim();
  const ext =
    doc.category === "Photo"
      ? "jpg"
      : doc.category === "Plan" || doc.category === "Estimate"
        ? "pdf"
        : "pdf";
  return `${base}.${ext}`;
}

export const ALL_DOCUMENTS: DocumentItem[] = [
  ...RECENT_DOCUMENTS,
  ...RELATED_DOCUMENTS,
];

export function getDocumentById(id: string): DocumentItem | undefined {
  return ALL_DOCUMENTS.find((doc) => doc.id === id);
}

export const DOCUMENT_CUSTOMERS = [
  ...new Set(ALL_DOCUMENTS.map((doc) => doc.customer)),
].sort();

export const DOCUMENT_DATE_RANGE_OPTIONS = [
  "Any time",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This year",
] as const;

export function filterMatchesCategory(
  doc: DocumentItem,
  filter: CategoryFilter,
): boolean {
  if (filter === "All") return true;
  const map: Record<Exclude<CategoryFilter, "All">, DocumentCategory> = {
    Plans: "Plan",
    Estimates: "Estimate",
    Photos: "Photo",
    Specifications: "Specification",
    Contracts: "Contract",
    Quotes: "Quote",
    "Sales Orders": "Sales Order",
  };
  return doc.category === map[filter];
}
