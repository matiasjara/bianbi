/**
 * Abstracción EventSource — cada scraper en scripts/ingest/sources/* implementa esto.
 */
import type { SourceResult } from "../lib/signal-utils";

export interface EventSource {
  /** Identificador estable (ej. puntoticket, fehoch_tournaments). */
  id: string;
  /** Etiqueta legible para logs y admin. */
  label: string;
  fetch(): Promise<SourceResult>;
}

export interface PlaywrightEventSource extends EventSource {
  fetchWithPage(page: import("playwright").Page): Promise<SourceResult>;
}
