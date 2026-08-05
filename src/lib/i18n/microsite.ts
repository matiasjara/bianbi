import type { CampaignInterest, CampaignPack, MicrositeContent } from "@/lib/demand/types";
import { climateForCampaign } from "@/lib/demand/climate-copy";
import {
  buildMicrositeEventCopy,
  type MicrositeCopyInput,
} from "@/lib/demand/microsite-event-copy";
import {
  getEventCopyOverride,
  isMundialU17VolleyballTitle,
} from "@/lib/demand/microsite-event-overrides";
import {
  guerrerasLocationHighlights,
  propertyStadiumProximity,
} from "@/lib/demand/venue-proximity-copy";
import {
  publicEventDescriptionEn,
  publicEventDescriptionPt,
} from "@/lib/demand/public-event-description";
import { cleanPublicEventTitle } from "@/lib/demand/guide-eligibility";
import type { Locale } from "@/lib/i18n/locale";

type Ui = {
  productLabel: string;
  ctaStay: string;
  ctaEssentials: string;
  shareLabel: string;
  copyLabel: string;
  copiedLabel: string;
  shareImageLabel: string;
  downloadImageLabel: string;
  sharingLabel: string;
  previewTitle: string;
  previewCloseLabel: string;
  previewLoadingLabel: string;
  navShare: string;
  shareSectionKicker: string;
  shareSectionTitle: string;
  shareSectionBody: string;
  shareHighlightsTitle: string;
  ctaShare: string;
  whatsAppLabel: string;
  stickyShareLabel: string;
  guideLinkLabel: string;
  snapshotKicker: string;
  snapshotTitle: string;
  when: string;
  where: string;
  weather: string;
  nearest: string;
  nearbyOptions: string;
  navMust: string;
  navNews: string;
  navMap: string;
  navTips: string;
  navWeather: string;
  navTransport: string;
  navFaq: string;
  navStay: string;
  kickerMust: string;
  titleMust: string;
  kickerAbout: string;
  kickerNews: string;
  titleNews: string;
  kickerMap: string;
  titleMap: string;
  mapBody: (venue: string) => string;
  kickerTips: string;
  titleTips: string;
  kickerWeather: string;
  titleWeather: string;
  kickerTransport: string;
  titleTransport: string;
  kickerFaq: string;
  titleFaq: string;
  kickerStay: string;
  titleStay: string;
  stayBody: (venue: string) => string;
  stayUnitOption: (n: number) => string;
  stayReviews: (n: number) => string;
  minWalk: string;
  ctaAirbnb: string;
  footerShare: string;
  footerNote: string;
};

const UI: Record<Locale, Ui> = {
  es: {
    productLabel: "Guía del evento",
    ctaStay: "Ver dónde alojar",
    ctaEssentials: "Lo esencial",
    shareLabel: "Compartir",
    copyLabel: "Copiar link",
    copiedLabel: "Link copiado",
    shareImageLabel: "Compartir guía",
    downloadImageLabel: "Guardar imagen",
    sharingLabel: "Preparando…",
    previewTitle: "Vista previa",
    previewCloseLabel: "Cerrar",
    previewLoadingLabel: "Generando imagen…",
    navShare: "Compartir",
    shareSectionKicker: "Para tu grupo",
    shareSectionTitle: "La guía lista para compartir",
    shareSectionBody:
      "Fechas, mapa, tips y dónde quedarte — en una imagen lista para WhatsApp o tus redes.",
    shareHighlightsTitle: "Lo que incluye",
    ctaShare: "Compartir guía",
    whatsAppLabel: "Enviar por WhatsApp",
    stickyShareLabel: "Compartir",
    guideLinkLabel: "Ver guía completa del Evento",
    snapshotKicker: "Snapshot",
    snapshotTitle: "Todo lo clave, de un vistazo",
    when: "Cuándo",
    where: "Dónde",
    weather: "Clima",
    nearest: "Más cerca",
    nearbyOptions: "Opciones cercanas",
    navMust: "Esencial",
    navNews: "Novedades",
    navMap: "Mapa",
    navTips: "Tips",
    navWeather: "Clima",
    navTransport: "Transporte",
    navFaq: "FAQ",
    navStay: "Alojamiento",
    kickerMust: "01 · Prioridad",
    kickerAbout: "Sobre el evento",
    titleMust: "Lo esencial",
    kickerNews: "02 · Actualizado",
    titleNews: "Novedades",
    kickerMap: "03 · Ubicación",
    titleMap: "Mapa del plan",
    mapBody: (venue) =>
      `${venue} y alojamientos cercanos para llegar sin estrés.`,
    kickerTips: "04 · Pro tips",
    titleTips: "Recomendaciones",
    kickerWeather: "05 · Ambiente",
    titleWeather: "Clima",
    kickerTransport: "06 · Cómo llegar",
    titleTransport: "Transporte",
    kickerStay: "07 · Reserva",
    titleStay: "Dónde alojar",
    kickerFaq: "08 · Dudas",
    titleFaq: "Preguntas frecuentes",
    stayBody: (venue) =>
      `Alojamientos cerca de ${venue}. Ordenados por cercanía. Reserva en Airbnb.`,
    stayUnitOption: (n) => `Unidad ${n}`,
    stayReviews: (n) => `${n} reseña${n === 1 ? "" : "s"}`,
    minWalk: "min",
    ctaAirbnb: "Reservar en Airbnb",
    footerShare: "La guía concreta del evento. Compártela y llega preparado.",
    footerNote:
      "Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. La reserva y el pago se hacen en el anuncio oficial.",
  },
  en: {
    productLabel: "Event guide",
    ctaStay: "Where to stay",
    ctaEssentials: "Must-know",
    shareLabel: "Share",
    copyLabel: "Copy link",
    copiedLabel: "Link copied",
    shareImageLabel: "Share guide",
    downloadImageLabel: "Save image",
    sharingLabel: "Preparing…",
    previewTitle: "Preview",
    previewCloseLabel: "Close",
    previewLoadingLabel: "Generating image…",
    navShare: "Share",
    shareSectionKicker: "For your group",
    shareSectionTitle: "The guide, ready to send",
    shareSectionBody:
      "Dates, map, tips and where to stay — one image for WhatsApp or social.",
    shareHighlightsTitle: "What's inside",
    ctaShare: "Share guide",
    whatsAppLabel: "Send on WhatsApp",
    stickyShareLabel: "Share",
    guideLinkLabel: "See full event guide",
    snapshotKicker: "Snapshot",
    snapshotTitle: "The essentials at a glance",
    when: "When",
    where: "Where",
    weather: "Weather",
    nearest: "Closest",
    nearbyOptions: "Nearby options",
    navMust: "Essentials",
    navNews: "Updates",
    navMap: "Map",
    navTips: "Tips",
    navWeather: "Weather",
    navTransport: "Transit",
    navFaq: "FAQ",
    navStay: "Stay",
    kickerMust: "01 · Priority",
    kickerAbout: "About the event",
    titleMust: "Must-know",
    kickerNews: "02 · Updated",
    titleNews: "Updates",
    kickerMap: "03 · Location",
    titleMap: "Plan map",
    mapBody: (venue) =>
      `${venue} and nearby apartments so you arrive without stress.`,
    kickerTips: "04 · Pro tips",
    titleTips: "Recommendations",
    kickerWeather: "05 · Conditions",
    titleWeather: "Weather",
    kickerTransport: "06 · Getting there",
    titleTransport: "Transit",
    kickerStay: "07 · Book",
    titleStay: "Where to stay",
    kickerFaq: "08 · FAQ",
    titleFaq: "Frequently asked questions",
    stayBody: (venue) =>
      `Apartments near ${venue}. Sorted by distance. Book on Airbnb.`,
    stayUnitOption: (n) => `Unit ${n}`,
    stayReviews: (n) => `${n} review${n === 1 ? "" : "s"}`,
    minWalk: "min",
    ctaAirbnb: "Book on Airbnb",
    footerShare: "The concrete event guide. Share it and arrive prepared.",
    footerNote:
      "This site is not part of Airbnb and is not affiliated with Airbnb, Inc. Booking and payment happen on the official listing.",
  },
  pt: {
    productLabel: "Guia do evento",
    ctaStay: "Onde ficar",
    ctaEssentials: "O essencial",
    shareLabel: "Compartilhar",
    copyLabel: "Copiar link",
    copiedLabel: "Link copiado",
    shareImageLabel: "Compartilhar guia",
    downloadImageLabel: "Salvar imagem",
    sharingLabel: "Preparando…",
    previewTitle: "Pré-visualização",
    previewCloseLabel: "Fechar",
    previewLoadingLabel: "Gerando imagem…",
    navShare: "Compartilhar",
    shareSectionKicker: "Para seu grupo",
    shareSectionTitle: "O guia pronto para enviar",
    shareSectionBody:
      "Datas, mapa, dicas e onde ficar — uma imagem para WhatsApp ou redes.",
    shareHighlightsTitle: "O que inclui",
    ctaShare: "Compartilhar guia",
    whatsAppLabel: "Enviar no WhatsApp",
    stickyShareLabel: "Compartilhar",
    guideLinkLabel: "Ver guia completa do evento",
    snapshotKicker: "Snapshot",
    snapshotTitle: "O essencial de um olhar",
    when: "Quando",
    where: "Onde",
    weather: "Clima",
    nearest: "Mais perto",
    nearbyOptions: "Opções próximas",
    navMust: "Essencial",
    navNews: "Novidades",
    navMap: "Mapa",
    navTips: "Dicas",
    navWeather: "Clima",
    navTransport: "Transporte",
    navFaq: "FAQ",
    navStay: "Hospedagem",
    kickerMust: "01 · Prioridade",
    kickerAbout: "Sobre o evento",
    titleMust: "O essencial",
    kickerNews: "02 · Atualizado",
    titleNews: "Novidades",
    kickerMap: "03 · Localização",
    titleMap: "Mapa do plano",
    mapBody: (venue) =>
      `${venue} e apartamentos próximos para chegar sem estresse.`,
    kickerTips: "04 · Pro tips",
    titleTips: "Recomendações",
    kickerWeather: "05 · Ambiente",
    titleWeather: "Clima",
    kickerTransport: "06 · Como chegar",
    titleTransport: "Transporte",
    kickerStay: "07 · Reserva",
    titleStay: "Onde ficar",
    kickerFaq: "08 · Dúvidas",
    titleFaq: "Perguntas frequentes",
    stayBody: (venue) =>
      `Apartamentos perto de ${venue}. Ordenados por proximidade. Reserve no Airbnb.`,
    stayUnitOption: (n) => `Unidade ${n}`,
    stayReviews: (n) => `${n} avaliaç${n === 1 ? "ão" : "ões"}`,
    minWalk: "min",
    ctaAirbnb: "Reservar no Airbnb",
    footerShare: "O guia concreto do evento. Compartilhe e chegue preparado.",
    footerNote:
      "Este site não faz parte do Airbnb e não é afiliado à Airbnb, Inc. A reserva e o pagamento são feitos no anúncio oficial.",
  },
};

const INTEREST: Record<CampaignInterest, Record<Locale, string>> = {
  concierto: { es: "Concierto", en: "Concert", pt: "Show" },
  partido_futbol: { es: "Partido", en: "Match", pt: "Jogo" },
  deporte_competencia: {
    es: "Deporte",
    en: "Sports",
    pt: "Esporte",
  },
  nieve: { es: "Nieve", en: "Snow", pt: "Neve" },
  feriado_puente: { es: "Feriado", en: "Holiday", pt: "Feriado" },
  vacaciones_familias: {
    es: "Vacaciones",
    en: "Holiday trip",
    pt: "Férias",
  },
  turismo_general: { es: "Turismo", en: "Travel", pt: "Turismo" },
  congreso_feria: {
    es: "Congreso / feria",
    en: "Congress / trade show",
    pt: "Congresso / feira",
  },
  otro_evento: { es: "Teatro / cultura", en: "Theater / culture", pt: "Teatro / cultura" },
};

function guideTitle(
  pack: CampaignPack,
  locale: Locale,
): string {
  const override = getEventCopyOverride(copyInput(pack), locale);
  if (override?.shortTitle) {
    return override.shortTitle;
  }

  const t = cleanPublicEventTitle(pack.eventTitle);
  const interest = pack.interest;
  if (locale === "en") {
    if (interest === "nieve") return "Santiago as your base for the mountains";
    if (
      interest === "feriado_puente" ||
      interest === "vacaciones_familias" ||
      interest === "turismo_general" ||
      interest === "otro_evento"
    ) {
      return /santiago/i.test(t) ? t : `${t} in Santiago`;
    }
    return t;
  }
  if (locale === "pt") {
    if (interest === "nieve") return "Santiago como base na cordilheira";
    if (
      interest === "feriado_puente" ||
      interest === "vacaciones_familias" ||
      interest === "turismo_general" ||
      interest === "otro_evento"
    ) {
      return /santiago/i.test(t) ? t : `${t} em Santiago`;
    }
    return t;
  }
  return pack.microsite.guideTitle;
}

function copyInput(pack: CampaignPack): MicrositeCopyInput {
  return {
    eventTitle: pack.eventTitle,
    eventDescription: pack.eventDescription,
    eventDates: pack.eventDates,
    eventStartsOn: pack.eventStartsOn,
    eventEndsOn: pack.eventEndsOn,
    venueName: pack.venueName,
    venuePoiId: pack.venuePoiId,
    venueLat: pack.venueLat,
    venueLng: pack.venueLng,
    interest: pack.interest,
    interestLabel: pack.interestLabel,
    estimatedAttendance: pack.estimatedAttendance,
    estimatedOvernight: pack.estimatedOvernight,
    demandDimension: pack.demandDimension,
    drivers: pack.drivers,
    properties: pack.properties,
    audience: pack.audience,
    eventUrl: pack.eventUrl,
  };
}

function eventSummary(pack: CampaignPack, locale: Locale): string {
  return buildMicrositeEventCopy(copyInput(pack), locale).eventSummary;
}

function eventDescription(pack: CampaignPack, locale: Locale): string {
  const override = getEventCopyOverride(copyInput(pack), locale);
  if (override?.eventDescription) return override.eventDescription;

  const base = {
    eventTitle: pack.eventTitle,
    venueName: pack.venueName,
    interest: pack.interest,
    eventDates: pack.eventDates,
    eventStartsOn: pack.eventStartsOn,
    eventEndsOn: pack.eventEndsOn,
  };
  if (locale === "en") return publicEventDescriptionEn(base);
  if (locale === "pt") return publicEventDescriptionPt(base);
  return pack.eventDescription;
}

function mustKnow(pack: CampaignPack, locale: Locale): string[] {
  return buildMicrositeEventCopy(copyInput(pack), locale).mustKnow;
}

function news(pack: CampaignPack, locale: Locale): string[] {
  return buildMicrositeEventCopy(copyInput(pack), locale).news;
}

function recommendations(pack: CampaignPack, locale: Locale): string[] {
  return buildMicrositeEventCopy(copyInput(pack), locale).recommendations;
}

function transport(pack: CampaignPack, locale: Locale): string[] {
  return buildMicrositeEventCopy(copyInput(pack), locale).transport;
}

function faqs(
  pack: CampaignPack,
  locale: Locale,
): Array<{ q: string; a: string }> {
  return buildMicrositeEventCopy(copyInput(pack), locale).faqs;
}

function localizePitch(
  prop: CampaignPack["properties"][number],
  locale: Locale,
  eventTitle?: string,
): string {
  const metro =
    prop.metroStations.length > 0
      ? locale === "pt"
        ? `Metrô ${prop.metroStations.slice(0, 2).join(" / ")}`
        : `Metro ${prop.metroStations.slice(0, 2).join(" / ")}`
      : null;

  if (eventTitle && isMundialU17VolleyballTitle(eventTitle)) {
    return [
      propertyStadiumProximity(prop.walkingMinutes, locale),
      metro,
      locale === "en"
        ? `${prop.neighborhood}: safe, well-connected Santiago neighborhood`
        : locale === "pt"
          ? `${prop.neighborhood}: bairro seguro e bem conectado em Santiago`
          : `${prop.neighborhood}: barrio seguro y bien conectado en Santiago`,
      prop.isSuperhost
        ? locale === "en"
          ? "Airbnb Superhost"
          : locale === "pt"
            ? "Anfitrião Superhost no Airbnb"
            : "Anfitrión Superhost en Airbnb"
        : locale === "en"
          ? "Book direct on Airbnb"
          : locale === "pt"
            ? "Reserva direta no Airbnb"
            : "Reserva directa en Airbnb",
    ]
      .filter(Boolean)
      .join(" · ");
  }

  if (locale === "en") {
    return [
      `${prop.walkingMinutes} min from the venue`,
      metro,
      `${prop.neighborhood}: residential, well-connected Santiago neighborhood`,
      prop.isSuperhost ? "Airbnb Superhost" : "Book direct on Airbnb",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  if (locale === "pt") {
    return [
      `${prop.walkingMinutes} min do venue`,
      metro,
      `${prop.neighborhood}: bairro residencial e bem conectado em Santiago`,
      prop.isSuperhost
        ? "Anfitrião Superhost no Airbnb"
        : "Reserva direta no Airbnb",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return prop.pitch;
}

export type LocalizedMicrosite = {
  locale: Locale;
  ui: Ui;
  content: MicrositeContent;
  properties: Array<
    CampaignPack["properties"][number] & { pitchLocalized: string }
  >;
};

export function localizeMicrosite(
  pack: CampaignPack,
  locale: Locale,
): LocalizedMicrosite {
  const ui = UI[locale];
  const title = guideTitle(pack, locale);
  const interestLabel =
    INTEREST[pack.interest]?.[locale] ?? pack.interestLabel;
  const weather = climateForCampaign(pack.eventStartsOn, pack.interest, locale);
  const summary = eventSummary(pack, locale);
  const description = eventDescription(pack, locale);

  const content: MicrositeContent = {
    ...pack.microsite,
    guideTitle: title,
    productLabel: ui.productLabel,
    productLabelEs: ui.productLabel,
    eventSummary: summary,
    eventDescription: description,
    interestLabel,
    mustKnow: mustKnow(pack, locale),
    recommendations: recommendations(pack, locale),
    news: news(pack, locale),
    weather,
    transport: transport(pack, locale),
    faqs: faqs(pack, locale),
    seoTitle:
      pack.interest === "nieve"
        ? locale === "en"
          ? `${title} · Santiago ski hub`
          : locale === "pt"
            ? `${title} · Hub ski Santiago`
            : `${title} · Santiago hub cordillera`
        : `${title} · ${pack.venueName}`,
    seoDescription:
      pack.interest === "nieve"
        ? locale === "en"
          ? `${title}. Dates, tips, weather, transfers to ski resorts, FAQ and hub stays in Santiago.`
          : locale === "pt"
            ? `${title}. Datas, dicas, clima, traslados para ski, FAQ e hospedagem hub em Santiago.`
            : pack.microsite.seoDescription
        : locale === "en"
          ? `${summary} Map, tips, weather, transit, FAQ and stays near ${pack.venueName} in Santiago.`
          : locale === "pt"
            ? `${summary} Mapa, dicas, clima, transporte, FAQ e hospedagem perto de ${pack.venueName} em Santiago.`
            : `${summary} Mapa, transporte, clima, FAQ y alojamiento cerca de ${pack.venueName}.`,
    shareText: isMundialU17VolleyballTitle(pack.eventTitle)
      ? locale === "en"
        ? `Guerreras World Cup in Chile (${pack.eventDates}). Essentials for delegations, staff, families and fans — stay near the court:`
        : locale === "pt"
          ? `Mundial das Guerreiras no Chile (${pack.eventDates}). O essencial para delegações, staff, famílias e torcida — fique perto da quadra:`
          : `Mundial de las Guerreras en Chile (${pack.eventDates}). Lo esencial para delegaciones, staff, familias e hinchada — quédate cerca de la cancha:`
      : pack.interest === "nieve"
        ? locale === "en"
          ? `${title} — ${pack.eventDates}. Essentials for your snow trip:`
          : locale === "pt"
            ? `${title} — ${pack.eventDates}. O essencial para sua viagem de neve:`
            : pack.microsite.shareText
        : locale === "en"
          ? `${title} — ${pack.eventDates} at ${pack.venueName}. Essentials for your visit:`
          : locale === "pt"
            ? `${title} — ${pack.eventDates} em ${pack.venueName}. O essencial para sua visita:`
            : pack.microsite.shareText,
  };

  const guerreras = isMundialU17VolleyballTitle(pack.eventTitle);

  return {
    locale,
    ui,
    content,
    properties: pack.microsite.properties.map((p) => ({
      ...p,
      amenities: p.amenities.filter((a) => !/mascota/i.test(a)),
      pitchLocalized: localizePitch(p, locale, pack.eventTitle),
      locationHighlights: guerreras
        ? guerrerasLocationHighlights(
            p.walkingMinutes,
            p.metroStations,
            p.neighborhood,
            locale,
          )
        : p.locationHighlights,
    })),
  };
}

export function getMicrositeUi(locale: Locale): Ui {
  return UI[locale];
}
