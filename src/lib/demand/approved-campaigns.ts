import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE = path.join(
  process.cwd(),
  "data",
  "ingested",
  "campaigns-approved.json",
);

export type ApprovedCampaignRecord = {
  campaignId: string;
  slug: string;
  approvedAt: string;
};

export async function loadApprovedCampaigns(): Promise<
  ApprovedCampaignRecord[]
> {
  try {
    const raw = await readFile(FILE, "utf8");
    const data = JSON.parse(raw) as { items?: ApprovedCampaignRecord[] };
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function approveCampaign(
  campaignId: string,
  slug: string,
): Promise<ApprovedCampaignRecord[]> {
  await mkdir(path.dirname(FILE), { recursive: true });
  const items = await loadApprovedCampaigns();
  const next = [
    { campaignId, slug, approvedAt: new Date().toISOString() },
    ...items.filter((i) => i.campaignId !== campaignId),
  ];
  await writeFile(FILE, JSON.stringify({ items: next }, null, 2));
  return next;
}
