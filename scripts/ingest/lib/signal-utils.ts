import type { DemandSignal, CityId } from "../../../src/lib/demand/types";
import { inferEventCity } from "../../../src/lib/demand/cities";
import { normalizePublicEventTitle } from "../../../src/lib/demand/event-title";
import { inferEventAudienceTags } from "../../../src/lib/demand/interest";
import {
  normalizeSignal,
  parseLooseDate,
} from "../../../src/lib/demand/dates";
import { scoreEventPotential } from "../../../src/lib/demand/potential";

export { parseLooseDate };

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function guessPoi(text: string): string[] {
  const t = text.toLowerCase();
  if (t.includes("movistar arena") || t.includes("movistar-arena"))
    return ["poi-movistar"];
  if (
    t.includes("estadio nacional") ||
    t.includes("julio martínez") ||
    t.includes("court central") ||
    t.includes("claudia schüler") ||
    t.includes("claudia schuler") ||
    t.includes("hockey césped") ||
    t.includes("hockey cesped") ||
    t.includes("velódromo") ||
    t.includes("velodromo") ||
    t.includes("peñalolén") ||
    t.includes("penalolen") ||
    t.includes("mario recordón") ||
    t.includes("mario recordon") ||
    t.includes("pista atlética") ||
    t.includes("pista atletica")
  )
    return ["poi-estadio"];
  if (t.includes("fantasilandia")) return ["poi-fantasilandia"];
  if (
    t.includes("o'higgins") ||
    t.includes("ohiggins") ||
    t.includes("parque o higgins") ||
    t.includes("parque o'higgins")
  )
    return ["poi-movistar", "poi-ohiggins"];
  if (t.includes("lastarria")) return ["poi-lastarria"];
  if (
    t.includes("subterráneo") ||
    t.includes("subterraneo") ||
    t.includes("orrego luco") ||
    t.includes("blondie") ||
    t.includes("club chocolate") ||
    t.includes("sala amarilla")
  )
    return ["poi-lastarria"];
  if (t.includes("barrio italia") || t.includes("italia")) return ["poi-italia"];
  if (t.includes("costanera")) return ["poi-costanera"];
  if (
    t.includes("espacio riesco") ||
    t.includes("huechuraba") ||
    t.includes("metropolitan santiago") ||
    t.includes("centro parque") ||
    (t.includes("metropolitan") && /convencion|congreso|feria|expo|mice/.test(t))
  )
    return ["poi-costanera"];
  if (
    t.includes("morandé") ||
    t.includes("morande") ||
    t.includes("teatro mori")
  )
    return ["poi-lastarria"];
  if (
    t.includes("caupolicán") ||
    t.includes("caupolican") ||
    t.includes("metropolitan") ||
    t.includes("teatro coliseo") ||
    t.includes("estación mapocho") ||
    t.includes("mapocho") ||
    t.includes("club hípico") ||
    t.includes("club hipico")
  )
    return ["poi-movistar", "poi-lastarria"];
  return [];
}

export function guessPropertyCodes(poiIds: string[], text = ""): string[] {
  const t = text.toLowerCase();
  if (poiIds.includes("poi-estadio") || poiIds.includes("poi-movistar")) {
    return ["Z114", "Z107", "E801", "E214", "T112"];
  }
  if (poiIds.includes("poi-fantasilandia")) {
    return ["T112"];
  }
  if (poiIds.includes("poi-italia") || poiIds.includes("poi-lastarria")) {
    return ["E801", "E214", "T112"];
  }
  return ["E801", "E214", "Z114", "Z107", "T112"];
}

export function isSantiagoRelevant(text: string): boolean {
  return inferEventCity(text) === "santiago";
}

export function toSignal(input: {
  source: DemandSignal["source"];
  title: string;
  date: string;
  description?: string;
  url?: string;
  intensity?: number;
  textForPoi?: string;
  city?: CityId;
}): DemandSignal {
  const blob = `${input.title} ${input.textForPoi ?? ""} ${input.description ?? ""}`;
  const city = input.city ?? inferEventCity(blob);
  const poiIds =
    city === "santiago"
      ? guessPoi(blob).length
        ? guessPoi(blob)
        : ["poi-movistar"]
      : [];
  const potential = scoreEventPotential(input.title, blob);
  const audienceTags = inferEventAudienceTags(input.title, blob);

  const base: DemandSignal = {
    id: `${input.source}-${slugify(`${input.title}-${input.date}`)}`,
    kind: "event",
    source: input.source,
    title: normalizePublicEventTitle(input.title).slice(0, 140),
    description:
      input.description ??
      `Evento detectado desde ${input.source}. Verificar fecha/venue.`,
    startsOn: input.date,
    endsOn: input.date,
    intensity: potential.intensity,
    potentialScore: potential.score,
    potentialTier: potential.tier,
    potentialFactors: potential.factors,
    audienceTags,
    poiIds,
    propertyCodesPreferred:
      city === "santiago" ? guessPropertyCodes(poiIds, blob) : [],
    url: input.url,
    scrapedAt: new Date().toISOString(),
  };

  if (city === "santiago" || city === "concepcion") {
    base.city = city;
  }

  return normalizeSignal(base);
}

export type SourceResult = {
  name: string;
  ok: boolean;
  signals: DemandSignal[];
  error?: string;
};
