import type { Metadata } from 'next'
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistSans.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMono.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
