/**
 * Mapa de fuentes de demanda deportiva / eventos.
 * Activas = scraper en pipeline. Candidatas = investigadas, por cablear.
 */

export type SourceStatus = "active" | "candidate" | "watch";
export type SourceMode = "fetch" | "playwright" | "api" | "rss" | "manual" | "discovery";

export type Discipline =
  | "futbol"
  | "atletismo"
  | "hockey"
  | "voleibol"
  | "basquetbol"
  | "tenis"
  | "multisport"
  | "conciertos"
  | "otro";

export interface DemandSourceEntry {
  id: string;
  name: string;
  status: SourceStatus;
  mode: SourceMode;
  discipline: Discipline;
  url: string;
  /** Por qué importa para renta corta en Santiago */
  why: string;
  /** Cómo scrapear / monitorear */
  scrapeNotes: string;
  /** Playbook típico */
  playbookHint: "mailing_first" | "hybrid" | "ads_heavy";
  /** Tags para discovery / matching */
  keywords: string[];
}

export const DEMAND_SOURCE_CATALOG: DemandSourceEntry[] = [
  // —— Activas (pipeline) ——
  {
    id: "campeonato_chileno",
    name: "Campeonato Chileno (ANFP)",
    status: "active",
    mode: "fetch",
    discipline: "futbol",
    url: "https://www.campeonatochileno.cl/",
    why: "Visitas de regiones a Santiago → pernocta + mailing a hinchadas.",
    scrapeNotes: "Match pages locales Santiago; tags regiones/clásico.",
    playbookHint: "mailing_first",
    keywords: ["campeonato chileno", "anfp", "estadio"],
  },
  {
    id: "ind_cl",
    name: "IND — grandes eventos",
    status: "active",
    mode: "manual",
    discipline: "multisport",
    url: "https://ind.cl/noticias/grandes-eventos-que-marcan-el-2026/",
    why: "Eventos oficiales con sedes RM (Davis, FIH, ciclismo, Chile Open).",
    scrapeNotes: "Catálogo curado + verificación de nota IND; RSS IND para discovery.",
    playbookHint: "mailing_first",
    keywords: ["ind", "estadio nacional", "grandes eventos"],
  },
  {
    id: "club_atletico_santiago",
    name: "Club Atlético Santiago — torneos",
    status: "active",
    mode: "fetch",
    discipline: "atletismo",
    url: "https://clubatleticosantiago.cl/torneos/",
    why: "Interescolares/federados en Mario Recordón; colegios de regiones.",
    scrapeNotes: "HTML torneos; filtrar sedes Santiago.",
    playbookHint: "mailing_first",
    keywords: ["interescolar", "atletismo", "mario recordón"],
  },
  {
    id: "fedachi",
    name: "FEDACHI — calendario atletismo",
    status: "active",
    mode: "api",
    discipline: "atletismo",
    url: "https://fedachi.cl/calendar",
    why: "Nacionales U16–adulto y Continental Tour en Santiago; asociaciones regionales.",
    scrapeNotes:
      "API pública Railway: /api/calendar?limit=1000 — filtrar location Santiago.",
    playbookHint: "mailing_first",
    keywords: ["fedachi", "nacional atletismo", "orlando guaita"],
  },
  {
    id: "fehoch_tournaments",
    name: "FEHOCH — torneos hockey césped",
    status: "active",
    mode: "fetch",
    discipline: "hockey",
    url: "https://atn.fehoch.cl/es/tournaments",
    why: "Torneos nacionales con sedes en Parque Estadio Nacional.",
    scrapeNotes: "Listado Clupik + summary por torneo (fechas min/max).",
    playbookHint: "mailing_first",
    keywords: ["fehoch", "hockey césped", "torneo nacional"],
  },
  {
    id: "fevochi",
    name: "FEVOCHI — voleibol",
    status: "active",
    mode: "rss",
    discipline: "voleibol",
    url: "https://www.fevochi.cl/",
    why: "Mundial U17 2026 en Ñuñoa + circuitos; delegaciones internacionales.",
    scrapeNotes: "RSS + catálogo Mundial U17 (6–16 ago 2026, Estadio Nacional).",
    playbookHint: "hybrid",
    keywords: ["fevochi", "voleibol", "mundial u17", "sivoley"],
  },
  {
    id: "ticketmaster_cl",
    name: "Ticketmaster CL",
    status: "active",
    mode: "playwright",
    discipline: "conciertos",
    url: "https://www.ticketmaster.cl/",
    why: "Mega shows → ads heavy.",
    scrapeNotes: "Playwright listados.",
    playbookHint: "ads_heavy",
    keywords: ["ticketmaster", "movistar arena"],
  },
  {
    id: "puntoticket",
    name: "PuntoTicket",
    status: "active",
    mode: "playwright",
    discipline: "conciertos",
    url: "https://www.puntoticket.com/",
    why: "Agenda local / arenas.",
    scrapeNotes: "Playwright.",
    playbookHint: "ads_heavy",
    keywords: ["puntoticket"],
  },
  {
    id: "ticketplus_cl",
    name: "TicketPlus CL",
    status: "active",
    mode: "api",
    discipline: "conciertos",
    url: "https://www.ticketplus.cl/",
    why: "Agenda local (teatros, shows, deportes RM) complementaria a PuntoTicket/TM.",
    scrapeNotes:
      "Fetch JSON: /events/search.json?q=…&searching=true — filtrar location RM.",
    playbookHint: "ads_heavy",
    keywords: ["ticketplus", "matucana", "mapocho"],
  },
  {
    id: "tocador",
    name: "Tocador",
    status: "active",
    mode: "fetch",
    discipline: "conciertos",
    url: "https://tocador.cl/",
    why: "Agenda editorial conciertos.",
    scrapeNotes: "Fetch HTML tablas.",
    playbookHint: "ads_heavy",
    keywords: ["tocador"],
  },
  {
    id: "passline",
    name: "Passline",
    status: "watch",
    mode: "playwright",
    discipline: "conciertos",
    url: "https://www.passline.com/",
    why: "Complemento ticketera (a menudo Cloudflare).",
    scrapeNotes: "Playwright; puede devolver 0.",
    playbookHint: "ads_heavy",
    keywords: ["passline"],
  },
  {
    id: "discovery_web",
    name: "Discovery web / RSS",
    status: "active",
    mode: "discovery",
    discipline: "multisport",
    url: "internal:ingest:discover",
    why: "Detecta actividades nuevas en notas IND/federaciones y búsquedas web.",
    scrapeNotes: "npm run ingest:discover → discovery.json (candidatos).",
    playbookHint: "mailing_first",
    keywords: ["interescolar santiago", "torneo nacional estadio nacional"],
  },

  // —— Candidatas prioritarias ——
  {
    id: "lnb_chile",
    name: "LNB Chile (básquetbol)",
    status: "candidate",
    mode: "fetch",
    discipline: "basquetbol",
    url: "https://lnbchile.com/",
    why: "Súper 8 y finales en Santiago con equipos de regiones (Sur).",
    scrapeNotes: "Noticias + fixture; filtrar sede Santiago / Super 8 / final.",
    playbookHint: "mailing_first",
    keywords: ["lnb", "súper 8", "final apertura santiago"],
  },
  {
    id: "sivoley",
    name: "SIVOLEY (competencias FEVOCHI)",
    status: "candidate",
    mode: "fetch",
    discipline: "voleibol",
    url: "https://sivoley.cl/",
    why: "Fixture LINAME / Liga A2 — sedes y fechas operativas.",
    scrapeNotes: "Login wall parcial; explorar endpoints públicos de partidos.",
    playbookHint: "mailing_first",
    keywords: ["sivoley", "liname", "liga a2"],
  },
  {
    id: "registro_fdn",
    name: "Registro FDN",
    status: "watch",
    mode: "fetch",
    discipline: "multisport",
    url: "https://registrofdn.cl/organizaciones",
    why: "Directorio de federaciones/asociaciones (mailing), no calendario.",
    scrapeNotes: "Ya en Base de datos; no genera fechas.",
    playbookHint: "mailing_first",
    keywords: ["federacion deportiva nacional"],
  },
  {
    id: "febachi",
    name: "FEBACHI / básquet federado",
    status: "candidate",
    mode: "fetch",
    discipline: "basquetbol",
    url: "https://www.chilebasket.cl/",
    why: "Campeonatos formativos y nacionales con sedes RM.",
    scrapeNotes: "Validar dominio oficial vigente y sección calendario.",
    playbookHint: "mailing_first",
    keywords: ["febachi", "chile basket", "campeonato nacional basquet"],
  },
  {
    id: "chilehockey_news",
    name: "Chile Hockey / FEHOCH noticias",
    status: "candidate",
    mode: "rss",
    discipline: "hockey",
    url: "https://atn.fehoch.cl/es/posts",
    why: "Anuncios de Qualifiers, finales, convocatorias.",
    scrapeNotes: "Posts Clupik; complementar torneos.",
    playbookHint: "mailing_first",
    keywords: ["diablas", "diablos", "qualifiers hockey"],
  },
  {
    id: "coch_teamchile",
    name: "COCH / Team Chile",
    status: "candidate",
    mode: "rss",
    discipline: "multisport",
    url: "https://www.coch.cl/",
    why: "Concentrados y eventos multi-deporte en Santiago.",
    scrapeNotes: "Noticias + calendario si existe feed.",
    playbookHint: "hybrid",
    keywords: ["team chile", "concentrado santiago", "juegos"],
  },
  {
    id: "estadio_nacional_agenda",
    name: "Parque Estadio Nacional — agenda recintos",
    status: "candidate",
    mode: "fetch",
    discipline: "multisport",
    url: "https://www.parqueestadionacional.cl/",
    why: "Fuente transversal: todo lo que ocurre en el parque (cerca Z114/Z107).",
    scrapeNotes: "Buscar cartelera / arriendos de recintos / noticias.",
    playbookHint: "hybrid",
    keywords: ["parque estadio nacional", "mario recordón", "velódromo"],
  },
  {
    id: "mindep_ind_rss",
    name: "MinDep / IND noticias (RSS)",
    status: "watch",
    mode: "rss",
    discipline: "multisport",
    url: "https://ind.cl/feed/",
    why: "Anuncios tempranos de sedes y mundiales.",
    scrapeNotes: "Ya usado en discovery; promover a señal si hay fecha+sede RM.",
    playbookHint: "mailing_first",
    keywords: ["mundial", "santiago", "estadio nacional"],
  },
  {
    id: "instagram_federaciones",
    name: "Instagram / RRSS federaciones",
    status: "candidate",
    mode: "discovery",
    discipline: "multisport",
    url: "https://www.instagram.com/",
    why: "Muchas bases y fechas salen primero en IG/stories.",
    scrapeNotes:
      "Sin API estable: monitoreo manual + keywords; futuro: Apify/BrightData o exports.",
    playbookHint: "mailing_first",
    keywords: ["bases", "inscripciones", "sede santiago", "estadio nacional"],
  },
  {
    id: "google_alerts_deportes",
    name: "Google Alerts / búsqueda web",
    status: "candidate",
    mode: "discovery",
    discipline: "multisport",
    url: "https://www.google.com/alerts",
    why: "Cubre medios regionales cuando anuncian viaje a Santiago.",
    scrapeNotes:
      "Alerts: interescolar santiago, torneo nacional Ñuñoa, mundial chile sede.",
    playbookHint: "mailing_first",
    keywords: ["interescolar santiago 2026", "torneo nacional estadio nacional"],
  },
];

export function sourcesByStatus(status: SourceStatus) {
  return DEMAND_SOURCE_CATALOG.filter((s) => s.status === status);
}
