import { spawn } from "node:child_process";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  readRobotsStatus,
  writeRobotsStatus,
  type RobotJob,
} from "@/lib/demand/robots-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LABELS: Record<RobotJob, string> = {
  discover: "Radar web/RSS (novedades)",
  events: "Scrapers de calendarios + fusión",
  full: "Radar + scrapers + fusión completa",
};

export async function POST(request: Request) {
  let job: RobotJob = "discover";
  try {
    const body = (await request.json()) as { job?: string };
    if (
      body.job === "events" ||
      body.job === "full" ||
      body.job === "discover"
    ) {
      job = body.job;
    }
  } catch {
    // default discover
  }

  const current = await readRobotsStatus();
  if (current.status === "running") {
    return NextResponse.json(
      {
        ok: false,
        error: "Ya hay un job en curso. Espera a que termine.",
        status: current,
      },
      { status: 409 },
    );
  }

  await writeRobotsStatus({
    status: "running",
    job,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    message: `Iniciando: ${LABELS[job]}`,
    logTail: "",
  });

  const worker = path.join(
    process.cwd(),
    "scripts",
    "ingest",
    "run-robots-job.ts",
  );

  // Detached: sobrevive cuando la respuesta HTTP termina
  const child = spawn("npx", ["tsx", worker, job], {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
    detached: true,
    stdio: "ignore",
  });
  child.unref();

  return NextResponse.json({
    ok: true,
    job,
    label: LABELS[job],
    message: "Robots en marcha.",
  });
}
