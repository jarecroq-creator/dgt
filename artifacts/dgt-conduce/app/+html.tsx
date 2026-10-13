import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// Root HTML for the web build: language, viewport and share metadata.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Conduce DGT · Test del Permiso B</title>
        <meta name="description" content="Practica para el examen teórico del Permiso B: tests por tema, simulacro tipo DGT y repaso de fallos." />
        <meta name="theme-color" content="#1E6B4E" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body{background-color:#F5F4EE}' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
