<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reglas de Mi Álbum 2026

## Producto

- Toda la interfaz y el contenido para usuarios deben estar en español.
- Diseñar móvil primero y comprobar también los puntos de quiebre de escritorio.
- No incluir marcas, logos, escudos, camisetas ni imágenes oficiales.
- Mantener la aplicación usable con teclado y tecnologías de asistencia.
- Mantener el lenguaje visual basado en verde oscuro, verde lima, superficies claras y tarjetas redondeadas.
- Mostrar siempre los estados internos con etiquetas españolas: faltante, conseguida y repetida.
- Las listas compartidas deben agrupar figuritas por país y usar una representación de texto común para portapapeles y WhatsApp.

## Arquitectura

- Usar Next.js App Router, TypeScript estricto y Tailwind CSS.
- Mantener las rutas en `app/`, los componentes reutilizables en `components/` y la lógica o los datos compartidos en `lib/`.
- Los componentes son Server Components por defecto. Añadir `"use client"` solo cuando una API del navegador o la interacción lo requiera.
- Centralizar los tipos de dominio en `lib/types.ts` y los datos base en `lib/albumData.ts`.
- Usar el alias `@/` para importaciones internas.

## Datos y estado

- Cada selección tiene exactamente 20 figuritas.
- El álbum incluye además 18 figuritas especiales, numeradas del 1 al 18.
- Los únicos estados internos válidos son `missing`, `owned` y `duplicate`; sus etiquetas visibles deben estar en español.
- El ciclo de estado es siempre `missing` → `owned` → `duplicate` → `missing`.
- Las transformaciones y cálculos del álbum deben permanecer como funciones puras en `lib/albumState.ts`.
- No añadir backend, autenticación ni servicios externos sin una fase que lo autorice.
- La persistencia debe permanecer aislada en `lib/albumStorage.ts`; no acceder a `localStorage` durante el renderizado del servidor.
- Validar completamente los datos almacenados antes de incorporarlos al estado y reconstruir el estado inicial si son inválidos.
- La importación JSON debe usar la misma validación estructural que la persistencia y nunca reemplazar el estado cuando falle.
- El reinicio completo del álbum siempre debe solicitar confirmación explícita.
- Mantener sincronizados `public/manifest.json`, los metadatos de `app/layout.tsx` y los iconos PWA.
- Incrementar la versión de caché de `public/sw.js` cuando cambien recursos precargados.

## Calidad

- Ejecutar `npm run lint` y `npm run build` antes de entregar cambios de implementación.
- No dar por finalizada una ruta dinámica sin verificar códigos válidos e inválidos.
- Mantener el README actualizado cuando cambien scripts, rutas o decisiones de arquitectura.
