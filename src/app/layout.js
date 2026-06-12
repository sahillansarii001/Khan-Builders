import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

import ClientLayoutWrapper from '../components/ClientLayoutWrapper';

export async function generateMetadata() {
  try {
    const res = await fetch('http://localhost:5000/api/settings', { next: { revalidate: 10 } });
    const settings = await res.json();
    return {
      title: settings.siteTitle || 'KHAN Builders and Developers',
      description: settings.siteDescription || 'Your Dream Home in Ambernath & Thane',
      keywords: settings.metaKeywords || 'real estate, homes, ambernath, thane, builders',
    };
  } catch {
    return {
      title: 'KHAN Builders and Developers',
      description: 'Your Dream Home in Ambernath & Thane',
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
