import { Chakra_Petch, Nunito_Sans } from 'next/font/google';

// Configuración de la fuente Chakra Petch (usada para títulos)
export const chakraPetch = Chakra_Petch({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chakra-petch',
});

// Configuración de la fuente Nunito Sans (usada para cuerpo de texto)
export const nunitoSans = Nunito_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
});
