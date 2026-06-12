'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, BedDouble, Square, IndianRupee, ArrowLeft, Phone,
  CheckCircle, ChevronLeft, ChevronRight, X, Send, User, Mail,
  Tag, Home, Building2, Zap, Car, Dumbbell, TreePine, ShieldCheck,
  Waves, Star
} from 'lucide-react';

const AMENITY_ICONS = {
  'Parking': Car, 'Lift': Building2, 'Security': ShieldCheck, 'Garden': TreePine,
  'Gym': Dumbbell, 'Pool': Waves, 'Club House': Star, 'Terrace': Home,
  'Balcony': Home, 'Power Backup': Zap, 'Water Tank': Zap, 'Water Supply': Zap,
  'Electricity Backup': Zap, 'Children Play Area': Star, '24/7 Security': ShieldCheck,
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:5000/api/properties/${id}`)
      .then(res => { setProperty(res.data); setLoading(false); })
      .catch(() => { toast.error('Property not found'); setLoading(false); });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/leads', {
        ...form,
        interest: property.type === 'sale' ? 'Buy' : 'Rent',
        message: form.message || `Interested in: ${property.title}`,
        propertyId: property._id,
        propertyTitle: property.title,
      });
      setSubmitted(true);
      toast.success('Enquiry sent! We will contact you shortly.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      toast.error('Failed to send enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-navy font-bold">Loading Property...</p>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-4">Property Not Found</h2>
        <Link href="/properties" className="text-gold font-bold hover:underline">← Back to Properties</Link>
      </div>
    </div>
  );

  const images = property.images?.length ? property.images : ['https://via.placeholder.com/800x500?text=No+Image'];
  const statusColor = property.status?.toLowerCase() === 'available' ? 'bg-green-500' :
    property.status?.toLowerCase() === 'sold' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Toaster position="top-right" />

      {/* Enquiry Modal */}
      <AnimatePresence>
        {showEnquiry && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setShowEnquiry(false); setSubmitted(false); }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-navy">Enquire About This Property</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-1">{property.title}</p>
                </div>
                <button onClick={() => { setShowEnquiry(false); setSubmitted(false); }} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-500" size={40} />
                  </div>
                  <h4 className="text-xl font-black text-navy mb-2">Enquiry Sent!</h4>
                  <p className="text-gray-500 mb-6">Our team will contact you within 24 hours.</p>
                  <button onClick={() => { setShowEnquiry(false); setSubmitted(false); }} className="bg-gold text-navy font-bold py-3 px-8 rounded-xl hover:bg-yellow-400 transition-colors">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      type="text"
                      placeholder="Your Full Name *"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number *"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address (optional)"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Your message or questions (optional)"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-gold to-yellow-400 text-navy font-black py-4 rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={16} /> Send Enquiry</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Nav */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-navy font-bold hover:text-gold transition-colors">
            <ArrowLeft size={18} /> Back to Properties
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT - Image + Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-gray-200 shadow-xl">
              <Image
                src={images[imgIndex]}
                alt={property.title}
                fill
                className="object-cover"
              />
              {/* Status Badge */}
              <div className={`absolute top-4 left-4 ${statusColor} text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider`}>
                {property.status}
              </div>
              {/* Type Badge */}
              <div className="absolute top-4 right-4 bg-navy text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                For {property.type}
              </div>
              {/* Nav Arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setImgIndex(i => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors">
                    <ChevronRight size={20} />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIndex(i)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${i === imgIndex ? 'border-gold' : 'border-transparent'}`}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Location */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl md:text-3xl font-black text-navy mb-2">{property.title}</h1>
              <p className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin size={16} className="text-gold" /> {property.location}
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <BedDouble size={20} className="text-gold mx-auto mb-1" />
                  <p className="font-black text-navy">{property.bhk}</p>
                  <p className="text-xs text-gray-400">Bedrooms</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <Square size={20} className="text-gold mx-auto mb-1" />
                  <p className="font-black text-navy">{property.area}</p>
                  <p className="text-xs text-gray-400">sq ft area</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <Tag size={20} className="text-gold mx-auto mb-1" />
                  <p className="font-black text-navy capitalize">{property.type}</p>
                  <p className="text-xs text-gray-400">Listing type</p>
                </div>
              </div>

              {/* Description */}
              <h2 className="text-lg font-black text-navy mb-3">About This Property</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-black text-navy mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map(amenity => {
                    const Icon = AMENITY_ICONS[amenity] || CheckCircle;
                    return (
                      <div key={amenity} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                          <Icon size={15} className="text-gold" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Price + CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">
                  {property.type === 'rent' ? 'Monthly Rent' : 'Sale Price'}
                </p>
                <p className="text-3xl font-black text-navy mb-1">
                  {formatPrice(property.price)}
                </p>
                {property.type === 'rent' && <p className="text-gray-400 text-sm">/month</p>}

                <div className="border-t border-gray-100 my-5" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Property Type</span>
                    <span className="font-bold text-navy capitalize">{property.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Configuration</span>
                    <span className="font-bold text-navy">{property.bhk}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Area</span>
                    <span className="font-bold text-navy">{property.area} sq ft</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-black text-xs px-2 py-1 rounded-full text-white ${statusColor}`}>{property.status}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowEnquiry(true)}
                  className="w-full bg-gradient-to-r from-gold to-yellow-400 text-navy font-black py-4 rounded-2xl hover:shadow-lg hover:shadow-gold/30 transition-all text-sm tracking-wide flex items-center justify-center gap-2 mb-3"
                >
                  <Send size={16} /> Enquire Now
                </button>
                <a
                  href="tel:+919876543210"
                  className="w-full flex items-center justify-center gap-2 bg-navy text-white font-bold py-3.5 rounded-2xl hover:bg-blue-900 transition-colors text-sm"
                >
                  <Phone size={16} /> Call Us Directly
                </a>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-br from-navy to-blue-900 rounded-3xl p-5 text-white">
                <p className="font-black mb-3 text-sm uppercase tracking-wider text-gold">Why Choose Us</p>
                <ul className="space-y-2">
                  {['RERA Registered Projects', 'Transparent Pricing', 'Zero Hidden Charges', 'Expert Legal Guidance'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-200">
                      <CheckCircle size={14} className="text-gold shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
