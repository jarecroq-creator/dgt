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

Preguntas: `artifacts/dgt-conduce/data/questions.ts` (propias, basadas en el Manual DGT del Permiso B; no son preguntas oficiales literales).
