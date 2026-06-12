import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

import ClientLayoutWrapper from '../components/ClientLayoutWrapper';

export const metadata = {
  title: 'KHAN Builders and Developers',
  description: 'Your Dream Home in Ambernath & Thane',
};

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
