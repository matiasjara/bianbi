import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { buildSeasonalitySignals } from "../../src/lib/demand/seasonality";
import { normalizeSignals } from "../../src/lib/demand/dates";
import { isRelevantDemandSignal } from "../../src/lib/demand/signal-relevance";
import type { DemandSignal, IngestManifest } from "../../src/lib/demand/types";
import { ingestFeriados } from "./feriados-lib";

const OUT_DIR = path.join(process.cwd(), "data", "ingested");

async function readJsonSafe<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const year = new Date().getFullYear();
  const sources: IngestManifest["sources"] = [];
  const merged: DemandSignal[] = [];

  // 1) Feriados
  for (const y of [year, year + 1]) {
    const { signals, error } = await ingestFeriados(y);
    merged.push(...signals);
    sources.push({
      name: `nager_holidays_${y}`,
      ok: !error,
      count: signals.length,
      error,
    });
  }
  await writeFile(
    path.join(OUT_DIR, "feriados.json"),
    JSON.stringify(
      merged.filter((s) => s.source === "nager_holidays"),
      null,
      2,
    ),
  );

  // 2) Estacionalidad
  const seasonality = buildSeasonalitySignals(year, year + 1);
  merged.push(...seasonality);
  sources.push({
    name: "seasonality_rules",
    ok: true,
    count: seasonality.length,
  });
  await writeFile(
    path.join(OUT_DIR, "seasonality.json"),
    JSON.stringify(seasonality, null, 2),
  );

  // 3) Eventos (si ya corrió el scrape; si no, vacío)
  const events = await readJsonSafe<DemandSignal[]>(
    path.join(OUT_DIR, "events.json"),
    [],
  );
  merged.push(...events);
  sources.push({
    name: "events_file",
    ok: true,
    count: events.length,
  });

  // Dedup by id
  const byId = new Map<string, DemandSignal>();
  for (const s of merged) byId.set(s.id, s);
  const all = normalizeSignals([...byId.values()]).filter(isRelevantDemandSignal);

  await writeFile(path.join(OUT_DIR, "signals.json"), JSON.stringify(all, null, 2));
  const manifest: IngestManifest = {
    ranAt: new Date().toISOString(),
    sources,
  };
  await writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.log(`Pipeline completo: ${all.length} señales`);
  for (const s of sources) {
    console.log(
      `  - ${s.name}: ${s.ok ? "ok" : "fail"} (${s.count}) ${s.error ?? ""}`,
    );
  }
}

main();
