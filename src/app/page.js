'use client';

import Link from 'next/link';
import { Home, Key, MapPin, Star, PhoneCall, CheckCircle, Search, ShieldCheck, Dumbbell, Droplets, TreePine } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  const [cms, setCms] = useState({
    heroTitle: 'Find Your Dream Home With KHAN Builders',
    heroSubtitle: 'Discover premium properties for sale and rent in Ambernath and Thane. We build homes that echo your dreams.',
    statsHappyFamilies: '500+',
    statsYearsExperience: '15+',
    statsProjectsDelivered: '12+',
    advantageTitle: 'The KHAN Advantage',
    advantageSubtitle: 'We build more than just houses; we create holistic living environments where families thrive and memories are made.',
    advantages: [
      { icon: 'ShieldCheck', title: 'Trusted Quality', desc: 'Premium grade materials and superior construction standards that stand the test of time.' },
      { icon: 'MapPin', title: 'Prime Locations', desc: 'Strategically located projects with excellent connectivity in Ambernath & Thane.' },
      { icon: 'Key', title: 'Affordable Luxury', desc: 'Experience best-in-class amenities at highly competitive and transparent prices.' },
      { icon: 'PhoneCall', title: '24/7 Support', desc: 'Dedicated customer service guiding you through every step of your home buying journey.' }
    ],
    amenitiesTitle: 'World-Class Amenities',
    amenitiesSubtitle: 'Our projects are designed to provide a resort-like lifestyle right at your doorstep. From fitness centers to lush green landscapes, we ensure every family member finds their perfect spot.',
    amenities: [
      { icon: 'Dumbbell', text: 'Modern Gymnasium' },
      { icon: 'Droplets', text: 'Swimming Pool' },
      { icon: 'TreePine', text: 'Landscaped Gardens' },
      { icon: 'ShieldCheck', text: '24/7 CCTV Security' }
    ],
    ctaTitle: 'Ready to step into your dream home?',
    ctaSubtitle: 'Schedule a site visit today and experience luxury firsthand.'
  });

  // Helper to get the Lucide icon dynamically
  const IconComponent = ({ name, ...props }) => {
    const icons = { ShieldCheck, MapPin, Key, PhoneCall, Dumbbell, Droplets, TreePine, Star, CheckCircle };
    const Icon = icons[name] || CheckCircle;
    return <Icon {...props} />;
  };

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchCms = () => {
      axios.get('http://localhost:5000/api/cms')
        .then(res => {
          if (res.data?.home) setCms(res.data.home);
        })
        .catch(err => console.error('Error fetching CMS data', err));
    };

    const fetchTestimonials = () => {
      axios.get('http://localhost:5000/api/testimonials')
        .then(res => setTestimonials(res.data))
        .catch(err => console.error('Error fetching testimonials', err));
    };

    fetchCms();
    fetchTestimonials();
    const interval = setInterval(() => {
      fetchCms();
      fetchTestimonials();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      {cms.heroTitle && (
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-navy pt-20 pb-16">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-fixed" />
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl leading-tight tracking-tight max-w-4xl mx-auto">
            {cms.heroTitle.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 whitespace-nowrap">
              {cms.heroTitle.split(' ').slice(-2).join(' ')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto drop-shadow-lg font-light">
            {cms.heroSubtitle}
          </p>
        </motion.div>

        {/* Quick Search Bar */}
        <motion.div 
          className="relative z-20 w-full max-w-4xl px-4 mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl">
            <div className="bg-white rounded-xl flex flex-col md:flex-row p-2 gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                <MapPin className="text-gold mr-3" size={20} />
                <input type="text" placeholder="Location (e.g. Ambernath)" className="bg-transparent w-full outline-none text-navy" />
              </div>
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                <Home className="text-gold mr-3" size={20} />
                <select className="bg-transparent w-full outline-none text-navy appearance-none cursor-pointer">
                  <option value="">Property Type</option>
                  <option value="1bhk">1 BHK</option>
                  <option value="2bhk">2 BHK</option>
                  <option value="3bhk">3 BHK</option>
                </select>
              </div>
              <Link href="/properties/sale" className="bg-gold text-navy px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-all shadow-md flex items-center justify-center group">
                <Search className="mr-2 group-hover:scale-110 transition-transform" size={20} /> Search
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      )}

      {/* Stats Bar */}
      {cms.statsHappyFamilies && (
      <section className="bg-gray-50 py-10 relative z-30 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {[
            { count: cms.statsYearsExperience, label: 'Years Experience' },
            { count: cms.statsHappyFamilies, label: 'Happy Families' },
            { count: cms.statsProjectsDelivered, label: 'Projects Done' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="p-4 group"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-4xl md:text-5xl font-black text-navy mb-2 group-hover:scale-110 transition-transform duration-300">{stat.count}</h3>
              <p className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* Why Choose Us */}
      {cms.advantageTitle && (
      <section className="py-32 bg-white px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto z-10">
          <motion.div className="text-center mb-20" {...fadeInUp}>
            <h2 className="text-4xl md:text-6xl font-black text-navy mb-6 tracking-tight">{cms.advantageTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-xl">{cms.advantageSubtitle}</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {((cms.advantages && cms.advantages.length > 0) ? cms.advantages : [
              { icon: 'ShieldCheck', title: 'Trusted Quality', desc: 'Premium grade materials and superior construction standards that stand the test of time.' },
              { icon: 'MapPin', title: 'Prime Locations', desc: 'Strategically located projects with excellent connectivity in Ambernath & Thane.' },
              { icon: 'Key', title: 'Affordable Luxury', desc: 'Experience best-in-class amenities at highly competitive and transparent prices.' },
              { icon: 'PhoneCall', title: '24/7 Support', desc: 'Dedicated customer service guiding you through every step of your home buying journey.' }
            ]).map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-500 border border-white hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-yellow-400 transition-all duration-500 transform group-hover:-rotate-6 group-hover:scale-110">
                  <IconComponent name={feature.icon} size={32} className="text-navy group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* Premium Amenities Section */}
      {cms.amenitiesTitle && (
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              {cms.amenitiesTitle.split(' ').map((word, i, arr) => 
                i >= arr.length - 1 
                  ? <span key={i} className="text-gold">{word}</span>
                  : <span key={i}>{word} </span>
              )}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {cms.amenitiesSubtitle}
            </p>
            <div className="grid grid-cols-2 gap-8">
              {((cms.amenities && cms.amenities.length > 0) ? cms.amenities : [
                { icon: 'Dumbbell', text: 'Modern Gymnasium' },
                { icon: 'Droplets', text: 'Swimming Pool' },
                { icon: 'TreePine', text: 'Landscaped Gardens' },
                { icon: 'ShieldCheck', text: '24/7 CCTV Security' }
              ]).map((item, i) => (
                <div key={i} className="flex items-center space-x-4 group p-3 hover:bg-gold/5 rounded-2xl transition-colors cursor-default">
                  <div className="w-14 h-14 rounded-full bg-gold/10 group-hover:bg-gold flex items-center justify-center flex-shrink-0 transition-colors duration-300 shadow-sm group-hover:shadow-lg">
                    <IconComponent name={item.icon} className="text-gold group-hover:text-white transition-colors duration-300" size={26} />
                  </div>
                  <span className="font-bold text-navy text-lg group-hover:text-gold transition-colors">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/gallery" className="text-gold font-bold hover:text-navy transition-colors flex items-center">
                View Gallery 
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Luxury Amenities"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
      <section className="py-24 bg-navy text-white px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-20" {...fadeInUp}>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">Clients Say</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-xl font-light">Don&apos;t just take our word for it. Hear from the families who have found their perfect home with us.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {testimonials.map((test, i) => (
              <motion.div key={test._id || i} variants={fadeInUp} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 shadow-2xl flex flex-col">
                <div className="flex text-gold mb-6 drop-shadow-md">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={22} className={j < (test.rating || 5) ? 'fill-current' : 'fill-none opacity-30'} />
                  ))}
                </div>
                <p className="text-gray-200 italic mb-8 text-lg font-light leading-relaxed flex-1">&quot;{test.review}&quot;</p>
                <div className="flex items-center">
                  {test.photo ? (
                    <img src={test.photo} alt={test.customerName} className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-gold/30" onError={e => { e.target.style.display='none'; }} />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-gold to-yellow-400 text-navy rounded-full flex items-center justify-center font-black text-2xl mr-4 shadow-lg shadow-gold/20">
                      {test.customerName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-white text-lg">{test.customerName}</h4>
                    <p className="text-sm text-gray-400">Happy Homeowner</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* Call to Action */}
      {cms.ctaTitle && (
      <section className="py-24 bg-gold text-navy text-center px-4 relative">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{cms.ctaTitle}</h2>
          <p className="text-xl md:text-2xl text-navy/80 mb-10 font-medium">{cms.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="inline-flex justify-center items-center bg-navy text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-navy/90 transition-all shadow-xl hover:-translate-y-1">
              <PhoneCall className="mr-2" size={20} /> Schedule a Visit
            </Link>
            <Link href="/properties/sale" className="inline-flex justify-center items-center bg-white text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:-translate-y-1 border border-navy/10">
              Browse Properties
            </Link>
          </div>
        </motion.div>
      </section>
      )}
    </div>
  );
}
