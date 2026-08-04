/**
 * Identidad de competencias federadas (mundiales, campeonatos multi-día)
 * para no generar una guía por cada noticia RSS del mismo torneo.
 */
import type { DemandSignal } from "./types";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function blob(signal: DemandSignal) {
  return normalize(`${signal.title} ${signal.description}`);
}

/**
 * Noticias de federación (sorteo, nómina, “rivales definidos”…) no son
 * el evento bookable: no deben abrir una guía propia.
 */
export function isFederationNewsOnly(signal: DemandSignal): boolean {
  const tags = signal.audienceTags.map(normalize);
  const fromRss =
    tags.includes("rss") ||
    (signal.potentialFactors ?? []).some((f) =>
      /rss|noticia/i.test(f),
    );

  const t = blob(signal);
  const newsHeadline =
    /\bsorteo\b|\brivales\b|\bgrupos del\b|\bnomina\b|\bconvocad|\bentrevista\b|\bpreparacion\b|\bamistoso\b|\bya tiene\b|\bdefinidos los\b|\btodo listo para\b|\bel camino a\b|\bcomienza en\b/.test(
      t,
    );

  if (fromRss && newsHeadline) return true;

  // Titular de prensa sobre un mundial/campeonato (no el nombre del certamen).
  if (
    newsHeadline &&
    /\bmundial\b|\bcampeonato\b/.test(t) &&
    !/^(mundial|campeonato|copa|torneo|circuito)\b/.test(
      normalize(signal.title).trim(),
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Clave estable por edición de campeonato (ej. Mundial U17 vóleibol Chile 2026).
 * Si no aplica, null → el caller usa la clave genérica.
 */
export function competitionCampaignGroupKey(
  signal: DemandSignal,
): string | null {
  const t = blob(signal);
  const year =
    signal.startsOn?.slice(0, 4) ||
    t.match(/\b(20\d{2})\b/)?.[1] ||
    "na";

  if (
    /\bmundial\b/.test(t) &&
    /\b(u\s*17|sub\s*-?\s*17)\b/.test(t) &&
    /\b(voleibol|volley)\b/.test(t)
  ) {
    return `comp:voleibol:mundial-u17-${year}`;
  }

  if (
    /\bmundial\b/.test(t) &&
    /\b(voleibol|volley)\b/.test(t) &&
    /\bchile\b/.test(t)
  ) {
    return `comp:voleibol:mundial-${year}`;
  }

  return null;
}
