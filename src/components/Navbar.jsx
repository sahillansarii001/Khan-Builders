'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Properties', path: '/properties' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full top-0 z-60 transition-all duration-300 ${scrolled ? 'bg-navy/90 backdrop-blur-xl shadow-lg py-1' : 'bg-navy py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-gold to-yellow-200">
              KHAN <span className="text-white text-xl font-light tracking-widest ml-1">BUILDERS</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                className={`relative group font-medium transition-colors duration-300 ${pathname === link.path ? 'text-gold' : 'text-gray-300 hover:text-white'}`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-linear-to-r from-gold to-yellow-400 rounded-full transition-transform duration-300 origin-left ${pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
            <Link 
              href="/contact" 
              className="bg-linear-to-r from-gold to-yellow-400 text-navy px-8 py-3 rounded-full font-black hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all transform hover:-translate-y-1 tracking-wide"
            >
              Enquire Now
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full h-screen overflow-y-auto transition-all duration-300 origin-top ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'} bg-navy shadow-2xl border-t border-white/10`}>
        <div className="px-6 py-8 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === link.path ? 'bg-gold/10 text-gold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center mt-8 bg-linear-to-r from-gold to-yellow-400 text-navy px-4 py-4 rounded-2xl font-black shadow-lg shadow-gold/20"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
