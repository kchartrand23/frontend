/** File types aligned with upload-validation.ts */
const PICKER_TYPES: FilePickerAcceptType[] = [
  {
    description: "Documents and images",
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  },
];

type FilePickerAcceptType = {
  description: string;
  accept: Record<string, string[]>;
};

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * Opens the native file picker and resolves after the dialog closes (Chromium / Edge).
 * Returns null when the user cancels or the API is unavailable.
 */
export async function pickUploadFileWithSystemDialog(): Promise<File | null> {
  if (typeof window === "undefined") return null;

  const showOpenFilePicker = (
    window as Window & {
      showOpenFilePicker?: (options?: {
        multiple?: boolean;
        types?: FilePickerAcceptType[];
      }) => Promise<FileSystemFileHandle[]>;
    }
  ).showOpenFilePicker;

  if (typeof showOpenFilePicker !== "function") {
    return null;
  }

  try {
    const handles = await showOpenFilePicker({
      multiple: false,
      types: PICKER_TYPES,
    });
    const handle = handles[0];
    if (!handle) return null;
    return await handle.getFile();
  } catch (error) {
    if (isAbortError(error)) return null;
    return null;
  }
}
