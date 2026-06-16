'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let role = '';
      if (
        email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        role = 'admin';
      } else if (
        email === process.env.NEXT_PUBLIC_PROPERTY_EMAIL &&
        password === process.env.NEXT_PUBLIC_PROPERTY_PASSWORD
      ) {
        role = 'property-manager';
      } else if (
        email === process.env.NEXT_PUBLIC_LEAD_EMAIL &&
        password === process.env.NEXT_PUBLIC_LEAD_PASSWORD
      ) {
        role = 'lead-manager';
      } else if (
        email === process.env.NEXT_PUBLIC_GALLERY_EMAIL &&
        password === process.env.NEXT_PUBLIC_GALLERY_PASSWORD
      ) {
        role = 'gallery-manager';
      } else {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('userRole', role);

      toast.success('Logged in successfully!');
      
      // Redirect based on role
      router.push(`/panel/${role}`);
      
    } catch (error) {
      toast.error('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Employee Login</h1>
          <p className="text-gray-500">Access your management dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon size={18} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-navy focus:border-navy outline-none" 
                placeholder="admin@khanbuilders.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-navy focus:border-navy outline-none" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold text-navy py-3 rounded-md font-bold text-lg hover:bg-yellow-600 transition-colors shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>


      </div>
    </div>
  );
}
