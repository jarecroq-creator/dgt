# Conduce DGT

App de práctica para el examen teórico del Permiso B: tests por tema, simulacro tipo DGT (30 preguntas, 30 min, máx. 3 fallos), repaso de fallos y progreso guardado en el dispositivo. Funciona en móvil (Expo) y en navegador, con diseño adaptable a móvil, tablet y escritorio.

## Estructura

- `artifacts/dgt-conduce` – app Expo / React Native (iOS, Android y web)
- `artifacts/api-server` – API Express (health check; la app no depende de ella)
- `artifacts/mockup-sandbox` – sandbox de maquetas
- `lib/*` – esquema de BD, spec OpenAPI y clientes generados

## Web

```bash
pnpm install
pnpm --filter @workspace/dgt-conduce run web          # desarrollo en http://localhost:8081
pnpm --filter @workspace/dgt-conduce run build:web    # exporta a artifacts/dgt-conduce/dist
PORT=3000 pnpm --filter @workspace/dgt-conduce run serve:web
```

En web, en el test: teclas `A`/`B`/`C` (o `1`/`2`/`3`) para responder y `Enter`/`Espacio` para continuar.
En ventanas anchas (≥1024 px) la navegación pasa a un lateral; el contenido se centra con ancho máximo.

## Comprobaciones

```bash
pnpm run typecheck
```

## Documentación

- `docs/temario/Manual-Permiso-B-Lectura-Facil-DGT.pdf` – Manual del Permiso B en Lectura Fácil (DGT, 2024)
- `docs/actualizaciones-octubre-2026.md` – novedades del RD 518/2026 y otros cambios de 2026 que el manual no recoge

## Banco de preguntas

500 preguntas en `artifacts/dgt-conduce/data/bank/` (una por tema del manual, más `actualidad.ts` y `puntos.ts`). Cada entrada es `[pregunta, respuesta correcta, incorrecta 1, incorrecta 2, explicación]`; `data/questions.ts` las convierte y reparte la posición de la respuesta correcta de forma estable.

| Tema | Preguntas |
|---|---|
| Novedades 2026 (RD 518/2026) | 38 |
| Temas 1–17 del manual y anexo de puntos | 462 |

Son preguntas propias basadas en el Manual DGT del Permiso B (edición 2024) y en las novedades de octubre de 2026; no son preguntas oficiales literales.
