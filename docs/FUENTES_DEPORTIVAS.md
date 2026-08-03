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
- **FEVOCHI** Mundial U17 + RSS + directorio asociaciones regionales
- Ticketmaster / PuntoTicket / TicketPlus / Tocador (+ Passline watch)

## Voleibol — mapa de fuentes

En Chile el vóleibol es **centralizado en FEVOCHI**. No hay federaciones paralelas por región: hay **~35 asociaciones** afiliadas que agrupan clubes locales.

| Capa | Qué es | URL | Uso en demandEngine |
|------|--------|-----|---------------------|
| **Federación** | FEVOCHI (torneos nacionales, selecciones) | [fevochi.cl](https://www.fevochi.cl/) · `info@fevochi.cl` | Scraper RSS + Mundial U17; mailing central |
| **Fixture nacional** | SIVOLEY (LINAME, Liga A2 piso) | [sivoley.cl](https://sivoley.cl/) | **Candidato** — requiere login; lista competencias públicas en home |
| **Asociaciones regionales** | Contacto por región (clubes afiliados) | [fevochi.cl/asociaciones](https://www.fevochi.cl/asociaciones/) | Directorio outreach (`volleyball-organizations.ts`) |
| **Torneos nacionales** | LINAME (menores), Liga A2, CNVP (playa) | Noticias en fevochi.cl/liname, /ligaa2, /cnvp | RSS FEVOCHI + curación manual de sedes RM |
| **Mega-eventos** | Mundial U17 2026, IND | fevochi.cl + ind.cl | Catálogo curado |
| **Clubes** | Boston College, Manquehue, UC, ARV, Stadio Italiano… | Aparecen en grupos LINAME/A2 (noticias FEVOCHI) | Sin directorio único — inferir desde SIVOLEY o noticias |
| **Plataforma jugadores** | USPLAT | Mencionada por FEVOCHI 2024 | Perfiles/stats; no calendario público obvio |

**RM — asociaciones con sede en Santiago (viajan clubes de regiones a sus fechas):**
- Asociación Santiago — `asovoleibolsantiago@gmail.com`
- Puente Alto, San Bernardo, Quilicura (LVQ), Pudahuel

**Emails útiles FEVOCHI:**
- General: `info@fevochi.cl`
- LINAME playa: `linameplaya@fevochi.cl`
- SIVOLEY soporte: tel. +56 9 6665 64652 (mismo contacto coordinación Santiago)

**Próximo paso técnico:** cablear scraper SIVOLEY (fixture LINAME/A2 filtrado por cancha en RM) o ampliar curación en `fevochi.ts` cuando publiquen sedes de fase clasificatoria.

## Candidatas (siguientes a cablear)

- [LNB Chile](https://lnbchile.com/) — Súper 8 / finales Santiago  
- [SIVOLEY](https://sivoley.cl/) — fixture LINAME / Liga A2 (login wall)  
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
