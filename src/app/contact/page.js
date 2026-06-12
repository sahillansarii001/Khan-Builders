'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSettings } from '../../context/SettingsContext';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'Buy',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { settings } = useSettings();
  const [cms, setCms] = useState({
    contact: { 
      title: 'Get in Touch', 
      subtitle: 'We are here to answer your questions and help you find your dream home.', 
      officeHours: 'Mon - Sat: 10:00 AM - 7:00 PM',
      address: 'Shop No 1, Main Road, Ambernath (W), Maharashtra 421501',
      phones: ['+91 98765 43210', '+91 12345 67890'],
      emails: ['info@khanbuilders.com', 'sales@khanbuilders.com']
    },
    faqs: [
      { question: "What is the booking amount for a new flat?", answer: "The booking amount varies by project but is typically 5% to 10% of the total property value." },
      { question: "Do you help with home loans?", answer: "Yes, we have tie-ups with major nationalized and private banks to assist you in securing a home loan at competitive interest rates." },
      { question: "Are your projects RERA registered?", answer: "Absolutely. All our ongoing projects are strictly RERA compliant and registered." },
      { question: "Can non-resident Indians (NRIs) buy property?", answer: "Yes, NRIs can easily purchase residential properties with us. Our team provides end-to-end assistance with the legal documentation." }
    ]
  });

  useEffect(() => {
    const fetchCms = () => {
      axios.get('http://localhost:5000/api/cms')
        .then(res => {
          if (res.data) {
            setCms(prev => ({
              contact: res.data.contact || prev.contact,
              faqs: res.data.faqs?.length ? res.data.faqs : prev.faqs
            }));
          }
        })
        .catch(err => console.error('Error fetching CMS data', err));
    };
    fetchCms();
    const interval = setInterval(fetchCms, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/leads', formData);
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      setFormData({ name: '', phone: '', email: '', interest: 'Buy', message: '' });
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 overflow-hidden">
      {/* Hero */}
      {(cms.contact.title || cms.contact.subtitle) && (
      <section className="bg-navy py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <motion.div className="relative z-10" {...fadeInUp}>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {cms.contact.title.split(' ').map((word, i, arr) => 
              i >= arr.length - 1 
                ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">{word}</span>
                : <span key={i}>{word} </span>
            )}
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-gold to-yellow-400 mx-auto mb-8 rounded-full shadow-lg shadow-gold/20"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">{cms.contact.subtitle}</p>
        </motion.div>
      </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div 
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {settings?.phone && (
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-500 group">
              <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-yellow-400 transition-colors duration-500 transform group-hover:-rotate-6">
                <Phone size={36} className="text-gold group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-black text-navy mb-3 tracking-tight">Phone</h3>
              <p className="text-gray-600 text-lg font-medium">{settings.phone}</p>
              {settings.whatsappNumber && (
                <p className="text-gray-600 text-lg font-medium mt-1">WA: {settings.whatsappNumber}</p>
              )}
            </div>
            )}
            
            {settings?.email && (
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-500 group">
              <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-yellow-400 transition-colors duration-500 transform group-hover:rotate-6">
                <Mail size={36} className="text-gold group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-black text-navy mb-3 tracking-tight">Email</h3>
              <p className="text-gray-600 text-lg font-medium">{settings.email}</p>
            </div>
            )}

            {settings?.address && (
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-500 group">
              <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-yellow-400 transition-colors duration-500 transform group-hover:-rotate-6">
                <MapPin size={36} className="text-gold group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-black text-navy mb-3 tracking-tight">Head Office</h3>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">{settings.address}</p>
            </div>
            )}

            <div className="bg-navy p-10 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.2)] flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-sm relative z-10">
                <Clock size={36} />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight relative z-10">Office Hours</h3>
              <p className="text-gray-300 text-lg relative z-10">Monday - Saturday</p>
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 font-bold text-2xl my-2 relative z-10">{cms.contact.officeHours}</p>
              <p className="text-gray-400 text-sm mt-2 font-medium tracking-wide relative z-10">Sunday: By Appointment</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-gray-100 relative overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-4xl font-black text-navy mb-3 tracking-tight">Send an Inquiry</h2>
            <p className="text-gray-500 text-lg mb-10 font-light">Fill out the form below and our sales representative will call you back within 24 hours.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">I am interested in *</label>
                  <select name="interest" value={formData.interest} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all appearance-none cursor-pointer">
                    <option value="Buy">Buying a Property</option>
                    <option value="Rent">Renting a Property</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="5" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all resize-none" placeholder="Tell us about your requirements..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-navy text-white py-4 rounded-xl font-bold text-lg hover:bg-gold hover:text-navy transition-colors flex justify-center items-center shadow-lg">
                {loading ? 'Sending Request...' : <><Send size={20} className="mr-2" /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        {cms.faqs && cms.faqs.length > 0 && (
        <motion.div className="mt-32 max-w-4xl mx-auto" {...fadeInUp}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-navy flex items-center justify-center tracking-tight">
              <HelpCircle className="mr-4 text-gold" size={40} /> Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {cms.faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                <button 
                  className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none group"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className={`font-bold text-xl transition-colors duration-300 ${openFaq === index ? 'text-gold' : 'text-navy group-hover:text-gold'}`}>{faq.question}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${openFaq === index ? 'bg-gold/10' : 'bg-gray-50 group-hover:bg-gold/10'}`}>
                    {openFaq === index ? <ChevronUp className="text-gold" /> : <ChevronDown className="text-gray-400 group-hover:text-gold" />}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-8 pt-0">
                    <p className="text-gray-600 text-lg leading-relaxed border-t border-gray-100 pt-6">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
        )}

        {/* Map */}
        <motion.div className="mt-32 rounded-[2.5rem] overflow-hidden shadow-2xl h-[600px] border-8 border-white bg-gray-100" {...fadeInUp}>
          <iframe 
            src={settings?.googleMapsLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120562.13887625126!2d73.0805566!3d19.2069818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be795856b3b2463%3A0xc66579c29ceb64dc!2sAmbernath%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
