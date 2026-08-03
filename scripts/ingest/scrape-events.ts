/**
 * Orquestador multi-fuente de eventos Chile.
 * Registry: scripts/ingest/sources/registry.ts
 * Mapa de fuentes: src/lib/demand/source-catalog.ts
 *
 * Uso: npm run ingest:events
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import type { DemandSignal, IngestManifest } from "../../src/lib/demand/types";
import { normalizeSignals } from "../../src/lib/demand/dates";
import { FETCH_SOURCES, PLAYWRIGHT_SOURCES } from "./sources/registry";

const OUT_DIR = path.join(process.cwd(), "data", "ingested");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const sources: IngestManifest["sources"] = [];
  const all: DemandSignal[] = [];

  for (const runner of FETCH_SOURCES) {
    const result = await runner();
    sources.push({
      name: result.name,
      ok: result.ok,
      count: result.signals.length,
      error: result.error,
    });
    all.push(...result.signals);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      locale: "es-CL",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();

    for (const runner of PLAYWRIGHT_SOURCES) {
      const result = await runner(page);
      sources.push({
        name: result.name,
        ok: result.ok,
        count: result.signals.length,
        error: result.error,
      });
      all.push(...result.signals);
    }

    await context.close();
  } finally {
    await browser.close();
  }

  const byKey = new Map<string, DemandSignal>();
  for (const s of all) {
    const key = `${s.startsOn}|${s.title.toLowerCase().slice(0, 80)}`;
    const prev = byKey.get(key);
    if (!prev || s.intensity >= prev.intensity) byKey.set(key, s);
  }
  const signals = normalizeSignals([...byKey.values()]).sort((a, b) =>
    a.startsOn.localeCompare(b.startsOn),
  );

  const outPath = path.join(OUT_DIR, "events.json");
  await writeFile(outPath, JSON.stringify(signals, null, 2));
  await writeFile(
    path.join(OUT_DIR, "manifest-events.json"),
    JSON.stringify({ ranAt: new Date().toISOString(), sources }, null, 2),
  );

  console.log(`\nEventos fusionados: ${signals.length} → ${outPath}`);
  for (const s of sources) {
    console.log(
      `  - ${s.name}: ${s.ok ? "ok" : "fail"} (${s.count})${s.error ? ` — ${s.error}` : ""}`,
    );
  }
}

main();
