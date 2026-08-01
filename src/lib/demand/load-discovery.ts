import { readFile } from "node:fs/promises";
import path from "node:path";

export type DiscoveryCandidate = {
  id: string;
  title: string;
  summary: string;
  url: string;
  sourceFeed: string;
  detectedAt: string;
  startsOn: string | null;
  santiagoHint: boolean;
  disciplineGuess: string;
  keywordsMatched: string[];
  action: "review" | "promote_sport" | "ignore_likely";
};

export type DiscoveryFile = {
  ranAt?: string;
  method?: string;
  counts?: {
    total: number;
    promote_sport: number;
    review: number;
    ignore_likely: number;
  };
  candidates: DiscoveryCandidate[];
};

export async function loadDiscovery(): Promise<DiscoveryFile | null> {
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "ingested", "discovery.json"),
      "utf8",
    );
    return JSON.parse(raw) as DiscoveryFile;
  } catch {
    return null;
  }
}
