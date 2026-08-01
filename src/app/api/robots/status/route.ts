import { NextResponse } from "next/server";
import { readRobotsStatus } from "@/lib/demand/robots-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const status = await readRobotsStatus();
  return NextResponse.json(status);
}
