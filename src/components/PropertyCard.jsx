import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Square, IndianRupee } from 'lucide-react';

export default function PropertyCard({ property }) {
  // Mock data fallback if property is not provided
  const prop = property || {
    id: '1',
    title: 'Luxury 2BHK Apartment',
    type: 'sale',
    bhk: '2BHK',
    price: 4500000,
    area: '1050 sq ft',
    location: 'Ambernath West',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    status: 'Available'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image 
          src={(prop.images && prop.images[0]) ? prop.images[0] : 'https://via.placeholder.com/500x300'} 
          alt={prop.title || 'Property'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-navy text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          For {prop.type}
        </div>
        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${(prop.status || '').toLowerCase() === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {prop.status}
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-xl font-bold text-white truncate">{prop.title}</h3>
          <p className="text-gray-300 flex items-center text-sm mt-1">
            <MapPin size={14} className="mr-1 text-gold" /> {prop.location}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6 text-gray-600">
          <div className="flex items-center">
            <BedDouble size={18} className="mr-2 text-navy" />
            <span className="font-medium">{prop.bhk}</span>
          </div>
          <div className="flex items-center">
            <Square size={18} className="mr-2 text-navy" />
            <span className="font-medium">{prop.area}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
          <div className="text-2xl font-bold text-navy flex items-center">
            {formatPrice(prop.price)}
          </div>
          <Link 
            href={`/properties/${prop._id || prop.id}`}
            className="text-gold font-semibold hover:text-navy transition-colors flex items-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
