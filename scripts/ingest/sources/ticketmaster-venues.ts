/**
 * @deprecated Import from ../lib/nearby-venues — re-export por compatibilidad.
 */
export {
  type NearbyVenue as TicketmasterVenue,
  NEARBY_VENUES as NEARBY_TICKETMASTER_VENUES,
  matchNearbyVenue as matchTicketmasterVenue,
} from "../lib/nearby-venues";

import { NEARBY_VENUES, type NearbyVenue } from "../lib/nearby-venues";

export const TICKETMASTER_CATEGORY_PAGES = [
  "musica",
  "deportes",
  "artes-y-teatro",
] as const;

export function venueByPageSlug(slug: string): NearbyVenue | undefined {
  return NEARBY_VENUES.find((v) => v.ticketmasterPageSlug === slug);
}

export function venuePageUrls(): Array<{
  slug: string;
  url: string;
  venue: NearbyVenue;
}> {
  return NEARBY_VENUES.filter((v) => v.ticketmasterPageSlug).map((venue) => ({
    slug: venue.ticketmasterPageSlug!,
    url: `https://www.ticketmaster.cl/page/${venue.ticketmasterPageSlug}`,
    venue,
  }));
}
