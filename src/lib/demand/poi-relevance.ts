import type { CampaignInterest } from "@/lib/demand/types";

const FANTASILANDIA_POI = "poi-fantasilandia";

/** Fantasilandia solo aplica a turismo familiar / vacaciones — no a conciertos ni deporte */
export function poiIdsForInterest(
  interest: CampaignInterest | undefined,
  poiIds: string[],
): string[] {
  if (interest === "vacaciones_familias") return poiIds;
  return poiIds.filter((id) => id !== FANTASILANDIA_POI);
}

export function allowsFantasilandiaPoi(
  interest: CampaignInterest | undefined,
): boolean {
  return interest === "vacaciones_familias";
}

export function preferredPoiOrder(
  interest: CampaignInterest | undefined,
): string[] {
  if (interest === "concierto") {
    return ["poi-movistar", "poi-ohiggins", "poi-estadio", "poi-italia"];
  }
  if (interest === "partido_futbol" || interest === "deporte_competencia") {
    return ["poi-estadio", "poi-movistar", "poi-italia", "poi-lastarria"];
  }
  if (interest === "vacaciones_familias") {
    return [
      "poi-fantasilandia",
      "poi-lastarria",
      "poi-italia",
      "poi-ohiggins",
    ];
  }
  if (interest === "nieve") {
    return ["poi-santiago-hub", "poi-italia", "poi-lastarria"];
  }
  return [
    "poi-movistar",
    "poi-estadio",
    "poi-ohiggins",
    "poi-italia",
    "poi-lastarria",
    "poi-costanera",
  ];
}
