'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Home, Plus, X, Search, Filter, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

export default function PropertyManagerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [properties, setProperties] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'sale',
    bhk: '1 BHK',
    price: '',
    area: '',
    location: '',
    description: '',
    status: 'Available',
    images: ''
  });
  
  const [editingId, setEditingId] = useState(null);

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/properties', { withCredentials: true });
      setProperties(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch properties');
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'property-manager' && role !== 'admin') {
      router.push('/panel/login');
    } else {
      // eslint-disable-next-line
      fetchProperties();
    }
  }, [router]);



  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`http://localhost:5000/api/properties/${deleteConfirmId}`, { withCredentials: true });
      fetchProperties();
      setDeleteConfirmId(null);
      toast.success('Property deleted');
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleEdit = (prop) => {
    setFormData({
      title: prop.title,
      type: prop.type,
      bhk: prop.bhk,
      price: prop.price,
      area: prop.area,
      location: prop.location,
      description: prop.description,
      status: prop.status === 'available' ? 'Available' : (prop.status === 'sold' ? 'Sold' : (prop.status === 'rented' ? 'Rented' : prop.status)),
      images: (prop.images || []).join(', ')
    });
    setEditingId(prop._id);
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleOpenModal = () => {
    setFormData({
      title: '',
      type: 'sale',
      bhk: '1 BHK',
      price: '',
      area: '',
      location: '',
      description: '',
      status: 'Available',
      images: ''
    });
    setEditingId(null);
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrls = [];
    if (selectedFiles.length > 0) {
      const uploadData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        uploadData.append('images', selectedFiles[i]);
      }
      try {
        const uploadRes = await axios.post('http://localhost:5000/api/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        uploadedImageUrls = uploadRes.data.images.map(url => `http://localhost:5000${url}`);
      } catch (err) {
        toast.error('Failed to upload images');
        return;
      }
    }

    const oldImages = formData.images ? formData.images.split(',').map(s => s.trim()).filter(s => s) : [];

    const payload = {
      ...formData,
      images: [...oldImages, ...uploadedImageUrls]
    };
    
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/properties/${editingId}`, payload, { withCredentials: true });
        toast.success('Property updated');
      } else {
        await axios.post('http://localhost:5000/api/properties', payload, { withCredentials: true });
        toast.success('Property added');
      }
      setShowModal(false);
      fetchProperties();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save property');
    }
  };

  const filteredProperties = properties.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-navy">Property Manager <span className="text-gold">Panel</span></h1>
            <p className="text-gray-500 mt-1">Manage listings, uploads, and statuses</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-navy flex items-center">
              <Home className="mr-3 text-gold" size={28} /> Property Listings
            </h2>
            
            <div className="flex w-full md:w-auto gap-4">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search properties..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors text-sm"
                />
              </div>
              <button 
                onClick={handleOpenModal}
                className="flex items-center justify-center shrink-0 bg-navy text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gold transition-colors shadow-md"
              >
                <Plus size={18} className="mr-2" /> Add Property
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-y border-gray-100">
                  <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Property Title</th>
                  <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Details</th>
                  <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Price</th>
                  <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((prop) => (
                  <tr key={prop._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-navy text-base">{prop.title}</p>
                      <p className="text-xs text-gray-400 mt-1">ID: #{prop._id.slice(-6)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold capitalize">{prop.type}</span>
                        <span className="px-2.5 py-1 bg-navy/5 text-navy rounded-md text-xs font-bold uppercase">{prop.bhk}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-700">₹{prop.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center ${
                        prop.status.toLowerCase() === 'available' ? 'bg-green-100 text-green-700' : 
                        prop.status.toLowerCase() === 'sold' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {prop.status.toLowerCase() === 'available' && <CheckCircle2 size={14} className="mr-1" />}
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(prop)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 mr-2"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(prop._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Property Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex justify-end">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-navy">{editingId ? 'Edit Property' : 'Add New Property'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Property Title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Luxury Skyline Apartment" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                      <option value="sale">Sale</option>
                      <option value="rent">Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Configuration</label>
                    <select value={formData.bhk} onChange={e => setFormData({...formData, bhk: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4+ BHK">4+ BHK</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹) *</label>
                    <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" placeholder="e.g. 5500000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Area (Sq.ft) *</label>
                    <input required value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" placeholder="e.g. 1050" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Ambernath East" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Detailed description of the property..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Upload Images</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors" 
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-xs text-green-600 mt-2 font-bold">{selectedFiles.length} files selected for upload</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Existing Image URLs (comma separated)</label>
                  <textarea value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors resize-none" placeholder="https://image1.jpg, https://image2.jpg"></textarea>
                  <p className="text-xs text-gray-400 mt-2">These are the images currently associated with this property.</p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-navy text-white font-bold rounded-xl hover:bg-gold hover:text-navy transition-colors shadow-lg shadow-navy/20">
                    {editingId ? 'Update Property' : 'Publish Property'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[60] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-navy mb-2">Delete Property?</h3>
              <p className="text-gray-500 mb-8">Are you sure you want to delete this property? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
