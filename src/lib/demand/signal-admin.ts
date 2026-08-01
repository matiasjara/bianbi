import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DemandSignal } from "./types";

const BASE = path.join(process.cwd(), "data", "ingested");
const OVERRIDES_FILE = path.join(BASE, "signal-overrides.json");
const SUPPRESSIONS_FILE = path.join(BASE, "signal-suppressions.json");

export type SignalOverride = Partial<
  Pick<DemandSignal, "title" | "description" | "startsOn" | "endsOn" | "url">
>;

type OverridesFile = { items: Record<string, SignalOverride> };
type SuppressionsFile = { ids: string[] };

export type SignalAdminState = {
  overrides: Record<string, SignalOverride>;
  suppressed: Set<string>;
};

async function readOverrides(): Promise<Record<string, SignalOverride>> {
  try {
    const raw = await readFile(OVERRIDES_FILE, "utf8");
    const data = JSON.parse(raw) as OverridesFile;
    return data.items ?? {};
  } catch {
    return {};
  }
}

async function readSuppressions(): Promise<Set<string>> {
  try {
    const raw = await readFile(SUPPRESSIONS_FILE, "utf8");
    const data = JSON.parse(raw) as SuppressionsFile;
    return new Set(data.ids ?? []);
  } catch {
    return new Set();
  }
}

export async function loadSignalAdminState(): Promise<SignalAdminState> {
  const [overrides, suppressedList] = await Promise.all([
    readOverrides(),
    readSuppressions(),
  ]);
  return { overrides, suppressed: suppressedList };
}

export function applySignalAdmin(
  signals: DemandSignal[],
  state: SignalAdminState,
): DemandSignal[] {
  return signals
    .filter((s) => !state.suppressed.has(s.id))
    .map((s) => {
      const patch = state.overrides[s.id];
      if (!patch) return s;
      return { ...s, ...patch };
    });
}

export async function saveSignalOverride(
  id: string,
  patch: SignalOverride,
): Promise<SignalAdminState> {
  await mkdir(BASE, { recursive: true });
  const overrides = await readOverrides();
  overrides[id] = { ...overrides[id], ...patch };
  await writeFile(
    OVERRIDES_FILE,
    JSON.stringify({ items: overrides }, null, 2),
  );
  return loadSignalAdminState();
}

export async function suppressSignal(id: string): Promise<SignalAdminState> {
  await mkdir(BASE, { recursive: true });
  const suppressed = await readSuppressions();
  suppressed.add(id);
  await writeFile(
    SUPPRESSIONS_FILE,
    JSON.stringify({ ids: [...suppressed] }, null, 2),
  );
  return loadSignalAdminState();
}

export async function restoreSignal(id: string): Promise<SignalAdminState> {
  await mkdir(BASE, { recursive: true });
  const suppressed = await readSuppressions();
  suppressed.delete(id);
  await writeFile(
    SUPPRESSIONS_FILE,
    JSON.stringify({ ids: [...suppressed] }, null, 2),
  );
  const overrides = await readOverrides();
  delete overrides[id];
  await writeFile(
    OVERRIDES_FILE,
    JSON.stringify({ items: overrides }, null, 2),
  );
  return loadSignalAdminState();
}
