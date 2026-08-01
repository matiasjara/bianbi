/**
 * Campeonato Chileno (ANFP) — partidos con local en Santiago RM.
 * Fuente: https://www.campeonatochileno.cl/match/{slug}-{YYYY-MM-DD}/
 *
 * Demanda típica: hinchada de regiones que viaja al partido → mailing > ads.
 */
import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";
import { toSignal, type SourceResult } from "../lib/signal-utils";

const HOMES = [
  "universidad-de-chile",
  "universidad-catolica",
  "audax-italiano",
  "union-espanola",
  "santiago-wanderers",
  "colo-colo",
  "palestino",
  "magallanes",
] as const;

const REGIONAL_AWAY =
  /coquimbo|la-serena|huachipato|cobresal|nublense|ohiggins|concepcion|deportes-concepcion|limache|calera|everton|antofagasta|iquique|copiapo|temuco|rancagua/i;

const BIG_CLASH =
  /colo-colo-universidad-de-chile|universidad-de-chile-colo-colo|universidad-catolica-universidad-de-chile|universidad-de-chile-universidad-catolica|colo-colo-universidad-catolica|universidad-catolica-colo-colo/;

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug.replace(/\/$/, ""));
  } catch {
    return slug.replace(/\/$/, "");
  }
}

function titleFromSlug(home: string, away: string) {
  const nice = (s: string) =>
    s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return `${nice(home)} vs ${nice(away)}`;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function scrapeCampeonatoChileno(): Promise<SourceResult> {
  const name = "campeonato_chileno";
  try {
    const res = await fetch("https://www.campeonatochileno.cl/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "es-CL,es;q=0.9",
        Accept: "text/html",
      },
    });
    if (!res.ok) {
      return { name, ok: false, signals: [], error: `HTTP ${res.status}` };
    }
    const html = await res.text();
    const re = /\/match\/([a-z0-9%\-]+-\d{4}-\d{2}-\d{2})\/?/gi;
    const seen = new Set<string>();
    const signals: DemandSignal[] = [];

    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const rawSlug = decodeSlug(m[1]);
      const dateMatch = rawSlug.match(/(\d{4}-\d{2}-\d{2})$/);
      if (!dateMatch) continue;
      const date = dateMatch[1];
      const teamsPart = rawSlug.slice(0, -(date.length + 1));
      const normalized = normalize(teamsPart);

      const home = HOMES.find((h) => normalized.startsWith(`${h}-`));
      if (!home) continue;
      const away = normalized.slice(home.length + 1);
      if (!away) continue;

      const key = `${date}|${home}|${away}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const regional = REGIONAL_AWAY.test(away);
      const clasico = BIG_CLASH.test(normalized);
      const title = titleFromSlug(home, away);
      const blob = `${title} campeonato chileno anfp ${regional ? "visita regiones" : ""} ${clasico ? "clásico" : ""}`;

      const signal = toSignal({
        source: "campeonato_chileno",
        title: clasico
          ? `Clásico · ${title}`
          : regional
            ? `${title} (visita desde regiones)`
            : title,
        date,
        url: `https://www.campeonatochileno.cl/match/${m[1]}/`,
        textForPoi: `${blob} estadio santiago`,
        description: regional
          ? "Partido ANFP con rival de regiones: demanda de pernocta + mailing a hinchada viajera."
          : "Partido ANFP con localía en Santiago.",
      });

      signal.kind = "sport";
      signal.audienceTags = [
        "deportes",
        "futbol",
        ...(regional ? ["regiones", "hinchada_viajera"] : []),
        ...(clasico ? ["clasico", "alta_demanda"] : []),
      ];
      signal.poiIds =
        clasico || /universidad-de-chile|colo-colo/.test(home)
          ? ["poi-estadio", "poi-movistar"]
          : ["poi-estadio"];
      signal.propertyCodesPreferred = [
        "Z114",
        "Z107",
        "E801",
        "E214",
        "T112",
      ];

      // Recalcular potencial con el título final (visita regiones / clásico)
      const pot = scoreEventPotential(signal.title, signal.description);
      signal.potentialScore = pot.score;
      signal.potentialTier = pot.tier;
      signal.potentialFactors = pot.factors;
      signal.intensity = pot.intensity;

      signals.push(signal);
    }

    return { name, ok: true, signals };
  } catch (e) {
    return {
      name,
      ok: false,
      signals: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
