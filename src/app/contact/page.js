'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, Clock, HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
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
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cms`)
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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`, formData);
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
    <div className="bg-[#f8fafc] min-h-screen pb-24 overflow-hidden relative">
      {/* Decorative background blurs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero */}
      <section className="bg-navy pt-32 pb-48 px-4 text-center relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/15 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4"></div>
        
        <motion.div className="relative z-10 max-w-4xl mx-auto" {...fadeInUp}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold border border-gold/20 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_30px_rgba(201,168,76,0.2)]">
            <MessageSquare size={16} /> Get In Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {cms.contact.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            {cms.contact.subtitle}
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Contact Info Sidebar */}
          <motion.div 
            className="xl:col-span-4 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {settings?.phone && (
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-start gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                  <Phone size={28} className="text-navy group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-1 tracking-tight">Call Us</h3>
                  <p className="text-gray-600 font-medium">{settings.phone}</p>
                  {settings.whatsappNumber && (
                    <p className="text-gray-500 text-sm mt-1">WA: {settings.whatsappNumber}</p>
                  )}
                </div>
              </div>
            )}
            
            {settings?.email && (
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-start gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                  <Mail size={28} className="text-navy group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-1 tracking-tight">Email Us</h3>
                  <p className="text-gray-600 font-medium">{settings.email}</p>
                </div>
              </div>
            )}

            {settings?.address && (
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-start gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                  <MapPin size={28} className="text-navy group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-1 tracking-tight">Visit Office</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{settings.address}</p>
                </div>
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-start gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                <Clock size={28} className="text-navy group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy mb-1 tracking-tight">Business Hours</h3>
                <p className="text-gray-600 text-sm mb-1">Monday - Saturday</p>
                <p className="text-navy font-bold text-lg">{cms.contact.officeHours}</p>
                <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider font-semibold">Sunday: Appointment Only</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="xl:col-span-8 bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Form decorative element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-4xl font-black text-navy mb-2 tracking-tight">Send a Message</h2>
            <p className="text-gray-500 mb-8 font-medium">Fill out the form below and our real estate experts will get back to you.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all duration-300 font-medium placeholder-gray-400" 
                    placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all duration-300 font-medium placeholder-gray-400" 
                    placeholder="Enter your phone number" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all duration-300 font-medium placeholder-gray-400" 
                    placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Interested In</label>
                  <div className="relative">
                    <select name="interest" value={formData.interest} onChange={handleChange} 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all duration-300 font-medium appearance-none cursor-pointer">
                      <option value="Buy">Buying a Property</option>
                      <option value="Rent">Renting a Property</option>
                      <option value="General">General Inquiry</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-navy ml-1">Your Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="4" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all duration-300 font-medium resize-none placeholder-gray-400" 
                  placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" disabled={loading} 
                className="w-full md:w-auto px-10 py-4 bg-navy text-white rounded-2xl font-bold text-lg hover:bg-gold hover:shadow-[0_10px_20px_rgba(201,168,76,0.3)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center group ml-auto mt-4">
                {loading ? 'Sending...' : (
                  <>
                    Send Message
                    <Send size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        {cms.faqs && cms.faqs.length > 0 && (
          <motion.div className="mt-32 max-w-4xl mx-auto" {...fadeInUp}>
            <div className="text-center mb-16">
              <span className="text-gold font-bold tracking-widest uppercase text-sm mb-3 block">Got Questions?</span>
              <h2 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-4">
              {cms.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <button 
                    className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none group"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className={`font-bold text-lg transition-colors duration-300 ${openFaq === index ? 'text-gold' : 'text-navy group-hover:text-gold'}`}>
                      {faq.question}
                    </span>
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-gold text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gold/10 group-hover:text-gold'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8 pt-0">
                          <div className="w-full h-px bg-gray-50 mb-6"></div>
                          <p className="text-gray-600 text-base leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Map */}
        <motion.div className="mt-32 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.1)] h-[500px] border-[12px] border-white bg-gray-100 relative group" {...fadeInUp}>
          <div className="absolute inset-0 border-2 border-gold/20 rounded-[2rem] pointer-events-none z-10"></div>
          <iframe 
            src={settings?.googleMapsLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120562.13887625126!2d73.0805566!3d19.2069818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be795856b3b2463%3A0xc66579c29ceb64dc!2sAmbernath%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
