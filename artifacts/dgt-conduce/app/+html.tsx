import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const TITLE = '¡¡Vamos Ana!! Conduce DGT · Test del Permiso B';
const DESCRIPTION = 'Practica para el examen teórico del Permiso B: tests por tema, simulacro tipo DGT y repaso de fallos. Funciona sin conexión.';

// Absolute site URL (needed for the WhatsApp/social preview image). Vercel exposes it at build time.
const SITE = process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://dgt-hazel.vercel.app');

// Sub-path hosting (e.g. GitHub Pages at /dgt). Empty for Vercel / root domains.
const BASE = process.env.BASE_PATH ?? '';

const REGISTER_SW = `if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('${BASE}/sw.js').catch(function () {}); }); }`;

// Root HTML for the web build: language, viewport, install (PWA) and share metadata.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="theme-color" content="#1E6B4E" />
        <link rel="manifest" href={`${BASE}/manifest.webmanifest`} />
        <link rel="icon" type="image/png" href={`${BASE}/favicon.png`} />
        <link rel="apple-touch-icon" href={`${BASE}/apple-touch-icon.png`} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Conduce DGT" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:title" content="¡¡Vamos Ana!! Esta vez sí lo aprobamos" />
        <meta property="og:description" content="Conduce DGT · Test del Permiso B, siempre disponible en tu móvil." />
        {SITE ? <meta property="og:url" content={`${SITE}${BASE}`} /> : null}
        {SITE ? <meta property="og:image" content={`${SITE}${BASE}/og-image.png`} /> : null}
        {SITE ? <meta property="og:image:width" content="1200" /> : null}
        {SITE ? <meta property="og:image:height" content="630" /> : null}
        <meta name="twitter:card" content="summary_large_image" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body{background-color:#F5F4EE}' }} />
        <script dangerouslySetInnerHTML={{ __html: REGISTER_SW }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
