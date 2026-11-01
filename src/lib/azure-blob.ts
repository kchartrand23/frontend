import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

type BlobCache = {
  blobServiceClient?: BlobServiceClient;
};

const globalWithBlob = globalThis as typeof globalThis & {
  __azureBlobCache?: BlobCache;

};

function getBlobCache(): BlobCache {
  if (!globalWithBlob.__azureBlobCache) {
    globalWithBlob.__azureBlobCache = {};
  }
  return globalWithBlob.__azureBlobCache;
}

/**
 * Azure Blob Storage client for document binaries (future upload/download).
 * Local dev: prefer AZURE_STORAGE_CONNECTION_STRING from Key Vault / .env.local.
 * Deployed: use managed identity with AZURE_STORAGE_ACCOUNT_NAME.
 */
export function getBlobServiceClient(): BlobServiceClient {
  const cache = getBlobCache();
  if (cache.blobServiceClient) {
    return cache.blobServiceClient;
  }

  const connectionString =
    process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
  if (connectionString) {
    cache.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    return cache.blobServiceClient;
  }

  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME?.trim();
  if (!accountName) {
    throw new Error(
      "Missing Azure Storage config. Set AZURE_STORAGE_CONNECTION_STRING (local) or AZURE_STORAGE_ACCOUNT_NAME (managed identity).",
    );
  }

  const accountUrl =
    process.env.AZURE_STORAGE_ACCOUNT_URL?.trim() ??
    `https://${accountName}.blob.core.windows.net`;

  cache.blobServiceClient = new BlobServiceClient(
    accountUrl,
    new DefaultAzureCredential(),
  );
  return cache.blobServiceClient;
}

export function getDocumentsContainerName(): string {
  const name = process.env.AZURE_STORAGE_CONTAINER_NAME?.trim();
  if (!name) {
    throw new Error("Missing AZURE_STORAGE_CONTAINER_NAME.");
  }
  return name;
}
