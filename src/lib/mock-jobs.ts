export type JobStatus = "Active" | "On Hold" | "Completed";

export type JobItem = {
  id: string;
  jobNumber: string;
  jobName: string;
  status: JobStatus;
  customer: string;
  address: string;
  market: string;
  branch: string;
  location: string;
  documentCount: number | null;
  lastUpdated: string;
  lastUpdatedSort: number;
};

export const MOCK_JOBS: JobItem[] = [
  {
    id: "1",
    jobNumber: "17944",
    jobName: "Lakewood Commons Renovation",
    status: "Completed",
    customer: "ABC Builders",
    address: "880 Lakewood Dr, Miami, FL 33101",
    market: "Raymond Building Supply",
    branch: "Jetport Facility",
    location: "Miami, FL",
    documentCount: 5,
    lastUpdated: "Jul 14, 2024",
    lastUpdatedSort: 20240714,
  },
  {
    id: "2",
    jobNumber: "21883",
    jobName: "Riverside Townhomes Phase 2",
    status: "Active",
    customer: "Smith Homes",
    address: "1200 Riverside Blvd, Tampa, FL 33602",
    market: "Raymond Building Supply",
    branch: "Tampa Facility",
    location: "Tampa, FL",
    documentCount: 4,
    lastUpdated: "Aug 2, 2024",
    lastUpdatedSort: 20240802,
  },
  {
    id: "3",
    jobNumber: "21003",
    jobName: "Harbor View Office Build",
    status: "On Hold",
    customer: "Metro Construction",
    address: "455 Harbor Way, Fort Lauderdale, FL 33301",
    market: "Raymond Building Supply",
    branch: "Pompano Beach Facility",
    location: "Fort Lauderdale, FL",
    documentCount: null,
    lastUpdated: "Jun 28, 2024",
    lastUpdatedSort: 20240628,
  },
  {
    id: "4",
    jobNumber: "19282",
    jobName: "Smith Residence",
    status: "Active",
    customer: "Smith Homes",
    address: "4821 Harbour Ct, Tampa, FL 33601",
    market: "Raymond Building Supply",
    branch: "Naples Facility",
    location: "Naples, FL",
    documentCount: 5,
    lastUpdated: "Jul 30, 2024",
    lastUpdatedSort: 20240730,
  },
  {
    id: "5",
    jobNumber: "18401",
    jobName: "Johnson Kitchen Remodel",
    status: "Completed",
    customer: "Johnson Co.",
    address: "901 Palm Ave, North Port, FL 34287",
    market: "Raymond Building Supply",
    branch: "North Port Facility",
    location: "North Port, FL",
    documentCount: 3,
    lastUpdated: "May 19, 2024",
    lastUpdatedSort: 20240519,
  },
];

export const JOB_CUSTOMERS = [
  ...new Set(MOCK_JOBS.map((job) => job.customer)),
].sort();

export function getJobByNumber(jobNumber: string): JobItem | undefined {
  return MOCK_JOBS.find((job) => job.jobNumber === jobNumber);
}

export const JOB_LAST_UPDATED_OPTIONS = [
  "Any time",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This year",
] as const;
