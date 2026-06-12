'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '../../components/PropertyCard';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';

export default function PropertiesPage() {
  const [typeFilter, setTypeFilter] = useState('sale'); // 'sale' or 'rent'
  const [bhkFilter, setBhkFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const [properties, setProperties] = useState([]);

  const [cms, setCms] = useState({
    propertiesSale: { title: 'Properties for Sale', subtitle: 'Explore our premium listings available for outright purchase.' },
    propertiesRent: { title: 'Properties for Rent', subtitle: 'Find your perfect rental home with our curated list of properties.' }
  });

  useEffect(() => {
    const fetchCms = () => {
      axios.get('http://localhost:5000/api/cms')
        .then(res => {
          if (res.data) {
            setCms(prev => ({
              propertiesSale: res.data.propertiesSale || prev.propertiesSale,
              propertiesRent: res.data.propertiesRent || prev.propertiesRent
            }));
          }
        })
        .catch(err => console.error('Error fetching CMS data', err));
    };
    
    const fetchProperties = () => {
      axios.get('http://localhost:5000/api/properties')
        .then(res => setProperties(res.data))
        .catch(err => console.error('Error fetching properties', err));
    };
    fetchCms();
    fetchProperties();
    const interval = setInterval(() => {
      fetchCms();
      fetchProperties();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredProperties = properties?.filter(p => {
    if (!p) return false;
    if (p.type !== typeFilter) return false;
    if (bhkFilter && p.bhk !== bhkFilter) return false;
    if (locationFilter && (!p.location || !p.location.toLowerCase().includes(locationFilter.toLowerCase()))) return false;
    if (priceFilter && typeFilter === 'sale') {
      if (priceFilter === 'low' && p.price > 5000000) return false;
      if (priceFilter === 'mid' && (p.price <= 5000000 || p.price > 10000000)) return false;
      if (priceFilter === 'high' && p.price <= 10000000) return false;
    }
    return true;
  }) || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Banner */}
      {(cms[typeFilter === 'sale' ? 'propertiesSale' : 'propertiesRent'].title || cms[typeFilter === 'sale' ? 'propertiesSale' : 'propertiesRent'].subtitle) && (
      <div className="bg-navy py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {typeFilter === 'sale' ? cms.propertiesSale.title : cms.propertiesRent.title}
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-gold to-yellow-400 mx-auto mb-8 rounded-full shadow-lg shadow-gold/20"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {typeFilter === 'sale' ? cms.propertiesSale.subtitle : cms.propertiesRent.subtitle}
          </p>
        </motion.div>
      </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Buy / Rent Toggle Tabs */}
        <div className="flex justify-center mb-12 relative z-20 -mt-16">
          <div className="bg-white/80 backdrop-blur-xl p-2 rounded-full shadow-2xl border border-white inline-flex relative">
            <button
              onClick={() => setTypeFilter('sale')}
              className={`px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 z-10 ${
                typeFilter === 'sale' ? 'text-navy shadow-lg' : 'text-gray-500 hover:text-navy'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setTypeFilter('rent')}
              className={`px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 z-10 ${
                typeFilter === 'rent' ? 'text-navy shadow-lg' : 'text-gray-500 hover:text-navy'
              }`}
            >
              For Rent
            </button>
            {/* Sliding highlight */}
            <div 
              className={`absolute top-2 bottom-2 w-[calc(50%-0.5rem)] bg-gradient-to-r from-gold to-yellow-400 rounded-full transition-transform duration-500 ease-in-out shadow-lg shadow-gold/30 z-0 ${typeFilter === 'rent' ? 'translate-x-full left-2' : 'translate-x-0 left-2'}`}
            ></div>
          </div>
        </div>

        {/* Advanced Filter Bar */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-12 flex flex-wrap gap-4 items-center justify-between relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center text-navy font-bold text-lg w-full md:w-auto mb-2 md:mb-0">
            <SlidersHorizontal className="mr-2 text-gold" size={24} /> Filters
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto flex-1 md:justify-end">
            <select 
              value={bhkFilter} onChange={(e) => setBhkFilter(e.target.value)}
              className="px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold focus:bg-white w-full md:w-auto min-w-[150px] cursor-pointer font-medium hover:border-gold transition-colors appearance-none shadow-sm"
            >
              <option value="">Any BHK</option>
              <option value="1BHK">1 BHK</option>
              <option value="2BHK">2 BHK</option>
              <option value="3BHK">3 BHK</option>
              <option value="4BHK+">4 BHK+</option>
            </select>
            <select 
              value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
              className="px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold focus:bg-white w-full md:w-auto min-w-[150px] cursor-pointer font-medium hover:border-gold transition-colors appearance-none shadow-sm"
            >
              <option value="">Any Location</option>
              <option value="Ambernath">Ambernath</option>
              <option value="Thane">Thane</option>
            </select>
            {typeFilter === 'sale' && (
              <select 
                value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}
                className="px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold focus:bg-white w-full md:w-auto min-w-[150px] cursor-pointer font-medium hover:border-gold transition-colors appearance-none shadow-sm"
              >
                <option value="">Any Price</option>
                <option value="low">Under ₹50L</option>
                <option value="mid">₹50L - ₹1Cr</option>
                <option value="high">Above ₹1Cr</option>
              </select>
            )}
          </div>
        </motion.div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center text-gray-600">
          <p>Showing <strong>{filteredProperties.length}</strong> properties for {typeFilter}</p>
        </div>

        {/* Grid */}
        {filteredProperties.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            animate="whileInView"
            variants={{
              initial: { opacity: 0 },
              whileInView: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            key={typeFilter}
          >
            {filteredProperties.map((prop) => (
              <motion.div key={prop._id || prop.id} variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }}>
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Search className="mx-auto text-gray-300 w-16 h-16 mb-4" />
            <h3 className="text-2xl font-bold text-navy mb-2">No Properties Found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            <button onClick={() => {setBhkFilter(''); setLocationFilter(''); setPriceFilter('');}} className="mt-6 text-gold font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
