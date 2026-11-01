import { documentFileName, type DocumentItem } from "@/lib/mock-documents";

type SavePickerType = {
  description: string;
  accept: Record<string, string[]>;
};

type SaveFilePickerWindow = Window & {
  showSaveFilePicker: (options: {
    suggestedName?: string;
    types?: SavePickerType[];
  }) => Promise<FileSystemFileHandle>;
};

function sanitizeDownloadFileName(name: string): string {
  const trimmed = name.trim().slice(0, 200);
  const sanitized = trimmed.replace(/[/\\?%*:|"<>]/g, "-").replace(/\.\./g, "");
  return sanitized || "document.bin";
}

function fileExtension(fileName: string): string | undefined {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === fileName.length - 1) {
    return undefined;
  }
  return fileName.slice(lastDot + 1).toLowerCase();
}

function mimeTypeForExtension(ext: string | undefined): string {
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
}

function savePickerTypes(ext: string | undefined): SavePickerType[] {
  switch (ext) {
    case "pdf":
      return [
        {
          description: "PDF document",
          accept: { "application/pdf": [".pdf"] },
        },
      ];
    case "jpg":
    case "jpeg":
      return [
        {
          description: "JPEG image",
          accept: { "image/jpeg": [".jpg", ".jpeg"] },
        },
      ];
    case "png":
      return [
        {
          description: "PNG image",
          accept: { "image/png": [".png"] },
        },
      ];
    default:
      return [
        {
          description: "Document file",
          accept: { "application/octet-stream": [".bin", ".dat"] },
        },
      ];
  }
}

async function buildDocumentFileBytes(item: DocumentItem): Promise<Uint8Array> {
  const lines = [
    `Title: ${item.title}`,
    `Document ID: ${item.id}`,
    `Version: ${item.version}`,
    `Type: ${item.category}`,
    `Job ID: ${item.jobId}`,
    "",
    "Placeholder file content until storage download is connected.",
  ];
  return new TextEncoder().encode(lines.join("\r\n"));
}

function triggerAnchorDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = "noopener";
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type DownloadDocumentOptions = {
  versionLabel?: string;
};

/** Prompts for a save location (where supported) and writes the document file. */
export async function downloadDocumentWithSaveDialog(
  item: DocumentItem,
  options?: DownloadDocumentOptions,
): Promise<void> {
  let fileName = sanitizeDownloadFileName(documentFileName(item));

  if (options?.versionLabel) {
    const version = options.versionLabel.trim().replace(/[/\\?%*:|"<>]/g, "-");
    const ext = fileExtension(fileName) ?? "bin";
    const stem = fileName.replace(/\.[^.]+$/, "") || "document";
    fileName = sanitizeDownloadFileName(`${stem}-${version}.${ext}`);
  }

  const ext = fileExtension(fileName);
  const mimeType = mimeTypeForExtension(ext);
  const bytes = await buildDocumentFileBytes(item);
  const blob = new Blob([bytes], { type: mimeType });

  const savePicker = (window as SaveFilePickerWindow).showSaveFilePicker;
  if (typeof savePicker === "function") {
    try {
      const handle = await savePicker({
        suggestedName: fileName,
        types: savePickerTypes(ext),
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  triggerAnchorDownload(blob, fileName);
}
