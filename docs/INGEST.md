# Fuentes de eventos (Chile)

La ingesta **no depende de una sola ticketera**. Cada fuente normaliza a `DemandSignal`.

| Fuente | Script | Método | Notas |
|--------|--------|--------|-------|
| **Ticketmaster CL** | `sources/ticketmaster.ts` + `ticketmaster-venues.ts` | Fetch venue + búsqueda | Solo venues ≤ ~5 km del inventario (Nacional, Movistar, O'Higgins, Caupolicán…) |
| **PuntoTicket** | `sources/puntoticket.ts` + `lib/nearby-venues.ts` | Playwright venue + /todos | Movistar Arena, Caupolicán, Coliseo + filtro RM cercana |
| **TicketPlus CL** | `sources/ticketplus.ts` | Fetch JSON | `/events/search.json` — teatros/shows/deportes RM |
| **Tocador** | `sources/tocador.ts` | Fetch HTML | Agenda editorial con venue + ticketera |
| **Passline** | `sources/passline.ts` | Playwright | A menudo Cloudflare (falla sin tumbar el pipeline) |
| **Campeonato Chileno (ANFP)** | `sources/campeonato-chileno.ts` | Fetch HTML | Localía Santiago; visita regiones → mailing |
| **IND grandes eventos** | `sources/ind-grandes-eventos.ts` | Fetch + catálogo | Copa Davis, Panamericano pista, Chile Open, FIH Qualifiers |
| **Club Atlético Santiago** | `sources/club-atletico-santiago.ts` | Fetch HTML | Torneos/interescolares en Estadio Nacional y RM |
| **FEDACHI** | `sources/fedachi.ts` | API JSON | Calendario atletismo, filtro Santiago |
| **FEHOCH torneos** | `sources/fehoch-tournaments.ts` | Fetch HTML | Torneos nacionales hockey |
| **FEVOCHI** | `sources/fevochi.ts` | Catálogo + RSS | Mundial U17 + noticias competencia |
| **Discovery** | `discover.ts` | RSS + DuckDuckGo | Candidatos → `discovery.json` / UI `/fuentes` |
| Feriados | `feriados.ts` | API Nager | Oficiales Chile |
| Estacionalidad | `seasonality.ts` | Reglas | Nieve BR, Fiestas Patrias, etc. |

Mapa completo: [`docs/FUENTES_DEPORTIVAS.md`](./FUENTES_DEPORTIVAS.md) · catálogo tipado `src/lib/demand/source-catalog.ts`.

### Playbooks de campaña

| Señal | Playbook | Canales |
|-------|----------|---------|
| Mega show (BTS, Lolla…) | `ads_heavy` | Google + Meta + PMax |
| Partido con visita de regiones | `mailing_first` | Mailing / WhatsApp (+ SEO) |
| Clásico / final | `hybrid` | Mailing + Search/Meta ligero |

```bash
npm run ingest:events     # multi-fuente (registry)
npm run ingest:discover   # radar RSS + web → discovery.json
npm run ingest            # fusiona con feriados + estacionalidad
```

## Próximas fuentes candidatas

Ver catálogo en `/fuentes` y `docs/FUENTES_DEPORTIVAS.md` (LNB, SIVOLEY, Parque Estadio Nacional, IG, Google Alerts…).

Si una fuente bloquea bots, el resto sigue. El calendario de `/demanda` no se cae.
