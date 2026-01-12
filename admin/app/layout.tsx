import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Hirotoshi Uchida',
  description: 'Access logs management and analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/themes/dark.css" 
        />
        <script 
          type="module" 
          src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/shoelace.js"
        ></script>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" 
        />
        <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
      </head>
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
