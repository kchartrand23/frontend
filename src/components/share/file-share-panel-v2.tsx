"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import { useShareDocumentFileName } from "@/components/share/use-share-document-file-name";
import { useShareReturnHref } from "@/components/share/use-share-return-href";
import { sanitizeTextInput, validateOptionalText } from "@/lib/upload-validation";
const MAX_RECIPIENT_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 2000;
const RECIPIENT_PATTERN = /^[\w\s@.,\-+'/]+$/iu;

const PERMISSION_OPTIONS = ["Can edit", "Can view"] as const;
type PermissionOption = (typeof PERMISSION_OPTIONS)[number];

function validateRecipients(
  value: string,
): { ok: true } | { ok: false; message: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, message: "Add at least one recipient." };
  }
  if (trimmed.length > MAX_RECIPIENT_LENGTH) {
    return {
      ok: false,
      message: `Recipients must be ${MAX_RECIPIENT_LENGTH} characters or fewer.`,
    };
  }
  if (!RECIPIENT_PATTERN.test(trimmed)) {
    return { ok: false, message: "Recipients contain invalid characters." };
  }
  return { ok: true };
}

function AccessAvatarRow() {
  return (
    <button
      type="button"
      className="group relative flex items-center -space-x-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
      aria-label="Manage access (19 people, 5 groups)"
      title="Manage access (19 people, 5 groups)"
    >
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-zinc-200 ring-2 ring-white"
        >
          {index === 2 ? (
            <span className="bg-gradient-to-br from-sky-100 to-indigo-200 flex h-full w-full items-center justify-center">
              <svg
                className="h-4 w-4 text-indigo-600/70"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </span>
          ) : (
            <svg
              className="h-4 w-4 text-zinc-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </span>
      ))}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 ring-2 ring-white">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </span>
      <span className="pointer-events-none absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 shadow-md group-hover:block group-focus-visible:block">
        Manage access (19 people, 5 groups)
        <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-zinc-200 bg-white" />
      </span>
    </button>
  );
}

export function FileSharePanelV2() {
  const returnHref = useShareReturnHref();
  const { fileName: shareFileName, loading: shareFileNameLoading } =
    useShareDocumentFileName();
  const recipientId = useId();
  const messageId = useId();
  const permissionId = useId();
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [permission, setPermission] = useState<PermissionOption>("Can edit");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCopyLink = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const placeholderLink = `${window.location.origin}/documents`;
      await navigator.clipboard.writeText(placeholderLink);
      setStatusMessage("Link copied to clipboard.");
    } catch {
      setErrorMessage("Unable to copy link. Try again later.");
    }
  };

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    const recipientResult = validateRecipients(recipients);
    if (!recipientResult.ok) {
      setErrorMessage(recipientResult.message);
      return;
    }

    const messageResult = validateOptionalText(message, MAX_MESSAGE_LENGTH);
    if (!messageResult.ok) {
      setErrorMessage(messageResult.message);
      return;
    }

    setErrorMessage(
      "Sharing is not connected yet. This screen is for layout preview only.",
    );
  };

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-2xl">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-zinc-800">
          Share &apos;
          {shareFileNameLoading ? "…" : shareFileName}
          &apos;
        </h1>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            className="rounded p-2 text-zinc-500 hover:bg-zinc-100"
            aria-label="More options"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded p-2 text-zinc-500 hover:bg-zinc-100"
            aria-label="Help"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <Link
            href={returnHref}
            className="rounded p-2 text-zinc-500 hover:bg-zinc-100"
            aria-label="Close share"
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
          </Link>
        </div>
      </div>

      <form onSubmit={handleSend} className="px-5 pb-5 pt-4">
        <div className="flex overflow-hidden rounded-sm border border-zinc-300 focus-within:border-[#2563eb] focus-within:ring-1 focus-within:ring-[#2563eb]">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <input
              id={recipientId}
              type="text"
              value={recipients}
              onChange={(e) =>
                setRecipients(
                  sanitizeTextInput(e.target.value, MAX_RECIPIENT_LENGTH),
                )
              }
              maxLength={MAX_RECIPIENT_LENGTH}
              placeholder="Add a name, group, or email"
              autoComplete="off"
              className="w-full border-0 py-2.5 pl-9 pr-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
            />
          </div>
          <div className="flex shrink-0 items-stretch border-l border-zinc-300 bg-zinc-50/80">
            <span className="flex items-center px-2 text-zinc-500" aria-hidden>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </span>
            <label htmlFor={permissionId} className="sr-only">
              Permission
            </label>
            <select
              id={permissionId}
              value={permission}
              onChange={(e) =>
                setPermission(e.target.value as PermissionOption)
              }
              className="max-w-[7.5rem] cursor-pointer border-0 bg-transparent py-2 pl-0 pr-7 text-sm text-zinc-700 outline-none"
            >
              {PERMISSION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="pointer-events-none -ml-6 flex items-center pr-2 text-zinc-500">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <div className="relative mt-3">
          <span className="pointer-events-none absolute left-3 top-3 text-zinc-500">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </span>
          <textarea
            id={messageId}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={5}
            placeholder="Add a message"
            className="w-full resize-none rounded-sm border border-zinc-300 py-2.5 pl-9 pr-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
          />
        </div>

        {errorMessage && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
        {statusMessage && (
          <p className="mt-3 text-sm text-emerald-700" role="status">
            {statusMessage}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <AccessAvatarRow />
          <div className="flex flex-wrap items-stretch gap-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-l-md border border-[#2563eb] bg-white px-4 py-2 text-sm font-medium text-[#2563eb] transition hover:bg-sky-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Copy link
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-r-md border border-l-0 border-[#2563eb] bg-white px-3 py-2 text-[#2563eb] transition hover:bg-sky-50"
              aria-label="Link settings"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <button
              type="submit"
              className="ml-2 inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
