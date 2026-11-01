"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import { useShareReturnHref } from "@/components/share/use-share-return-href";
import { sanitizeTextInput, validateOptionalText } from "@/lib/upload-validation";

const MAX_RECIPIENT_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 2000;

const RECIPIENT_PATTERN = /^[\w\s@.,\-+'/]+$/iu;

function validateRecipients(value: string): { ok: true } | { ok: false; message: string } {
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
    return {
      ok: false,
      message: "Recipients contain invalid characters.",
    };
  }
  return { ok: true };
}

function ShareAvatarStack() {
  return (
    <div className="flex items-center -space-x-2" aria-hidden>
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-200 ring-2 ring-white">
        <svg className="h-5 w-5 text-amber-800/60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white ring-2 ring-white">
        WW
      </span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-500 ring-2 ring-zinc-200">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </span>
    </div>
  );
}

export function FileSharePanel() {
  const returnHref = useShareReturnHref();
  const recipientId = useId();
  const messageId = useId();
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
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
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <h1 className="text-lg font-semibold text-zinc-900">Share</h1>
        <Link
          href={returnHref}
          className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          aria-label="Close share"
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
      </div>

      <form onSubmit={handleSend} className="px-5 py-5">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </span>
          <input
            id={recipientId}
            type="text"
            value={recipients}
            onChange={(e) =>
              setRecipients(sanitizeTextInput(e.target.value, MAX_RECIPIENT_LENGTH))
            }
            maxLength={MAX_RECIPIENT_LENGTH}
            placeholder="Add a name, group or email"
            autoComplete="off"
            className="w-full rounded-lg border border-zinc-200 py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#1a2744]/40 focus:ring-2 focus:ring-[#1a2744]/10"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
        </div>

        <div className="relative mt-4">
          <span className="pointer-events-none absolute left-3 top-3 text-zinc-400">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </span>
          <textarea
            id={messageId}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={4}
            placeholder="Add a message"
            className="w-full resize-none rounded-lg border border-zinc-200 py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#1a2744]/40 focus:ring-2 focus:ring-[#1a2744]/10"
          />
        </div>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
        {statusMessage && (
          <p className="mt-4 text-sm text-emerald-700" role="status">
            {statusMessage}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-5">
          <ShareAvatarStack />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-[#2563eb] transition hover:bg-sky-50"
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
              Copy Link
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-[#1a2744] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#152038]"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
