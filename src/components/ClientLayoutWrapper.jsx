'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { SettingsProvider } from '../context/SettingsContext';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();

  // Check if we are on the login page
  const isLoginPage = pathname === '/panel/login';
  
  // Check if we are inside the dashboard panel (but not the login page)
  const isDashboard = pathname.startsWith('/panel') && !isLoginPage;

  if (isLoginPage) {
    // Pure blank canvas for login
    return <SettingsProvider>{children}</SettingsProvider>;
  }

  if (isDashboard) {
    // Render the Sidebar on the left and the children on the right
    return (
      <SettingsProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 ml-64 overflow-x-hidden">
            {children}
          </main>
        </div>
      </SettingsProvider>
    );
  }

  // Default Public Layout
  return (
    <SettingsProvider>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </SettingsProvider>
  );
}
