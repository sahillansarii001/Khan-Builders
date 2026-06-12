'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Trash2, Image as ImageIcon, Star, Plus, X, FolderUp, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API = 'http://localhost:5000/api/gallery';
const CATEGORIES = ['Exteriors', 'Interiors', 'Amenities', 'Ongoing Projects'];

const EMPTY_FORM = { imageUrl: '', projectName: '', category: 'Exteriors', featured: false };

export default function GalleryManagerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'upload'

  const fetchImages = async () => {
    try {
      const res = await axios.get(API);
      setImages(res.data);
    } catch {
      toast.error('Failed to load gallery');
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'gallery-manager' && role !== 'admin') {
      router.push('/panel/login');
    } else {
      fetchImages().then(() => setLoading(false));
    }
  }, [router]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (activeTab === 'upload' && selectedFiles.length > 0) {
        // Upload files first
        for (let i = 0; i < selectedFiles.length; i++) {
          const uploadData = new FormData();
          uploadData.append('images', selectedFiles[i]);
          const uploadRes = await axios.post('http://localhost:5000/api/upload', uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const imageUrl = `http://localhost:5000${uploadRes.data.images[0]}`;
          await axios.post(API, { imageUrl, projectName: form.projectName, category: form.category, featured: form.featured });
        }
        toast.success(`${selectedFiles.length} image(s) uploaded!`);
      } else {
        // URL mode
        if (!form.imageUrl) { toast.error('Please enter an image URL'); setSaving(false); return; }
        await axios.post(API, form);
        toast.success('Image added to gallery!');
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setSelectedFiles([]);
      setPreviews([]);
      fetchImages();
    } catch {
      toast.error('Failed to save image');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (img) => {
    try {
      await axios.put(`${API}/${img._id}`, { featured: !img.featured });
      setImages(prev => prev.map(i => i._id === img._id ? { ...i, featured: !i.featured } : i));
      toast.success(img.featured ? 'Removed from featured' : 'Marked as featured!');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API}/${deleteConfirmId}`);
      setImages(prev => prev.filter(i => i._id !== deleteConfirmId));
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const filtered = filterCategory === 'All' ? images : images.filter(i => i.category === filterCategory);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Toaster position="top-right" />

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={28} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Delete Image?</h3>
            <p className="text-gray-500 mb-6 text-sm">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-navy">Add Gallery Image</h3>
              <button onClick={() => { setShowModal(false); setSelectedFiles([]); setPreviews([]); }} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button onClick={() => setActiveTab('url')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'url' ? 'bg-white shadow text-navy' : 'text-gray-500'}`}>
                <LinkIcon size={14} /> From URL
              </button>
              <button onClick={() => setActiveTab('upload')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'upload' ? 'bg-white shadow text-navy' : 'text-gray-500'}`}>
                <Upload size={14} /> Upload Files
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {activeTab === 'url' ? (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Image URL *</label>
                  <input
                    type="url"
                    required={activeTab === 'url'}
                    value={form.imageUrl}
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors"
                  />
                  {form.imageUrl && (
                    <div className="relative h-36 w-full rounded-xl overflow-hidden mt-2 border border-gray-100">
                      <Image src={form.imageUrl} alt="preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Images</label>
                  <label className="border-2 border-dashed border-gold/30 rounded-xl p-6 flex flex-col items-center justify-center bg-gold/5 hover:bg-gold/10 transition-colors cursor-pointer">
                    <FolderUp size={32} className="text-gold mb-2" />
                    <p className="text-sm font-bold text-navy">Click to browse files</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP supported</p>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {previews.map((src, i) => (
                        <div key={i} className="relative h-20 rounded-xl overflow-hidden border border-gray-100">
                          <Image src={src} alt="" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Name *</label>
                <input
                  required
                  type="text"
                  value={form.projectName}
                  onChange={e => setForm({ ...form, projectName: e.target.value })}
                  placeholder="e.g. Khan Residency"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-gold cursor-pointer" />
                <label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer flex items-center gap-2">
                  <Star size={14} className="text-gold" /> Mark as Featured
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-gold to-yellow-400 text-navy font-black rounded-xl hover:shadow-lg transition-all disabled:opacity-60">
                  {saving ? 'Saving...' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy">Gallery <span className="text-gold">Manager</span></h1>
            <p className="text-gray-400 text-sm mt-0.5">{images.length} images · {images.filter(i => i.featured).length} featured</p>
          </div>
          <button onClick={() => { setForm(EMPTY_FORM); setSelectedFiles([]); setPreviews([]); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 text-navy font-black px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm">
            <Plus size={16} /> Add Image
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterCategory === cat ? 'bg-navy text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-navy hover:text-navy'}`}
            >
              {cat}
              <span className="ml-2 text-xs opacity-60">
                {cat === 'All' ? images.length : images.filter(i => i.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <ImageIcon className="mx-auto text-gray-200 w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No Images Yet</h3>
            <p className="text-gray-400 mb-6">Add your first gallery image to get started.</p>
            <button onClick={() => setShowModal(true)} className="bg-gold text-navy font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors">Add First Image</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map(img => (
              <div key={img._id} className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all aspect-square">
                <Image src={img.imageUrl} alt={img.projectName} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />

                {/* Featured badge */}
                {img.featured && (
                  <div className="absolute top-2 left-2 bg-gold text-navy text-[10px] font-black uppercase px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Star size={10} className="fill-navy" /> Featured
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => toggleFeatured(img)}
                      title={img.featured ? 'Remove from featured' : 'Mark as featured'}
                      className={`p-1.5 rounded-lg transition-colors ${img.featured ? 'bg-gold text-navy' : 'bg-white/20 hover:bg-gold hover:text-navy text-white'}`}
                    >
                      <Star size={14} className={img.featured ? 'fill-current' : ''} />
                    </button>
                    <button onClick={() => setDeleteConfirmId(img._id)} className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <span className="bg-gold text-navy text-[10px] font-black uppercase px-2 py-0.5 rounded mb-1 inline-block">{img.category}</span>
                    <p className="text-white font-bold text-sm truncate">{img.projectName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
