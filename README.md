# AislaEco - Sitio Web

Sitio web moderno para AislaEco, especialistas en aislamiento térmico para áticos con subvenciones públicas.

## 🚀 Características

- Diseño responsivo y moderno
- Formulario de evaluación en múltiples pasos
- Animaciones suaves con AOS (Animate On Scroll)
- Optimizado para SEO y rendimiento
- Estructura de proyecto escalable

## 🛠️ Requisitos previos

- Node.js (v14 o superior)
- npm (v7 o superior)

## 🚀 Instalación

1. Clona el repositorio:

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd website-hicham
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## 🛠️ Comandos disponibles

- `npm start` - Inicia el servidor de desarrollo en http://localhost:3000
- `npm run build` - Construye la versión de producción en la carpeta `dist/`
- `npm run build:dev` - Construye la versión de desarrollo
- `npm run watch` - Observa los cambios y reconstruye automáticamente
- `npm run lint` - Ejecuta ESLint en los archivos JavaScript
- `npm run format` - Formatea el código con Prettier

## 📁 Estructura del proyecto

```
website-hicham/
├── dist/                    # Archivos construidos para producción
├── src/                     # Código fuente
│   ├── js/                  # JavaScript
│   │   ├── modules/         # Módulos JavaScript
│   │   └── main.js          # Punto de entrada de JavaScript
│   └── scss/                # Estilos SCSS
│       └── main.scss        # Punto de entrada de estilos
├── index.html               # Página principal
├── package.json             # Dependencias y scripts
├── webpack.config.js        # Configuración de Webpack
└── postcss.config.js        # Configuración de PostCSS
```

## 🎨 Estilos

El proyecto utiliza SCSS para los estilos, organizados siguiendo la arquitectura 7-1:

- `base/` - Estilos base, como reset y tipografía
- `components/` - Componentes reutilizables
- `layout/` - Diseño de la página
- `pages/` - Estilos específicos de página
- `themes/` - Temas
- `utils/` - Variables, mixins y funciones
- `vendors/` - Estilos de terceros

## 🌐 Despliegue

Para desplegar el sitio, simplemente construye la versión de producción y sirve los archivos estáticos:

```bash
npm run build
```

Los archivos generados se encontrarán en la carpeta `dist/`.

## 📝 Licencia

Este proyecto está bajo la licencia MIT.
