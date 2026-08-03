/**
 * Campeonato Chileno (ANFP) — partidos con local en Santiago RM.
 * Fuentes:
 * - https://www.campeonatochileno.cl/
 * - https://www.campeonatochileno.cl/estadio/estadio-nacional-julio-martinez-pradanos/
 *
 * Demanda típica: hinchada de regiones que viaja al partido → mailing > ads.
 */
import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";
import { toSignal, type SourceResult } from "../lib/signal-utils";

const HOMEPAGE = "https://www.campeonatochileno.cl/";
const ESTADIO_NACIONAL_URL =
  "https://www.campeonatochileno.cl/estadio/estadio-nacional-julio-martinez-pradanos/";

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
  /coquimbo|la-serena|huachipato|cobresal|nublense|ohiggins|concepcion|deportes-concepcion|limache|calera|everton|antofagasta|iquique|copiapo|temuco|rancagua|san-felipe/i;

const BIG_CLASH =
  /colo-colo-universidad-de-chile|universidad-de-chile-colo-colo|universidad-catolica-universidad-de-chile|universidad-de-chile-universidad-catolica|colo-colo-universidad-catolica|universidad-catolica-colo-colo/;

const REGIONAL_CLUB_HINTS: Array<{ re: RegExp; hint: string }> = [
  { re: /nublense|ñublense/, hint: "Chillán y Ñuble (Ñublense)" },
  { re: /coquimbo/, hint: "Coquimbo y La Serena" },
  { re: /huachipato|concepcion/, hint: "Gran Concepción (Huachipato)" },
  { re: /everton/, hint: "Viña del Mar y Valparaíso (Everton)" },
  { re: /ohiggins/, hint: "Rancagua y O'Higgins" },
  { re: /cobresal|copiapo/, hint: "Atacama (Cobresal / Copiapó)" },
  { re: /la-serena/, hint: "La Serena" },
  { re: /calera|san-felipe/, hint: "La Calera / Aconcagua" },
  { re: /limache/, hint: "Limache y Quillota" },
  { re: /antofagasta/, hint: "Antofagasta" },
  { re: /iquique/, hint: "Iquique y Tarapacá" },
  { re: /temuco/, hint: "Temuco y Araucanía" },
];

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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function extractMatchSlugs(html: string): string[] {
  const re = /\/match\/([a-z0-9%\-]+-\d{4}-\d{2}-\d{2})\/?/gi;
  const slugs: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    slugs.push(decodeSlug(m[1]));
  }
  return slugs;
}

function parseTeams(rawSlug: string): { home: string; away: string; date: string } | null {
  const dateMatch = rawSlug.match(/(\d{4}-\d{2}-\d{2})$/);
  if (!dateMatch) return null;
  const date = dateMatch[1];
  const teamsPart = rawSlug.slice(0, -(date.length + 1));
  const normalized = normalize(teamsPart);

  const home = HOMES.find((h) => normalized.startsWith(`${h}-`));
  if (!home) return null;
  const away = normalized.slice(home.length + 1);
  if (!away || /femenino/.test(away)) return null;
  return { home, away, date };
}

function parseEstadioNacionalTeams(
  rawSlug: string,
): { home: string; away: string; date: string } | null {
  const dateMatch = rawSlug.match(/(\d{4}-\d{2}-\d{2})$/);
  if (!dateMatch) return null;
  const date = dateMatch[1];
  const teamsPart = rawSlug.slice(0, -(date.length + 1));
  if (/femenino/i.test(teamsPart)) return null;

  const normalized = normalize(teamsPart);
  for (const h of HOMES) {
    if (!normalized.startsWith(`${h}-`)) continue;
    const away = normalized.slice(h.length + 1);
    if (!away) return null;
    return { home: h, away, date };
  }

  // Fallback: primer segmento como local si el partido está en la página del estadio
  const dash = normalized.indexOf("-");
  if (dash <= 0) return null;
  const home = normalized.slice(0, dash);
  const away = normalized.slice(dash + 1);
  if (!away || away.length < 3) return null;
  return { home, away, date };
}

function regionalAudienceHint(home: string, away: string): string | null {
  const blob = normalize(`${home} ${away}`);
  for (const { re, hint } of REGIONAL_CLUB_HINTS) {
    if (re.test(blob)) return hint;
  }
  return null;
}

function isRegionalMatch(home: string, away: string) {
  return REGIONAL_AWAY.test(normalize(`${home} ${away}`));
}

type BuildOpts = {
  venue: "homepage" | "estadio_nacional";
  minDate?: string;
};

function buildSignal(
  rawSlug: string,
  teams: { home: string; away: string; date: string },
  opts: BuildOpts,
): DemandSignal | null {
  if (opts.minDate && teams.date < opts.minDate) return null;

  const normalized = normalize(`${teams.home}-${teams.away}`);
  const regional = isRegionalMatch(teams.home, teams.away);
  const clasico = BIG_CLASH.test(normalized);
  const title = titleFromSlug(teams.home, teams.away);
  const audienceHint = regionalAudienceHint(teams.home, teams.away);
  const venueLabel =
    opts.venue === "estadio_nacional"
      ? "Estadio Nacional Julio Martínez Prádanos, Ñuñoa"
      : "Santiago RM";

  const blob = `${title} campeonato chileno anfp ${venueLabel} ${regional ? "visita regiones" : ""} ${clasico ? "clásico" : ""} ${audienceHint ?? ""}`;

  let description =
    opts.venue === "estadio_nacional"
      ? `Partido ANFP en ${venueLabel}.`
      : "Partido ANFP con localía en Santiago.";

  if (regional && audienceHint) {
    description = `Partido en ${venueLabel}: ${title}. Audiencia objetivo: hinchada visitante desde ${audienceHint} (pernocta + mailing).`;
  } else if (regional) {
    description = `Partido en ${venueLabel}: ${title}. Rival de regiones → hinchada viajera y pernocta en Santiago.`;
  }

  const signal = toSignal({
    source: "campeonato_chileno",
    title: clasico ? `Clásico · ${title}` : title,
    date: teams.date,
    url: `https://www.campeonatochileno.cl/match/${encodeURIComponent(rawSlug)}/`,
    textForPoi: `${blob} estadio nacional santiago`,
    description,
  });

  signal.kind = "sport";
  signal.audienceTags = [
    "deportes",
    "futbol",
    ...(opts.venue === "estadio_nacional" ? ["estadio_nacional"] : []),
    ...(regional ? ["regiones", "hinchada_viajera"] : []),
    ...(clasico ? ["clasico", "alta_demanda"] : []),
  ];
  signal.poiIds =
    clasico || /universidad-de-chile|colo-colo/.test(teams.home)
      ? ["poi-estadio", "poi-movistar"]
      : ["poi-estadio"];
  signal.propertyCodesPreferred = ["Z114", "Z107", "E801", "E214", "T112"];

  const pot = scoreEventPotential(signal.title, signal.description);
  signal.potentialScore = pot.score;
  signal.potentialTier = pot.tier;
  signal.potentialFactors = pot.factors;
  signal.intensity = pot.intensity;

  return signal;
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept-Language": "es-CL,es;q=0.9",
      Accept: "text/html",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

function ingestSlugs(
  slugs: string[],
  opts: BuildOpts & {
    parse: (raw: string) => { home: string; away: string; date: string } | null;
  },
) {
  const seen = new Set<string>();
  const signals: DemandSignal[] = [];

  for (const rawSlug of slugs) {
    const teams = opts.parse(rawSlug);
    if (!teams) continue;

    const key = `${teams.date}|${teams.home}|${teams.away}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const signal = buildSignal(rawSlug, teams, opts);
    if (signal) signals.push(signal);
  }

  return signals;
}

export async function scrapeCampeonatoChileno(): Promise<SourceResult> {
  const name = "campeonato_chileno";
  try {
    const minDate = todayIso();
    const [homeHtml, estadioHtml] = await Promise.all([
      fetchHtml(HOMEPAGE),
      fetchHtml(ESTADIO_NACIONAL_URL),
    ]);

    const homepageSignals = ingestSlugs(extractMatchSlugs(homeHtml), {
      venue: "homepage",
      minDate,
      parse: parseTeams,
    });

    const estadioSignals = ingestSlugs(extractMatchSlugs(estadioHtml), {
      venue: "estadio_nacional",
      minDate,
      parse: parseEstadioNacionalTeams,
    });

    const merged = new Map<string, DemandSignal>();
    for (const s of [...homepageSignals, ...estadioSignals]) {
      const key = `${s.startsOn}|${normalize(s.title)}`;
      const prev = merged.get(key);
      if (!prev || s.intensity > prev.intensity) {
        merged.set(key, s);
      }
    }

    return { name, ok: true, signals: [...merged.values()] };
  } catch (e) {
    return {
      name,
      ok: false,
      signals: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
