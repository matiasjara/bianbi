# Bianbi

Generación de demanda para renta corta. Tres módulos:

1. **Propiedades** — inventario real Airbnb  
2. **Demanda** — feriados + scrape Playwright + estacionalidad → calendario de peaks
3. **Campañas** — sugerencias derivadas de esos peaks

La app es **privada** (contraseña). Solo las landings `/c/[slug]` son públicas.

```bash
cp .env.example .env.local
# define AUTH_PASSWORD y AUTH_SECRET
npm install
npm run ingest:events
npm run ingest
npm run dev
```

- `/login` — acceso
- `/propiedades` · `/demanda` · `/campanas` — privado
- `/c/[slug]` — landing pública
