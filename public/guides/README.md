# Imágenes de apoyo para guías

Fotos editoriales usadas en cards del home y polaroids de micrositios.
Resolver: `src/lib/demand/guide-images.ts`.

## Carpetas

| Carpeta | Uso |
|---------|-----|
| `nieve/` | Ski / cordillera |
| `deportes/` | Fútbol, hockey, rugby, vóleibol, atletismo, estadios |
| `conciertos/` | Shows, Movistar Arena |
| `gastronomia/` | Comida y terrazas (apoyo / viaje) |
| `barrios/` | Barrios de Santiago |
| `santiago/` | Ciudad / centro histórico |
| `viaje/` | City breaks (opcional) |
| `_inbox/` | Sin clasificar |

## Reglas de matching

1. Sede concreta (ej. Movistar → `conciertos/movistar-*.png`)
2. Deporte en el título (hockey, rugby, etc.)
3. Interés de la campaña (`nieve`, `concierto`, `partido_futbol`…)
4. Fallback: fotos Airbnb de la propiedad

El video `barrios/bellas-artes.mp4` está archivado pero **no** se usa aún como cover (peso alto).

## Cómo agregar más

```
tema-descripcion.jpg
```

Ej.: `nieve/farellones-amanece.jpg` — luego súmalo al array correspondiente en `guide-images.ts`.
