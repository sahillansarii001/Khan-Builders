'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Users, Target } from 'lucide-react';
import axios from 'axios';

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  const [cms, setCms] = useState({
    heroTitle: 'About KHAN Builders',
    heroSubtitle: 'Building dreams into reality with passion, precision, and unwavering integrity.',
    heroImage: 'https://images.unsplash.com/photo-1541885088529-2820c74b8862?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    journeySubtitle: 'The Journey',
    journeyTitle: 'A Legacy of Trust & Excellence',
    journeyImage: 'https://images.unsplash.com/photo-1541885088529-2820c74b8862?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    story: 'Established over a decade ago, KHAN Builders and Developers has been at the forefront of real estate innovation in Ambernath and Thane. Our journey started with a simple vision: to provide affordable, high-quality housing to the masses.',
    missionTitle: 'Our Mission',
    mission: "To deliver high-quality, affordable housing solutions that exceed our customers' expectations.",
    visionTitle: 'Our Vision',
    vision: 'To be the most trusted and respected real estate developer in Maharashtra, known for our integrity and design excellence.',
    leadershipSubtitle: 'Leadership',
    leadershipTitle: 'Meet Our Team',
    team: [
      { name: 'Mr. Salman Khan', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { name: 'Mr. Aarif Khan', role: 'Managing Director', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { name: 'Mr. Rohan Sharma', role: 'Head of Construction', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
    ]
  });

  useEffect(() => {
    const fetchCms = () => {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cms`)
        .then(res => {
          if (res.data?.about) setCms(res.data.about);
        })
        .catch(err => console.error('Error fetching CMS data', err));
    };

    fetchCms();
    const interval = setInterval(fetchCms, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      {(cms.heroTitle || cms.heroSubtitle) && (
      <section className="bg-navy py-32 px-4 text-center relative overflow-hidden">
        <div className={`absolute inset-0 opacity-20 bg-cover bg-center`} style={{ backgroundImage: `url('${cms.heroImage}')` }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <motion.div className="relative z-10" {...fadeInUp}>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {cms.heroTitle.split(' ').map((word, i, arr) => {
              if (i === arr.length - 2 || i === arr.length - 1) {
                return <span key={i} className={i === arr.length - 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200" : "text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200"}> {word}</span>;
              }
              return i === 0 ? word : ' ' + word;
            })}
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-gold to-yellow-400 mx-auto mb-8 rounded-full shadow-lg shadow-gold/20"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {cms.heroSubtitle}
          </p>
        </motion.div>
      </section>
      )}

      {/* Our Story */}
      {cms.story && (
      <section className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div className="space-y-8" {...fadeInUp}>
            <div>
              <span className="text-gold font-bold tracking-widest uppercase text-sm">{cms.journeySubtitle}</span>
              <h2 className="text-4xl md:text-5xl font-black text-navy mt-2 mb-6 tracking-tight">{cms.journeyTitle}</h2>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-line font-light">
              {cms.story}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <div className="flex items-center text-navy font-bold text-lg bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <CheckCircle className="text-gold mr-3" size={24} /> ISO 9001:2015
              </div>
              <div className="flex items-center text-navy font-bold text-lg bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <CheckCircle className="text-gold mr-3" size={24} /> RERA Registered
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image 
              src={cms.journeyImage} 
              alt="Construction Site"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>
      )}

      {/* Mission & Vision */}
      {(cms.mission || cms.vision) && (
      <section className="bg-gray-50 py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {cms.mission && (
          <motion.div 
            className="bg-white/80 backdrop-blur-xl p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] border border-gray-100 border-t-8 border-t-gold hover:-translate-y-2 transition-all duration-500 group"
            {...fadeInUp}
          >
            <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-yellow-400 transition-colors duration-500 transform group-hover:-rotate-6">
              <Target className="text-gold w-10 h-10 group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-4xl font-black text-navy mb-6 tracking-tight">{cms.missionTitle}</h3>
            <p className="text-gray-600 text-xl font-light leading-relaxed whitespace-pre-line">
              {cms.mission}
            </p>
          </motion.div>
          )}
          {cms.vision && (
          <motion.div 
            className="bg-white/80 backdrop-blur-xl p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] border border-gray-100 border-t-8 border-t-navy hover:-translate-y-2 transition-all duration-500 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-20 h-20 bg-navy/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-navy group-hover:to-blue-900 transition-colors duration-500 transform group-hover:rotate-6">
              <Award className="text-navy w-10 h-10 group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-4xl font-black text-navy mb-6 tracking-tight">{cms.visionTitle}</h3>
            <p className="text-gray-600 text-xl font-light leading-relaxed whitespace-pre-line">
              {cms.vision}
            </p>
          </motion.div>
          )}
        </div>
      </section>
      )}

      {/* Leadership Team */}
      {cms.team?.length > 0 && (
      <section className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-24" {...fadeInUp}>
            <span className="text-gold font-bold tracking-widest uppercase text-sm">{cms.leadershipSubtitle}</span>
            <h2 className="text-5xl md:text-6xl font-black text-navy mt-4 tracking-tight">{cms.leadershipTitle}</h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {cms.team.map((member, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center group">
                <div className="relative w-72 h-72 mx-auto mb-8 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group-hover:border-gold transition-colors duration-500">
                  <Image 
                    src={member.img || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-3xl font-black text-navy mb-2 group-hover:text-gold transition-colors">{member.name}</h3>
                <p className="text-gray-500 font-semibold tracking-wide uppercase">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}
    </div>
  );
}
