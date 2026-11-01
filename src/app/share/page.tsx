import { FileSharePanel } from "@/components/share/file-share-panel";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Share — Document Management Service",
  description: "Share a document with colleagues.",
};

export default function SharePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100/80 px-4 py-10">
      <Suspense
        fallback={
          <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 shadow-xl">
            Loading…
          </div>
        }
      >
        <FileSharePanel />
      </Suspense>
    </div>
  );
}
