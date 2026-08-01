/**
 * Worker en background para jobs disparados desde /api/robots/run.
 * Uso interno: npx tsx scripts/ingest/run-robots-job.ts <discover|events|full>
 */
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type RobotJob = "discover" | "events" | "full";

const STATUS_PATH = path.join(
  process.cwd(),
  "data",
  "ingested",
  "robots-status.json",
);

const JOBS: Record<RobotJob, string[]> = {
  discover: ["ingest:discover"],
  events: ["ingest:events", "ingest"],
  full: ["ingest:discover", "ingest:events", "ingest"],
};

const LABELS: Record<RobotJob, string> = {
  discover: "Radar web/RSS (novedades)",
  events: "Scrapers de calendarios + fusión",
  full: "Radar + scrapers + fusión completa",
};

async function writeStatus(patch: Record<string, unknown>) {
  await mkdir(path.dirname(STATUS_PATH), { recursive: true });
  let current: Record<string, unknown> = {};
  try {
    current = JSON.parse(await readFile(STATUS_PATH, "utf8")) as Record<
      string,
      unknown
    >;
  } catch {
    // ignore
  }
  await writeFile(
    STATUS_PATH,
    JSON.stringify({ ...current, ...patch }, null, 2),
  );
}

function runNpmScript(script: string): Promise<{ code: number; log: string }> {
  return new Promise((resolve) => {
    const child = spawn("npm", ["run", script], {
      cwd: process.cwd(),
      env: process.env,
      shell: true,
    });
    let log = "";
    child.stdout?.on("data", (chunk: Buffer) => {
      log += chunk.toString();
      if (log.length > 12000) log = log.slice(-12000);
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      log += chunk.toString();
      if (log.length > 12000) log = log.slice(-12000);
    });
    child.on("close", (code) => resolve({ code: code ?? 1, log }));
    child.on("error", (err) =>
      resolve({ code: 1, log: `${log}\n${err.message}` }),
    );
  });
}

async function main() {
  const job = (process.argv[2] ?? "discover") as RobotJob;
  if (!JOBS[job]) {
    console.error("Job inválido. Usa: discover | events | full");
    process.exit(1);
  }

  let combinedLog = "";
  try {
    for (const script of JOBS[job]) {
      await writeStatus({
        status: "running",
        job,
        message: `Ejecutando npm run ${script}…`,
      });
      console.log(`→ npm run ${script}`);
      const result = await runNpmScript(script);
      combinedLog += `\n—— npm run ${script} (exit ${result.code}) ——\n${result.log}`;
      if (result.code !== 0) {
        await writeStatus({
          status: "error",
          finishedAt: new Date().toISOString(),
          message: `Falló ${script} (código ${result.code}).`,
          logTail: combinedLog.trim().slice(-4000),
        });
        process.exit(result.code);
      }
    }
    await writeStatus({
      status: "ok",
      finishedAt: new Date().toISOString(),
      message: `${LABELS[job]} listo.`,
      logTail: combinedLog.trim().slice(-4000),
    });
    console.log("OK", LABELS[job]);
  } catch (e) {
    await writeStatus({
      status: "error",
      finishedAt: new Date().toISOString(),
      message: e instanceof Error ? e.message : String(e),
      logTail: combinedLog.trim().slice(-4000),
    });
    process.exit(1);
  }
}

main();
