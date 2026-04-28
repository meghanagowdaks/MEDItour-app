import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Doctor, SPECIALIZATIONS } from '../lib/types';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [spec, setSpec] = useState(searchParams.get('spec') || 'All');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, sortBy]);

  const fetchDoctors = async () => {
    setLoading(true);
    let q = supabase.from('doctors').select('*, hospital:hospitals(id,name,city)');
    if (spec !== 'All') q = q.eq('specialization', spec);
    if (sortBy === 'rating') q = q.order('rating', { ascending: false });
    else if (sortBy === 'exp') q = q.order('experience_years', { ascending: false });
    else if (sortBy === 'fee_asc') q = q.order('consultation_fee', { ascending: true });

    const { data } = await q;
    setDoctors((data as Doctor[]) || []);
    setLoading(false);
  };

  const filtered = query
    ? doctors.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.specialization.toLowerCase().includes(query.toLowerCase())
      )
    : doctors;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-gradient-to-r from-teal-600 to-sky-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Find Doctors in India</h1>
          <p className="mt-2 text-teal-100">Browse verified specialist profiles with ratings and availability</p>
          <div className="mt-6 flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search doctor name or specialization..."
                className="w-full pl-9 pr-3 py-3 rounded-xl text-sm text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
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
            <option value="exp">Sort: Most Experienced</option>
            <option value="fee_asc">Sort: Fee Low to High</option>
          </select>

          {(query || spec !== 'All') && (
            <button
              onClick={() => { setQuery(''); setSpec('All'); }}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}

          <span className="ml-auto text-sm text-slate-500">{filtered.length} doctors found</span>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading doctors..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">No doctors found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} showHospital />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
