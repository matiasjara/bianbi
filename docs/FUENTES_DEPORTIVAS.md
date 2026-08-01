# Fuentes de demanda deportiva (Santiago)

Objetivo: detectar competencias donde **gente de regiones / delegaciones** viaja a Santiago (Estadio Nacional, Peñalolén, arenas) para armar campañas **mailing-first**.

## Cómo funciona

| Capa | Comando | Salida |
|------|---------|--------|
| Scrapers activos | `npm run ingest:events` | `data/ingested/events.json` |
| Radar web/RSS | `npm run ingest:discover` | `data/ingested/discovery.json` |
| Fusión demanda | `npm run ingest` | `signals.json` |
| UI | `/fuentes` | Catálogo + últimos discovery |

Catálogo tipado: `src/lib/demand/source-catalog.ts`  
Registry scrapers: `scripts/ingest/sources/registry.ts`

## Activas (scrape continuo)

- ANFP / Campeonato Chileno  
- IND grandes eventos  
- Club Atlético Santiago (interescolares)  
- **FEDACHI** API calendario (`/api/calendar`) — nacionales en Santiago  
- **FEHOCH** torneos Clupik  
- **FEVOCHI** Mundial U17 + RSS  
- Ticketmaster / PuntoTicket / TicketPlus / Tocador (+ Passline watch)

## Candidatas (siguientes a cablear)

- [LNB Chile](https://lnbchile.com/) — Súper 8 / finales Santiago  
- [SIVOLEY](https://sivoley.cl/) — fixture LINAME / Liga A2  
- Parque Estadio Nacional (agenda transversal)  
- COCH / Team Chile  
- FEBACHI / chilebasket  
- Instagram federaciones (sin API estable → monitoreo + discovery)  
- Google Alerts con queries de interescolar / nacional / sede Santiago  

## Método discovery

1. RSS IND + FEVOCHI (y ampliar feeds)  
2. Búsquedas DuckDuckGo HTML con queries fijas de demanda regional→RM  
3. Clasificación: `promote_sport` | `review` | `ignore_likely`  
4. Revisar en `/fuentes` → promover a scraper curado o catálogo

## Playbook

| Señal | Canal |
|-------|--------|
| Interescolar / nacional federado / visita regiones | mailing + SEO |
| Mundial / Davis / FIH / mega show | hybrid o ads |
| Concierto mega | ads heavy |
