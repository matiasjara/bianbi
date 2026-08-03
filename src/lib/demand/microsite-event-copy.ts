/**
 * Copy público del micrositio — específico por evento (título, fechas, venue, demanda).
 */
import { formatPeople } from "./attendance";
import {
  getEventCopyOverride,
  isInternalNewsLine,
} from "./microsite-event-overrides";
import {
  formatVenueMetroMustKnow,
  formatVenueMetroTransport,
  nearestMetroStations,
} from "./venue-metro";
import type { Locale } from "@/lib/i18n/locale";
import type {
  CampaignInterest,
  CampaignPack,
  CampaignPackProperty,
} from "./types";

export type MicrositeCopyInput = Pick<
  CampaignPack,
  | "eventTitle"
  | "eventDescription"
  | "eventDates"
  | "eventStartsOn"
  | "eventEndsOn"
  | "venueName"
  | "venuePoiId"
  | "venueLat"
  | "venueLng"
  | "interest"
  | "interestLabel"
  | "estimatedAttendance"
  | "estimatedOvernight"
  | "demandDimension"
  | "drivers"
  | "properties"
  | "audience"
> & {
  eventUrl?: string;
};

function t(locale: Locale, es: string, en: string, pt: string): string {
  if (locale === "en") return en;
  if (locale === "pt") return pt;
  return es;
}

function isMultiDay(start: string, end: string): boolean {
  return start !== end;
}

function hoods(pack: MicrositeCopyInput, limit = 3): string[] {
  return [...new Set(pack.properties.map((p) => p.neighborhood))].slice(
    0,
    limit,
  );
}

function nearestMins(props: CampaignPackProperty[]): number {
  return props[0]?.walkingMinutes ?? 15;
}

function propertyMetros(props: CampaignPackProperty[]): string[] {
  return [...new Set(props.flatMap((p) => p.metroStations))];
}

function extractFootballMatch(title: string): { home: string; away: string } | null {
  const m = title.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
  if (!m) return null;
  const home = m[1]?.trim();
  const away = m[2]?.trim();
  if (!home || !away) return null;
  return { home, away };
}

function extractTicketingSource(
  description: string,
  eventUrl?: string,
): string | null {
  const d = `${description} ${eventUrl ?? ""}`.toLowerCase();
  if (/punto\s*ticket|puntoticket/.test(d)) return "PuntoTicket";
  if (/ticketpro/.test(d)) return "Ticketpro";
  if (/ticketplus/.test(d)) return "TicketPlus";
  if (/passline/.test(d)) return "Passline";
  if (/ticketmaster/.test(d)) return "Ticketmaster";
  if (/tocador/.test(d)) return "Tocador";
  return null;
}

function crowdLine(pack: MicrositeCopyInput, locale: Locale): string | null {
  const { estimatedAttendance, demandDimension } = pack;
  if (
    demandDimension !== "mega" &&
    demandDimension !== "grande" &&
    (estimatedAttendance ?? 0) < 8_000
  ) {
    return null;
  }
  const n = formatPeople(estimatedAttendance || 15_000);
  return t(
    locale,
    `Evento de gran escala (~${n} asistentes): conviene reservar alojamiento con anticipación.`,
    `Large-scale event (~${n} attendees): book accommodation early.`,
    `Evento de grande escala (~${n} espectadores): vale reservar hospedagem com antecedência.`,
  );
}

function overnightLine(pack: MicrositeCopyInput, locale: Locale): string | null {
  if ((pack.estimatedOvernight ?? 0) < 1_500) return null;
  const n = formatPeople(pack.estimatedOvernight);
  return t(
    locale,
    `Alta demanda de pernocta en Santiago para estas fechas (~${n} viajeros estimados).`,
    `High overnight demand in Santiago for these dates (~${n} travelers estimated).`,
    `Alta demanda de pernoite em Santiago nestas datas (~${n} viajantes estimados).`,
  );
}

function audienceOriginLine(pack: MicrositeCopyInput, locale: Locale): string | null {
  const geo = pack.audience.geoTargets.slice(0, 2).map((g) => g.label);
  if (geo.length === 0) return null;
  const list = geo.join(locale === "en" ? " and " : locale === "pt" ? " e " : " y ");
  return t(
    locale,
    `Muchos viajeros llegan desde ${list}: reserva con margen si vienes de fuera de Santiago.`,
    `Many visitors arrive from ${list}: book early if you're traveling from outside Santiago.`,
    `Muitos visitantes chegam de ${list}: reserve com antecedência se vier de fora de Santiago.`,
  );
}

function venueAccessTip(pack: MicrositeCopyInput, locale: Locale): string | null {
  const { venuePoiId, venueName, eventTitle } = pack;
  const isVolleyball = /voleibol|v[oó]leibol|volley/i.test(eventTitle);
  switch (venuePoiId) {
    case "poi-movistar":
      return t(
        locale,
        `${venueName} está en Parque O'Higgins (Av. Beaucheff): combina metro Toesca o Irarrázaval con caminata o rideshare según tu alojamiento.`,
        `${venueName} is in O'Higgins Park (Beaucheff Ave.): combine Toesca or Irarrázaval metro with a walk or rideshare from your stay.`,
        `${venueName} fica no Parque O'Higgins (Av. Beaucheff): combine Metrô Toesca ou Irarrázaval com caminhada ou rideshare conforme sua hospedagem.`,
      );
    case "poi-estadio":
      if (isVolleyball) {
        return t(
          locale,
          `${venueName} en Ñuñoa: metro Irarrázaval o Ñuble suelen ser los más cómodos; en días de partido hay mayor flujo de público y conviene llegar con anticipación.`,
          `${venueName} in Ñuñoa: Irarrázaval or Ñuble metro are usually best; match days bring heavier crowds — arrive early.`,
          `${venueName} em Ñuñoa: metrô Irarrázaval ou Ñuble costumam ser os mais práticos; em dias de jogo há mais público — chegue com antecedência.`,
        );
      }
      return t(
        locale,
        `${venueName} en Ñuñoa: metro Irarrázaval o Ñuble suelen ser los más útiles; en partidos grandes hay cortes de calle y colas tempranas.`,
        `${venueName} in Ñuñoa: Irarrázaval or Ñuble metro are usually best; big matches mean street closures and early queues.`,
        `${venueName} em Ñuñoa: metrô Irarrázaval ou Ñuble costumam ser os mais úteis; em jogos grandes há bloqueios e filas cedo.`,
      );
    case "poi-ohiggins":
      return t(
        locale,
        `Eventos en ${venueName} / Club Hípico: metro Toesca queda relativamente cerca; revisa accesos oficiales del día.`,
        `Events at ${venueName} / Club Hípico: Toesca metro is relatively close; check official access routes for your date.`,
        `Eventos em ${venueName} / Club Hípico: metrô Toesca fica relativamente perto; confira acessos oficiais do dia.`,
      );
    default:
      return null;
  }
}

function stayNightsTip(pack: MicrositeCopyInput, locale: Locale): string | null {
  if (pack.interest === "nieve") {
    return t(
      locale,
      "Para ski, planifica 3–5 noches en Santiago como base y días de ida a la cordillera.",
      "For skiing, plan 3–5 nights in Santiago as a base and day trips to the mountains.",
      "Para ski, planeje 3–5 noites em Santiago como base e dias na cordilheira.",
    );
  }
  if (isMultiDay(pack.eventStartsOn, pack.eventEndsOn)) {
    return t(
      locale,
      `El evento abarca ${pack.eventDates}: considera llegar un día antes y quedarte hasta el cierre.`,
      `The event spans ${pack.eventDates}: consider arriving a day early and staying through the end.`,
      `O evento cobre ${pack.eventDates}: considere chegar um dia antes e ficar até o fim.`,
    );
  }
  return t(
    locale,
    `Evento de un día (${pack.eventDates}): bloquea la noche del evento con margen de llegada.`,
    `Single-day event (${pack.eventDates}): book the event night with arrival buffer.`,
    `Evento de um dia (${pack.eventDates}): reserve a noite do evento com margem de chegada.`,
  );
}

export function buildEventSummary(
  pack: MicrositeCopyInput,
  locale: Locale,
): string {
  const override = getEventCopyOverride(pack, locale);
  if (override?.eventSummary) return override.eventSummary;

  const { eventTitle, eventDates, venueName, interest } = pack;
  if (interest === "nieve") {
    return t(
      locale,
      `Temporada ${eventDates}: Santiago como base hacia Valle Nevado, Farellones y Portillo.`,
      `Season ${eventDates}: Santiago as your base for Valle Nevado, Farellones and Portillo.`,
      `Temporada ${eventDates}: Santiago como base para Valle Nevado, Farellones e Portillo.`,
    );
  }
  return t(
    locale,
    `Guía para ${eventTitle} (${eventDates}) en ${venueName}: mapa, transporte, clima y alojamiento cercano.`,
    `Guide for ${eventTitle} (${eventDates}) at ${venueName}: map, transit, weather and nearby stays.`,
    `Guia para ${eventTitle} (${eventDates}) em ${venueName}: mapa, transporte, clima e hospedagem próxima.`,
  );
}

export function buildMustKnow(
  pack: MicrositeCopyInput,
  locale: Locale,
): string[] {
  const override = getEventCopyOverride(pack, locale);
  if (override?.mustKnow) return override.mustKnow;

  const mins = nearestMins(pack.properties);
  const tips: string[] = [];

  if (pack.interest === "nieve") {
    tips.push(
      t(
        locale,
        `Temporada de nieve ${pack.eventDates}: duermes en Santiago y sales a la cordillera.`,
        `Snow season ${pack.eventDates}: sleep in Santiago and head to the mountains.`,
        `Temporada de neve ${pack.eventDates}: durma em Santiago e saia para a cordilheira.`,
      ),
      t(
        locale,
        "Centros habituales: Valle Nevado, Farellones/El Colorado, Portillo (1–2 h desde Santiago).",
        "Common resorts: Valle Nevado, Farellones/El Colorado, Portillo (1–2 h from Santiago).",
        "Centros habituais: Valle Nevado, Farellones/El Colorado, Portillo (1–2 h de Santiago).",
      ),
    );
    const overnight = overnightLine(pack, locale);
    if (overnight) tips.push(overnight);
    tips.push(
      t(
        locale,
        "Revisa el parte de nieve y reserva van/tour con anticipación en fines de semana de julio.",
        "Check the snow report and book van/tour ahead on July weekends.",
        "Confira o boletim de neve e reserve van/tour com antecedência nos fins de semana de julho.",
      ),
    );
    return tips.slice(0, 5);
  }

  tips.push(
    t(
      locale,
      `${pack.eventTitle} · ${pack.eventDates} · ${pack.venueName}.`,
      `${pack.eventTitle} · ${pack.eventDates} · ${pack.venueName}.`,
      `${pack.eventTitle} · ${pack.eventDates} · ${pack.venueName}.`,
    ),
  );

  const crowd = crowdLine(pack, locale);
  if (crowd) tips.push(crowd);

  const venueTip = venueAccessTip(pack, locale);
  if (venueTip) tips.push(venueTip);

  if (pack.interest === "concierto") {
    const venueMetros = nearestMetroStations(pack.venueLat, pack.venueLng);
    if (venueMetros.length) {
      tips.push(formatVenueMetroMustKnow(venueMetros, locale));
    }
    tips.push(
      t(
        locale,
        `Para ${pack.eventTitle}, entra con 45–60 min de margen: colas, control y merch en ${pack.venueName}.`,
        `For ${pack.eventTitle}, allow 45–60 min buffer: queues, security and merch at ${pack.venueName}.`,
        `Para ${pack.eventTitle}, entre com 45–60 min de margem: filas, controle e merch em ${pack.venueName}.`,
      ),
    );
  } else if (pack.interest === "partido_futbol") {
    const match = extractFootballMatch(pack.eventTitle);
    tips.push(
      match
        ? t(
            locale,
            `Partido ${match.home} vs ${match.away}: llega temprano por controles y cortes de calle en ${pack.venueName}.`,
            `Match ${match.home} vs ${match.away}: arrive early for security and street closures at ${pack.venueName}.`,
            `Jogo ${match.home} x ${match.away}: chegue cedo por controles e bloqueios perto de ${pack.venueName}.`,
          )
        : t(
            locale,
            `Partido en ${pack.venueName}: revisa horario oficial y accesos de hinchada el día del evento.`,
            `Match at ${pack.venueName}: check official kickoff time and fan access on event day.`,
            `Jogo em ${pack.venueName}: confira horário oficial e acessos de torcida no dia do evento.`,
          ),
    );
  } else if (pack.interest === "deporte_competencia") {
    tips.push(
      t(
        locale,
        `${pack.eventTitle}: confirma horarios de tu categoría y acreditaciones si vas como staff o familia.`,
        `${pack.eventTitle}: confirm your category schedule and credentials if you're staff or family.`,
        `${pack.eventTitle}: confirme horários da sua categoria e credenciais se for staff ou família.`,
      ),
    );
  }

  const nights = stayNightsTip(pack, locale);
  if (nights) tips.push(nights);

  tips.push(
    t(
      locale,
      `Alojamientos destacados a ~${mins} min de ${pack.venueName}.`,
      `Featured stays ~${mins} min from ${pack.venueName}.`,
      `Acomodações em destaque a ~${mins} min de ${pack.venueName}.`,
    ),
  );

  const origin = audienceOriginLine(pack, locale);
  if (origin) tips.push(origin);

  return tips.slice(0, 6);
}

export function buildNews(pack: MicrositeCopyInput, locale: Locale): string[] {
  const override = getEventCopyOverride(pack, locale);
  if (override?.news) return override.news;

  if (pack.interest === "nieve") {
    return [
      t(
        locale,
        `Temporada de nieve ${pack.eventDates}: mayor flujo hacia centros de ski en la cordillera.`,
        `Snow season ${pack.eventDates}: stronger flow to mountain resorts.`,
        `Temporada de neve ${pack.eventDates}: maior fluxo para centros na cordilheira.`,
      ),
      t(
        locale,
        "Si aún no tienes alojamiento en Santiago, reserva pronto: julio y fines de semana se llenan.",
        "If you still need a place in Santiago, book soon — July and weekends fill up.",
        "Se ainda não tem hospedagem em Santiago, reserve cedo — julho e fins de semana esgotam.",
      ),
      t(
        locale,
        "Condiciones de nieve cambian rápido: confirma centros y caminos el mismo día.",
        "Snow conditions change fast: confirm resorts and roads the same day.",
        "Condições de neve mudam rápido: confirme centros e estradas no mesmo dia.",
      ),
    ];
  }

  const items: string[] = [
    t(
      locale,
      `${pack.eventTitle} se realiza en ${pack.venueName} (${pack.eventDates}).`,
      `${pack.eventTitle} takes place at ${pack.venueName} (${pack.eventDates}).`,
      `${pack.eventTitle} acontece em ${pack.venueName} (${pack.eventDates}).`,
    ),
  ];

  const driver = pack.drivers.find((d) => d.length > 12 && !isInternalNewsLine(d));
  if (driver) {
    items.push(driver.endsWith(".") ? driver : `${driver}.`);
  }

  const overnight = overnightLine(pack, locale);
  if (overnight) items.push(overnight);

  const ticketSource = extractTicketingSource(
    pack.eventDescription,
    pack.eventUrl,
  );
  if (ticketSource) {
    items.push(
      t(
        locale,
        `Entradas vía ${ticketSource}: revisa confirmación y horarios de puertas en tu mail o app.`,
        `Tickets via ${ticketSource}: check confirmation and door times in your email or app.`,
        `Ingressos via ${ticketSource}: confira confirmação e horários de portões no e-mail ou app.`,
      ),
    );
  } else if (pack.interest === "concierto") {
    items.push(
      t(
        locale,
        `Revisa la app o el mail del ticket de ${pack.eventTitle} por cambios de puerta o horarios.`,
        `Check the ticket app or email for ${pack.eventTitle} for door or opening time changes.`,
        `Confira o app ou e-mail do ingresso de ${pack.eventTitle} por mudanças de porta ou horário.`,
      ),
    );
  } else if (pack.interest === "partido_futbol") {
    const match = extractFootballMatch(pack.eventTitle);
    items.push(
      match
        ? t(
            locale,
            `Sigue a ${match.home} y ${match.away} por posibles cambios de horario en ${pack.venueName}.`,
            `Follow ${match.home} and ${match.away} for possible schedule changes at ${pack.venueName}.`,
            `Acompanhe ${match.home} e ${match.away} por possíveis mudanças de horário em ${pack.venueName}.`,
          )
        : t(
            locale,
            "Sigue a tu club y a la ANFP por posibles cambios de horario o sede.",
            "Follow your club and the league for possible kickoff or venue changes.",
            "Acompanhe seu clube e a liga por possíveis mudanças de horário ou sede.",
          ),
    );
  } else if (pack.interest === "deporte_competencia") {
    items.push(
      t(
        locale,
        `${pack.eventTitle}: confirma calendario de competencias y sedes auxiliares con la organización.`,
        `${pack.eventTitle}: confirm competition schedule and auxiliary venues with organizers.`,
        `${pack.eventTitle}: confirme calendário de competições e sedes auxiliares com a organização.`,
      ),
    );
  }

  items.push(
    t(
      locale,
      `Barrios recomendados cerca de ${pack.venueName}: ${hoods(pack).join(", ") || "Ñuñoa, Barrio Italia, Santiago Centro"}.`,
      `Recommended neighborhoods near ${pack.venueName}: ${hoods(pack).join(", ") || "Ñuñoa, Barrio Italia, Santiago Centro"}.`,
      `Bairros recomendados perto de ${pack.venueName}: ${hoods(pack).join(", ") || "Ñuñoa, Barrio Italia, Santiago Centro"}.`,
    ),
  );

  return items.slice(0, 5);
}

export function buildRecommendations(
  pack: MicrositeCopyInput,
  locale: Locale,
): string[] {
  const venue = pack.venueName;
  const mins = nearestMins(pack.properties);
  const hoodList = hoods(pack).join(", ");

  if (pack.interest === "nieve") {
    return [
      t(
        locale,
        `Para ${pack.eventDates}, usa Santiago como base: duermes bien y sales temprano a la cordillera.`,
        `For ${pack.eventDates}, use Santiago as your base: sleep well and leave early for the mountains.`,
        `Para ${pack.eventDates}, use Santiago como base: durma bem e saia cedo para a cordilheira.`,
      ),
      t(
        locale,
        "Revisa el parte de nieve y el clima del valle el día anterior.",
        "Check the snow report and valley weather the day before.",
        "Confira o boletim de neve e o clima do vale no dia anterior.",
      ),
      t(
        locale,
        hoodList
          ? `Alojamientos hub en ${hoodList} con metro cerca para las noches en ciudad.`
          : "Alojamientos hub con metro cerca para las noches en ciudad.",
        hoodList
          ? `Hub stays in ${hoodList} with metro nearby for city nights.`
          : "Hub stays with metro nearby for city nights.",
        hoodList
          ? `Hospedagens hub em ${hoodList} com metrô perto para as noites na cidade.`
          : "Hospedagens hub com metrô perto para as noites na cidade.",
      ),
      t(
        locale,
        "Reserva van o tour con anticipación en fines de semana de julio.",
        "Book van or tour ahead on July weekends.",
        "Reserve van ou tour com antecedência nos fins de semana de julho.",
      ),
    ];
  }

  const base = [
    t(
      locale,
      `Para ${pack.eventTitle}, calcula ~${mins} min desde tu alojamiento hasta ${venue}.`,
      `For ${pack.eventTitle}, plan ~${mins} min from your stay to ${venue}.`,
      `Para ${pack.eventTitle}, calcule ~${mins} min da sua hospedagem até ${venue}.`,
    ),
    t(
      locale,
      `Guarda en mapas offline el pin de ${venue} y el de tu alojamiento en ${hoodList || "Santiago"}.`,
      `Save offline map pins for ${venue} and your stay in ${hoodList || "Santiago"}.`,
      `Salve no mapa offline o pin de ${venue} e da hospedagem em ${hoodList || "Santiago"}.`,
    ),
    t(
      locale,
      "Coordina check-in en Airbnb el mismo día que reserves.",
      "Coordinate check-in on Airbnb the same day you book.",
      "Combine o check-in no Airbnb no mesmo dia da reserva.",
    ),
  ];

  if (pack.interest === "concierto") {
    return [
      ...base,
      t(
        locale,
        `Antes de ${pack.eventTitle}, come en ${hoodList || "el barrio del alojamiento"}; vuelve con rideshare si el show termina tarde.`,
        `Before ${pack.eventTitle}, eat in ${hoodList || "your neighborhood"}; rideshare back if the show ends late.`,
        `Antes de ${pack.eventTitle}, jante em ${hoodList || "seu bairro"}; volte de rideshare se o show terminar tarde.`,
      ),
      t(
        locale,
        "Viaja liviano: muchos venues no permiten mochilas grandes.",
        "Travel light: many venues don't allow large backpacks.",
        "Viaje leve: muitos venues não permitem mochilas grandes.",
      ),
    ];
  }

  if (pack.interest === "partido_futbol") {
    const match = extractFootballMatch(pack.eventTitle);
    return [
      ...base,
      match
        ? t(
            locale,
            `Hinchada de ${match.home} o ${match.away}: muévete en grupo y usa rutas iluminadas o metro.`,
            `Fans of ${match.home} or ${match.away}: move in a group and use lit routes or metro.`,
            `Torcida de ${match.home} ou ${match.away}: ande em grupo e use rotas iluminadas ou metrô.`,
          )
        : t(
            locale,
            "Si hay hinchada visitante, muévete en grupo por rutas iluminadas o metro.",
            "If there's an away crowd, move in a group on lit routes or metro.",
            "Se houver torcida visitante, ande em grupo por rotas iluminadas ou metrô.",
          ),
      t(
        locale,
        "Evita manejar si piensas celebrar: usa metro o rideshare al volver.",
        "Skip driving if you'll celebrate: use metro or rideshare on the way back.",
        "Evite dirigir se for comemorar: use metrô ou rideshare na volta.",
      ),
    ];
  }

  if (pack.interest === "deporte_competencia") {
    return [
      ...base,
      t(
        locale,
        `${pack.eventTitle}: lleva capas si compites o asistes a pruebas matinales al aire libre.`,
        `${pack.eventTitle}: bring layers for early outdoor sessions.`,
        `${pack.eventTitle}: leve camadas para provas matinais ao ar livre.`,
      ),
      t(
        locale,
        "Descansa cerca del venue: los días de competencia suelen ser largos.",
        "Rest near the venue — competition days run long.",
        "Descanse perto do venue — dias de competição costumam ser longos.",
      ),
    ];
  }

  return [
    ...base,
    t(
      locale,
      `Combina ${pack.eventTitle} con un paseo por ${hoodList || "el barrio"} (cafés, plazas, miradores).`,
      `Combine ${pack.eventTitle} with a walk through ${hoodList || "the neighborhood"}.`,
      `Combine ${pack.eventTitle} com um passeio por ${hoodList || "o bairro"}.`,
    ),
  ];
}

export function buildTransport(
  pack: MicrositeCopyInput,
  locale: Locale,
): string[] {
  const metros = propertyMetros(pack.properties);
  const eventLine = t(
    locale,
    `Para ${pack.eventTitle} (${pack.eventDates}), planifica ida y vuelta a ${pack.venueName} con anticipación.`,
    `For ${pack.eventTitle} (${pack.eventDates}), plan your trip to and from ${pack.venueName} ahead of time.`,
    `Para ${pack.eventTitle} (${pack.eventDates}), planeje ida e volta a ${pack.venueName} com antecedência.`,
  );

  if (pack.interest === "nieve") {
    return [
      eventLine,
      metros.length
        ? t(
            locale,
            `En la ciudad: Metro ${metros.slice(0, 3).join(", ")} cerca de los alojamientos hub.`,
            `In the city: Metro ${metros.slice(0, 3).join(", ")} near hub apartments.`,
            `Na cidade: Metrô ${metros.slice(0, 3).join(", ")} perto das hospedagens hub.`,
          )
        : t(
            locale,
            "Buena conexión a transporte público en Santiago.",
            "Good connection to Santiago public transit.",
            "Boa conexão com transporte público em Santiago.",
          ),
      t(
        locale,
        "A la cordillera: van/tour desde Santiago a Valle Nevado, Farellones o Portillo (reserva con anticipación).",
        "To the mountains: van/tour from Santiago to Valle Nevado, Farellones or Portillo (book ahead).",
        "Para a cordilheira: van/tour de Santiago a Valle Nevado, Farellones ou Portillo (reserve antes).",
      ),
      t(
        locale,
        "Aeropuerto SCL: transfer, taxi o Uber hasta el check-in en Santiago.",
        "SCL airport: transfer, taxi or Uber to your Santiago check-in.",
        "Aeroporto SCL: transfer, táxi ou Uber até o check-in em Santiago.",
      ),
    ];
  }

  if (pack.interest === "concierto") {
    const venueMetros = nearestMetroStations(pack.venueLat, pack.venueLng);
    return [
      eventLine,
      venueMetros.length
        ? formatVenueMetroTransport(venueMetros, locale)
        : t(
            locale,
            "Buena conexión a transporte público de Santiago.",
            "Good connection to Santiago public transit.",
            "Boa conexão com transporte público de Santiago.",
          ),
      t(
        locale,
        `Después de ${pack.eventTitle}, planifica la vuelta: último tren del Metro o rideshare según horario del show.`,
        `After ${pack.eventTitle}, plan your return: last Metro train or rideshare depending on show time.`,
        `Depois de ${pack.eventTitle}, planeje a volta: último trem do Metrô ou rideshare conforme o horário do show.`,
      ),
      t(
        locale,
        "Desde regiones: bus a terminales + metro/Uber al alojamiento.",
        "From other regions: bus to terminals + metro/Uber to your stay.",
        "De outras regiões: ônibus até terminais + metrô/Uber até a hospedagem.",
      ),
      t(
        locale,
        "Aeropuerto SCL: transfer oficial, taxi o Uber hasta el check-in.",
        "SCL airport: official transfer, taxi or Uber to check-in.",
        "Aeroporto SCL: transfer oficial, táxi ou Uber até o check-in.",
      ),
    ];
  }

  return [
    eventLine,
    metros.length
      ? t(
          locale,
          `Metro cercano a los alojamientos: ${metros.slice(0, 3).join(", ")}.`,
          `Metro near featured stays: ${metros.slice(0, 3).join(", ")}.`,
          `Metrô perto das hospedagens: ${metros.slice(0, 3).join(", ")}.`,
        )
      : t(
          locale,
          "Buena conexión a transporte público de Santiago.",
          "Good connection to Santiago public transit.",
          "Boa conexão com transporte público de Santiago.",
        ),
    t(
      locale,
      `Hacia ${pack.venueName}: a pie si estás cerca; rideshare de noche si prefieres.`,
      `To ${pack.venueName}: walk if you're close; rideshare at night if you prefer.`,
      `Para ${pack.venueName}: a pé se estiver perto; rideshare à noite se preferir.`,
    ),
    t(
      locale,
      "Desde regiones: bus a terminales + metro/Uber al alojamiento.",
      "From other regions: bus to terminals + metro/Uber to your stay.",
      "De outras regiões: ônibus até terminais + metrô/Uber até a hospedagem.",
    ),
    t(
      locale,
      "Aeropuerto SCL: transfer oficial, taxi o Uber hasta el check-in.",
      "SCL airport: official transfer, taxi or Uber to check-in.",
      "Aeroporto SCL: transfer oficial, táxi ou Uber até o check-in.",
    ),
  ];
}

function lodgingFaqs(
  pack: MicrositeCopyInput,
  locale: Locale,
): Array<{ q: string; a: string }> {
  const mins = nearestMins(pack.properties);
  const venue = pack.venueName;
  const metro = pack.properties[0]?.metroStations[0];
  const neighborhoods = hoods(pack);

  return [
    {
      q: t(
        locale,
        `¿Qué tan cerca quedan los alojamientos de ${venue}?`,
        `How close are the apartments to ${venue}?`,
        `Quão perto ficam os apartamentos de ${venue}?`,
      ),
      a: t(
        locale,
        `Para ${pack.eventTitle}, las opciones destacadas están desde ~${mins} minutos (según unidad). En el mapa ves la distancia real antes de reservar.`,
        `For ${pack.eventTitle}, featured options start from ~${mins} minutes (varies by unit). The map shows real distance before you book.`,
        `Para ${pack.eventTitle}, as opções em destaque ficam a partir de ~${mins} minutos (conforme o apto). No mapa você vê a distância real antes de reservar.`,
      ),
    },
    {
      q: t(locale, "¿Es seguro el barrio?", "Is the neighborhood safe?", "O bairro é seguro?"),
      a: t(
        locale,
        `Barrios recomendados para ${pack.eventTitle}: ${neighborhoods.join(", ") || "Ñuñoa, Barrio Italia, Santiago Centro"}. Metro cerca y vida de barrio; usa sentido común de ciudad grande.`,
        `Recommended neighborhoods for ${pack.eventTitle}: ${neighborhoods.join(", ") || "Ñuñoa, Barrio Italia, Santiago Centro"}. Metro nearby and neighborhood life — use big-city common sense.`,
        `Bairros recomendados para ${pack.eventTitle}: ${neighborhoods.join(", ") || "Ñuñoa, Barrio Italia, Santiago Centro"}. Metrô perto e vida de bairro; use o senso comum de cidade grande.`,
      ),
    },
    {
      q: t(
        locale,
        "¿Cómo llego desde el aeropuerto?",
        "How do I get from the airport?",
        "Como chego do aeroporto?",
      ),
      a: metro
        ? t(
            locale,
            `Desde el aeropuerto: transfer o taxi/Uber al alojamiento. Después te mueves fácil por Metro ${metro} y alrededores.`,
            `From the airport: transfer or taxi/Uber to the apartment. Then move easily via Metro ${metro} and surroundings.`,
            `Do aeroporto: transfer ou táxi/Uber até o apto. Depois você se move fácil pelo Metrô ${metro} e arredores.`,
          )
        : t(
            locale,
            "Desde el aeropuerto: transfer o taxi/Uber directo al alojamiento. Luego metro, a pie o rideshare.",
            "From the airport: transfer or taxi/Uber straight to the apartment. Then metro, walking or rideshare.",
            "Do aeroporto: transfer ou táxi/Uber direto ao apartamento. Depois metrô, a pé ou rideshare.",
          ),
    },
    {
      q: t(
        locale,
        "¿Puedo hacer check-in tarde?",
        "Can I check in late?",
        "Posso fazer check-in tarde?",
      ),
      a: t(
        locale,
        "La mayoría de los alojamientos tienen cerradura digital / check-in autónomo. Confirmas detalles con el anfitrión en Airbnb al reservar.",
        "Most apartments have digital locks / self check-in. Confirm details with the host on Airbnb when you book.",
        "A maioria dos aptos tem fechadura digital / check-in autônomo. Confirme detalhes com o anfitrião no Airbnb ao reservar.",
      ),
    },
    {
      q: t(
        locale,
        "¿Dónde reservo y pago?",
        "Where do I book and pay?",
        "Onde reservo e pago?",
      ),
      a: t(
        locale,
        "Solo en Airbnb, en el link de cada alojamiento. Ahí está el pago protegido, la cancelación según política del anuncio y el chat con el anfitrión.",
        "Only on Airbnb via each apartment link — protected payment, cancellation policy and host chat.",
        "Só no Airbnb, no link de cada apartamento. Lá estão o pagamento protegido, o cancelamento conforme a política do anúncio e o chat com o anfitrião.",
      ),
    },
    {
      q: t(
        locale,
        "¿Crambie es parte de Airbnb?",
        "Is Crambie part of Airbnb?",
        "A Crambie faz parte do Airbnb?",
      ),
      a: t(
        locale,
        "No. Crambie te muestra opciones y la guía del evento; la reserva y el pago son siempre en el anuncio oficial de Airbnb.",
        "No. Crambie shows options and the event guide; booking and payment are always on the official Airbnb listing.",
        "Não. A Crambie mostra opções e o guia do evento; a reserva e o pagamento são sempre no anúncio oficial do Airbnb.",
      ),
    },
  ];
}

export function buildFaqs(
  pack: MicrositeCopyInput,
  locale: Locale,
): Array<{ q: string; a: string }> {
  if (pack.interest === "nieve") {
    const neighborhoods = hoods(pack);
    const metro = pack.properties[0]?.metroStations[0];
    return [
      {
        q: t(
          locale,
          "¿Dónde quedan los alojamientos?",
          "Where are the apartments?",
          "Onde ficam os apartamentos?",
        ),
        a: t(
          locale,
          `Para la temporada ${pack.eventDates}, alojamientos hub en Santiago${neighborhoods.length ? ` (${neighborhoods.join(", ")})` : ""}: bien conectados y cómodos entre días de ski.`,
          `For season ${pack.eventDates}, hub apartments in Santiago${neighborhoods.length ? ` (${neighborhoods.join(", ")})` : ""}: well connected and comfortable between ski days.`,
          `Para a temporada ${pack.eventDates}, hospedagens hub em Santiago${neighborhoods.length ? ` (${neighborhoods.join(", ")})` : ""}: bem conectadas e confortáveis entre dias de ski.`,
        ),
      },
      {
        q: t(
          locale,
          "¿Cómo llego a los centros de ski?",
          "How do I get to the ski resorts?",
          "Como chego aos centros de ski?",
        ),
        a: t(
          locale,
          "Desde Santiago puedes contratar van/tour (Valle Nevado, Farellones/El Colorado, Portillo), transfer privado o auto con cadenas según el día. Sal early: la ruta puede demorar 1–2 h.",
          "From Santiago you can book van/tour (Valle Nevado, Farellones/El Colorado, Portillo), private transfer or a car with chains when required. Leave early — the drive can take 1–2 h.",
          "De Santiago você pode contratar van/tour (Valle Nevado, Farellones/El Colorado, Portillo), transfer privado ou carro com correntes se necessário. Saia cedo — a viagem pode levar 1–2 h.",
        ),
      },
      ...lodgingFaqs(pack, locale).slice(3),
    ];
  }

  const eventFaqs: Array<{ q: string; a: string }> = [
    {
      q: t(
        locale,
        `¿Cuándo es ${pack.eventTitle}?`,
        `When is ${pack.eventTitle}?`,
        `Quando é ${pack.eventTitle}?`,
      ),
      a: t(
        locale,
        `${pack.eventDates}${isMultiDay(pack.eventStartsOn, pack.eventEndsOn) ? " (varios días)" : " (fecha única)"}.`,
        `${pack.eventDates}${isMultiDay(pack.eventStartsOn, pack.eventEndsOn) ? " (multi-day)" : " (single date)"}.`,
        `${pack.eventDates}${isMultiDay(pack.eventStartsOn, pack.eventEndsOn) ? " (vários dias)" : " (data única)"}.`,
      ),
    },
    {
      q: t(
        locale,
        `¿Dónde se realiza ${pack.eventTitle}?`,
        `Where does ${pack.eventTitle} take place?`,
        `Onde acontece ${pack.eventTitle}?`,
      ),
      a: t(
        locale,
        `En ${pack.venueName}, Santiago. ${venueAccessTip(pack, locale) ?? "Revisa accesos oficiales el día del evento."}`,
        `At ${pack.venueName}, Santiago. ${venueAccessTip(pack, locale) ?? "Check official access routes on event day."}`,
        `Em ${pack.venueName}, Santiago. ${venueAccessTip(pack, locale) ?? "Confira acessos oficiais no dia do evento."}`,
      ),
    },
  ];

  if (pack.eventUrl) {
    eventFaqs.push({
      q: t(
        locale,
        `¿Dónde compro entradas para ${pack.eventTitle}?`,
        `Where do I buy tickets for ${pack.eventTitle}?`,
        `Onde compro ingressos para ${pack.eventTitle}?`,
      ),
      a: t(
        locale,
        `Consulta la venta oficial del evento (${pack.eventUrl}). Crambie no vende entradas; solo te ayuda con alojamiento y logística.`,
        `Check official ticket sales (${pack.eventUrl}). Crambie does not sell tickets — we help with stays and logistics only.`,
        `Consulte a venda oficial do evento (${pack.eventUrl}). A Crambie não vende ingressos; ajuda só com hospedagem e logística.`,
      ),
    });
  }

  const crowd = crowdLine(pack, locale);
  if (crowd) {
    eventFaqs.push({
      q: t(
        locale,
        `¿Debo reservar alojamiento con anticipación para ${pack.eventTitle}?`,
        `Should I book accommodation early for ${pack.eventTitle}?`,
        `Devo reservar hospedagem com antecedência para ${pack.eventTitle}?`,
      ),
      a: crowd,
    });
  }

  return [...eventFaqs, ...lodgingFaqs(pack, locale)];
}

export function buildMicrositeEventCopy(
  pack: MicrositeCopyInput,
  locale: Locale = "es",
) {
  return {
    eventSummary: buildEventSummary(pack, locale),
    mustKnow: buildMustKnow(pack, locale),
    news: buildNews(pack, locale),
    recommendations: buildRecommendations(pack, locale),
    transport: buildTransport(pack, locale),
    faqs: buildFaqs(pack, locale),
  };
}
