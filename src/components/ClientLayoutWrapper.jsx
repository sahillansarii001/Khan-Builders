'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { SettingsProvider } from '../context/SettingsContext';
import { Menu } from 'lucide-react';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="flex min-h-screen bg-gray-50 relative">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <main className="flex-1 md:ml-64 overflow-x-hidden w-full transition-all">
            {/* Mobile Header for Sidebar Toggle */}
            <div className="md:hidden flex items-center justify-between bg-white p-4 border-b border-gray-200">
              <span className="font-bold text-navy text-lg">Admin Panel</span>
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 bg-gray-50 text-navy hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
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
