import type { Metadata } from "next";
import { paladins } from './fonts';
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayLib",
  description: "Libreria de juegos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${paladins.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
