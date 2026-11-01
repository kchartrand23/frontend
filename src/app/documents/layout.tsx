import { Suspense } from "react";
import { DocumentsShell } from "@/components/documents/documents-shell";

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-[#F9FAFB] text-zinc-900">
      <Suspense fallback={null}>
        <DocumentsShell />
      </Suspense>
      {children}
    </div>
  );
}
