'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Exteriors', 'Interiors', 'Amenities', 'Ongoing Projects'];

  const [cms, setCms] = useState({
    title: 'Our Project Gallery',
    subtitle: 'Take a visual tour of our completed and ongoing projects.',
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchCms = () => {
      axios.get('http://localhost:5000/api/cms')
        .then(res => { if (res.data?.gallery) setCms(res.data.gallery); })
        .catch(err => console.error('Error fetching CMS data', err));
    };
    const fetchGallery = () => {
      axios.get('http://localhost:5000/api/gallery')
        .then(res => setImages(res.data))
        .catch(err => console.error('Error fetching gallery', err));
    };
    fetchCms();
    fetchGallery();
    const interval = setInterval(() => { fetchCms(); fetchGallery(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {(cms.title || cms.subtitle) && (
      <div className="bg-navy py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1600607687931-cebf0046d48e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {cms.title.split(' ').map((word, i, arr) => 
              i >= arr.length - 1 
                ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">{word}</span>
                : <span key={i}>{word} </span>
            )}
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-gold to-yellow-400 mx-auto mb-8 rounded-full shadow-lg shadow-gold/20"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">{cms.subtitle}</p>
        </motion.div>
      </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300 shadow-sm border ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-gold to-yellow-400 text-navy shadow-lg shadow-gold/20 scale-105 border-transparent' 
                  : 'bg-white/80 backdrop-blur-md text-gray-500 hover:bg-white hover:text-navy hover:scale-105 border-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredImages.map((img, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                key={img._id || img.imageUrl + index} 
                className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden group cursor-pointer shadow-lg border border-gray-100"
                onClick={() => setSelectedImage(img)}
              >
                <Image 
                  src={img.imageUrl || img.url} 
                  alt={img.projectName || img.project}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {img.featured && (
                  <div className="absolute top-3 left-3 bg-gold text-navy text-[10px] font-black uppercase px-2 py-1 rounded-lg flex items-center gap-1 shadow-md z-10">
                    <span>★</span> Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <Maximize2 className="text-gold mb-2 self-end absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" size={28} />
                  <span className="text-gold font-bold text-sm tracking-widest uppercase mb-1">{img.category}</span>
                  <span className="text-white font-black text-2xl">{img.projectName || img.project}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-gold transition-colors bg-white/10 p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={selectedImage.imageUrl || selectedImage.url} 
                alt={selectedImage.projectName || selectedImage.project}
                fill
                className="object-contain"
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-white px-8 py-4 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl text-center">
                <p className="text-gold font-bold text-sm uppercase tracking-wider mb-1">{selectedImage.category}</p>
                <h3 className="text-2xl font-bold">{selectedImage.projectName || selectedImage.project}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
