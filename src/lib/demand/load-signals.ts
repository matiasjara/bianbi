import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildSeasonalitySignals } from "./seasonality";
import { enrichSignalCity, signalMatchesCity } from "./cities";
import { normalizeSignal } from "./dates";
import { enrichSignalPotentials } from "./calendar";
import {
  applySignalAdmin,
  loadSignalAdminState,
} from "./signal-admin";
import { isRelevantDemandSignal } from "./signal-relevance";
import type { CityId, DemandSignal } from "./types";

async function readJsonSafe<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

/** Solo señales reales: feriados API + scrape + estacionalidad. Sin seed dummy. */
function sanitizeSignalDates(s: DemandSignal): DemandSignal | null {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const startOk =
    iso.test(s.startsOn) && !Number.isNaN(Date.parse(`${s.startsOn}T12:00:00Z`));
  if (!startOk) return null;
  const endOk =
    iso.test(s.endsOn) && !Number.isNaN(Date.parse(`${s.endsOn}T12:00:00Z`));
  if (endOk && s.endsOn >= s.startsOn) return s;
  return { ...s, endsOn: s.startsOn };
}

export async function loadAllSignals(options?: {
  city?: CityId;
}): Promise<{
  signals: DemandSignal[];
  ingestedAt: string | null;
  sourceCounts: Record<string, number>;
}> {
  const base = path.join(process.cwd(), "data", "ingested");
  const fromFile = await readJsonSafe<DemandSignal[]>(
    path.join(base, "signals.json"),
    [],
  );
  const feriados = await readJsonSafe<DemandSignal[]>(
    path.join(base, "feriados.json"),
    [],
  );
  const events = await readJsonSafe<DemandSignal[]>(
    path.join(base, "events.json"),
    [],
  );
  const manifest = await readJsonSafe<{ ranAt?: string }>(
    path.join(base, "manifest.json"),
    {},
  );

  const year = new Date().getFullYear();
  const seasonality = buildSeasonalitySignals(year, year + 1);

  const byId = new Map<string, DemandSignal>();
  for (const raw of [...seasonality, ...feriados, ...events, ...fromFile]) {
    if (raw.source === "seed") continue;
    const sanitized = sanitizeSignalDates(raw);
    if (!sanitized) continue;
    const s = normalizeSignal(sanitized);
    byId.set(s.id, s);
  }

  // Recalcula potencial de eventos (BTS ≠ teatro chico) aunque el JSON sea viejo
  const enriched = enrichSignalPotentials([...byId.values()])
    .filter(isRelevantDemandSignal)
    .map(enrichSignalCity);
  const admin = await loadSignalAdminState();
  let signals = applySignalAdmin(enriched, admin);
  if (options?.city) {
    signals = signals.filter((s) => signalMatchesCity(s, options.city!));
  }
  const sourceCounts: Record<string, number> = {};
  for (const s of signals) {
    sourceCounts[s.source] = (sourceCounts[s.source] ?? 0) + 1;
  }

  return {
    signals,
    ingestedAt: manifest.ranAt ?? null,
    sourceCounts,
  };
}
