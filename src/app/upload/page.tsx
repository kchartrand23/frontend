import { DocumentUploadWizard } from "@/components/upload/document-upload-wizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Document — Document Management Service",
  description: "Upload a document in three guided steps.",
};

export default function UploadPage() {
  return <DocumentUploadWizard />;
}
