import { cache } from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";
import {
  buildEventRecordsFromPacks,
  eventCanonicalManifest,
} from "./build-event-records";
import {
  getIngestCacheVersion,
  INGEST_DATA_REVALIDATE_SEC,
} from "./ingest-cache";
import type { EventCanonicalManifest, EventRecord } from "./types";

const OUT_DIR = path.join(process.cwd(), "data", "ingested");
const RECORDS_FILE = path.join(OUT_DIR, "events-canonical.json");
const MANIFEST_FILE = path.join(OUT_DIR, "events-canonical-manifest.json");

async function readCanonicalFile(): Promise<{
  manifest: EventCanonicalManifest;
  records: EventRecord[];
} | null> {
  try {
    const raw = await readFile(RECORDS_FILE, "utf8");
    const records = JSON.parse(raw) as EventRecord[];
    let manifest: EventCanonicalManifest;
    try {
      manifest = JSON.parse(
        await readFile(MANIFEST_FILE, "utf8"),
      ) as EventCanonicalManifest;
    } catch {
      manifest = eventCanonicalManifest(records);
    }
    return { records, manifest };
  } catch {
    return null;
  }
}

async function loadAllEventRecordsImpl(): Promise<EventRecord[]> {
  const fromFile = await readCanonicalFile();
  if (fromFile?.records.length) {
    return fromFile.records;
  }
  if (process.env.NODE_ENV === "development") {
    return buildEventRecordsFromPacks(200);
  }
  return [];
}

const loadAllEventRecordsCached = unstable_cache(
  async (ingestVersion: string) => {
    void ingestVersion;
    return loadAllEventRecordsImpl();
  },
  ["load-all-event-records"],
  { revalidate: INGEST_DATA_REVALIDATE_SEC, tags: ["ingest-data"] },
);

export async function loadAllEventRecords(): Promise<EventRecord[]> {
  const version = await getIngestCacheVersion();
  return loadAllEventRecordsCached(version);
}

export const loadEventRecordBySlug = cache(
  async (slug: string): Promise<EventRecord | null> => {
    const records = await loadAllEventRecords();
    return records.find((r) => r.slug === slug) ?? null;
  },
);

export const loadEventRecordByGuideSlug = cache(
  async (guideSlug: string): Promise<EventRecord | null> => {
    const records = await loadAllEventRecords();
    return records.find((r) => r.guideSlug === guideSlug) ?? null;
  },
);

const loadIndexableEventRecordsCached = unstable_cache(
  async (ingestVersion: string) => {
    void ingestVersion;
    const records = await loadAllEventRecordsImpl();
    return records.filter((r) => r.indexable);
  },
  ["load-indexable-event-records"],
  { revalidate: INGEST_DATA_REVALIDATE_SEC, tags: ["ingest-data"] },
);

export async function loadIndexableEventRecords(): Promise<EventRecord[]> {
  const version = await getIngestCacheVersion();
  return loadIndexableEventRecordsCached(version);
}

const loadEventPathMapCached = unstable_cache(
  async (ingestVersion: string) => {
    void ingestVersion;
    const records = await loadAllEventRecordsImpl();
    const entries: Array<[string, string]> = [];
    for (const r of records) {
      if (r.indexable) entries.push([r.guideSlug, r.slug]);
    }
    return entries;
  },
  ["load-event-path-map"],
  { revalidate: INGEST_DATA_REVALIDATE_SEC, tags: ["ingest-data"] },
);

export async function loadEventPathMap(): Promise<Map<string, string>> {
  const version = await getIngestCacheVersion();
  const entries = await loadEventPathMapCached(version);
  return new Map(entries);
}

export async function buildAndWriteEventCanonical(limit = 200): Promise<{
  manifest: EventCanonicalManifest;
  records: EventRecord[];
}> {
  await mkdir(OUT_DIR, { recursive: true });
  const records = await buildEventRecordsFromPacks(limit);
  const manifest = eventCanonicalManifest(records);
  await writeFile(RECORDS_FILE, JSON.stringify(records, null, 2));
  await writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  return { records, manifest };
}

export async function getEventCanonicalManifest(): Promise<EventCanonicalManifest> {
  const fromFile = await readCanonicalFile();
  if (fromFile) return fromFile.manifest;
  const records = await loadAllEventRecords();
  return eventCanonicalManifest(records);
}
