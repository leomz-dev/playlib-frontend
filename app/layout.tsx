import type { Metadata } from "next";
import { chakraPetch, nunitoSans } from './fonts';
import "./globals.css";

// Metadatos de la aplicación para SEO y título de la pestaña
export const metadata: Metadata = {
  title: "PlayLib",
  description: "Libreria de juegos.",
};

// Componente principal que envuelve toda la aplicación
// Aplica las fuentes y estilos globales
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Se inyectan las variables CSS de las fuentes en el tag html
    <html lang="en" className={`${chakraPetch.variable} ${nunitoSans.variable}`}>
      <body className="font-nunito bg-black">
        {children}
      </body>
    </html>
  );
}
