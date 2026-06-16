import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, MessageSquare, Briefcase, Play } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings, loading } = useSettings();

  return (
    <footer className="bg-navy text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="mb-8 md:mb-0">
            <Link href="/" className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-gold to-yellow-200 mb-6 inline-block">
              KHAN <span className="text-white text-xl font-light tracking-widest ml-1">BUILDERS</span>
            </Link>
            <p className="text-sm mt-4 text-gray-400 leading-relaxed font-light">
              Your trusted partner in finding the perfect home in Ambernath & Thane. Experience luxury, comfort, and affordability.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-gold transition-colors font-light">Home</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors font-light">About Us</Link></li>
              <li><Link href="/properties" className="hover:text-gold transition-colors font-light">Properties</Link></li>
              <li><Link href="/gallery" className="hover:text-gold transition-colors font-light">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors font-light">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start group cursor-default">
                <MapPin className="mr-4 text-gold shrink-0 mt-1 group-hover:scale-110 transition-transform" size={20} />
                <span className="font-light text-gray-300 group-hover:text-white transition-colors">{settings?.address || 'Ambernath & Thane, Maharashtra, India'}</span>
              </li>
              <li className="flex items-center group cursor-default">
                <Phone className="mr-4 text-gold shrink-0 group-hover:scale-110 transition-transform" size={20} />
                <span className="font-light text-gray-300 group-hover:text-white transition-colors">{settings?.phone || '+91 0000000000'}</span>
              </li>
              <li className="flex items-center group cursor-default">
                <Mail className="mr-4 text-gold shrink-0 group-hover:scale-110 transition-transform" size={20} />
                <span className="font-light text-gray-300 group-hover:text-white transition-colors">{settings?.email || 'info@khanbuilders.com'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              {settings?.facebookLink && (
                <a href={settings.facebookLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:scale-110 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                  <Globe size={20} />
                </a>
              )}
              {settings?.instagramLink && (
                <a href={settings.instagramLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:scale-110 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                  <MessageSquare size={20} />
                </a>
              )}
              {settings?.twitterLink && (
                <a href={settings.twitterLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:scale-110 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                  <Briefcase size={20} />
                </a>
              )}
              {settings?.youtubeLink && (
                <a href={settings.youtubeLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:scale-110 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                  <Play size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>
            Made by{' '}
            <a 
              href="https://ahmed.nexcoreinstitute.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gold transition-colors font-medium"
            >
              Ahmed khan
            </a>{' '}
            All rights reserved.
          </p>
          <p className="mt-2 md:mt-0">
            <Link href="/panel/login" className="hover:text-gold transition-colors">Employee Login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
