"use client";

import { DocumentSearchHeader } from "@/components/documents/document-search-header";
import { DocumentSearchNavProvider } from "@/components/documents/document-search-nav-context";
import { DocumentSearchView } from "@/components/documents/document-search-view";

export function DocumentsShell() {
  return (
    <DocumentSearchNavProvider>
      <DocumentSearchHeader />
      <div className="flex min-h-[calc(100vh-3.25rem)] flex-col">
        <DocumentSearchView />
      </div>
    </DocumentSearchNavProvider>
  );
}
