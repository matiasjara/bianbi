/**
 * Copy editorial por evento — overrides cuando el template genérico queda corto.
 */
import { formatDateRangeHuman, formatDateRangeLongEs } from "./dates";
import type { Locale } from "@/lib/i18n/locale";
import type { MicrositeCopyInput } from "./microsite-event-copy";

export type EventCopyOverride = {
  shortTitle?: string;
  eventSummary?: string;
  eventDescription?: string;
  headline?: string;
  subhead?: string;
  mustKnow?: string[];
  news?: string[];
};

/** Campos mínimos para decidir / armar overrides editoriales. */
export type EventCopyOverrideInput = Pick<
  MicrositeCopyInput,
  | "eventTitle"
  | "eventDates"
  | "eventStartsOn"
  | "eventEndsOn"
  | "venueName"
  | "properties"
>;

function t(locale: Locale, es: string, en: string, pt: string): string {
  if (locale === "en") return en;
  if (locale === "pt") return pt;
  return es;
}

function isMundialU17Volleyball(pack: EventCopyOverrideInput): boolean {
  return /mundial.*u17.*voleibol|voleibol.*u17.*mundial|mundial femenino u17/i.test(
    pack.eventTitle,
  );
}

function displayDates(pack: EventCopyOverrideInput, locale: Locale): string {
  return formatDateRangeHuman(
    pack.eventStartsOn,
    pack.eventEndsOn,
    locale === "pt" ? "pt" : locale === "en" ? "en" : "es",
  );
}

function mundialU17VolleyballOverride(
  pack: EventCopyOverrideInput,
  locale: Locale,
  nearestMinsOverride?: number,
): EventCopyOverride {
  const dates = displayDates(pack, locale);
  const mins =
    nearestMinsOverride ?? pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;

  return {
    shortTitle: t(
      locale,
      "Mundial Sub-17 de vóleibol",
      "U17 Women's Volleyball World Championship",
      "Mundial Sub-17 de vôlei",
    ),
    headline: t(
      locale,
      `El Mundial Sub-17 de vóleibol en Santiago — a ${mins} min del ${venue}`,
      `U17 Volleyball World Championship in Santiago — ${mins} min from ${venue}`,
      `Mundial Sub-17 de vôlei em Santiago — a ${mins} min do ${venue}`,
    ),
    subhead: t(
      locale,
      `${dates}. Chile recibe a 24 selecciones en el Parque Estadio Nacional.\n\nAlojamientos a ~${mins} min del recinto, pensados para familias, staff y delegaciones que viajan. Metro cerca, barrio seguro y reserva directa en Airbnb.`,
      `${dates}. Chile hosts 24 national teams at Parque Estadio Nacional.\n\nStays ~${mins} min from the venue — for families, staff and traveling delegations. Metro nearby, safe neighborhood, book direct on Airbnb.`,
      `${dates}. O Chile recebe 24 seleções no Parque Estadio Nacional.\n\nAcomodações a ~${mins} min do ginásio, para famílias, staff e delegações. Metrô perto, bairro seguro e reserva direta no Airbnb.`,
    ),
    eventSummary: t(
      locale,
      `Del ${formatDateRangeLongEs(pack.eventStartsOn, pack.eventEndsOn)}, Santiago es sede del Mundial Femenino Sub-17 de la FIVB. Todo lo esencial para llegar, moverte y dormir cerca del Estadio Nacional.`,
      `From ${dates}, Santiago hosts the FIVB U17 Women's World Championship. Everything you need to get there, get around and stay near the venue.`,
      `De ${dates}, Santiago sedia o Mundial Feminino Sub-17 da FIVB. Tudo para chegar, circular e dormir perto do Estadio Nacional.`,
    ),
    eventDescription: t(
      locale,
      `Chile organiza el Campeonato Mundial Femenino Sub-17 de la FIVB: once días de competencia con fase de grupos y finales en el Parque Estadio Nacional (Ñuñoa), además de partidos en la región de Aconcagua.\n\nSi vienes a apoyar a tu selección, acompañar al equipo o colaborar en el torneo, aquí tienes lo esencial para planificar transporte, entradas y alojamiento.`,
      `Chile hosts the FIVB U17 Women's World Championship: eleven days of competition with group stages and finals at Parque Estadio Nacional (Ñuñoa), plus matches in the Aconcagua region.\n\nWhether you're supporting your team, traveling with staff or visiting as family, here's what you need for transport, tickets and where to stay.`,
      `O Chile organiza o Mundial Feminino Sub-17 da FIVB: onze dias de competição com fase de grupos e finais no Parque Estadio Nacional (Ñuñoa), além de jogos na região de Aconcagua.\n\nSe você vem torcer, acompanhar a equipe ou trabalhar no torneio, aqui está o essencial para transporte, ingressos e hospedagem.`,
    ),
    mustKnow: [
      t(
        locale,
        `${dates} · Parque Estadio Nacional, Ñuñoa.`,
        `${dates} · Parque Estadio Nacional, Ñuñoa.`,
        `${dates} · Parque Estadio Nacional, Ñuñoa.`,
      ),
      t(
        locale,
        "24 selecciones y público internacional: conviene reservar alojamiento con semanas de anticipación.",
        "24 national teams and international visitors — book accommodation well ahead.",
        "24 seleções e público internacional: reserve hospedagem com antecedência.",
      ),
      t(
        locale,
        "Metro Irarrázaval o Ñuble suelen ser los más cómodos para llegar al recinto.",
        "Irarrázaval or Ñuble metro stations are usually best for reaching the venue.",
        "Metrô Irarrázaval ou Ñuble costumam ser os mais práticos para chegar ao ginásio.",
      ),
      t(
        locale,
        "Entradas y horarios oficiales en fevochi.cl — Crambie no vende tickets.",
        "Official tickets and schedules at fevochi.cl — Crambie does not sell tickets.",
        "Ingressos e horários oficiais em fevochi.cl — a Crambie não vende ingressos.",
      ),
      t(
        locale,
        "El torneo dura 11 días: considera llegar un día antes y quedarte hasta la final.",
        "The tournament runs 11 days — consider arriving a day early and staying through the final.",
        "O torneio dura 11 dias — considere chegar um dia antes e ficar até a final.",
      ),
      t(
        locale,
        `Alojamientos destacados a ~${mins} min caminando del recinto.`,
        `Featured stays ~${mins} min walk from the venue.`,
        `Acomodações em destaque a ~${mins} min a pé do ginásio.`,
      ),
    ],
    news: [
      t(
        locale,
        `Santiago recibe el Mundial Femenino Sub-17 de vóleibol del ${dates}.`,
        `Santiago hosts the U17 Women's Volleyball World Championship, ${dates}.`,
        `Santiago recebe o Mundial Feminino Sub-17 de vôlei de ${dates}.`,
      ),
      t(
        locale,
        "Alta demanda de alojamiento: delegaciones, familias y staff desde Chile y el extranjero.",
        "High accommodation demand from delegations, families and staff from Chile and abroad.",
        "Alta demanda de hospedagem: delegações, famílias e staff do Chile e do exterior.",
      ),
      t(
        locale,
        "Fase de grupos y finales en Parque Estadio Nacional; revisa sedes auxiliares en Aconcagua.",
        "Group stage and finals at Parque Estadio Nacional; check auxiliary venues in Aconcagua.",
        "Fase de grupos e finais no Parque Estadio Nacional; confira sedes auxiliares em Aconcagua.",
      ),
      t(
        locale,
        "Barrios recomendados cerca del recinto: Ñuñoa, Barrio Italia y Santiago Centro.",
        "Recommended neighborhoods near the venue: Ñuñoa, Barrio Italia and downtown Santiago.",
        "Bairros recomendados perto do ginásio: Ñuñoa, Barrio Italia e Santiago Centro.",
      ),
    ],
  };
}

export function getEventCopyOverride(
  pack: EventCopyOverrideInput,
  locale: Locale,
  opts?: { nearestMins?: number },
): EventCopyOverride | null {
  if (isMundialU17Volleyball(pack)) {
    return mundialU17VolleyballOverride(pack, locale, opts?.nearestMins);
  }
  return null;
}

export function isInternalNewsLine(text: string): boolean {
  return (
    /\(\d+\s*·\s*~/.test(text) ||
    /\bpernocta\b/i.test(text) ||
    /\bmailing\b/i.test(text)
  );
}
