/**
 * Qué packs merecen guía pública SEO vs. señales internas de demanda.
 * Reglas de estacionalidad genéricas (congresos, verano amplio…) no son eventos concretos.
 */
import { classifyInterest } from "./interest";
import type { DemandPeak, DemandSignal } from "./types";

/** IDs base de seasonality_rules que no deben ser guías públicas. */
const NON_PUBLISHABLE_SEASON_RULES = new Set([
  "season-congresos-otoño",
  "season-congresos-primavera",
  "season-verano",
  "season-semana-santa",
  "season-halloween-festivales",
]);

function seasonRuleBaseId(signal: DemandSignal): string | null {
  if (signal.source !== "seasonality_rules") return null;
  return signal.id.replace(/-\d{4}(-[ab])?$/, "");
}

const VAGUE_TITLE =
  /^(evento|show|actividad|otro|sin t[ií]tulo|tbd|por confirmar)\b/i;

export function isPublishableGuideSignal(signal: DemandSignal): boolean {
  const ruleId = seasonRuleBaseId(signal);
  if (ruleId && NON_PUBLISHABLE_SEASON_RULES.has(ruleId)) return false;

  const interest = classifyInterest(signal);
  if (interest === "otro_evento") {
    const title = signal.title.trim();
    if (title.length < 10) return false;
    if (VAGUE_TITLE.test(title)) return false;
  }

  return true;
}

export function isPublishableGuidePeak(peak: DemandPeak): boolean {
  const lead = peak.signals[0];
  if (!lead) return false;
  return isPublishableGuideSignal(lead);
}

import { normalizePublicEventTitle } from "./event-title";

/** Título legible sin año ni ruido de regla estacional / ticketing. */
export function cleanPublicEventTitle(raw: string): string {
  return normalizePublicEventTitle(raw);
}
