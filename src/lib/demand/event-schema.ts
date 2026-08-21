import type { CampaignPack } from "./types";
import type { EventRecord } from "./types";

type EventSchemaInput = {
  locale: string;
  pack: CampaignPack;
  record: EventRecord;
  seoTitle: string;
  seoDescription: string;
  guideTitle: string;
  eventTitle: string;
  venueName: string;
  siteUrl: string;
};

function eventStatus(lifecycle: EventRecord["lifecycleStatus"]): string {
  switch (lifecycle) {
    case "CANCELLED":
      return "https://schema.org/EventCancelled";
    case "COMPLETED":
    case "POST_EVENT":
      return "https://schema.org/EventScheduled";
    case "ONGOING":
    case "UPCOMING":
    default:
      return "https://schema.org/EventScheduled";
  }
}

export function buildEventJsonLd(input: EventSchemaInput) {
  const { pack, record, seoDescription, eventTitle, venueName, siteUrl } = input;
  const event: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventTitle,
    description: seoDescription,
    startDate: pack.eventStartsOn,
    endDate: pack.eventEndsOn,
    eventStatus: eventStatus(record.lifecycleStatus),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: venueName,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Santiago",
        addressCountry: "CL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: pack.venueLat,
        longitude: pack.venueLng,
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Crambie",
      url: siteUrl,
    },
    url: `${siteUrl}/eventos/${record.slug}`,
  };

  if (pack.eventUrl) {
    event.offers = {
      "@type": "Offer",
      url: pack.eventUrl,
      availability: "https://schema.org/InStock",
    };
  }

  return event;
}

export function buildEventBreadcrumbJsonLd(input: {
  siteUrl: string;
  record: EventRecord;
  eventTitle: string;
}) {
  const { siteUrl, record, eventTitle } = input;
  const discipline = record.eventType;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Eventos",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: discipline,
        item: `${siteUrl}/?tipo=${discipline}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: eventTitle,
        item: `${siteUrl}/eventos/${record.slug}`,
      },
    ],
  };
}
