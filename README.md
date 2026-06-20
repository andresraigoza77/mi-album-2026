# Mi Álbum 2026

Aplicación web móvil primero para controlar una colección de figuritas de fútbol 2026. El acceso requiere iniciar sesión con Google y el progreso se sincroniza por usuario mediante Supabase, con `localStorage` como respaldo local.

## Funcionalidades

- 12 grupos, 48 selecciones y 20 figuritas por equipo.
- Estados `missing`, `owned` y `duplicate`, visibles como faltante, conseguida y repetida.
- Dashboard con progreso general y estadísticas.
- Listas de faltantes y repetidas agrupadas por país.
- Copia de listas y uso compartido por WhatsApp.
- Persistencia automática en `localStorage`.
- Acceso protegido mediante inicio de sesión con Google.
- Sincronización automática del progreso en Supabase.
- Exportación, importación validada y reinicio del progreso.
- Carga voluntaria del avance inicial leído desde la checklist física.
- PWA instalable con soporte offline básico.
- Interfaz responsive y accesible mediante teclado.

El archivo de datos también incluye 18 figuritas especiales. El seguimiento interactivo actual comprende las 960 figuritas de las selecciones.

La carga del avance leído desde la checklist interpreta las X azules como figuritas conseguidas, deja las demás como faltantes y no crea repetidas. Esta función, junto con exportación, importación y reinicio, permanece implementada internamente pero ya no se muestra en el dashboard principal.

Cuando hay una sesión de Google, la app carga el estado de Supabase automáticamente, guarda cambios después de 900 ms sin actividad y revisa actualizaciones remotas cada 10 segundos o al recuperar el foco. Si Supabase no está disponible, `localStorage` continúa funcionando como respaldo.

## Tecnologías

- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `localStorage`
- Supabase Auth y base de datos
- Web App Manifest y service worker

## Requisitos

- Node.js 20.9 o superior
- npm 10 o superior

## Instalación

Desde la raíz del proyecto:

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La pantalla de acceso solicitará iniciar sesión con Google antes de mostrar cualquier ruta del álbum.

Para habilitar autenticación y sincronización en la nube, crea `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

La tabla `public.album_progress` debe permitir leer e insertar/actualizar la fila cuyo `user_id` corresponda al usuario autenticado mediante sus políticas RLS. En despliegues de Vercel o Netlify, configura las mismas variables en el panel del proyecto y registra la URL pública entre las URLs de redirección autorizadas de Supabase Auth.

Para probar el build de producción:

```bash
npm run build
npm run start
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run lint` | Ejecuta ESLint |
| `npm run build` | Comprueba TypeScript y genera el build de producción |
| `npm run start` | Sirve localmente el build de producción |

## Rutas

| Ruta | Propósito |
| --- | --- |
| `/` | Dashboard y gestión del progreso |
| `/grupos` | Grupos y tarjetas de equipos |
| `/equipo/[code]` | Checklist de una selección |
| `/faltantes` | Lista de figuritas faltantes |
| `/repetidas` | Lista de figuritas repetidas |

## Instalación como PWA

En un navegador compatible, abre el build de producción mediante HTTPS —o sírvelo localmente con `npm run build && npm run start`— y utiliza la opción **Instalar aplicación** del navegador. El manifest se encuentra en `public/manifest.json` y el service worker en `public/sw.js`. Para evitar cachés obsoletas durante hot reload, el service worker no se registra con `npm run dev`.

## Despliegue en Vercel

### Desde un repositorio Git

1. Sube el proyecto a GitHub, GitLab o Bitbucket.
2. En Vercel, selecciona **Add New Project** e importa el repositorio.
3. Conserva el framework detectado como **Next.js**.
4. Configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en **Environment Variables**.
5. Despliega el proyecto.

Vercel ejecutará `npm run build` y publicará la aplicación mediante HTTPS, requisito necesario para instalar la PWA fuera de `localhost`.

### Desde la CLI

```bash
npx vercel
npx vercel --prod
```

El primer comando configura y crea un despliegue de prueba; el segundo publica en producción.

## Despliegue en Netlify

El proyecto incluye un archivo `netlify.toml` con esta configuración:

- Comando de build: `npm run build`
- Directorio de publicación: `.next`
- Versión de Node.js: 20

Para desplegar desde un repositorio Git:

1. Sube el proyecto a GitHub, GitLab o Bitbucket.
2. En Netlify, selecciona **Add new project** y después **Import an existing project**.
3. Conecta el proveedor Git y selecciona el repositorio.
4. Comprueba que Netlify detecte Next.js. Los valores de build se leerán desde `netlify.toml`.
5. Añade `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en la configuración de variables de entorno.
6. Selecciona **Deploy**.

Netlify publicará la aplicación mediante HTTPS, por lo que podrá instalarse como PWA desde navegadores compatibles.

## Estructura principal

```text
app/          Rutas, layout y estilos globales
components/   Interfaz y proveedores de estado
lib/          Datos, tipos, estado puro y persistencia
public/       Manifest, service worker e iconos PWA
```

## Privacidad y alcance

- El login con Google es obligatorio para acceder a la aplicación.
- `localStorage` conserva una copia local de respaldo, pero no habilita el acceso sin sesión.
- Con sesión iniciada, el progreso se sincroniza con `public.album_progress` en Supabase.
- No se incluye analítica.
- No se utilizan marcas, logos ni imágenes oficiales.
