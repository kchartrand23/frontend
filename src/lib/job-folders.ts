import type { DocumentItem } from "@/lib/mock-documents";

export type JobFolderNode = {
  id: string;
  label: string;
  children?: JobFolderNode[];
};

export const JOB_FOLDER_TREE: JobFolderNode[] = [
  { id: "all", label: "All Documents" },
  {
    id: "plans",
    label: "Plans",
    children: [
      {
        id: "plans-architectural",
        label: "Architectural",
        children: [
          { id: "plans-architectural-original", label: "Original" },
          { id: "plans-architectural-revised", label: "Revised" },
        ],
      },
      { id: "plans-structural", label: "Structural" },
    ],
  },
  { id: "quotes", label: "Quotes" },
  { id: "sales-orders", label: "Sales Orders" },
  { id: "specifications", label: "Specifications" },
  { id: "photos", label: "Photos" },
  { id: "contracts", label: "Contracts" },
];

export function documentMatchesFolder(
  documentFolderId: string,
  selectedFolderId: string,
): boolean {
  if (selectedFolderId === "all") return true;
  if (documentFolderId === selectedFolderId) return true;
  return documentFolderId.startsWith(`${selectedFolderId}-`);
}

export function countDocumentsInFolder(
  documents: DocumentItem[],
  folderId: string,
): number {
  return documents.filter((doc) =>
    documentMatchesFolder(doc.folderId, folderId),
  ).length;
}

function findPathToFolder(
  nodes: JobFolderNode[],
  targetId: string,
  trail: string[] = [],
): string[] | null {
  for (const node of nodes) {
    const nextTrail = [...trail, node.label];
    if (node.id === targetId) return nextTrail;
    if (node.children) {
      const found = findPathToFolder(node.children, targetId, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

export function folderPathLabel(folderId: string): string {
  if (folderId === "all") return "All Documents";
  const path = findPathToFolder(JOB_FOLDER_TREE, folderId);
  return path ? path.slice(1).join(" > ") : folderId;
}

export function collectFolderCounts(
  documents: DocumentItem[],
  nodes: JobFolderNode[] = JOB_FOLDER_TREE,
): Map<string, number> {
  const counts = new Map<string, number>();

  const walk = (node: JobFolderNode) => {
    counts.set(node.id, countDocumentsInFolder(documents, node.id));
    node.children?.forEach(walk);
  };

  nodes.forEach(walk);
  return counts;
}
