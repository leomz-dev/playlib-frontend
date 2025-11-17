import { Chakra_Petch, Nunito_Sans } from 'next/font/google';

export const chakraPetch = Chakra_Petch({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chakra-petch',
});

export const nunitoSans = Nunito_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
});
