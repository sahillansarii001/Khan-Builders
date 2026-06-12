'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Download, Phone, Mail, Calendar, CheckSquare, Trash2, MessageSquare, User, ChevronRight, X, Building2 } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API = 'http://localhost:5000/api/leads';

const COLUMNS = ['New', 'Contacted', 'Negotiation', 'Closed'];

const COLUMN_STYLES = {
  New:         { header: 'bg-blue-50 border-blue-200',   badge: 'bg-blue-500',   dot: 'bg-blue-400' },
  Contacted:   { header: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-500', dot: 'bg-yellow-400' },
  Negotiation: { header: 'bg-purple-50 border-purple-200', badge: 'bg-purple-500', dot: 'bg-purple-400' },
  Closed:      { header: 'bg-green-50 border-green-200',  badge: 'bg-green-500',  dot: 'bg-green-400' },
};

export default function LeadManagerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(API);
      setLeads(res.data);
    } catch (err) {
      toast.error('Failed to fetch leads');
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'lead-manager' && role !== 'admin') {
      router.push('/panel/login');
    } else {
      // eslint-disable-next-line
      fetchLeads().then(() => setLoading(false));
    }
  }, [router]);

  const moveLead = async (lead, newStatus) => {
    if (lead.status === newStatus) return;
    const original = leads;
    // Optimistic update
    setLeads(prev => prev.map(l => l._id === lead._id ? { ...l, status: newStatus } : l));
    try {
      await axios.put(`${API}/${lead._id}`, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
    } catch (err) {
      setLeads(original);
      toast.error('Failed to update status');
    }
  };

  const deleteLead = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${API}/${deleteConfirmId}`);
      setLeads(prev => prev.filter(l => l._id !== deleteConfirmId));
      toast.success('Lead deleted');
      if (selectedLead && selectedLead._id === deleteConfirmId) setSelectedLead(null);
    } catch (err) {
      toast.error('Failed to delete lead');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const saveNote = async () => {
    if (!selectedLead) return;
    setSavingNote(true);
    try {
      const res = await axios.put(`${API}/${selectedLead._id}`, { message: editNote });
      setLeads(prev => prev.map(l => l._id === selectedLead._id ? res.data : l));
      setSelectedLead(res.data);
      toast.success('Note saved');
    } catch (err) {
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const exportCSV = () => {
    window.open('http://localhost:5000/api/leads/export/csv', '_blank');
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-navy font-bold">Loading Leads...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={28} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Delete Lead?</h3>
            <p className="text-gray-500 mb-6 text-sm">This action cannot be undone. The lead will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={deleteLead} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end" onClick={() => setSelectedLead(null)}>
          <div className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto p-6 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-navy">Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><X size={20} /></button>
            </div>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
              <div className="w-14 h-14 bg-gradient-to-br from-navy to-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                {selectedLead.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-navy text-lg">{selectedLead.name}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${COLUMN_STYLES[selectedLead.status]?.badge || 'bg-gray-400'}`}>
                  {selectedLead.status}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone size={16} className="text-gold shrink-0" />
                <a href={`tel:${selectedLead.phone}`} className="font-medium text-navy hover:text-gold transition-colors">{selectedLead.phone}</a>
              </div>
              {selectedLead.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail size={16} className="text-gold shrink-0" />
                  <a href={`mailto:${selectedLead.email}`} className="font-medium text-navy hover:text-gold transition-colors">{selectedLead.email}</a>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User size={16} className="text-gold shrink-0" />
                <span className="font-medium text-gray-700">Interest: <strong>{selectedLead.interest}</strong></span>
              </div>
              {selectedLead.propertyTitle && (
                <div className="flex items-center gap-3 p-3 bg-navy/5 border border-navy/10 rounded-xl">
                  <Building2 size={16} className="text-navy shrink-0" />
                  <span className="font-medium text-navy text-sm">Property: <strong>{selectedLead.propertyTitle}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={16} className="text-gold shrink-0" />
                <span className="font-medium text-gray-700">{formatDate(selectedLead.createdAt)}</span>
              </div>
            </div>

            {/* Move Status */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Pipeline Stage</label>
              <div className="grid grid-cols-2 gap-2">
                {COLUMNS.map(col => (
                  <button
                    key={col}
                    onClick={() => { moveLead(selectedLead, col); setSelectedLead(prev => ({ ...prev, status: col })); }}
                    className={`py-2 px-3 rounded-xl text-sm font-bold border-2 transition-all ${selectedLead.status === col ? 'border-gold bg-gold/10 text-gold' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Note / Message */}
            <div className="mb-6 flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Notes / Message</label>
              <textarea
                value={editNote}
                onChange={e => setEditNote(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors resize-none text-sm"
                placeholder="Add notes about this lead..."
              />
              <button onClick={saveNote} disabled={savingNote} className="mt-2 w-full py-2.5 bg-navy text-white rounded-xl font-bold hover:bg-blue-900 transition-colors text-sm disabled:opacity-60">
                {savingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>

            {/* Delete */}
            <button
              onClick={() => setDeleteConfirmId(selectedLead._id)}
              className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Delete Lead
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy">Lead Manager <span className="text-gold">Kanban</span></h1>
            <p className="text-gray-400 text-sm mt-0.5">{leads.length} total leads in pipeline</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center bg-white text-navy px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors shadow-sm text-sm">
              <Download size={16} className="mr-2" /> Export CSV
            </button>
            <button onClick={() => { localStorage.removeItem('userRole'); router.push('/panel/login'); }} className="flex items-center bg-red-50 text-red-500 px-5 py-2.5 rounded-xl border border-red-200 font-bold hover:bg-red-100 transition-colors text-sm">
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {COLUMNS.map(col => {
            const colLeads = leads.filter(l => l.status === col);
            const style = COLUMN_STYLES[col];
            return (
              <div key={col} className="flex flex-col min-h-[300px]">
                {/* Column Header */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-3 ${style.header}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></span>
                    <h3 className="font-black text-navy text-sm uppercase tracking-wider">{col}</h3>
                  </div>
                  <span className="bg-white text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {colLeads.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                      No leads here
                    </div>
                  ) : colLeads.map(lead => (
                    <div
                      key={lead._id}
                      onClick={() => { setSelectedLead(lead); setEditNote(lead.message || ''); }}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/30 transition-all cursor-pointer group"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-navy to-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                            {lead.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-navy text-sm leading-tight">{lead.name}</h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{lead.interest}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gold transition-colors shrink-0 mt-1" />
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1.5 mb-3">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Phone size={11} className="text-gray-400" /> {lead.phone}
                        </p>
                        {lead.email && (
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <Mail size={11} className="text-gray-400" /> {lead.email}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          <Calendar size={11} /> {formatDate(lead.createdAt)}
                        </p>
                      </div>

                      {/* Property Tag */}
                      {lead.propertyTitle && (
                        <div className="flex items-center gap-1.5 bg-navy/5 border border-navy/10 rounded-lg px-2.5 py-1.5 mb-3">
                          <Building2 size={11} className="text-navy shrink-0" />
                          <span className="text-xs font-bold text-navy truncate">{lead.propertyTitle}</span>
                        </div>
                      )}

                      {/* Note Preview */}
                      {lead.message && (
                        <div className="bg-yellow-50 p-2.5 rounded-lg border border-yellow-100 mb-3">
                          <p className="text-xs text-yellow-800 italic line-clamp-2">
                            <MessageSquare size={10} className="inline mr-1" />
                            {lead.message}
                          </p>
                        </div>
                      )}

                      {/* Quick Move */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <select
                          value={lead.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => moveLead(lead, e.target.value)}
                          className="text-xs font-bold text-gold bg-transparent outline-none cursor-pointer appearance-none border-0 p-0"
                        >
                          {COLUMNS.map(c => <option key={c} value={c}>→ {c}</option>)}
                        </select>
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteConfirmId(lead._id); }}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {leads.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 mt-4">
            <MessageSquare className="mx-auto text-gray-300 w-16 h-16 mb-4" />
            <h3 className="text-2xl font-bold text-navy mb-2">No Leads Yet</h3>
            <p className="text-gray-500">Leads will appear here when customers submit enquiries from your website.</p>
          </div>
        )}
      </div>
    </div>
  );
}
