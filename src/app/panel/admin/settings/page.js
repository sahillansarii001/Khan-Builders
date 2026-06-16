'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, Globe, Share2, Search, Link2 } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/settings`;

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    phone: '', email: '', whatsappNumber: '', address: '', googleMapsLink: '',
    facebookLink: '', instagramLink: '', twitterLink: '', youtubeLink: '',
    siteTitle: '', siteDescription: '', metaKeywords: '', logoUrl: '', footerText: ''
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/panel/login');
      return;
    }
    
    axios.get(API).then(res => {
      if (res.data) setForm(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      toast.error('Failed to load settings');
      setLoading(false);
    });
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(API, form);
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-navy flex items-center gap-2">
              <Settings className="text-gold" size={24} /> System <span className="text-gold">Settings</span>
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage global configuration, SEO, and social links</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 text-navy font-black px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-70"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <Globe className="text-gold" size={20} /> General Contact Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
              <input type="text" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Office Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors resize-none"></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed Link</label>
              <input type="text" name="googleMapsLink" value={form.googleMapsLink} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors font-mono text-xs" />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <Search className="text-gold" size={20} /> SEO & Metadata
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Site Title (Browser Tab)</label>
              <input type="text" name="siteTitle" value={form.siteTitle} onChange={handleChange} placeholder="Khan Builders | Premium Real Estate" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description (Google Search Snippet)</label>
              <textarea name="siteDescription" value={form.siteDescription} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Meta Keywords (Comma separated)</label>
              <input type="text" name="metaKeywords" value={form.metaKeywords} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <Share2 className="text-gold" size={20} /> Social Media Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Facebook URL</label>
              <input type="url" name="facebookLink" value={form.facebookLink} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Instagram URL</label>
              <input type="url" name="instagramLink" value={form.instagramLink} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Twitter / X URL</label>
              <input type="url" name="twitterLink" value={form.twitterLink} onChange={handleChange} placeholder="https://twitter.com/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">YouTube URL</label>
              <input type="url" name="youtubeLink" value={form.youtubeLink} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
        </div>

        {/* Branding & Footer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <Link2 className="text-gold" size={20} /> Branding & Footer
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Custom Logo URL (Optional)</label>
              <input type="url" name="logoUrl" value={form.logoUrl} onChange={handleChange} placeholder="Leave blank to use default text logo" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Footer Copyright Text</label>
              <input type="text" name="footerText" value={form.footerText} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
