import './globals.css';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'EcoTech DataFlow',
  description: 'Sistema de monitoramento e gamificação de coleta seletiva',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
