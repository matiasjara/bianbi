import { readFile } from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";

const MANIFEST = path.join(process.cwd(), "data", "ingested", "manifest.json");

/** Versión de datos ingestados — invalida cache cuando cambia manifest.ranAt. */
async function readIngestVersion(): Promise<string> {
  try {
    const m = JSON.parse(await readFile(MANIFEST, "utf8")) as { ranAt?: string };
    return m.ranAt ?? "unknown";
  } catch {
    return "unknown";
  }
}

export const getIngestCacheVersion = unstable_cache(
  readIngestVersion,
  ["ingest-cache-version"],
  { revalidate: 300, tags: ["ingest-data"] },
);

/** Segundos de revalidación para lecturas derivadas de data/ingested. */
export const INGEST_DATA_REVALIDATE_SEC = 3600;
