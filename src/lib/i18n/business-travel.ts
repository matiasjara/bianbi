import type { Locale } from "@/lib/i18n/locale";

export type BusinessZone = {
  id: string;
  name: string;
  blurb: string;
  goodFor: string[];
};

export type BusinessTripType = {
  id: string;
  title: string;
  body: string;
};

export type BusinessTravelUi = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  ctaStay: string;
  ctaEvents: string;
  modelTitle: string;
  modelBody: string;
  modelEventTitle: string;
  modelEventBody: string;
  modelEvergreenTitle: string;
  modelEvergreenBody: string;
  zonesTitle: string;
  zonesBody: string;
  tripsTitle: string;
  tripsBody: string;
  congressTitle: string;
  congressBody: string;
  congressEmpty: string;
  congressCta: string;
  stayTitle: string;
  stayBody: string;
  mapTitle: string;
  mapBody: string;
  closeTitle: string;
  closeBody: string;
  footerNote: string;
};

const UI: Record<Locale, BusinessTravelUi> = {
  es: {
    metaTitle: "Viaje de trabajo a Santiago — dónde alojarte",
    metaDescription:
      "Reuniones, congresos o semana de proyecto en Santiago: zonas, movilidad y departamentos full equipados cerca de oficinas y recintos MICE.",
    eyebrow: "Negocios · Santiago",
    headline: "Tu base en Santiago cuando vienes a trabajar",
    subhead:
      "No siempre hay un concierto o un partido: a veces es una reunión, una feria o una semana de proyecto. Esta guía es para eso — sin depender de un evento puntual.",
    ctaStay: "Ver alojamientos",
    ctaEvents: "Guías por evento",
    modelTitle: "Dos formas de usar Crambie",
    modelBody:
      "El viaje corporativo se divide en dos intenciones distintas. Conviene tratarlas por separado.",
    modelEventTitle: "Vienes por un congreso o feria con fecha",
    modelEventBody:
      "Ejemplo: FIDAE, Expo Salud, Edifica. Ahí sí tiene sentido una guía por evento: venue, fechas, transporte y dónde dormir cerca del recinto.",
    modelEvergreenTitle: "Vienes por reuniones, oficina o proyecto",
    modelEvergreenBody:
      "Ejemplo: juntas en Las Condes, visita a cliente, workation de una semana. No hay ticketera ni cartelera — necesitas zona, conectividad y estadía flexible.",
    zonesTitle: "Elige zona según tu agenda",
    zonesBody:
      "En Santiago la distancia importa en hora punta. Prioriza dormir cerca de donde trabajarás, no solo del aeropuerto.",
    tripsTitle: "Tipo de viaje",
    tripsBody:
      "La duración y el tamaño del equipo cambian qué conviene reservar.",
    congressTitle: "¿Coincide con un congreso o feria?",
    congressBody:
      "Si tus fechas calzan con alguno de estos eventos, la guía específica suma detalle de venue y movilidad.",
    congressEmpty: "Revisa el calendario del home para ferias y congresos del mes.",
    congressCta: "Ver guía",
    stayTitle: "Alojamientos para viaje de trabajo",
    stayBody:
      "Departamentos full equipados en barrios bien conectados: WiFi, cocina y metro cerca para moverte a reuniones sin depender de hotel.",
    mapTitle: "Ubicación de los alojamientos",
    mapBody: "Barrio Italia, Ñuñoa y Santiago Centro — base práctica para oriente y centro.",
    closeTitle: "Reserva con calma, llega preparado",
    closeBody:
      "Filtramos opciones en Airbnb con buena conectividad. Tú reservas directo; nosotros te ayudamos a elegir la zona correcta.",
    footerNote: "Guía de viaje de negocios · alojamiento independiente en Santiago",
  },
  en: {
    metaTitle: "Business travel to Santiago — where to stay",
    metaDescription:
      "Meetings, trade shows or project weeks in Santiago: neighborhoods, mobility and fully equipped apartments near offices and MICE venues.",
    eyebrow: "Business · Santiago",
    headline: "Your Santiago base for work trips",
    subhead:
      "It is not always a concert or a match — sometimes it is a meeting, a fair or a project week. This guide is for that, without tying you to one public event.",
    ctaStay: "See stays",
    ctaEvents: "Event guides",
    modelTitle: "Two ways to use Crambie",
    modelBody: "Corporate travel splits into two intents. Treat them separately.",
    modelEventTitle: "You come for a dated congress or trade show",
    modelEventBody:
      "Example: FIDAE, Expo Salud, Edifica. An event guide makes sense: venue, dates, transport and stays near the venue.",
    modelEvergreenTitle: "You come for meetings, office or a project",
    modelEvergreenBody:
      "Example: meetings in Las Condes, client visits, a one-week workation. No ticket office — you need the right area, connectivity and flexible length of stay.",
    zonesTitle: "Pick an area for your schedule",
    zonesBody:
      "In Santiago rush hour matters. Sleep near where you work, not only near the airport.",
    tripsTitle: "Trip profile",
    tripsBody: "Duration and team size change what you should book.",
    congressTitle: "Overlaps with a congress or fair?",
    congressBody:
      "If your dates match one of these, the specific guide adds venue and mobility detail.",
    congressEmpty: "Check the home calendar for this month's fairs and congresses.",
    congressCta: "Open guide",
    stayTitle: "Stays for business travel",
    stayBody:
      "Fully equipped apartments in well-connected neighborhoods: WiFi, kitchen and metro nearby for meetings without generic hotel friction.",
    mapTitle: "Where the stays are",
    mapBody: "Barrio Italia, Ñuñoa and downtown Santiago — practical bases for the east side and center.",
    closeTitle: "Book calmly, arrive ready",
    closeBody:
      "We surface Airbnb options with solid connectivity. You book direct; we help you pick the right area.",
    footerNote: "Business travel guide · independent stays in Santiago",
  },
  pt: {
    metaTitle: "Viagem a trabalho em Santiago — onde ficar",
    metaDescription:
      "Reuniões, feiras ou semana de projeto em Santiago: bairros, mobilidade e apartamentos equipados perto de escritórios e centros MICE.",
    eyebrow: "Negócios · Santiago",
    headline: "Sua base em Santiago quando vem a trabalhar",
    subhead:
      "Nem sempre é show ou jogo — às vece é reunião, feira ou semana de projeto. Este guia é para isso, sem depender de um evento fixo na cartaz.",
    ctaStay: "Ver acomodações",
    ctaEvents: "Guias por evento",
    modelTitle: "Duas formas de usar o Crambie",
    modelBody:
      "A viagem corporativa se divide em duas intenções. Vale tratá-las separadamente.",
    modelEventTitle: "Você vem por congresso ou feira com data",
    modelEventBody:
      "Exemplo: FIDAE, Expo Salud, Edifica. Aí faz sentido um guia por evento: venue, datas, transporte e onde dormir perto.",
    modelEvergreenTitle: "Você vem por reuniões, escritório ou projeto",
    modelEvergreenBody:
      "Exemplo: reuniões em Las Condes, visita a cliente, workation de uma semana. Sem ticketera — você precisa de zona, conectividade e estadia flexível.",
    zonesTitle: "Escolha a zona pela sua agenda",
    zonesBody:
      "Em Santiago o trânsito importa. Durma perto de onde vai trabalhar, não só do aeroporto.",
    tripsTitle: "Perfil da viagem",
    tripsBody: "Duração e tamanho da equipe mudam o que convém reservar.",
    congressTitle: "Coincide com congresso ou feira?",
    congressBody:
      "Se suas datas batem com algum destes, o guia específico traz detalhe de venue e mobilidade.",
    congressEmpty: "Veja o calendário da home para feiras e congressos do mês.",
    congressCta: "Ver guia",
    stayTitle: "Acomodações para viagem a trabalho",
    stayBody:
      "Apartamentos equipados em bairros bem conectados: WiFi, cozinha e metrô perto para reuniões sem atrito de hotel genérico.",
    mapTitle: "Onde ficam as acomodações",
    mapBody: "Barrio Italia, Ñuñoa e centro de Santiago — bases práticas para oriente e centro.",
    closeTitle: "Reserve com calma, chegue preparado",
    closeBody:
      "Selecionamos opções no Airbnb com boa conectividade. Você reserva direto; nós ajudamos a escolher a zona certa.",
    footerNote: "Guia de viagem de negócios · acomodação independente em Santiago",
  },
};

const ZONES: Record<Locale, BusinessZone[]> = {
  es: [
    {
      id: "oriente",
      name: "Las Condes / Providencia",
      blurb: "Reuniones corporativas, oficinas y cenas de trabajo.",
      goodFor: ["Reuniones 1–3 días", "Visitas a clientes", "Viaje solo o pareja"],
    },
    {
      id: "mice",
      name: "Huechuraba / Vitacura (MICE)",
      blurb: "Cerca de Espacio Riesco, Metropolitan y aeropuerto.",
      goodFor: ["Congresos y ferias", "Delegaciones", "Primer día desde SCL"],
    },
    {
      id: "centro",
      name: "Centro / Lastarria / Italia",
      blurb: "Buen equilibrio precio–conectividad y vida de barrio.",
      goodFor: ["Proyectos de varios días", "Equipos pequeños", "Workation"],
    },
    {
      id: "nunoa",
      name: "Ñuñoa / oriente accesible",
      blurb: "Metro directo a líneas hacia Providencia y centro.",
      goodFor: ["Estadía semanal", "Presupuesto más eficiente", "Teletrabajo"],
    },
  ],
  en: [
    {
      id: "oriente",
      name: "Las Condes / Providencia",
      blurb: "Corporate meetings, offices and working dinners.",
      goodFor: ["1–3 day meetings", "Client visits", "Solo or pair travel"],
    },
    {
      id: "mice",
      name: "Huechuraba / Vitacura (MICE)",
      blurb: "Near Espacio Riesco, Metropolitan and the airport.",
      goodFor: ["Congress and fairs", "Delegations", "First night from SCL"],
    },
    {
      id: "centro",
      name: "Downtown / Lastarria / Italia",
      blurb: "Good balance of price, connectivity and neighborhood life.",
      goodFor: ["Multi-day projects", "Small teams", "Workation"],
    },
    {
      id: "nunoa",
      name: "Ñuñoa / accessible east side",
      blurb: "Metro with direct lines toward Providencia and downtown.",
      goodFor: ["Weekly stays", "Better value", "Remote work"],
    },
  ],
  pt: [
    {
      id: "oriente",
      name: "Las Condes / Providencia",
      blurb: "Reuniões corporativas, escritórios e jantares de trabalho.",
      goodFor: ["Reuniões 1–3 dias", "Visitas a clientes", "Viagem solo ou casal"],
    },
    {
      id: "mice",
      name: "Huechuraba / Vitacura (MICE)",
      blurb: "Perto de Espacio Riesco, Metropolitan e aeroporto.",
      goodFor: ["Congressos e feiras", "Delegações", "Primeira noite vindo de SCL"],
    },
    {
      id: "centro",
      name: "Centro / Lastarria / Italia",
      blurb: "Bom equilíbrio preço–conectividade e vida de bairro.",
      goodFor: ["Projetos de vários dias", "Equipes pequenas", "Workation"],
    },
    {
      id: "nunoa",
      name: "Ñuñoa / oriente acessível",
      blurb: "Metrô com linhas diretas a Providencia e centro.",
      goodFor: ["Estadia semanal", "Melhor custo", "Teletrabalho"],
    },
  ],
};

const TRIPS: Record<Locale, BusinessTripType[]> = {
  es: [
    {
      id: "fly-in",
      title: "Reunión express (1–2 noches)",
      body: "Prioriza check-in flexible, WiFi estable y cercanía al metro. Evita cruzar la ciudad en hora punta dos veces al día.",
    },
    {
      id: "week",
      title: "Semana de proyecto",
      body: "Un departamento con cocina y escritorio suele rendir más que hotel: mismo equipo, menos fricción y mejor costo por noche.",
    },
    {
      id: "fair-plus",
      title: "Feria + reuniones extra",
      body: "Si el congreso es solo parte del viaje, combina la guía del evento con esta base: feria en Huechuraba, reuniones en oriente.",
    },
  ],
  en: [
    {
      id: "fly-in",
      title: "Express meeting (1–2 nights)",
      body: "Prioritize flexible check-in, stable WiFi and metro access. Avoid crossing the city at rush hour twice a day.",
    },
    {
      id: "week",
      title: "Project week",
      body: "An apartment with kitchen and desk often beats a hotel: same team, less friction, better nightly value.",
    },
    {
      id: "fair-plus",
      title: "Fair + extra meetings",
      body: "If the congress is only part of the trip, combine the event guide with this base: fair in Huechuraba, meetings on the east side.",
    },
  ],
  pt: [
    {
      id: "fly-in",
      title: "Reunião express (1–2 noites)",
      body: "Priorize check-in flexível, WiFi estável e metrô perto. Evite atravessar a cidade no horário de pico duas vezes ao dia.",
    },
    {
      id: "week",
      title: "Semana de projeto",
      body: "Um apartamento com cozinha e mesa de trabalho costuma valer mais que hotel: mesma equipe, menos atrito.",
    },
    {
      id: "fair-plus",
      title: "Feira + reuniões extras",
      body: "Se o congresso é só parte da viagem, combine o guia do evento com esta base: feira em Huechuraba, reuniões no oriente.",
    },
  ],
};

export function getBusinessTravelUi(locale: Locale): BusinessTravelUi {
  return UI[locale];
}

export function getBusinessZones(locale: Locale): BusinessZone[] {
  return ZONES[locale];
}

export function getBusinessTripTypes(locale: Locale): BusinessTripType[] {
  return TRIPS[locale];
}
