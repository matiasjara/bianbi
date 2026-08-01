/**
 * Persistencia local de métricas de ads (demo/manual hoy; API mañana).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ChannelMetrics, MetricsSource } from "./ad-monitoring";

const FILE = path.join(process.cwd(), "data", "ingested", "ad-metrics.json");

export type StoredCampaignMetrics = {
  campaignId: string;
  slug: string;
  source: MetricsSource;
  channels: ChannelMetrics[];
  updatedAt: string;
};

type FileShape = { items: StoredCampaignMetrics[] };

async function readAll(): Promise<StoredCampaignMetrics[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const data = JSON.parse(raw) as FileShape;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function loadMetricsForCampaign(
  campaignId: string,
): Promise<StoredCampaignMetrics | null> {
  const items = await readAll();
  return items.find((i) => i.campaignId === campaignId) ?? null;
}

export async function loadAllCampaignMetrics(): Promise<StoredCampaignMetrics[]> {
  return readAll();
}

export async function saveCampaignMetrics(
  entry: StoredCampaignMetrics,
): Promise<StoredCampaignMetrics[]> {
  await mkdir(path.dirname(FILE), { recursive: true });
  const items = await readAll();
  const next = [
    entry,
    ...items.filter((i) => i.campaignId !== entry.campaignId),
  ];
  await writeFile(FILE, JSON.stringify({ items: next }, null, 2));
  return next;
}
