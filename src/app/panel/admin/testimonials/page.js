'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Plus, X, Trash2, CheckCircle, XCircle, Edit, Quote, User } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API = 'http://localhost:5000/api/testimonials';

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          className={`transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300'} ${onChange ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
        >
          <Star size={20} fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

const EMPTY_FORM = { customerName: '', review: '', rating: 5, photo: '', approved: true };

export default function TestimonialsManagerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      setTestimonials(res.data);
    } catch {
      toast.error('Failed to load testimonials');
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/panel/login');
    } else {
      fetchTestimonials().then(() => setLoading(false));
    }
  }, [router]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setForm({ customerName: t.customerName, review: t.review, rating: t.rating, photo: t.photo || '', approved: t.approved });
    setEditingId(t._id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        toast.success('Testimonial updated!');
      } else {
        await axios.post(API, form);
        toast.success('Testimonial added!');
      }
      setShowModal(false);
      fetchTestimonials();
    } catch {
      toast.error('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const toggleApprove = async (t) => {
    try {
      await axios.put(`${API}/${t._id}`, { approved: !t.approved });
      setTestimonials(prev => prev.map(x => x._id === t._id ? { ...x, approved: !x.approved } : x));
      toast.success(t.approved ? 'Testimonial hidden' : 'Testimonial approved & published!');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API}/${deleteConfirmId}`);
      setTestimonials(prev => prev.filter(t => t._id !== deleteConfirmId));
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const approved = testimonials.filter(t => t.approved);
  const pending = testimonials.filter(t => !t.approved);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Toaster position="top-right" />

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={28} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Delete Testimonial?</h3>
            <p className="text-gray-500 mb-6 text-sm">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-navy">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Customer Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type="text"
                    value={form.customerName}
                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                    placeholder="e.g. Rahul Mehta"
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Review *</label>
                <textarea
                  required
                  rows={4}
                  value={form.review}
                  onChange={e => setForm({ ...form, review: e.target.value })}
                  placeholder="What did the customer say?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                <StarRating value={form.rating} onChange={val => setForm({ ...form, rating: val })} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Photo URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="url"
                  value={form.photo}
                  onChange={e => setForm({ ...form, photo: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="approved"
                  checked={form.approved}
                  onChange={e => setForm({ ...form, approved: e.target.checked })}
                  className="w-4 h-4 accent-gold cursor-pointer"
                />
                <label htmlFor="approved" className="text-sm font-bold text-gray-700 cursor-pointer">
                  Published (visible on website)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-gold to-yellow-400 text-navy font-black rounded-xl hover:shadow-lg transition-all disabled:opacity-60">
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-navy">Testimonials <span className="text-gold">Manager</span></h1>
            <p className="text-gray-400 text-sm mt-0.5">{approved.length} published · {pending.length} pending approval</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 text-navy font-black px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm">
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: testimonials.length, color: 'text-navy', bg: 'bg-navy/5' },
            { label: 'Published', value: approved.length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending', value: pending.length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center border border-white`}>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <Quote className="mx-auto text-gray-200 w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No Testimonials Yet</h3>
            <p className="text-gray-400 mb-6">Add your first customer testimonial to get started.</p>
            <button onClick={openAdd} className="bg-gold text-navy font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors">Add First Testimonial</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div key={t._id} className={`bg-white rounded-2xl shadow-sm border transition-all hover:shadow-md p-5 flex flex-col ${t.approved ? 'border-gray-100' : 'border-yellow-200 bg-yellow-50/30'}`}>
                {/* Status Banner */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${t.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.approved ? '✓ Published' : '⏳ Pending'}
                  </span>
                  <StarRating value={t.rating} />
                </div>

                {/* Review */}
                <div className="relative mb-5 flex-1">
                  <Quote size={20} className="text-gold/30 absolute -top-1 -left-1" />
                  <p className="text-gray-600 text-sm leading-relaxed pl-4 italic line-clamp-4">{t.review}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  {t.photo ? (
                    <img src={t.photo} alt={t.customerName} className="w-10 h-10 rounded-full object-cover border-2 border-gold/20" onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-navy to-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                      {t.customerName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy text-sm truncate">{t.customerName}</p>
                    <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleApprove(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${t.approved ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}
                  >
                    {t.approved ? <><XCircle size={13} /> Hide</> : <><CheckCircle size={13} /> Publish</>}
                  </button>
                  <button
                    onClick={() => openEdit(t)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(t._id)}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
