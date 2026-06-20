# Mi Álbum 2026

Aplicación web móvil primero para controlar una colección de figuritas de fútbol 2026. Funciona sin cuenta ni backend: el progreso se guarda localmente en el navegador.

## Funcionalidades

- 12 grupos, 48 selecciones y 20 figuritas por equipo.
- Estados `missing`, `owned` y `duplicate`, visibles como faltante, conseguida y repetida.
- Dashboard con progreso general y estadísticas.
- Listas de faltantes y repetidas agrupadas por país.
- Copia de listas y uso compartido por WhatsApp.
- Persistencia automática en `localStorage`.
- Exportación, importación validada y reinicio del progreso.
- Carga voluntaria del avance inicial leído desde la checklist física.
- PWA instalable con soporte offline básico.
- Interfaz responsive y accesible mediante teclado.

El archivo de datos también incluye 18 figuritas especiales. El seguimiento interactivo actual comprende las 960 figuritas de las selecciones.

En el dashboard, el botón **Cargar avance de la imagen** reemplaza el estado actual —previa confirmación— por las X azules interpretadas como figuritas conseguidas. Las figuritas no marcadas quedan como faltantes y ninguna se carga como repetida. La acción no se ejecuta automáticamente, por lo que los cambios manuales posteriores se conservan normalmente.

## Tecnologías

- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `localStorage`
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

Abre [http://localhost:3000](http://localhost:3000). El progreso permanece únicamente en el almacenamiento local de ese navegador.

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
4. Despliega el proyecto. Esta versión no necesita variables de entorno.

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
5. Selecciona **Deploy**. Esta versión no necesita variables de entorno.

Netlify publicará la aplicación mediante HTTPS, por lo que podrá instalarse como PWA desde navegadores compatibles.

## Estructura principal

```text
app/          Rutas, layout y estilos globales
components/   Interfaz y proveedores de estado
lib/          Datos, tipos, estado puro y persistencia
public/       Manifest, service worker e iconos PWA
```

## Privacidad y alcance

- No hay login, backend ni analítica.
- El progreso no sale del dispositivo salvo cuando el usuario exporta o comparte una lista.
- No se utilizan marcas, logos ni imágenes oficiales.
