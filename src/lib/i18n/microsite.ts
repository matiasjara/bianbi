import type { CampaignInterest, CampaignPack, MicrositeContent } from "@/lib/demand/types";
import { climateForCampaign } from "@/lib/demand/climate-copy";
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
    kickerFaq: "07 · Dudas",
    titleFaq: "Preguntas frecuentes",
    kickerStay: "08 · Reserva",
    titleStay: "Dónde alojar",
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
    kickerFaq: "07 · FAQ",
    titleFaq: "Frequently asked questions",
    kickerStay: "08 · Book",
    titleStay: "Where to stay",
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
    kickerFaq: "07 · Dúvidas",
    titleFaq: "Perguntas frequentes",
    kickerStay: "08 · Reserva",
    titleStay: "Onde ficar",
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
  otro_evento: { es: "Evento", en: "Event", pt: "Evento" },
};

function guideTitle(
  pack: CampaignPack,
  locale: Locale,
): string {
  const t = pack.eventTitle;
  const interest = pack.interest;
  if (locale === "en") {
    if (interest === "concierto") return `Concert guide: ${t}`;
    if (interest === "partido_futbol") return `Match guide: ${t}`;
    if (interest === "deporte_competencia") return `Travel guide: ${t}`;
    if (interest === "nieve") return `Snow travel guide: Santiago as your base`;
    if (
      interest === "feriado_puente" ||
      interest === "vacaciones_familias" ||
      interest === "turismo_general"
    ) {
      return `Travel guide: ${t} in Santiago`;
    }
    return `Event guide: ${t}`;
  }
  if (locale === "pt") {
    if (interest === "concierto") return `Guia do show: ${t}`;
    if (interest === "partido_futbol") return `Guia do jogo: ${t}`;
    if (interest === "deporte_competencia") return `Guia de viagem: ${t}`;
    if (interest === "nieve") return `Guia de neve: Santiago como base`;
    if (
      interest === "feriado_puente" ||
      interest === "vacaciones_familias" ||
      interest === "turismo_general"
    ) {
      return `Guia de viagem: ${t} em Santiago`;
    }
    return `Guia do evento: ${t}`;
  }
  return pack.microsite.guideTitle;
}

function eventSummary(pack: CampaignPack, locale: Locale): string {
  if (pack.interest === "nieve") {
    if (locale === "en") {
      return `Chile snow season (${pack.eventDates}). Santiago as a comfortable base for Valle Nevado, Farellones and Portillo.`;
    }
    if (locale === "pt") {
      return `Temporada de neve no Chile (${pack.eventDates}). Santiago como base confortável para Valle Nevado, Farellones e Portillo.`;
    }
  }
  if (locale === "en") {
    return `${pack.eventTitle} at ${pack.venueName}. ${pack.eventDates}. Everything essential for your Santiago visit.`;
  }
  if (locale === "pt") {
    return `${pack.eventTitle} em ${pack.venueName}. ${pack.eventDates}. Tudo o essencial para sua visita a Santiago.`;
  }
  return pack.microsite.eventSummary;
}

function mustKnow(pack: CampaignPack, locale: Locale): string[] {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;
  if (pack.interest === "nieve") {
    if (locale === "en") {
      return [
        `Season: ${pack.eventDates}.`,
        "Santiago is your base: sleep in the city and head to the mountains.",
        "Common resorts: Valle Nevado, Farellones/El Colorado, Portillo (1–2 h from Santiago).",
        "Check the snow report and book van/tour ahead on winter weekends.",
        "Save this guide and share it with whoever is coming with you.",
      ];
    }
    if (locale === "pt") {
      return [
        `Temporada: ${pack.eventDates}.`,
        "Santiago é sua base: durma na cidade e saia para a cordilheira.",
        "Centros habituais: Valle Nevado, Farellones/El Colorado, Portillo (1–2 h de Santiago).",
        "Confira o boletim de neve e reserve van/tour com antecedência nos fins de semana.",
        "Salve este guia e compartilhe com quem vai com você.",
      ];
    }
  }
  if (locale === "en") {
    const tips = [
      `Date: ${pack.eventDates}.`,
      `Venue: ${venue}, Santiago.`,
      `Arrive early: recommended stays are ~${mins} min walk away.`,
      "Save this guide and share it with whoever is coming with you.",
    ];
    if (pack.interest === "concierto") {
      tips.push(
        "Build in buffer time: queues, security and merch usually take longer.",
        "Plan the night return: metro, rideshare or a short walk depending on the hour.",
      );
    } else if (pack.interest === "partido_futbol") {
      tips.push(
        "Check stadium access times and possible street closures.",
        "If you're visiting fans, move in a group on well-lit routes.",
      );
    } else if (pack.interest === "nieve") {
      tips.push(
        "Santiago is your base: sleep in the city and leave early for the mountains.",
        "Check the snow report the day before.",
      );
    } else if (pack.interest === "deporte_competencia") {
      tips.push(
        "Confirm competition times and credentials if you're staff or family.",
        "Rest near the venue: competition days run long.",
      );
    }
    return tips;
  }
  if (locale === "pt") {
    const tips = [
      `Data: ${pack.eventDates}.`,
      `Local: ${venue}, Santiago.`,
      `Chegue com antecedência: os aptos recomendados ficam a ~${mins} min a pé.`,
      "Salve este guia e compartilhe com quem vai com você.",
    ];
    if (pack.interest === "concierto") {
      tips.push(
        "Entre com margem: filas, controle de acesso e merch costumam demorar.",
        "Planeje a volta à noite: metrô, rideshare ou caminhada curta conforme o horário.",
      );
    } else if (pack.interest === "partido_futbol") {
      tips.push(
        "Confira horários de acesso ao estádio e possíveis cortes de rua.",
        "Se for torcida visitante, ande em grupo por rotas iluminadas.",
      );
    } else if (pack.interest === "nieve") {
      tips.push(
        "Santiago é sua base: durma na cidade e saia cedo para a cordilheira.",
        "Confira o boletim de neve no dia anterior.",
      );
    } else if (pack.interest === "deporte_competencia") {
      tips.push(
        "Confirme horários da competição e credenciais se for staff ou família.",
        "Descanse perto do venue: o dia é longo.",
      );
    }
    return tips;
  }
  return pack.microsite.mustKnow;
}

function news(pack: CampaignPack, locale: Locale): string[] {
  if (pack.interest === "nieve") {
    if (locale === "en") {
      return [
        `Snow season ${pack.eventDates}: stronger flow to mountain resorts.`,
        "If you still need a place in Santiago, book soon — July and weekends fill up.",
        "Snow conditions change fast: confirm resorts and roads the same day.",
        "Tips: city base + early departure + van/tour or car with chains when required.",
      ];
    }
    if (locale === "pt") {
      return [
        `Temporada de neve ${pack.eventDates}: maior fluxo para centros na cordilheira.`,
        "Se ainda não tem hospedagem em Santiago, reserve cedo — julho e fins de semana esgotam.",
        "Condições de neve mudam rápido: confirme centros e estradas no mesmo dia.",
        "Dicas: base na cidade + saída cedo + van/tour ou carro com correntes se necessário.",
      ];
    }
  }
  if (locale === "en") {
    const items = [
      `${pack.eventTitle} takes place at ${pack.venueName} (${pack.eventDates}).`,
      "If you still need a place to stay, book soon: event dates fill up near the venue.",
    ];
    if (pack.interest === "concierto") {
      items.push(
        "Check the ticket app or email for door changes or opening times.",
      );
    }
    if (pack.interest === "partido_futbol") {
      items.push(
        "Follow your club and the league for possible kickoff or venue changes.",
      );
    }
    if (pack.interest === "nieve") {
      items.push(
        "Snow conditions change fast: confirm resorts and roads the same day.",
      );
    }
    items.push(
      "Local tips: metro + safe neighborhood + fully equipped apartment to arrive and rest.",
    );
    return items;
  }
  if (locale === "pt") {
    const items = [
      `${pack.eventTitle} acontece em ${pack.venueName} (${pack.eventDates}).`,
      "Se ainda não tem hospedagem, reserve cedo: datas de evento esgotam perto do venue.",
    ];
    if (pack.interest === "concierto") {
      items.push(
        "Confira o app ou e-mail do ingresso por mudanças de porta ou horário de abertura.",
      );
    }
    if (pack.interest === "partido_futbol") {
      items.push(
        "Acompanhe seu clube e a liga por possíveis mudanças de horário ou sede.",
      );
    }
    if (pack.interest === "nieve") {
      items.push(
        "Condições de neve mudam rápido: confirme centros e estradas no mesmo dia.",
      );
    }
    items.push(
      "Dicas locais: metrô + bairro seguro + apartamento completo para chegar e descansar.",
    );
    return items;
  }
  return pack.microsite.news;
}

function recommendations(pack: CampaignPack, locale: Locale): string[] {
  const venue = pack.venueName;
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  if (locale === "en") {
    const base = [
      `Leave buffer time: plan ~${mins} min walk to ${venue}.`,
      "Save the apartment pin and the venue pin for offline maps.",
      "Coordinate check-in on Airbnb the same day you book.",
    ];
    if (pack.interest === "concierto") {
      return [
        ...base,
        "Eat near the neighborhood before the show; rideshare back if it's very late.",
        "Don't leave valuable bags at the venue: travel light.",
      ];
    }
    if (pack.interest === "partido_futbol") {
      return [
        ...base,
        "If there's an away crowd, move in a group and use lit routes / metro.",
        "Avoid driving if you'll celebrate: skip the car or use rideshare.",
      ];
    }
    if (pack.interest === "deporte_competencia") {
      return [
        ...base,
        "In winter, dress in layers for early outdoor sessions.",
        "Stay hydrated and rest near the venue — competition days are long.",
      ];
    }
    if (pack.interest === "nieve") {
      return [
        "Use Santiago as a base: sleep well and leave early for the mountains.",
        "Check the snow report and valley weather the day before.",
        "Metro and a safe neighborhood for city nights.",
      ];
    }
    return [
      ...base,
      "Combine the event with a neighborhood walk (cafés, plazas, viewpoints).",
      "Traveling as a couple? Pick a place with a double bed and sofa bed if someone else joins.",
    ];
  }
  if (locale === "pt") {
    const base = [
      `Chegue com margem: calcule ~${mins} min a pé até ${venue}.`,
      "Salve o pin do apartamento e do venue no mapa offline.",
      "Combine o check-in no Airbnb no mesmo dia da reserva.",
    ];
    if (pack.interest === "concierto") {
      return [
        ...base,
        "Coma perto do bairro antes do show; volte de rideshare se for muito tarde.",
        "Não deixe mochilas de valor no venue: viaje leve.",
      ];
    }
    if (pack.interest === "partido_futbol") {
      return [
        ...base,
        "Se houver torcida visitante, ande em grupo e use rotas iluminadas / metrô.",
        "Evite dirigir se for comemorar: deixe o carro ou use rideshare.",
      ];
    }
    if (pack.interest === "deporte_competencia") {
      return [
        ...base,
        "No inverno, vá em camadas para provas ao ar livre cedo.",
        "Hidrate-se e descanse perto do venue — dias de competição são longos.",
      ];
    }
    if (pack.interest === "nieve") {
      return [
        "Use Santiago como base: durma bem e saia cedo para a cordilheira.",
        "Confira o boletim de neve e o clima do vale no dia anterior.",
        "Metrô e bairro seguro para as noites na cidade.",
      ];
    }
    return [
      ...base,
      "Combine o evento com um passeio pelo bairro (cafés, praças, mirantes).",
      "Viajando a dois? Escolha apto com cama de casal e sofá-cama se alguém mais chegar.",
    ];
  }
  return pack.microsite.recommendations;
}

function transport(pack: CampaignPack, locale: Locale): string[] {
  const metros = [
    ...new Set(pack.properties.flatMap((p) => p.metroStations)),
  ];
  if (pack.interest === "nieve") {
    if (locale === "en") {
      return [
        metros.length
          ? `In the city: Metro ${metros.slice(0, 3).join(", ")} near hub apartments.`
          : "Good connection to Santiago public transit.",
        "To the mountains: van/tour from Santiago to Valle Nevado, Farellones or Portillo (book ahead).",
        "Own car: check road status, fog and chain requirements.",
        "SCL airport: transfer, taxi or Uber to your Santiago check-in.",
      ];
    }
    if (locale === "pt") {
      return [
        metros.length
          ? `Na cidade: Metrô ${metros.slice(0, 3).join(", ")} perto dos aptos hub.`
          : "Boa conexão com transporte público de Santiago.",
        "Para a cordilheira: van/tour de Santiago a Valle Nevado, Farellones ou Portillo (reserve antes).",
        "Carro próprio: confira estado da estrada, neblina e correntes obrigatórias.",
        "Aeroporto SCL: transfer, táxi ou Uber até o check-in em Santiago.",
      ];
    }
  }
  if (locale === "en") {
    return [
      metros.length
        ? `Nearby metro: ${metros.slice(0, 3).join(", ")}.`
        : "Good connection to Santiago public transit.",
      "Walk to the venue when it's close; rideshare at night if you prefer.",
      "From other regions: bus to terminals + metro/Uber to the apartment.",
      "SCL airport: official transfer, taxi or Uber to check-in.",
    ];
  }
  if (locale === "pt") {
    return [
      metros.length
        ? `Metrô próximo: ${metros.slice(0, 3).join(", ")}.`
        : "Boa conexão com o transporte público de Santiago.",
      "A pé até o venue quando a distância é curta; rideshare à noite se preferir.",
      "De outras regiões: ônibus até terminais + metrô/Uber até o apartamento.",
      "Aeroporto SCL: transfer oficial, táxi ou Uber até o check-in.",
    ];
  }
  return pack.microsite.transport;
}

function faqs(
  pack: CampaignPack,
  locale: Locale,
): Array<{ q: string; a: string }> {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;
  const metro = pack.properties[0]?.metroStations[0];
  const hoods = [
    ...new Set(pack.properties.map((p) => p.neighborhood)),
  ].slice(0, 3);

  if (pack.interest === "nieve") {
    if (locale === "en") {
      return [
        {
          q: "Where are the apartments?",
          a: `In Santiago hub neighborhoods${hoods.length ? ` (${hoods.join(", ")})` : ""}: well connected, metro nearby, comfortable between ski days.`,
        },
        {
          q: "How do I get to the ski resorts?",
          a: "From Santiago you can book van/tour (Valle Nevado, Farellones/El Colorado, Portillo), private transfer or a car with chains when required. Leave early — the drive can take 1–2 h.",
        },
        {
          q: "Why stay in Santiago instead of the mountain?",
          a: "Santiago is the flight hub with restaurants and easier logistics: you sleep better, have metro, and more flexible bookings. Ideal if you mix ski + city.",
        },
        {
          q: "How do I get from the airport?",
          a: metro
            ? `Transfer or taxi/Uber to the apartment. Then use Metro ${metro} on non-ski days.`
            : "Transfer or taxi/Uber straight to the apartment. Then metro or rideshare in the city.",
        },
        {
          q: "Where do I book and pay?",
          a: "Only on Airbnb via each apartment link — protected payment, cancellation policy and host chat.",
        },
        {
          q: "Is Crambie part of Airbnb?",
          a: "No. Crambie shows options and the travel guide; booking and payment are always on the official Airbnb listing.",
        },
      ];
    }
    if (locale === "pt") {
      return [
        {
          q: "Onde ficam os apartamentos?",
          a: `Em bairros hub de Santiago${hoods.length ? ` (${hoods.join(", ")})` : ""}: bem conectados, metrô perto e confortáveis entre dias de ski.`,
        },
        {
          q: "Como chego aos centros de ski?",
          a: "De Santiago você pode contratar van/tour (Valle Nevado, Farellones/El Colorado, Portillo), transfer privado ou carro com correntes se necessário. Saia cedo — a viagem pode levar 1–2 h.",
        },
        {
          q: "Por que me hospedar em Santiago e não na montanha?",
          a: "Santiago é hub de voos, restaurantes e logística: você dorme melhor, tem metrô e reservas mais flexíveis. Ideal se combina ski + cidade.",
        },
        {
          q: "Como chego do aeroporto?",
          a: metro
            ? `Transfer ou táxi/Uber até o apto. Depois use o Metrô ${metro} nos dias sem ski.`
            : "Transfer ou táxi/Uber direto ao apartamento. Depois metrô ou rideshare na cidade.",
        },
        {
          q: "Onde reservo e pago?",
          a: "Só no Airbnb, no link de cada apartamento — pagamento protegido, cancelamento e chat com o anfitrião.",
        },
        {
          q: "A Crambie faz parte do Airbnb?",
          a: "Não. A Crambie mostra opções e o guia de viagem; reserva e pagamento são sempre no anúncio oficial do Airbnb.",
        },
      ];
    }
  }

  if (locale === "en") {
    return [
      {
        q: `How close are the apartments to ${venue}?`,
        a: `Featured options start from ~${mins} minutes on foot (varies by unit). The map shows real distance before you book.`,
      },
      {
        q: "Is the neighborhood safe?",
        a: "We focus on well-connected residential areas (Ñuñoa, Barrio Italia, Santiago Centro). Metro nearby and neighborhood life — still use big-city common sense.",
      },
      {
        q: "How do I get from the airport?",
        a: metro
          ? `From the airport: transfer or taxi/Uber to the apartment. Then move easily via Metro ${metro} and surroundings.`
          : "From the airport: transfer or taxi/Uber straight to the apartment. Then metro, walking or rideshare.",
      },
      {
        q: "Can I check in late?",
        a: "Most of our apartments have digital locks / self check-in. Confirm details with the host on Airbnb when you book.",
      },
      {
        q: "Where do I book and pay?",
        a: "Only on Airbnb, via each apartment link. That's where protected payment, cancellation policy and host chat live.",
      },
      {
        q: "Is Crambie part of Airbnb?",
        a: "No. Crambie shows options and the event guide; booking and payment are always on the official Airbnb listing.",
      },
    ];
  }
  if (locale === "pt") {
    return [
      {
        q: `Quão perto ficam os apartamentos de ${venue}?`,
        a: `As opções em destaque ficam a partir de ~${mins} minutos a pé (conforme o apto). No mapa você vê a distância real antes de reservar.`,
      },
      {
        q: "O bairro é seguro?",
        a: "Trabalhamos bairros residenciais bem conectados (Ñuñoa, Barrio Italia, Santiago Centro). Metrô perto e vida de bairro; ainda assim use o senso comum de qualquer cidade grande.",
      },
      {
        q: "Como chego do aeroporto?",
        a: metro
          ? `Do aeroporto: transfer ou táxi/Uber até o apto. Depois você se move fácil pelo Metrô ${metro} e arredores.`
          : "Do aeroporto: transfer ou táxi/Uber direto ao apartamento. Depois metrô, a pé ou rideshare.",
      },
      {
        q: "Posso fazer check-in tarde?",
        a: "A maioria dos nossos aptos tem fechadura digital / check-in autônomo. Confirme detalhes com o anfitrião no Airbnb ao reservar.",
      },
      {
        q: "Onde reservo e pago?",
        a: "Só no Airbnb, no link de cada apartamento. Lá estão o pagamento protegido, o cancelamento conforme a política do anúncio e o chat com o anfitrião.",
      },
      {
        q: "A Crambie faz parte do Airbnb?",
        a: "Não. A Crambie mostra opções e o guia do evento; a reserva e o pagamento são sempre no anúncio oficial do Airbnb.",
      },
    ];
  }
  return pack.microsite.faqs;
}

function localizePitch(
  prop: CampaignPack["properties"][number],
  locale: Locale,
): string {
  const metro =
    prop.metroStations.length > 0
      ? locale === "pt"
        ? `Metrô ${prop.metroStations.slice(0, 2).join(" / ")}`
        : `Metro ${prop.metroStations.slice(0, 2).join(" / ")}`
      : null;

  if (locale === "en") {
    return [
      `${prop.walkingMinutes} min walk from the venue`,
      metro,
      `${prop.neighborhood}: residential, well-connected Santiago neighborhood`,
      prop.isSuperhost ? "Airbnb Superhost" : "Book direct on Airbnb",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  if (locale === "pt") {
    return [
      `${prop.walkingMinutes} min a pé do venue`,
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

  const content: MicrositeContent = {
    ...pack.microsite,
    guideTitle: title,
    productLabel: ui.productLabel,
    productLabelEs: ui.productLabel,
    eventSummary: summary,
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
          ? `${title}. Dates, map, tips, weather, transit, FAQ and stays near ${pack.venueName} in Santiago.`
          : locale === "pt"
            ? `${title}. Datas, mapa, dicas, clima, transporte, FAQ e hospedagem perto de ${pack.venueName} em Santiago.`
            : pack.microsite.seoDescription,
    shareText:
      pack.interest === "nieve"
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

  return {
    locale,
    ui,
    content,
    properties: pack.microsite.properties.map((p) => ({
      ...p,
      amenities: p.amenities.filter((a) => !/mascota/i.test(a)),
      pitchLocalized: localizePitch(p, locale),
    })),
  };
}

export function getMicrositeUi(locale: Locale): Ui {
  return UI[locale];
}
