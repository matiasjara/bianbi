/**
 * Registry de scrapers activos del pipeline de eventos.
 * El mapa completo (activas + candidatas) vive en src/lib/demand/source-catalog.ts
 */
import type { Page } from "playwright";
import type { SourceResult } from "../lib/signal-utils";
import { scrapeCampeonatoChileno } from "./campeonato-chileno";
import { scrapeClubAtleticoSantiago } from "./club-atletico-santiago";
import { scrapeCongresosFerias } from "./congresos-ferias";
import { scrapeFedachi } from "./fedachi";
import { scrapeFehochTournaments } from "./fehoch-tournaments";
import { scrapeFevochi } from "./fevochi";
import { scrapeIndGrandesEventos } from "./ind-grandes-eventos";
import { scrapePassline } from "./passline";
import { scrapePuntoTicket } from "./puntoticket";
import { scrapeTicketmaster } from "./ticketmaster";
import { scrapeTicketPlus } from "./ticketplus";
import { scrapeTocador } from "./tocador";

export type FetchRunner = () => Promise<SourceResult>;
export type PlaywrightRunner = (page: Page) => Promise<SourceResult>;

export const FETCH_SOURCES: FetchRunner[] = [
  scrapeTocador,
  scrapeTicketPlus,
  scrapeCampeonatoChileno,
  scrapeIndGrandesEventos,
  scrapeCongresosFerias,
  scrapeClubAtleticoSantiago,
  scrapeFedachi,
  scrapeFehochTournaments,
  scrapeFevochi,
];

export const PLAYWRIGHT_SOURCES: PlaywrightRunner[] = [
  scrapeTicketmaster,
  scrapePuntoTicket,
  scrapePassline,
];
