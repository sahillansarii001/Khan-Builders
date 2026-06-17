'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Images, MessageSquare, LogOut, LayoutDashboard, Settings, FileText, X } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      setTimeout(() => setRole(userRole), 0);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/panel/login');
  };

  const navLinks = [
    { name: 'Admin Overview', path: '/panel/admin', icon: LayoutDashboard, roles: ['admin'] },
    { name: 'Content Manager', path: '/panel/admin/cms', icon: FileText, roles: ['admin'] },
    { name: 'Property Manager', path: '/panel/property-manager', icon: Home, roles: ['admin', 'property-manager'] },
    { name: 'Leads Kanban', path: '/panel/lead-manager', icon: Users, roles: ['admin', 'lead-manager'] },
    { name: 'Testimonials', path: '/panel/admin/testimonials', icon: MessageSquare, roles: ['admin', 'lead-manager'] },
    { name: 'Gallery Manager', path: '/panel/gallery-manager', icon: Images, roles: ['admin', 'gallery-manager'] },
    { name: 'System Settings', path: '/panel/admin/settings', icon: Settings, roles: ['admin'] },
  ];

  // Filter links based on user role
  const allowedLinks = navLinks.filter(link => link.roles.includes(role));

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      )}
      
      <div className={`w-64 bg-navy min-h-screen text-white flex flex-col fixed left-0 top-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <Link href="/" className="flex items-center text-2xl font-black tracking-tighter">
              <span className="text-gold">KHAN</span>
              <span className="text-white ml-1 font-light tracking-widest text-sm mt-1">BUILDERS</span>
            </Link>
            <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold bg-white/5 inline-block px-2 py-1 rounded">
              {role ? role.replace('-', ' ') : 'Loading...'}
            </p>
          </div>
          
          <button 
            className="md:hidden text-gray-400 hover:text-white p-1 bg-white/5 rounded-lg"
            onClick={() => setIsOpen && setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-4 flex flex-col space-y-1">
          {allowedLinks.map((link, index) => {
            const isActive = pathname === link.path;
            const isSub = link.isSub;
            // Add a bit more top margin if this is a main link and not the first one
            const marginTop = !isSub && index !== 0 ? 'mt-4' : '';
            
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={`flex items-center rounded-xl transition-all ${marginTop} ${
                  isSub ? 'py-2 pl-12 pr-4 text-sm' : 'py-3 px-4'
                } ${
                  isActive 
                    ? (isSub ? 'text-gold font-bold' : 'bg-gold text-navy font-bold shadow-lg shadow-gold/20')
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {!isSub && <link.icon className="mr-3" size={20} />}
                {isSub && <div className={`w-1.5 h-1.5 rounded-full mr-3 ${isActive ? 'bg-gold' : 'bg-gray-500'}`}></div>}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all"
        >
          <LogOut className="mr-2" size={18} /> Logout
        </button>
      </div>
    </div>
    </>
  );
}
