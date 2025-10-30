import localFont from 'next/font/local';

export const paladins = localFont({
  src: [
    {
      path: '../public/fonts/paladins.ttf',
      weight: '400', // Adjust weight if needed
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-paladins',
});
