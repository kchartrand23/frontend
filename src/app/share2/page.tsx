import { FileSharePanelV2 } from "@/components/share/file-share-panel-v2";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Share (v2) — Document Management Service",
  description: "Share a document with colleagues.",
};

export default function Share2Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f2f1] px-4 py-10">
      <Suspense
        fallback={
          <div className="w-full max-w-2xl rounded-sm border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 shadow-2xl">
            Loading…
          </div>
        }
      >
        <FileSharePanelV2 />
      </Suspense>
    </div>
  );
}
