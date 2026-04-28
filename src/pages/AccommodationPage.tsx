import { useState } from 'react';
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, Hotel, SlidersHorizontal } from 'lucide-react';
import { MOCK_HOTELS, CITIES } from '../lib/types';

const HOTEL_TYPES = ['All', 'Luxury', 'Business', 'Comfort', 'Budget'];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-3.5 h-3.5" />,
  'Airport Shuttle': <Car className="w-3.5 h-3.5" />,
  'Restaurant': <Utensils className="w-3.5 h-3.5" />,
  'Gym': <Dumbbell className="w-3.5 h-3.5" />,
};

export default function AccommodationPage() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);

  const filtered = MOCK_HOTELS.filter(h => {
    if (selectedCity !== 'All' && h.city !== selectedCity) return false;
    if (selectedType !== 'All' && h.type !== selectedType) return false;
    if (h.price_per_night > maxPrice) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-gradient-to-r from-teal-700 to-teal-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Hotel className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Accommodation</h1>
          </div>
          <p className="text-teal-100">Find stays near top Indian hospitals — from budget-friendly to luxury options</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-700">Filter Accommodations</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">City</label>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2 outline-none"
              >
                {CITIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Type</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2 outline-none"
              >
                {HOTEL_TYPES.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="text-xs text-slate-400 block mb-1">Max Price/Night: <span className="font-semibold text-slate-700">${maxPrice}</span></label>
              <input
                type="range"
                min={20}
                max={300}
                step={10}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>$20</span><span>$300</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-5">{filtered.length} accommodations found</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(hotel => (
            <div key={hotel.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    hotel.type === 'Luxury' ? 'bg-amber-400 text-amber-900' :
                    hotel.type === 'Budget' ? 'bg-emerald-500 text-white' :
                    'bg-sky-500 text-white'
                  }`}>
                    {hotel.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                  {Array(hotel.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-800 text-lg">{hotel.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {hotel.city}
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <MapPin className="w-3 h-3" />
                  {hotel.distance_to_hospital} from nearest hospital
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {hotel.amenities.slice(0, 4).map(a => (
                    <span key={a} className="flex items-center gap-1 text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full">
                      {AMENITY_ICONS[a] || null}
                      {a}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">per night from</span>
                    <p className="text-xl font-bold text-sky-600">${hotel.price_per_night}</p>
                  </div>
                  <button className="text-sm font-semibold bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl transition-colors">
                    View Rates
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Hotel className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p>No accommodations match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
