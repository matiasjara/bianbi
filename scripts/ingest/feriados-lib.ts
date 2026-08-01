import type { DemandSignal } from "../../src/lib/demand/types";

type NagerHoliday = {
  date: string;
  localName: string;
  name: string;
  global: boolean;
};

export async function ingestFeriados(
  year: number,
): Promise<{ signals: DemandSignal[]; error?: string }> {
  try {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/CL`,
    );
    if (!res.ok) {
      return { signals: [], error: `HTTP ${res.status}` };
    }
    const holidays = (await res.json()) as NagerHoliday[];

    const signals: DemandSignal[] = holidays.map((h) => {
      const isPatrias = h.localName.toLowerCase().includes("patrias");
      const isNewYear =
        h.localName.toLowerCase().includes("año nuevo") ||
        h.name.toLowerCase().includes("new year");
      const intensity = isPatrias ? 9 : isNewYear ? 8 : 5;

      return {
        id: `feriado-${h.date}`,
        kind: "holiday" as const,
        source: "nager_holidays" as const,
        title: h.localName,
        description: `Feriado oficial Chile · ${h.name}`,
        startsOn: h.date,
        endsOn: h.date,
        intensity,
        audienceTags: ["nacional", "turismo"],
        poiIds: ["poi-lastarria", "poi-italia", "poi-fantasilandia"],
        url: `https://date.nager.at/api/v3/PublicHolidays/${year}/CL`,
        scrapedAt: new Date().toISOString(),
      };
    });

    return { signals };
  } catch (e) {
    return { signals: [], error: e instanceof Error ? e.message : String(e) };
  }
}
