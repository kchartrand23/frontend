"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getBranchesForMarket,
  isBranch,
  isMarket,
  MARKETS,
  OWNERS,
} from "@/lib/business-context-options";
import {
  DEFAULT_DOCUMENT_STATUS,
  getUploadReviewMetadataRows,
} from "@/lib/document-metadata-display";
import {
  DEFAULT_UPLOAD_DOCUMENT_TYPE,
  DOCUMENT_TYPES,
  inferUploadDocumentTypeFromFileName,
  isDocumentType,
  type DocumentType,
} from "@/lib/document-types";
import { pickUploadFileWithSystemDialog } from "@/lib/pick-upload-file";
import {
  sanitizeTextInput,
  validateJobId,
  validateOptionalText,
  validateRequiredText,
  validateTags,
  validateUploadFile,
} from "@/lib/upload-validation";

/** Re-enable when upload queue UI is ready. */
const UPLOAD_QUEUE_STEP_ENABLED = false;

const STEPS = [
  "Select File",
  "Upload Queue",
  "Document Details",
  "Validate",
] as const;

const UPLOAD_QUEUE_STEP = 2;
const TOTAL_STEPS = STEPS.length;

function getVisibleSteps(): readonly string[] {
  if (UPLOAD_QUEUE_STEP_ENABLED) return STEPS;
  return STEPS.filter((_, index) => index + 1 !== UPLOAD_QUEUE_STEP);
}

function getDisplayStepIndex(step: number): number {
  if (!UPLOAD_QUEUE_STEP_ENABLED) {
    if (step <= 1) return 1;
    if (step === 3) return 2;
    if (step >= 4) return 3;
  }
  return step;
}

function getNextWizardStep(step: number): number {
  if (step >= TOTAL_STEPS) return TOTAL_STEPS;
  if (!UPLOAD_QUEUE_STEP_ENABLED && step === 1) return 3;
  return step + 1;
}

function getPreviousWizardStep(step: number): number {
  if (step <= 1) return 1;
  if (!UPLOAD_QUEUE_STEP_ENABLED && step === 3) return 1;
  return step - 1;
}

const DOCUMENT_STATUSES = [
  "Draft",
  "Active",
  "Pending Review",
  "Archived",
] as const;

const STEP_HEADINGS: Record<number, string> = {
  1: "Upload a document",
  2: "Upload a document",
  3: "Add Document Details",
  4: "Review upload",
};

const RETENTION_POLICIES = [
  "Job Files — 7 Years",
  "Legal Hold — Indefinite",
  "Financial — 10 Years",
  "Standard — 3 Years",
] as const;

const fieldClassName =
  "mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#5A4AF4]/40 focus:ring-2 focus:ring-[#5A4AF4]/20";

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-700">
      {children}
      {required && (
        <span className="text-red-500" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

const STEP_SUBTITLES: Record<number, string> = {
  1: "Choose a file, provide details, then review before uploading.",
  2: "Confirm your file finished uploading before continuing.",
  3: "Choose a file, complete its metadata, then review before uploading.",
  4: "Review everything before saving.",
};

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50/90 p-4 sm:p-5">
      <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function UploadedFileSummary({
  file,
  onReplace,
}: {
  file: File;
  onReplace: () => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Uploaded file
        </p>
        <button
          type="button"
          onClick={onReplace}
          className="text-sm font-medium text-[#2563eb] hover:underline"
        >
          Replace file
        </button>
      </div>
      <div className="mt-3 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">{file.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {fileTypeLabel(file.name)} · {formatFileSize(file.size)}
          </p>
        </div>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
          aria-hidden
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb >= 10 ? Math.round(kb) : kb.toFixed(1)} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`;
}

function fileTypeLabel(fileName: string): string {
  const parts = fileName.split(".");
  if (parts.length < 2) return "File";
  return parts[parts.length - 1]!.toUpperCase();
}

function UploadQueueItem({ file }: { file: File }) {
  return (
    <li className="flex items-start gap-4 rounded-lg border border-emerald-300 bg-white px-4 py-4">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900">{file.name}</p>
        <p className="mt-0.5 text-xs text-zinc-500">
          {fileTypeLabel(file.name)} · {formatFileSize(file.size)}
        </p>
        <p className="mt-2 text-sm font-medium text-emerald-600">Completed</p>
      </div>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
        aria-hidden
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </li>
  );
}

function StepProgressRing({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const progress = step / total;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center"
      aria-label={`Step ${step} of ${total}`}
    >
      <svg className="h-[72px] w-[72px] -rotate-90" viewBox="0 0 72 72" aria-hidden>
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth="4"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="absolute text-center text-xs font-semibold leading-tight text-zinc-700">
        {step}
        <span className="block text-[10px] font-normal text-zinc-400">of {total}</span>
      </span>
    </div>
  );
}

export function DocumentUploadWizard() {
  const router = useRouter();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const browseInFlightRef = useRef(false);
  const legacyChangeHandledRef = useRef(false);
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [jobId, setJobId] = useState("");
  const [jobName, setJobName] = useState("");
  const [customer, setCustomer] = useState("");
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>(
    DEFAULT_UPLOAD_DOCUMENT_TYPE,
  );
  const [market, setMarket] = useState("");
  const [branch, setBranch] = useState("");

  const branchOptions = useMemo(() => {
    if (isMarket(market)) {
      return getBranchesForMarket(market);
    }
    return [];
  }, [market]);
  const [location, setLocation] = useState("");
  const [retentionPolicy, setRetentionPolicy] = useState<string>(
    RETENTION_POLICIES[0],
  );
  const [owner, setOwner] = useState<string>(OWNERS[0]);
  const [tags, setTags] = useState("");
  const [versionNumber, setVersionNumber] = useState("1");
  const [documentStatus, setDocumentStatus] = useState<string>(
    DEFAULT_DOCUMENT_STATUS,
  );
  const [division, setDivision] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [jobAddress, setJobAddress] = useState("");
  const [modelName, setModelName] = useState("");
  const [attachmentId, setAttachmentId] = useState("");
  const [docOriginationSystem, setDocOriginationSystem] = useState("");
  const [component, setComponent] = useState("");
  const [productSku, setProductSku] = useState("");
  const [orderDeliveryDate, setOrderDeliveryDate] = useState("");
  const [insideSalesRep, setInsideSalesRep] = useState("");
  const [outsideSalesRep, setOutsideSalesRep] = useState("");
  const [takenBy, setTakenBy] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptFile = useCallback((file: File | undefined): boolean => {
    if (!file) return false;
    const result = validateUploadFile(file);
    if (!result.ok) {
      setSelectedFile(null);
      setFileError(result.message);
      return false;
    }
    setFileError(null);
    setSelectedFile(file);
    setDocumentType(inferUploadDocumentTypeFromFileName(file.name));
    if (!title.trim()) {
      setTitle(sanitizeTextInput(file.name.replace(/\.[^.]+$/, ""), 200));
    }
    return true;
  }, [title]);

  const finishFileSelection = useCallback(
    (file: File | undefined) => {
      const success = acceptFile(file);
      if (!success) return;

      setStep((current) => (current === 1 ? getNextWizardStep(1) : current));

      const input = fileInputRef.current;
      if (input) {
        input.value = "";
        input.blur();
      }
    },
    [acceptFile],
  );

  const onBrowseFiles = async () => {
    if (browseInFlightRef.current) return;
    browseInFlightRef.current = true;
    setStepError(null);

    try {
      const hasSystemPicker =
        typeof window !== "undefined" &&
        typeof (
          window as Window & {
            showOpenFilePicker?: unknown;
          }
        ).showOpenFilePicker === "function";

      if (hasSystemPicker) {
        const picked = await pickUploadFileWithSystemDialog();
        if (picked) {
          finishFileSelection(picked);
        }
        return;
      }

      fileInputRef.current?.click();
    } finally {
      browseInFlightRef.current = false;
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (legacyChangeHandledRef.current) return;

    const file = event.target.files?.[0];
    if (!file) return;

    legacyChangeHandledRef.current = true;
    const input = event.currentTarget;

    window.setTimeout(() => {
      finishFileSelection(file);
      legacyChangeHandledRef.current = false;
      input.value = "";
      input.blur();
    }, 300);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    finishFileSelection(file);
  };

  const canContinue = () => {
    if (step === 1) return selectedFile !== null && !fileError;
    if (step === 2) return selectedFile !== null;
    if (step === 3) {
      return (
        validateRequiredText(title, "File name", 200).ok &&
        validateRequiredText(documentType, "Document type", 80).ok &&
        validateOptionalText(jobName, 120).ok &&
        validateRequiredText(customer, "Customer name", 120).ok &&
        validateOptionalText(location, 120).ok &&
        validateOptionalText(jobAddress, 200).ok &&
        validateTags(tags).ok
      );
    }
    return true;
  };

  const validateDocumentDetailsStep = (): string | null => {
    const checks = [
      validateRequiredText(title, "File name", 200),
      validateRequiredText(documentType, "Document type", 80),
      validateOptionalText(jobName, 120),
      validateRequiredText(customer, "Customer name", 120),
      validateOptionalText(location, 120),
      validateOptionalText(jobAddress, 200),
      validateOptionalText(division, 120),
      validateOptionalText(customerCode, 40),
      validateTags(tags),
    ];
    for (const result of checks) {
      if (!result.ok) return result.message;
    }
    if (jobId.trim()) {
      const jobResult = validateJobId(jobId);
      if (!jobResult.ok) return jobResult.message;
    }
    return null;
  };

  const handleContinue = () => {
    setStepError(null);
    if (step === 1) {
      if (!selectedFile) {
        setStepError("Select a file to continue.");
        return;
      }
      const fileResult = validateUploadFile(selectedFile);
      if (!fileResult.ok) {
        setFileError(fileResult.message);
        return;
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.blur();
      }
    }
    if (UPLOAD_QUEUE_STEP_ENABLED && step === UPLOAD_QUEUE_STEP) {
      if (!selectedFile) {
        setStepError("No file in the upload queue.");
        return;
      }
    }
    if (step === 3) {
      const detailsError = validateDocumentDetailsStep();
      if (detailsError) {
        setStepError(detailsError);
        return;
      }
    }
    if (step === TOTAL_STEPS) {
      router.push("/?upload=success");
      return;
    }
    setStep((current) => getNextWizardStep(current));
  };

  const handleBack = () => {
    setStepError(null);
    if (step <= 1) return;
    setStep(getPreviousWizardStep(step));
  };

  const backPillClassName =
    "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50";

  const cancelButtonClassName =
    "inline-flex items-center justify-center rounded-lg border border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#2563eb] transition hover:bg-sky-50";

  const continueEnabled = canContinue();
  const visibleSteps = getVisibleSteps();
  const displayStep = getDisplayStepIndex(step);

  const handleMarketChange = (nextMarket: string) => {
    setMarket(nextMarket);
    setBranch("");
  };

  const reviewMetadataRows = useMemo(
    () =>
      getUploadReviewMetadataRows({
        sourceFileName: selectedFile?.name ?? "",
        sourceFileSizeBytes: selectedFile?.size ?? 0,
        title,
        documentType,
        versionNumber,
        documentStatus,
        market,
        branch,
        division,
        customer,
        customerCode,
        jobName,
        jobId,
        lotNumber,
        communityName,
        jobAddress,
        modelName,
        attachmentId,
        docOriginationSystem,
        component,
        productSku,
        orderDeliveryDate,
        insideSalesRep,
        outsideSalesRep,
        takenBy,
        vendorName,
        documentNumber,
        owner,
        retentionPolicy,
        tags,
        location,
      }),
    [
      selectedFile,
      title,
      documentType,
      versionNumber,
      documentStatus,
      market,
      branch,
      division,
      customer,
      customerCode,
      jobName,
      jobId,
      lotNumber,
      communityName,
      jobAddress,
      modelName,
      attachmentId,
      docOriginationSystem,
      component,
      productSku,
      orderDeliveryDate,
      insideSalesRep,
      outsideSalesRep,
      takenBy,
      vendorName,
      documentNumber,
      owner,
      retentionPolicy,
      tags,
      location,
    ],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between bg-[#1a2744] px-5 py-4 sm:px-8">
        <h1 className="text-base font-semibold text-white sm:text-lg">
          Upload Document
        </h1>
        <Link
          href="/"
          className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label="Close upload"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>
      </header>

      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-zinc-200 px-5 py-5 sm:px-8">
        <div className="min-w-0 max-w-2xl">
          <p className="text-lg font-bold text-zinc-900">
            {STEP_HEADINGS[step] ?? "Upload a document"}
          </p>
          <p className="mt-1 text-sm text-sky-700/90">
            {STEP_SUBTITLES[step]}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Step {displayStep} — {visibleSteps[displayStep - 1]}
          </p>
        </div>
        <StepProgressRing step={displayStep} total={visibleSteps.length} />
      </div>

      <main
        className={`mx-auto flex w-full flex-1 flex-col px-5 py-8 sm:px-8 ${
          step >= 3 ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {step === 1 && (
          <div
            onDragOver={onDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={
              isDragging
                ? "rounded-lg ring-2 ring-sky-300 ring-offset-2"
                : undefined
            }
          >
            <input
              ref={fileInputRef}
              id={inputId}
              type="file"
              tabIndex={-1}
              className="hidden"
              accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={onFileInputChange}
            />
            {selectedFile && !fileError ? (
              <UploadedFileSummary
                file={selectedFile}
                onReplace={() => {
                  setStepError(null);
                  setSelectedFile(null);
                  setFileError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              />
            ) : (
              <div
                className={`flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 transition sm:py-20 ${
                  isDragging
                    ? "border-sky-400 bg-sky-50/80"
                    : "border-sky-200 bg-zinc-50/80"
                }`}
              >
                <span className="mb-4 text-[#1a2744]">
                  <svg
                    className="mx-auto h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </span>
                <button
                  type="button"
                  onClick={() => void onBrowseFiles()}
                  className="flex flex-col items-center rounded-lg px-4 py-2 text-center transition hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744]/30"
                >
                  <span className="text-base font-bold text-[#1a2744]">
                    Upload files
                  </span>
                  <span className="mt-2 text-sm text-zinc-600">
                    or{" "}
                    <span className="font-medium text-[#2563eb] underline-offset-2 hover:underline">
                      click to browse your files
                    </span>
                  </span>
                </button>
                <span className="mt-4 text-xs text-zinc-400">
                  (PDF, DOCX, XLSX, JPG, PNG) • (Max 100 MB)
                </span>
              </div>
            )}
            {fileError && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {fileError}
              </p>
            )}
          </div>
        )}

        {UPLOAD_QUEUE_STEP_ENABLED && step === UPLOAD_QUEUE_STEP && selectedFile && (
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Upload queue</h2>
            <ul className="mt-6 list-none space-y-3" aria-label="Upload queue">
              <UploadQueueItem file={selectedFile} />
            </ul>
          </div>
        )}

        {step === 3 && selectedFile && (
          <div className="space-y-6">
            <UploadedFileSummary
              file={selectedFile}
              onReplace={() => {
                setStepError(null);
                setStep(1);
              }}
            />

            <DetailSection title="Document details">
              <div className="md:col-span-2">
                <FieldLabel htmlFor="doc-title" required>
                  File Name
                </FieldLabel>
                <input
                  id="doc-title"
                  type="text"
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="doc-type" required>
                  Document Type
                </FieldLabel>
                <select
                  id="doc-type"
                  value={
                    isDocumentType(documentType)
                      ? documentType
                      : DEFAULT_UPLOAD_DOCUMENT_TYPE
                  }
                  onChange={(e) => {
                    const next = e.target.value;
                    if (isDocumentType(next)) {
                      setDocumentType(next);
                    }
                  }}
                  className={fieldClassName}
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="version-number">Version Number</FieldLabel>
                <input
                  id="version-number"
                  type="text"
                  maxLength={20}
                  value={versionNumber}
                  onChange={(e) =>
                    setVersionNumber(e.target.value.slice(0, 20))
                  }
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="doc-status">Status</FieldLabel>
                <select
                  id="doc-status"
                  value={documentStatus}
                  onChange={(e) => setDocumentStatus(e.target.value)}
                  className={fieldClassName}
                >
                  {DOCUMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </DetailSection>

            <DetailSection title="Organization">
              <div>
                <FieldLabel htmlFor="market">Market</FieldLabel>
                <select
                  id="market"
                  value={market}
                  onChange={(e) => handleMarketChange(e.target.value)}
                  className={fieldClassName}
                >
                  <option value="">Select market</option>
                  {MARKETS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="branch">Branch</FieldLabel>
                <select
                  id="branch"
                  value={isBranch(branch) ? branch : ""}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (next === "") {
                      setBranch("");
                      return;
                    }
                    if (isBranch(next)) {
                      setBranch(next);
                    }
                  }}
                  className={fieldClassName}
                  disabled={!isMarket(market)}
                >
                  <option value="">
                    {isMarket(market) ? "Select branch" : "Select market first"}
                  </option>
                  {branchOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="division">Division</FieldLabel>
                <input
                  id="division"
                  type="text"
                  maxLength={120}
                  value={division}
                  onChange={(e) => setDivision(e.target.value.slice(0, 120))}
                  className={fieldClassName}
                />
              </div>
            </DetailSection>

            <DetailSection title="Customer & job">
              <div>
                <FieldLabel htmlFor="customer" required>
                  Customer Name
                </FieldLabel>
                <input
                  id="customer"
                  type="text"
                  maxLength={120}
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value.slice(0, 120))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="customer-code">Customer Code</FieldLabel>
                <input
                  id="customer-code"
                  type="text"
                  maxLength={40}
                  value={customerCode}
                  onChange={(e) =>
                    setCustomerCode(e.target.value.slice(0, 40))
                  }
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="job-name">Job Name</FieldLabel>
                <input
                  id="job-name"
                  type="text"
                  maxLength={120}
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value.slice(0, 120))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="job-id">Job ID</FieldLabel>
                <input
                  id="job-id"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={jobId}
                  onChange={(e) =>
                    setJobId(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="lot-number">Lot Number</FieldLabel>
                <input
                  id="lot-number"
                  type="text"
                  maxLength={40}
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value.slice(0, 40))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="community-name">Community Name</FieldLabel>
                <input
                  id="community-name"
                  type="text"
                  maxLength={120}
                  value={communityName}
                  onChange={(e) =>
                    setCommunityName(e.target.value.slice(0, 120))
                  }
                  className={fieldClassName}
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="job-address">Job Address</FieldLabel>
                <input
                  id="job-address"
                  type="text"
                  maxLength={200}
                  value={jobAddress}
                  onChange={(e) => setJobAddress(e.target.value.slice(0, 200))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="model-name">Model Name</FieldLabel>
                <input
                  id="model-name"
                  type="text"
                  maxLength={120}
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value.slice(0, 120))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="attachment-id">Attachment ID</FieldLabel>
                <input
                  id="attachment-id"
                  type="text"
                  maxLength={80}
                  value={attachmentId}
                  onChange={(e) => setAttachmentId(e.target.value.slice(0, 80))}
                  className={fieldClassName}
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="doc-origination">
                  Document Origination System
                </FieldLabel>
                <input
                  id="doc-origination"
                  type="text"
                  maxLength={120}
                  value={docOriginationSystem}
                  onChange={(e) =>
                    setDocOriginationSystem(e.target.value.slice(0, 120))
                  }
                  className={fieldClassName}
                />
              </div>
            </DetailSection>

            <DetailSection title="Sales & fulfillment">
              <div>
                <FieldLabel htmlFor="component">Component</FieldLabel>
                <input
                  id="component"
                  type="text"
                  maxLength={120}
                  value={component}
                  onChange={(e) => setComponent(e.target.value.slice(0, 120))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="product-sku">Product SKU</FieldLabel>
                <input
                  id="product-sku"
                  type="text"
                  maxLength={80}
                  value={productSku}
                  onChange={(e) => setProductSku(e.target.value.slice(0, 80))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="order-delivery-date">
                  Order Delivery Date
                </FieldLabel>
                <input
                  id="order-delivery-date"
                  type="date"
                  value={orderDeliveryDate}
                  onChange={(e) => setOrderDeliveryDate(e.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="inside-sales-rep">
                  Inside Sales Rep
                </FieldLabel>
                <input
                  id="inside-sales-rep"
                  type="text"
                  maxLength={120}
                  value={insideSalesRep}
                  onChange={(e) =>
                    setInsideSalesRep(e.target.value.slice(0, 120))
                  }
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="outside-sales-rep">
                  Outside Sales Rep
                </FieldLabel>
                <input
                  id="outside-sales-rep"
                  type="text"
                  maxLength={120}
                  value={outsideSalesRep}
                  onChange={(e) =>
                    setOutsideSalesRep(e.target.value.slice(0, 120))
                  }
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="taken-by">Taken By</FieldLabel>
                <input
                  id="taken-by"
                  type="text"
                  maxLength={120}
                  value={takenBy}
                  onChange={(e) => setTakenBy(e.target.value.slice(0, 120))}
                  className={fieldClassName}
                />
              </div>
            </DetailSection>

            <DetailSection title="Other Information">
              <div>
                <FieldLabel htmlFor="vendor-name">Vendor Name</FieldLabel>
                <input
                  id="vendor-name"
                  type="text"
                  maxLength={120}
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value.slice(0, 120))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="document-number">Document Number</FieldLabel>
                <input
                  id="document-number"
                  type="text"
                  maxLength={80}
                  value={documentNumber}
                  onChange={(e) =>
                    setDocumentNumber(e.target.value.slice(0, 80))
                  }
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="owner">Owner</FieldLabel>
                <select
                  id="owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className={fieldClassName}
                >
                  {OWNERS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="retention-policy">Retention Policy</FieldLabel>
                <select
                  id="retention-policy"
                  value={retentionPolicy}
                  onChange={(e) => setRetentionPolicy(e.target.value)}
                  className={fieldClassName}
                >
                  {RETENTION_POLICIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="tags">Tags</FieldLabel>
                <input
                  id="tags"
                  type="text"
                  maxLength={500}
                  value={tags}
                  onChange={(e) => setTags(e.target.value.slice(0, 500))}
                  className={fieldClassName}
                  placeholder="Comma-separated tags"
                />
              </div>
            </DetailSection>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="text-sm text-zinc-600">
              Review the details below before saving your document.
            </p>
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {reviewMetadataRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5"
                >
                  <dt className="text-xs font-medium text-zinc-500">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-zinc-900 break-words">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex gap-3 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>
                This document will be immediately searchable after saving. You can
                edit metadata at any time.
              </p>
            </div>
          </div>
        )}

        {stepError && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {stepError}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-6">
          <div className="flex min-w-0 items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className={backPillClassName}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            ) : (
              <span />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {step >= 2 && (
              <Link href="/documents" className={cancelButtonClassName}>
                Cancel
              </Link>
            )}
            <button
              type="button"
              disabled={!continueEnabled}
              onClick={handleContinue}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                continueEnabled
                  ? "bg-[#1a2744] text-white hover:bg-[#152038]"
                  : "cursor-not-allowed bg-zinc-200 text-zinc-400"
              }`}
            >
              {step === TOTAL_STEPS ? "Save document" : "Next"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
