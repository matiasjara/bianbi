import type { CampaignPack, CampaignPackProperty } from "@/lib/demand/types";
import type { Locale } from "@/lib/i18n/locale";

type Ui = {
  metaFallback: string;
  heroMetroSafe: string;
  ctaAirbnb: string;
  ctaSeeUnits: string;
  whyTitle: string;
  whyBody: (venue: string) => string;
  unitsTitle: string;
  unitsBody: (venue: string) => string;
  option: (n: number, mins: number, km: number) => string;
  barrio: string;
  metro: string;
  beds: string;
  bedsValue: string;
  capacity: (n: number, bedrooms: number) => string;
  airbnbRating: (rating: string, reviews: number, superhost: boolean) => string;
  reviewWord: (n: number) => string;
  ctaBook: string;
  paySafe: string;
  mapTitle: string;
  mapBody: (venue: string) => string;
  mapEvent: string;
  mapUnit: string;
  closeTitle: string;
  closeBody: (dates: string, venue: string) => string;
  ctaGoAirbnb: string;
  footerStay: (dates: string) => string;
  footerDisclaimer: string;
  langHint: string;
};

const UI: Record<Locale, Ui> = {
  es: {
    metaFallback: "Campaña",
    heroMetroSafe: "barrio seguro en Santiago · arriendo directo en Airbnb",
    ctaAirbnb: "Ver disponibilidad en Airbnb",
    ctaSeeUnits: "Ver departamentos",
    whyTitle: "Por qué este es el lugar indicado",
    whyBody: (venue) =>
      `No es un hotel genérico lejos del evento: es un departamento real en Santiago, pensado para que llegues, descanses y estés cerca de ${venue}.`,
    unitsTitle: "Elige tu departamento",
    unitsBody: (venue) =>
      `Ordenados por cercanía a ${venue}. Reserva con las fechas del evento directo en Airbnb: pago protegido y mensajes con el anfitrión.`,
    option: (n, mins, km) => `Opción ${n} · ${mins} min a pie · ${km} km`,
    barrio: "Barrio",
    metro: "Metro",
    beds: "Camas",
    bedsValue: "matrimonial + sofá-cama",
    capacity: (n, bedrooms) =>
      `hasta ${n} huésped${n === 1 ? "" : "es"} · ${bedrooms} dorm`,
    airbnbRating: (rating, reviews, superhost) =>
      `${rating} ★ · ${reviews} reseña${reviews === 1 ? "" : "s"}${superhost ? " · Superhost" : ""}`,
    reviewWord: () => "",
    ctaBook: "Reservar en Airbnb",
    paySafe: "Pago seguro · cancelación según política del anuncio",
    mapTitle: "Evento y departamentos en el mapa",
    mapBody: (venue) =>
      `${venue} y tus opciones de alojamiento cerca.`,
    mapEvent: "Evento",
    mapUnit: "Departamento",
    closeTitle: "Reserva ahora y asegura tu estadía",
    closeBody: (dates, venue) =>
      `Las fechas de ${dates} se llenan rápido cerca de ${venue}. Arriendas en Airbnb: es el canal seguro para pagar, coordinar el check-in y ver reseñas reales.`,
    ctaGoAirbnb: "Ir a Airbnb",
    footerStay: (dates) => `Alojamiento independiente en Santiago · ${dates}`,
    footerDisclaimer:
      "Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. No gestionamos arriendos, no cobramos reservas ni procesamos pagos: solo mostramos opciones y te redirigimos al anuncio oficial en Airbnb para que reserves allí.",
    langHint: "Idioma",
  },
  en: {
    metaFallback: "Stay",
    heroMetroSafe: "safe neighborhood in Santiago · book direct on Airbnb",
    ctaAirbnb: "Check availability on Airbnb",
    ctaSeeUnits: "See apartments",
    whyTitle: "Why this is the right place",
    whyBody: (venue) =>
      `Not a generic hotel far from the event — a real apartment in Santiago, so you arrive, rest, and stay close to ${venue}.`,
    unitsTitle: "Choose your apartment",
    unitsBody: (venue) =>
      `Sorted by walking time to ${venue}. Book event dates directly on Airbnb: protected payment and host messaging.`,
    option: (n, mins, km) => `Option ${n} · ${mins} min walk · ${km} km`,
    barrio: "Neighborhood",
    metro: "Metro",
    beds: "Beds",
    bedsValue: "queen bed + sofa bed",
    capacity: (n, bedrooms) =>
      `up to ${n} guest${n === 1 ? "" : "s"} · ${bedrooms} bed${bedrooms === 1 ? "" : "s"}`,
    airbnbRating: (rating, reviews, superhost) =>
      `${rating} ★ · ${reviews} review${reviews === 1 ? "" : "s"}${superhost ? " · Superhost" : ""}`,
    reviewWord: () => "",
    ctaBook: "Book on Airbnb",
    paySafe: "Secure payment · cancellation per listing policy",
    mapTitle: "Event and apartments on the map",
    mapBody: (venue) =>
      `${venue} and your nearby stay options.`,
    mapEvent: "Event",
    mapUnit: "Apartment",
    closeTitle: "Book now and lock in your stay",
    closeBody: (dates, venue) =>
      `Dates around ${dates} fill up fast near ${venue}. You book on Airbnb — the safe way to pay, arrange check-in, and read real reviews.`,
    ctaGoAirbnb: "Go to Airbnb",
    footerStay: (dates) => `Independent stay in Santiago · ${dates}`,
    footerDisclaimer:
      "This site is not part of Airbnb and is not affiliated with Airbnb, Inc. We do not manage rentals, take bookings, or process payments — we only show options and send you to the official Airbnb listing to book there.",
    langHint: "Language",
  },
  pt: {
    metaFallback: "Estadia",
    heroMetroSafe: "bairro seguro em Santiago · aluguel direto no Airbnb",
    ctaAirbnb: "Ver disponibilidade no Airbnb",
    ctaSeeUnits: "Ver apartamentos",
    whyTitle: "Por que este é o lugar certo",
    whyBody: (venue) =>
      `Não é um hotel genérico longe do evento: é um apartamento real em Santiago, pensado para você chegar, descansar e ficar perto de ${venue}.`,
    unitsTitle: "Escolha seu apartamento",
    unitsBody: (venue) =>
      `Ordenados pela proximidade a ${venue}. Reserve nas datas do evento direto no Airbnb: pagamento protegido e mensagens com o anfitrião.`,
    option: (n, mins, km) => `Opção ${n} · ${mins} min a pé · ${km} km`,
    barrio: "Bairro",
    metro: "Metrô",
    beds: "Camas",
    bedsValue: "casal + sofá-cama",
    capacity: (n, bedrooms) =>
      `até ${n} hóspede${n === 1 ? "" : "s"} · ${bedrooms} quarto${bedrooms === 1 ? "" : "s"}`,
    airbnbRating: (rating, reviews, superhost) =>
      `${rating} ★ · ${reviews} avaliação${reviews === 1 ? "" : "ões"}${superhost ? " · Superhost" : ""}`,
    reviewWord: () => "",
    ctaBook: "Reservar no Airbnb",
    paySafe: "Pagamento seguro · cancelamento conforme o anúncio",
    mapTitle: "Evento e apartamentos no mapa",
    mapBody: (venue) =>
      `${venue} e suas opções de hospedagem por perto.`,
    mapEvent: "Evento",
    mapUnit: "Apartamento",
    closeTitle: "Reserve agora e garanta sua estadia",
    closeBody: (dates, venue) =>
      `As datas de ${dates} esgotam rápido perto de ${venue}. Você aluga no Airbnb: o canal seguro para pagar, combinar o check-in e ver avaliações reais.`,
    ctaGoAirbnb: "Ir ao Airbnb",
    footerStay: (dates) => `Hospedagem independente em Santiago · ${dates}`,
    footerDisclaimer:
      "Este site não faz parte do Airbnb e não é afiliado à Airbnb, Inc. Não gerenciamos aluguéis, não cobramos reservas nem processamos pagamentos: só mostramos opções e redirecionamos para o anúncio oficial no Airbnb para você reservar lá.",
    langHint: "Idioma",
  },
};

const AMENITY: Record<string, Record<Locale, string>> = {
  "Cama matrimonial": {
    es: "Cama matrimonial",
    en: "Queen bed",
    pt: "Cama de casal",
  },
  "Sofá-cama": { es: "Sofá-cama", en: "Sofa bed", pt: "Sofá-cama" },
  WiFi: { es: "WiFi", en: "WiFi", pt: "WiFi" },
  Cocina: { es: "Cocina", en: "Kitchen", pt: "Cozinha" },
  "Cocina completa": {
    es: "Cocina completa",
    en: "Full kitchen",
    pt: "Cozinha completa",
  },
  Lavadora: { es: "Lavadora", en: "Washer", pt: "Máquina de lavar" },
  Calefacción: { es: "Calefacción", en: "Heating", pt: "Aquecimento" },
  TV: { es: "TV", en: "TV", pt: "TV" },
  Estacionamiento: {
    es: "Estacionamiento",
    en: "Parking",
    pt: "Estacionamento",
  },
};

function tAmenity(a: string, locale: Locale): string {
  return AMENITY[a]?.[locale] ?? a;
}

function placeHook(locale: Locale): string {
  if (locale === "en") {
    return "Near the metro, safe Santiago neighborhood, protected Airbnb booking";
  }
  if (locale === "pt") {
    return "Perto do metrô, bairro seguro em Santiago e reserva protegida no Airbnb";
  }
  return "Metro cerca, barrio seguro en Santiago y reserva protegida en Airbnb";
}

function localizeHeadline(pack: CampaignPack, locale: Locale): string {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;
  const title = pack.eventTitle;

  if (locale === "en") {
    if (pack.interest === "nieve") {
      return "Snow season: sleep in Santiago, head to the mountains";
    }
    if (pack.interest === "concierto") {
      return `${title}: stay close and skip the long transfer`;
    }
    return `${title}: sleep ${mins} min from ${venue}`;
  }
  if (locale === "pt") {
    if (pack.interest === "nieve") {
      return "Neve: durma em Santiago e vá para a cordilheira";
    }
    if (pack.interest === "concierto") {
      return `${title}: fique perto e esqueça o translado`;
    }
    return `${title}: durma a ${mins} min de ${venue}`;
  }
  return pack.headline;
}

function localizeSubhead(pack: CampaignPack, locale: Locale): string {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;
  const dates = pack.eventDates;
  const hook = placeHook(locale);

  if (locale === "en") {
    if (pack.interest === "nieve") {
      return `${dates}. Full apartment as your base: well located, metro nearby, secure Airbnb rental.`;
    }
    return `${dates}. In Santiago, near the metro, in a safe neighborhood. Book direct on Airbnb. About ${mins} min from ${venue}. ${hook}.`;
  }
  if (locale === "pt") {
    if (pack.interest === "nieve") {
      return `${dates}. Apto completo como base: bem localizado, metrô por perto e aluguel seguro no Airbnb.`;
    }
    return `${dates}. Em Santiago, perto do metrô, em bairro seguro. Reserve direto no Airbnb. A ~${mins} min de ${venue}. ${hook}.`;
  }
  return pack.subhead;
}

function localizeTrust(pack: CampaignPack, locale: Locale): string[] {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;
  const metros = [
    ...new Set(pack.properties.flatMap((p) => p.metroStations)),
  ];
  const barrio = pack.properties[0]?.neighborhood ?? "Santiago";

  if (locale === "en") {
    return [
      pack.interest === "nieve"
        ? "Santiago as your base: arrive, rest, then head to the mountains without losing the day"
        : `About ${mins} min walk from ${venue}: arrive, shower, and head to the event`,
      metros.length
        ? `Metro nearby (${metros.slice(0, 3).join(", ")}): move around Santiago without a car`
        : "Well connected to Santiago transit",
      `${barrio}: residential, safe, comfortable for sleeping after the event`,
      "Book direct on Airbnb: protected payment, messaging, and real reviews",
      "Self check-in and a full apartment: your space, not a generic hotel",
    ];
  }
  if (locale === "pt") {
    return [
      pack.interest === "nieve"
        ? "Base em Santiago: você chega, descansa e vai à cordilheira sem perder o dia"
        : `A ~${mins} min a pé de ${venue}: chegue, tome banho e saia para o evento`,
      metros.length
        ? `Metrô perto (${metros.slice(0, 3).join(", ")}): circule por Santiago sem carro`
        : "Bem conectado ao transporte de Santiago",
      `${barrio}: bairro residencial, seguro e confortável para dormir depois do evento`,
      "Aluguel direto no Airbnb: pagamento protegido, mensagens e avaliações reais",
      "Check-in autônomo e apartamento completo: seu espaço, sem hotel genérico",
    ];
  }
  return pack.trustPoints;
}

function localizePitch(
  prop: CampaignPackProperty,
  locale: Locale,
): string {
  const metro =
    prop.metroStations.length > 0
      ? locale === "en"
        ? `Metro ${prop.metroStations.slice(0, 2).join(" / ")}`
        : locale === "pt"
          ? `Metrô ${prop.metroStations.slice(0, 2).join(" / ")}`
          : `Metro ${prop.metroStations.slice(0, 2).join(" / ")}`
      : null;

  const parts =
    locale === "en"
      ? [
          `${prop.walkingMinutes} min walk from the event spot`,
          metro,
          `${prop.neighborhood}: residential, well-connected Santiago neighborhood`,
          prop.isSuperhost
            ? "Airbnb Superhost"
            : "Book direct on Airbnb",
        ]
      : locale === "pt"
        ? [
            `${prop.walkingMinutes} min a pé do ponto do evento`,
            metro,
            `${prop.neighborhood}: bairro residencial e bem conectado em Santiago`,
            prop.isSuperhost
              ? "Anfitrião Superhost no Airbnb"
              : "Reserva direta no Airbnb",
          ]
        : null;

  if (!parts) return prop.pitch;
  return parts.filter(Boolean).join(" · ");
}

function localizeAdCopy(pack: CampaignPack, locale: Locale) {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;
  if (locale === "en") {
    return {
      headline: `${pack.eventTitle} · ${mins} min`.slice(0, 40),
      primaryText:
        `Apartment in Santiago near ${venue}. Metro + safe area + Airbnb. ${pack.eventDates}.`.slice(
          0,
          125,
        ),
      description: `~${mins} min · book on Airbnb`,
      cta: "Learn more",
      ctaB: "See options",
      descB: "Santiago · protected Airbnb",
      primaryB:
        `${pack.eventTitle}. ${pack.eventDates}. Safe neighborhood, metro nearby.`.slice(
          0,
          125,
        ),
    };
  }
  if (locale === "pt") {
    return {
      headline: `${pack.eventTitle} · ${mins} min`.slice(0, 40),
      primaryText:
        `Apto em Santiago perto de ${venue}. Metrô + bairro seguro + Airbnb. ${pack.eventDates}.`.slice(
          0,
          125,
        ),
      description: `~${mins} min · reserve no Airbnb`,
      cta: "Saiba mais",
      ctaB: "Ver opções",
      descB: "Santiago · Airbnb protegido",
      primaryB:
        `${pack.eventTitle}. ${pack.eventDates}. Bairro seguro, metrô perto.`.slice(
          0,
          125,
        ),
    };
  }
  return {
    headline: pack.adHeadline.slice(0, 40),
    primaryText: pack.adPrimaryText.slice(0, 125),
    description: `A ~${mins} min · reserva en Airbnb`,
    cta: "Más información",
    ctaB: "Ver opciones",
    descB: "Santiago · Airbnb protegido",
    primaryB:
      `${pack.eventTitle}. ${pack.eventDates}. Depto en barrio seguro, metro cerca.`.slice(
        0,
        125,
      ),
  };
}

export type LocalizedLanding = {
  locale: Locale;
  ui: Ui;
  headline: string;
  subhead: string;
  trustPoints: string[];
  properties: Array<
    CampaignPackProperty & { pitchLocalized: string; amenitiesLocalized: string[] }
  >;
  heroLine: string;
};

export function getLandingUi(locale: Locale): Ui {
  return UI[locale];
}

export function localizeLanding(
  pack: CampaignPack,
  locale: Locale,
): LocalizedLanding {
  const ui = UI[locale];
  const metros = [
    ...new Set(pack.properties.flatMap((p) => p.metroStations)),
  ];
  const barrioLead = pack.properties[0]?.neighborhood ?? "Santiago";
  const metroBit =
    metros.length > 0
      ? locale === "en"
        ? `Metro ${metros.slice(0, 2).join(" / ")} · `
        : locale === "pt"
          ? `Metrô ${metros.slice(0, 2).join(" / ")} · `
          : `Metro ${metros.slice(0, 2).join(" / ")} · `
      : "";

  return {
    locale,
    ui,
    headline: localizeHeadline(pack, locale),
    subhead: localizeSubhead(pack, locale),
    trustPoints: localizeTrust(pack, locale),
    heroLine: `${metroBit}${barrioLead} · ${ui.heroMetroSafe}`,
    properties: pack.properties.map((p) => ({
      ...p,
      pitchLocalized: localizePitch(p, locale),
      amenitiesLocalized: p.amenities.map((a) => tAmenity(a, locale)),
    })),
  };
}

export function localizedAdCreatives(
  pack: CampaignPack,
  locale: Locale,
): Array<{
  id: string;
  label: string;
  imageUrl: string;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
  locale: Locale;
}> {
  const lead = pack.properties[0];
  const photoA = lead?.photo ?? "";
  const photoB = pack.properties[1]?.photo || lead?.photos?.[1] || photoA;
  const copy = localizeAdCopy(pack, locale);
  const lang = locale.toUpperCase();
  return [
    {
      id: `${pack.slug}-creative-a-${locale}`,
      label: `A · ${lang}`,
      imageUrl: photoA,
      headline: copy.headline,
      primaryText: copy.primaryText,
      description: copy.description,
      cta: copy.cta,
      locale,
    },
    {
      id: `${pack.slug}-creative-b-${locale}`,
      label: `B · ${lang}`,
      imageUrl: photoB,
      headline: `${pack.venueName} · ${lead?.walkingMinutes ?? 15} min`.slice(
        0,
        40,
      ),
      primaryText: copy.primaryB,
      description: copy.descB,
      cta: copy.ctaB,
      locale,
    },
  ].filter((c) => Boolean(c.imageUrl));
}
