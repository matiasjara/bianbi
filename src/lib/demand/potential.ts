/**
 * Scoring de potencial de demanda por evento.
 * No es "cantidad de eventos": un headliner mega (BTS, Coldplay) pesa
 * órdenes de magnitud más que un show de club o teatro chico.
 */

export type DemandTier = "mega" | "alta" | "media" | "baja";

export type PotentialBreakdown = {
  /** 0–100 potencial de noches de hotel/Airbnb */
  score: number;
  /** 1–10 para compatibilidad con intensity */
  intensity: number;
  tier: DemandTier;
  factors: string[];
  venueScore: number;
  artistScore: number;
  formatScore: number;
};

/** Headliners / marcas con demanda hotelera demostrada en Santiago. */
const MEGA_ARTISTS =
  /\b(bts|blackpink|taylor swift|coldplay|bad bunny|the weeknd|beyonc[eé]|harry styles|ed sheeran|bruno mars|madonna|u2|rolling stones|metallica|iron maiden|roger waters|paul mccartney|karol g|rosal[ií]a|shakira|daddy yankee|j balvin|anuel|ozuna|feid|pesopluma|peso pluma|lollapalooza|creamfields|tomorrowland|copa am[eé]rica|mundial|olympi)\b/i;

const HIGH_ARTISTS =
  /\b(soda stereo|ser[uú] gir[aá]n|man[aá]|los fabulosos cadillacs|los tres|la ley|chancho en piedra|lucybell|los bunkers|jorge drexler|natalia lafourcade|morat|grupo firme|marco antonio sol[ií]s|luis miguel|alejandro sanz|enrique iglesias|romeo santos|prince royce|camila|deep purple|def leppard|guns n'? roses|ac\/?dc|green day|maroon 5|imagine dragons|twenty one pilots|billie eilish|dua lipa|olivia rodrigo|travis scott|drake|eminem|post malone|ariana grande|lady gaga|katy perry|rihanna|justin bieber|chris brown|the 1975|arctic monkeys|radiohead|muse|foo fighters|red hot|pearl jam|robbie williams|jamiroquai|gorillaz|chemical brothers|deadmau5|martin garrix|david guetta|ti[eë]sto|carl cox|solomun|fauna primavera|piknic|santiago rocks|cirque du soleil|disney on ice|kapo|ca7riel|paco amoroso)\b/i;

const MID_ARTISTS =
  /\b(tour|world tour|live in santiago|en chile|movistar arena|estadio nacional)\b/i;

/** Capacidad / magnetismo del venue (proxy de aforo). */
const VENUE_WEIGHTS: Array<{ re: RegExp; score: number; label: string }> = [
  {
    re: /estadio nacional|nacional julio|monumental|bicentenario la florida|estadio bicentenario/i,
    score: 95,
    label: "venue estadio (~40k+)",
  },
  {
    re: /parque o'?higgins|lollapalooza|creamfields|fauna/i,
    score: 92,
    label: "festival / parque masivo",
  },
  {
    re: /movistar arena/i,
    score: 85,
    label: "Movistar Arena (~15k)",
  },
  {
    re: /gran arena monticello|arena monticello/i,
    score: 70,
    label: "arena mediana-grande",
  },
  {
    re: /metropolitan|teatro caupolic[aá]n|caupolican|club h[ií]pico|estaci[oó]n mapocho|mapocho/i,
    score: 55,
    label: "venue mid (~2–5k)",
  },
  {
    re: /teatro coliseo|teatro nescaf[eé]|teatro mori|teatro universitario|sala metr[oó]nomo|club chocolate|teatro cariola|teatro zoco/i,
    score: 28,
    label: "teatro/club chico",
  },
  {
    re: /liga|fecha\s*\d|vs\.?|partido|primera divisi[oó]n|ascenso/i,
    score: 35,
    label: "partido de liga (demanda local)",
  },
];

function artistScore(text: string): { score: number; factor?: string } {
  if (MEGA_ARTISTS.test(text)) {
    return { score: 98, factor: "headliner mega / marca global" };
  }
  if (HIGH_ARTISTS.test(text)) {
    return { score: 78, factor: "artista/alta demanda regional" };
  }
  if (MID_ARTISTS.test(text)) {
    return { score: 55, factor: "tour / show de arena genérico" };
  }
  // Heurística: título muy corto en venue grande ya se cubre por venue
  return { score: 32, factor: "artista/local o desconocido" };
}

function venueScore(text: string): { score: number; factor?: string } {
  for (const v of VENUE_WEIGHTS) {
    if (v.re.test(text)) return { score: v.score, factor: v.label };
  }
  return { score: 40, factor: "venue no clasificado" };
}

function formatScore(text: string): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 40;

  if (/lollapalooza|creamfields|fauna|festival|fest\b/i.test(text)) {
    score += 25;
    factors.push("formato festival (varias noches / turismo)");
  }
  if (
    /\b(\d{1,2})\s*,\s*(\d{1,2})\s*y\s*(\d{1,2})\b|\b\d\s*d[ií]as\b|pase de temporada|3 d[ií]as|fin de semana completo/i.test(
      text,
    )
  ) {
    score += 15;
    factors.push("multi-día / varias fechas");
  }
  if (/world tour|tour mundial|latin america tour|stadium tour/i.test(text)) {
    score += 12;
    factors.push("world tour (público extranjero)");
  }
  if (/agotad|sold out|últimas entradas|last tickets/i.test(text)) {
    score += 10;
    factors.push("señal de alta demanda (sold out / últimas)");
  }
  if (/teatro|standup|stand[- ]up|obra|comedia|taller|charla|conferencia/i.test(text)) {
    score -= 15;
    factors.push("formato teatro/charla (menor impacto hotelero)");
  }
  if (
    /\bultrabailable\b|\bfull ultrabailable\b|\bweeknd'?dance\b|\bjazz club\b|\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\s+se\s+(sale|baila)\b|\bclub subterr[aá]neo\b.*\(\+21\)/i.test(
      text,
    )
  ) {
    score -= 28;
    factors.push("fiesta/club local recurrente (bajo impacto turístico)");
  }
  if (/liga femenina|reserva|escuela f[uú]tbol|programa tradicional/i.test(text)) {
    score -= 20;
    factors.push("evento nicho / bajo impacto turístico");
  }
  if (
    /\bsub\s*1[24689]\b|\bsub\s*12\b|\bsub\s*14\b|\bsub\s*16\b|\bsub\s*19\b|\bintermedia\b|\bh5\b.*\bhockey\b|\bhockey\b.*\bh5\b/i.test(
      text,
    )
  ) {
    score -= 22;
    factors.push("hockey formativo/intermedia (público local)");
  }

  return { score: Math.max(0, Math.min(100, score)), factors };
}

function sportPotential(text: string): PotentialBreakdown | null {
  const isSport =
    /\bvs\.?\b|campeonato chileno|anfp|cl[aá]sico|visita desde regiones|copa chile|supercopa|final\b|copa davis|chile open|panamericano|fih|hockey|ciclismo en pista|qualifiers|ironman|interescolar|atletismo|mario record[oó]n|posta de santiago|fedachi|fehoch|fevochi|voleibol|mundial u17|orlando guaita|nacional u\d+/i.test(
      text,
    );
  if (!isSport) return null;

  const factors: string[] = ["evento deportivo federado"];
  let score = 42;

  if (/visita desde regiones|regiones|hinchada/i.test(text)) {
    score += 18;
    factors.push("rival de regiones → pernocta + mailing");
  }
  if (/cl[aá]sico|colo-colo.*universidad de chile|universidad de chile.*colo-colo|universidad cat[oó]lica.*universidad de chile/i.test(text)) {
    score += 28;
    factors.push("clásico / alta convocatoria");
  }
  if (/final|semifinal|definición|liguilla|playoff/i.test(text)) {
    score += 22;
    factors.push("instancia decisiva (final/playoff)");
  }
  if (/copa chile|supercopa|libertadores|sudamericana|recopa/i.test(text)) {
    score += 15;
    factors.push("copa / torneo continental o nacional");
  }
  if (
    /copa davis|chile open|fih|world cup qualifiers|panamericano|premundial|mundial u17|orlando guaita|fedachi marathon|sudamericano/i.test(
      text,
    )
  ) {
    score += 26;
    factors.push("evento internacional / federaciones → mailing + pernocta");
  }
  if (/interescolar|colegio|master.*atletismo|posta de santiago/i.test(text)) {
    score += 16;
    factors.push("atletismo interescolar/federado → familias + regiones");
  }
  if (/estadio nacional|ñu[nñ]oa|vel[oó]dromo|pe[nñ]alol[eé]n|claudia sch/i.test(text)) {
    score += 10;
    factors.push("sede Parque Estadio Nacional / Peñalolén");
  }
  if (/universidad de chile|colo-?colo|universidad cat[oó]lica/i.test(text)) {
    score += 8;
    factors.push("grande de Santiago de local");
  }

  score = Math.round(Math.max(25, Math.min(92, score)));
  const tier: DemandTier =
    score >= 75 ? "alta" : score >= 50 ? "media" : "baja";

  return {
    score,
    intensity: Math.max(1, Math.min(10, Math.round(score / 10))),
    tier: score >= 85 ? "mega" : tier,
    factors,
    venueScore: 70,
    artistScore: score,
    formatScore: 55,
  };
}

function congressPotential(text: string): PotentialBreakdown | null {
  const isCongress =
    /\b(congreso|convencion|convención|simposio|summit|cumbre|forum|foro|expo\b|feria|conference|symposium|mice|fidae|edifica|expo salud|espacio food|hyvolution|seguridad expo)\b/i.test(
      text,
    );
  if (!isCongress) return null;
  if (/\bferia libre\b|\bferia vecinal\b/i.test(text)) return null;

  const factors: string[] = ["congreso / feria sectorial"];
  let score = 58;

  if (/internacional|mundial|world|european|latinoameric/i.test(text)) {
    score += 14;
    factors.push("convocatoria internacional");
  }
  if (/espacio riesco|metropolitan|centro parque|fidae|edifica|25\.000|25000/i.test(text)) {
    score += 12;
    factors.push("recinto MICE / feria masiva");
  }
  if (/salud|mineria|tecnolog|fintech|construccion|alimentari|mice|negocios/i.test(text)) {
    score += 6;
    factors.push("sector con viajes corporativos");
  }
  if (/\b\d\s*d[ií]as\b|\d{1,2}\s*al\s*\d{1,2}/i.test(text)) {
    score += 8;
    factors.push("multi-día → pernocta");
  }

  score = Math.round(Math.max(45, Math.min(88, score)));
  const tier: DemandTier =
    score >= 75 ? "alta" : score >= 55 ? "media" : "baja";

  return {
    score,
    intensity: Math.max(1, Math.min(10, Math.round(score / 10))),
    tier,
    factors,
    venueScore: 65,
    artistScore: score,
    formatScore: 70,
  };
}

export function scoreEventPotential(
  title: string,
  extra = "",
): PotentialBreakdown {
  const text = `${title} ${extra}`;

  const sport = sportPotential(text);
  if (sport) return sport;

  const congress = congressPotential(text);
  if (congress) return congress;

  const artist = artistScore(text);
  const venue = venueScore(text);
  const format = formatScore(text);

  // Peso: artista 45% + venue 35% + formato 20%
  const raw =
    artist.score * 0.45 + venue.score * 0.35 + format.score * 0.2;

  // Boost si mega artista en estadio/arena
  let score = raw;
  if (artist.score >= 90 && venue.score >= 80) {
    score = Math.min(100, raw + 8);
  }
  // Cap bajo si venue club aunque el nombre suene grande (ruido)
  if (venue.score <= 30 && artist.score < 90) {
    score = Math.min(score, 42);
  }

  score = Math.round(Math.max(5, Math.min(100, score)));

  const tier: DemandTier =
    score >= 85 ? "mega" : score >= 65 ? "alta" : score >= 40 ? "media" : "baja";

  const intensity = Math.max(1, Math.min(10, Math.round(score / 10)));

  const factors = [
    artist.factor,
    venue.factor,
    ...format.factors,
  ].filter((f): f is string => Boolean(f));

  return {
    score,
    intensity,
    tier,
    factors,
    venueScore: venue.score,
    artistScore: artist.score,
    formatScore: format.score,
  };
}

/**
 * Agrega potenciales de varios eventos en un día sin que
 * 10 shows chicos ganen a 1 mega.
 * Fórmula: top1 + 0.45*top2 + 0.25*top3 + 0.1*suma_resto (cap 100).
 */
export function aggregateEventPotentials(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => b - a);
  const top1 = sorted[0] ?? 0;
  const top2 = sorted[1] ?? 0;
  const top3 = sorted[2] ?? 0;
  const rest = sorted.slice(3).reduce((a, b) => a + b, 0);
  return Math.min(100, Math.round(top1 + top2 * 0.45 + top3 * 0.25 + rest * 0.08));
}

export function tierLabel(tier: DemandTier): string {
  return {
    mega: "Mega",
    alta: "Alta",
    media: "Media",
    baja: "Baja",
  }[tier];
}
