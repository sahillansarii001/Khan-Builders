'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, CheckCircle2, XCircle } from 'lucide-react';

export default function TestimonialsManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Amit Kumar', text: 'Great buying experience! Very transparent.', status: 'Pending' },
    { id: 2, name: 'Priya Desai', text: 'Best developers in Thane. Love my new flat.', status: 'Approved' },
  ]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'lead-manager' && role !== 'admin') {
      router.push('/panel/login');
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-navy">Testimonial <span className="text-gold">Moderation</span></h1>
            <p className="text-gray-500 mt-1">Review and approve customer feedback</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-navy flex items-center">
              <MessageSquare size={28} className="mr-3 text-gold" /> Testimonial Reviews
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(test => (
              <div key={test.id} className="border border-gray-200 rounded-xl p-6 relative">
                <div className="absolute top-4 right-4 flex space-x-2">
                  {test.status === 'Pending' ? (
                    <>
                      <button className="text-green-500 hover:text-green-700 bg-green-50 p-1.5 rounded-lg transition-colors" title="Approve">
                        <CheckCircle2 size={20} />
                      </button>
                      <button className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg transition-colors" title="Reject">
                        <XCircle size={20} />
                      </button>
                    </>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <CheckCircle2 size={14} className="mr-1" /> Approved
                    </span>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">{test.name}</h4>
                    <p className="text-xs text-gray-500">Submitted via Contact Form</p>
                  </div>
                </div>
                <p className="text-gray-700 italic border-l-4 border-gold pl-4 py-1">&quot;{test.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
