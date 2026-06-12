'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSettings } from '../context/SettingsContext';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const { settings } = useSettings();

  // Hide on panel routes
  if (pathname.startsWith('/panel')) {
    return null;
  }

  const phoneNumber = settings?.whatsappNumber?.replace(/\D/g, '') || '910000000000';
  const message = encodeURIComponent('Hello KHAN Builders, I am interested in a property.');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform transform hover:scale-110 flex items-center justify-center animate-bounce hover:animate-none"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
}
