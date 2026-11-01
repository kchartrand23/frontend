"use client";

type UploadSuccessBannerProps = {
  onDismiss?: () => void;
};

export function UploadSuccessBanner({ onDismiss }: UploadSuccessBannerProps) {
  return (
    <div
      className="mx-auto mb-8 max-w-2xl rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-left sm:px-5 sm:py-4"
      role="status"
    >
      <div className="flex gap-3">
        <span
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
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
          <p className="text-sm font-semibold text-emerald-900">
            Document uploaded successfully
          </p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded p-1 text-emerald-700 hover:bg-emerald-100/80"
            aria-label="Dismiss notification"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
