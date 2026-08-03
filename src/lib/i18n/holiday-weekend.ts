import type { Locale } from "@/lib/i18n/locale";

export type SantiagoPlan = {
  id: string;
  name: string;
  blurb: string;
  icon: "camera" | "music" | "pin" | "sunrise";
};

export type HolidayWeekendUi = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  ctaStay: string;
  ctaEvents: string;
  audienceTitle: string;
  audienceBody: string;
  bridgesTitle: string;
  bridgesBody: string;
  bridgesDays: (n: number) => string;
  plansTitle: string;
  plansBody: string;
  eventsTitle: string;
  eventsBody: string;
  eventsEmpty: string;
  eventsCta: string;
  tipsTitle: string;
  tips: string[];
  stayTitle: string;
  stayBody: string;
  mapTitle: string;
  mapBody: string;
  closeTitle: string;
  closeBody: string;
  footerNote: string;
};

const UI: Record<Locale, HolidayWeekendUi> = {
  es: {
    metaTitle: "Feriado en Santiago — escapada desde regiones",
    metaDescription:
      "Fin de semana largo en Santiago: próximos feriados, qué hacer, eventos del momento y departamentos en barrios caminables. Ideal si vienes desde regiones.",
    eyebrow: "Feriado · Santiago",
    headline: "Escapada a Santiago en fin de semana largo",
    subhead:
      "Si vienes desde regiones por un feriado, lo que importa es aprovechar bien 2–4 días: dónde dormir, qué hacer cerca y si hay conciertos o partidos en esas fechas.",
    ctaStay: "Ver alojamientos",
    ctaEvents: "Calendario de eventos",
    audienceTitle: "Hecho para quien viene de fuera de Santiago",
    audienceBody:
      "No necesitas un evento específico: mucha gente sube en feriados prolongados por panoramas urbanos, comida, shows y paseos. Esta guía es ese caso — distinto a un viaje de trabajo o a una guía de un solo concierto.",
    bridgesTitle: "Próximos feriados y fines de semana largos",
    bridgesBody:
      "Feriados oficiales con los días adyacentes que suelen tomarse para viajar. Reserva con anticipación en las fechas marcadas como alta demanda.",
    bridgesDays: (n) => `${n} día${n === 1 ? "" : "s"}`,
    plansTitle: "Qué hacer en Santiago (sin auto)",
    plansBody:
      "Barrios caminables y metro: combina 2–3 por día según dónde te quedes.",
    eventsTitle: "Eventos en esas fechas",
    eventsBody:
      "Si viajas en esas fechas y coincide un concierto, partido o feria, suma la guía del evento al plan.",
    eventsEmpty: "Revisa el calendario del home para el mes de tu viaje.",
    eventsCta: "Ver guía",
    tipsTitle: "Tips para regiones",
    tips: [
      "Reserva alojamiento antes en Fiestas Patrias y Año Nuevo: sube la demanda y el precio.",
      "Prioriza barrio con metro: evitas depender de auto y estacionamiento en feriados.",
      "Combina día cultural (Lastarria / Italia) con noche de show si hay cartelera.",
      "Bus o avión según distancia; desde muchas ciudades el bus nocturno rinde para 3 días.",
    ],
    stayTitle: "Dónde quedarte el fin de semana largo",
    stayBody:
      "Departamentos full equipados en Italia, Ñuñoa y Centro: cocina, WiFi y base para moverte en metro todo el fin de semana.",
    mapTitle: "Ubicación de los alojamientos",
    mapBody: "Puntos de referencia y deptos — Santiago como ciudad, no solo un venue.",
    closeTitle: "Arma tu escapada de feriado en Santiago",
    closeBody:
      "Elige fechas, mira si hay evento que te interese y reserva un depto conectado. Tú pagas en Airbnb; nosotros te orientamos.",
    footerNote: "Escapadas en feriado · alojamiento independiente en Santiago",
  },
  en: {
    metaTitle: "Long weekend in Santiago — escape from other regions",
    metaDescription:
      "Chilean holiday long weekends in Santiago: upcoming bridges, things to do, events and apartments in walkable neighborhoods.",
    eyebrow: "Holiday · Santiago",
    headline: "Santiago getaway on a long weekend",
    subhead:
      "Traveling from other regions for a public holiday? Make the most of 2–4 days: where to stay, what's nearby, and whether concerts or matches fall on your dates.",
    ctaStay: "See stays",
    ctaEvents: "Event calendar",
    audienceTitle: "Built for visitors from outside Santiago",
    audienceBody:
      "You do not need one specific event: many people visit on bridges for food, neighborhoods, shows and city walks. Different from business travel or a single concert guide.",
    bridgesTitle: "Upcoming long weekends",
    bridgesBody:
      "Official holidays grouped into escape windows (includes adjacent weekends when relevant). Book early on major bridges.",
    bridgesDays: (n) => `${n} day${n === 1 ? "" : "s"}`,
    plansTitle: "What to do in Santiago (without a car)",
    plansBody: "Walkable neighborhoods and metro — combine 2–3 per day.",
    eventsTitle: "Events on those dates",
    eventsBody: "If your bridge overlaps a concert, match or fair, add that event guide.",
    eventsEmpty: "Check the home calendar for your travel month.",
    eventsCta: "Open guide",
    tipsTitle: "Tips for regional travelers",
    tips: [
      "Book early for Fiestas Patrias and New Year — demand and prices spike.",
      "Stay near metro lines to skip holiday traffic and parking.",
      "Mix a cultural day (Lastarria / Italia) with a show if something is on.",
      "Bus or flight by distance; overnight bus works well for 3-day trips from many cities.",
    ],
    stayTitle: "Where to stay for the bridge",
    stayBody:
      "Fully equipped apartments in Italia, Ñuñoa and downtown — kitchen, WiFi and a metro-friendly base.",
    mapTitle: "Stay locations",
    mapBody: "Landmarks and apartments — Santiago as a city, not only a venue.",
    closeTitle: "Plan your Santiago bridge",
    closeBody:
      "Pick dates, check for events you like, and book a connected apartment. You pay on Airbnb; we help you choose.",
    footerNote: "Holiday escapes · independent stays in Santiago",
  },
  pt: {
    metaTitle: "Feriado em Santiago — escapada de outras regiões",
    metaDescription:
      "Fins de semana prolongados em Santiago: próximos feriados, o que fazer, eventos e apartamentos em bairros caminháveis.",
    eyebrow: "Feriado · Santiago",
    headline: "Escapada a Santiago no feriado prolongado",
    subhead:
      "Vindo de outras regiões? Aproveite 2–4 dias: onde ficar, o que fazer perto e se há shows ou jogos nas suas datas.",
    ctaStay: "Ver acomodações",
    ctaEvents: "Calendário de eventos",
    audienceTitle: "Feito para quem vem de fora de Santiago",
    audienceBody:
      "Não precisa de um evento único: muita gente sobe nos feriados por gastronomia, bairros e passeios. Diferente de viagem a trabalho ou guia de um show só.",
    bridgesTitle: "Próximos feriados prolongados",
    bridgesBody:
      "Feriados oficiais agrupados em janelas de viagem. Reserve cedo nos feriados principais.",
    bridgesDays: (n) => `${n} dia${n === 1 ? "" : "s"}`,
    plansTitle: "O que fazer em Santiago (sem carro)",
    plansBody: "Bairros caminháveis e metrô — combine 2–3 por dia.",
    eventsTitle: "Eventos nessas datas",
    eventsBody: "Se o feriado coincide com show ou jogo, some a guia do evento.",
    eventsEmpty: "Veja o calendário da home no mês da viagem.",
    eventsCta: "Ver guia",
    tipsTitle: "Dicas para quem vem de regiones",
    tips: [
      "Reserve cedo nas Fiestas Patrias e Ano-Novo.",
      "Prefira bairro com metrô para evitar trânsito de feriado.",
      "Misture dia cultural (Lastarria / Italia) com show se houver cartaz.",
      "Ônibus ou voo conforme a distância; bus noturno funciona bem para 3 dias.",
    ],
    stayTitle: "Onde ficar no feriado",
    stayBody:
      "Apartamentos equipados em Italia, Ñuñoa e centro — cozinha, WiFi e base com metrô.",
    mapTitle: "Localização das acomodações",
    mapBody: "Referências e apartamentos — Santiago como cidade.",
    closeTitle: "Monte seu feriado em Santiago",
    closeBody:
      "Escolha datas, veja eventos e reserve um apartamento conectado. Você paga no Airbnb; nós orientamos.",
    footerNote: "Escapadas de feriado · acomodação independente em Santiago",
  },
};

const PLANS: Record<Locale, SantiagoPlan[]> = {
  es: [
    {
      id: "italia",
      name: "Barrio Italia",
      blurb: "Cafés, diseño, anticuarios y cenas sin formalidad.",
      icon: "camera",
    },
    {
      id: "lastarria",
      name: "Lastarria & Centro",
      blurb: "Museos, Santa Lucía, teatro y vida nocturna caminable.",
      icon: "pin",
    },
    {
      id: "shows",
      name: "Show o partido",
      blurb: "Revisa el calendario: a veces el feriado coincide con Movistar o Estadio Nacional.",
      icon: "music",
    },
    {
      id: "costanera",
      name: "Oriente & Costanera",
      blurb: "Mirador, parque y restaurantes — buen plan de día soleado.",
      icon: "sunrise",
    },
  ],
  en: [
    {
      id: "italia",
      name: "Barrio Italia",
      blurb: "Cafés, design shops and relaxed dinners.",
      icon: "camera",
    },
    {
      id: "lastarria",
      name: "Lastarria & downtown",
      blurb: "Museums, Santa Lucía hill and walkable nightlife.",
      icon: "pin",
    },
    {
      id: "shows",
      name: "Show or match",
      blurb: "Check the calendar — bridges often overlap arena or stadium events.",
      icon: "music",
    },
    {
      id: "costanera",
      name: "East side & Costanera",
      blurb: "Skyline views, parks and restaurants on sunny days.",
      icon: "sunrise",
    },
  ],
  pt: [
    {
      id: "italia",
      name: "Barrio Italia",
      blurb: "Cafés, design e jantares informais.",
      icon: "camera",
    },
    {
      id: "lastarria",
      name: "Lastarria e centro",
      blurb: "Museus, Santa Lucía e vida noturna a pé.",
      icon: "pin",
    },
    {
      id: "shows",
      name: "Show ou jogo",
      blurb: "Veja o calendário — feriados às vezes coincidem com arena ou estádio.",
      icon: "music",
    },
    {
      id: "costanera",
      name: "Oriente e Costanera",
      blurb: "Mirante, parque e restaurantes em dia de sol.",
      icon: "sunrise",
    },
  ],
};

export function getHolidayWeekendUi(locale: Locale): HolidayWeekendUi {
  return UI[locale];
}

export function getSantiagoHolidayPlans(locale: Locale): SantiagoPlan[] {
  return PLANS[locale];
}
