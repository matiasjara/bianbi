import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { IngestManifest } from "../../src/lib/demand/types";
import { ingestFeriados } from "./feriados-lib";

const OUT_DIR = path.join(process.cwd(), "data", "ingested");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const year = new Date().getFullYear();
  const years = [year, year + 1];
  const all = [];
  const sources: IngestManifest["sources"] = [];

  for (const y of years) {
    const { signals, error } = await ingestFeriados(y);
    all.push(...signals);
    sources.push({
      name: `nager_holidays_${y}`,
      ok: !error,
      count: signals.length,
      error,
    });
  }

  const outPath = path.join(OUT_DIR, "feriados.json");
  await writeFile(outPath, JSON.stringify(all, null, 2));
  await writeFile(
    path.join(OUT_DIR, "manifest-feriados.json"),
    JSON.stringify({ ranAt: new Date().toISOString(), sources }, null, 2),
  );

  console.log(`Feriados: ${all.length} señales → ${outPath}`);
  for (const s of sources) {
    console.log(
      `  - ${s.name}: ${s.ok ? "ok" : "fail"} (${s.count}) ${s.error ?? ""}`,
    );
  }
}

main();
