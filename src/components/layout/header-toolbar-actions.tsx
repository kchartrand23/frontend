"use client";

import Link from "next/link";
import { useCurrentUsername } from "@/lib/use-current-username";

/** Re-enable when notifications are wired up. */
const NOTIFICATIONS_ENABLED = false;

export function NotificationBell() {
  const unreadCount = 3;

  return (
    <button
      type="button"
      className="relative rounded-lg p-2 text-zinc-800 transition hover:bg-zinc-100"
      aria-label={`Notifications, ${unreadCount} unread`}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}

export function UserAvatarButton() {
  const { username, loading } = useCurrentUsername();
  const displayName = loading ? "Loading…" : username;

  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-rose-200 ring-2 ring-white transition group-hover:ring-zinc-200"
        aria-label={`Signed in as ${displayName}`}
      >
        <svg
          className="h-5 w-5 text-rose-800/60"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>
      <div
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 shadow-md group-hover:block group-focus-within:block"
      >
        {displayName}
      </div>
    </div>
  );
}

export function HeaderUploadLink() {
  return (
    <Link
      href="/upload"
      className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#1a2744] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#152038]"
    >
      Upload
    </Link>
  );
}

export function HeaderToolbarActions() {
  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <HeaderUploadLink />
      {NOTIFICATIONS_ENABLED ? <NotificationBell /> : null}
      <UserAvatarButton />
    </div>
  );
}
