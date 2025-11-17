import type { Metadata } from "next";
import { chakraPetch, nunitoSans } from './fonts';
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
    <html lang="en" className={`${chakraPetch.variable} ${nunitoSans.variable}`}>
      <body className="font-nunito bg-black">
        {children}
      </body>
    </html>
  );
}
