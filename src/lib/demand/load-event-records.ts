import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildEventRecordsFromPacks,
  eventCanonicalManifest,
} from "./build-event-records";
import type { EventCanonicalManifest, EventRecord } from "./types";

const OUT_DIR = path.join(process.cwd(), "data", "ingested");
const RECORDS_FILE = path.join(OUT_DIR, "events-canonical.json");
const MANIFEST_FILE = path.join(OUT_DIR, "events-canonical-manifest.json");

type CachedCanonical = {
  manifest: EventCanonicalManifest;
  records: EventRecord[];
};

let cache: CachedCanonical | null = null;
let cacheMtime = 0;

async function readCanonicalFile(): Promise<CachedCanonical | null> {
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

export async function loadAllEventRecords(): Promise<EventRecord[]> {
  const fromFile = await readCanonicalFile();
  if (fromFile?.records.length) {
    cache = fromFile;
    return fromFile.records;
  }
  const built = await buildEventRecordsFromPacks(200);
  cache = { records: built, manifest: eventCanonicalManifest(built) };
  return built;
}

export async function loadEventRecordBySlug(
  slug: string,
): Promise<EventRecord | null> {
  const records = await loadAllEventRecords();
  return records.find((r) => r.slug === slug) ?? null;
}

export async function loadEventRecordByGuideSlug(
  guideSlug: string,
): Promise<EventRecord | null> {
  const records = await loadAllEventRecords();
  return records.find((r) => r.guideSlug === guideSlug) ?? null;
}

export async function loadIndexableEventRecords(): Promise<EventRecord[]> {
  const records = await loadAllEventRecords();
  return records.filter((r) => r.indexable);
}

export async function loadEventPathMap(): Promise<Map<string, string>> {
  const records = await loadAllEventRecords();
  const map = new Map<string, string>();
  for (const r of records) {
    if (r.indexable) map.set(r.guideSlug, r.slug);
  }
  return map;
}

export async function buildAndWriteEventCanonical(limit = 200): Promise<CachedCanonical> {
  await mkdir(OUT_DIR, { recursive: true });
  const records = await buildEventRecordsFromPacks(limit);
  const manifest = eventCanonicalManifest(records);
  await writeFile(RECORDS_FILE, JSON.stringify(records, null, 2));
  await writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  cache = { records, manifest };
  return cache;
}

export async function getEventCanonicalManifest(): Promise<EventCanonicalManifest> {
  const fromFile = await readCanonicalFile();
  if (fromFile) return fromFile.manifest;
  const records = await loadAllEventRecords();
  return eventCanonicalManifest(records);
}
