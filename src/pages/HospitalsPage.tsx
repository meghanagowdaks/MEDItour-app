import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Hospital, SPECIALIZATIONS, CITIES } from '../lib/types';
import HospitalCard from '../components/HospitalCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CompareModal from '../components/CompareModal';

export default function HospitalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [spec, setSpec] = useState(searchParams.get('spec') || 'All');
  const [sortBy, setSortBy] = useState('rating');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchHospitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, spec, sortBy]);

  const fetchHospitals = async () => {
    setLoading(true);
    let q = supabase.from('hospitals').select('*');
    if (city !== 'All') q = q.eq('city', city);
    if (spec !== 'All') q = q.contains('specializations', [spec]);
    if (sortBy === 'rating') q = q.order('rating', { ascending: false });
    else if (sortBy === 'cost_asc') q = q.order('min_cost', { ascending: true });
    else if (sortBy === 'cost_desc') q = q.order('min_cost', { ascending: false });

    const { data } = await q;
    setHospitals(data || []);
    setLoading(false);
  };

  const filtered = query
    ? hospitals.filter(h =>
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.city.toLowerCase().includes(query.toLowerCase()) ||
        h.specializations.some(s => s.toLowerCase().includes(query.toLowerCase()))
      )
    : hospitals;

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city !== 'All') params.set('city', city);
    if (spec !== 'All') params.set('spec', spec);
    setSearchParams(params);
    fetchHospitals();
  };

  const clearFilters = () => {
    setQuery('');
    setCity('All');
    setSpec('All');
    setSortBy('rating');
    setSearchParams({});
  };

  const hasFilters = query || city !== 'All' || spec !== 'All';

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Find Hospitals in India</h1>
          <p className="mt-2 text-sky-100">Compare top-rated hospitals by specialization, city, and cost</p>
          <form onSubmit={applySearch} className="mt-6 flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search hospital, city, or treatment..."
                className="w-full pl-9 pr-3 py-3 rounded-xl text-sm text-slate-800 outline-none"
              />
            </div>
            <button type="submit" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-5 py-3 rounded-xl text-sm font-medium transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 border border-slate-200 bg-white px-4 py-2 rounded-xl hover:border-sky-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="text-sm text-slate-700 border border-slate-200 bg-white px-3 py-2 rounded-xl outline-none hover:border-sky-300 transition-colors"
          >
            {CITIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>)}
          </select>

          <select
            value={spec}
            onChange={e => setSpec(e.target.value)}
            className="text-sm text-slate-700 border border-slate-200 bg-white px-3 py-2 rounded-xl outline-none hover:border-sky-300 transition-colors"
          >
            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Specializations' : s}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm text-slate-700 border border-slate-200 bg-white px-3 py-2 rounded-xl outline-none hover:border-sky-300 transition-colors"
          >
            <option value="rating">Sort: Best Rated</option>
            <option value="cost_asc">Sort: Cost Low to High</option>
            <option value="cost_desc">Sort: Cost High to Low</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            {compareIds.length > 0 && (
              <button
                onClick={() => setShowCompare(true)}
                className="flex items-center gap-2 text-sm font-medium bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                <BarChart3 className="w-4 h-4" /> Compare ({compareIds.length})
              </button>
            )}
            <span className="text-sm text-slate-500">{filtered.length} hospitals found</span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Finding hospitals..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg">No hospitals found matching your criteria.</p>
            <button onClick={clearFilters} className="mt-4 text-sky-600 hover:underline text-sm">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(hospital => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                showCompare
                isSelected={compareIds.includes(hospital.id)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        )}
      </div>

      {showCompare && (
        <CompareModal
          hospitals={hospitals.filter(h => compareIds.includes(h.id))}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}
