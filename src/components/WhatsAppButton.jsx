'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Hide on panel routes
  if (pathname.startsWith('/panel')) {
    return null;
  }

  const phoneNumber = '910000000000'; // Replace with actual number
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
