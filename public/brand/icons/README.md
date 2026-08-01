# Iconos Bianbi

Sprite original: `../icons-sprite.png`  
Cortes individuales: `i000.png` … `i095.png` (128×128, fondo transparente).

Los PNG están limpios y normalizados ópticamente:
1. se descartan fragmentos de celdas vecinas del sprite
2. el trazo principal ocupa ~82% del canvas

Backup sin normalizar: `../icons-raw/` (local, no versionar).

Usar en código:

```tsx
import { BrandIcon } from "@/components/brand/BrandIcon";

<BrandIcon name="music" size={48} />
<BrandIcon name="i036" size={36} /> // por ID
```

Catálogo semántico: `src/lib/brand/icons.ts`
