# 🎬 PlayLib Frontend

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**PlayLib** es una interfaz web moderna y responsiva diseñada para gestionar y visualizar bibliotecas multimedia. Este proyecto está construido con [Next.js](https://nextjs.org) (App Router) y estilizado con [Tailwind CSS](https://tailwindcss.com), ofreciendo un alto rendimiento y una experiencia de usuario fluida.

## ✨ Características

- **🚀 Modern Stack:** Next.js 14+ con App Router.
- **🎨 UI/UX:** Diseño limpio y adaptable gracias a Tailwind CSS.
- **⚡ Performance:** Optimización automática de fuentes e imágenes.
- **📱 Responsive:** Funciona perfectamente en móviles, tablets y escritorio.

## 🚀 Getting Started

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/leomz-dev/playlib-frontend.git
cd playlib-frontend
2. Instalar dependencias
code
Bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
3. Configurar entorno
Renombra el archivo .env.example a .env.local (o créalo) y añade la URL de tu [1]backend:
code
Env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
4. Ejecutar el servidor de desarrollo
code
Bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Abre http://localhost:3000 en tu navegador para ver la aplicación.
Puedes comenzar a editar la página modificando app/page.tsx. La página se actualizará automáticamente a medida que edites el archivo.
📂 Estructura del Proyecto
Este proyecto sigue la estructura estándar de Next.js con App Router:
code
Text
src/
├── app/              # Páginas, Layouts y Rutas
├── components/       # Componentes reutilizables de UI
├── lib/              # Funciones de utilidad y configuración
└── styles/           # Estilos globales (Tailwind directives)
☁️ Despliegue (Deploy)
La forma más sencilla de desplegar tu aplicación Next.js es utilizando la Plataforma Vercel.
Consulta la documentación de despliegue de Next.js para más detalles.
📚 Learn More
Para aprender más sobre las tecnologías usadas:
Next.js Documentation - características y API de Next.js.
Tailwind CSS Docs - utilidades y configuración.
Learn Next.js - tutorial interactivo.
<div align="center">
Desarrollado por <a href="https://github.com/leomz-dev">leomz-dev</a>
</div>
