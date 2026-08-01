import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type RobotJob = "discover" | "events" | "full";

export type RobotsStatus = {
  status: "idle" | "running" | "ok" | "error";
  job: RobotJob | null;
  startedAt: string | null;
  finishedAt: string | null;
  message: string;
  logTail: string;
};

const STATUS_PATH = path.join(
  process.cwd(),
  "data",
  "ingested",
  "robots-status.json",
);

const IDLE: RobotsStatus = {
  status: "idle",
  job: null,
  startedAt: null,
  finishedAt: null,
  message: "Sin jobs recientes.",
  logTail: "",
};

export async function readRobotsStatus(): Promise<RobotsStatus> {
  try {
    const raw = await readFile(STATUS_PATH, "utf8");
    return { ...IDLE, ...(JSON.parse(raw) as RobotsStatus) };
  } catch {
    return IDLE;
  }
}

export async function writeRobotsStatus(
  patch: Partial<RobotsStatus>,
): Promise<RobotsStatus> {
  await mkdir(path.dirname(STATUS_PATH), { recursive: true });
  const current = await readRobotsStatus();
  const next = { ...current, ...patch };
  await writeFile(STATUS_PATH, JSON.stringify(next, null, 2));
  return next;
}
