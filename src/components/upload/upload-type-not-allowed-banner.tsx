"use client";

export function UploadTypeNotAllowedBanner() {
  return (
    <div
      className="mx-auto w-full max-w-2xl rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-left sm:px-5 sm:py-4"
      role="alert"
    >
      <div className="flex gap-3">
        <span
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700"
          aria-hidden
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-900">
            Document Type is not allowed
          </p>
        </div>
      </div>
    </div>
  );
}
