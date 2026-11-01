"use client";

import Link from "next/link";
import { UsLbmLogo } from "@/components/auth/us-lbm-logo";
import { HeaderToolbarActions } from "@/components/layout/header-toolbar-actions";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="U.S. LBM home">
          <UsLbmLogo className="h-11 w-auto sm:h-12" />
        </Link>

        <HeaderToolbarActions />
      </div>
    </header>
  );
}
