import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Shield, Phone, Globe, CheckCircle,
  ChevronRight, Building2, Users, Stethoscope
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Hospital, Doctor, Review } from '../lib/types';
import StarRating from '../components/StarRating';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'doctors' | 'reviews'>('overview');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('hospitals').select('*').eq('id', id).maybeSingle(),
      supabase.from('doctors').select('*').eq('hospital_id', id),
      supabase.from('reviews').select('*').eq('hospital_id', id).order('created_at', { ascending: false }),
    ]).then(([{ data: h }, { data: d }, { data: r }]) => {
      setHospital(h);
      setDoctors(d || []);
      setReviews(r || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="pt-16"><LoadingSpinner text="Loading hospital details..." /></div>;
  if (!hospital) return <div className="pt-16 text-center py-24 text-slate-500">Hospital not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero banner */}
      <div className="relative h-64 sm:h-80">
        <img src={hospital.image_url} alt={hospital.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {hospital.accreditations.map(a => (
                  <span key={a} className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {a}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{hospital.name}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-white/90 text-sm">{hospital.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rating strip */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-slate-400 mb-1">Overall Rating</p>
                <StarRating rating={hospital.rating} reviewCount={hospital.review_count} size="lg" />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Specializations</p>
                <p className="text-sm font-semibold text-slate-700">{hospital.specializations.length} specialties</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Estimated Cost</p>
                <p className="text-sm font-bold text-emerald-600">₹{hospital.min_cost.toLocaleString()} – ₹{hospital.max_cost.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Doctors</p>
                <p className="text-sm font-semibold text-slate-700">{doctors.length} specialists</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              {(['overview', 'doctors', 'reviews'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 text-sm font-medium py-2 rounded-lg capitalize transition-colors ${tab === t ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  {t === 'doctors' ? `Doctors (${doctors.length})` : t === 'reviews' ? `Reviews (${reviews.length})` : 'Overview'}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-sky-500" /> About
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-sm">{hospital.description}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-sky-500" /> Specializations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specializations.map(s => (
                      <span key={s} className="text-sm bg-sky-50 text-sky-700 px-3 py-1 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-sky-500" /> Facilities
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {hospital.facilities.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'doctors' && (
              <div>
                {doctors.length === 0 ? (
                  <p className="text-slate-400 text-center py-12">No doctors listed yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map(d => (
                      <DoctorCard key={d.id} doctor={d} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
                    No reviews yet. Be the first to review this hospital.
                  </div>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl p-5 border border-slate-100">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{r.reviewer_name}</p>
                          <p className="text-xs text-slate-400">{r.reviewer_country}</p>
                        </div>
                        <StarRating rating={r.rating} showValue={false} />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-700 mt-2">{r.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{r.body}</p>
                      <p className="text-xs text-slate-300 mt-3">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Book Appointment</h3>
              {doctors.length > 0 ? (
                <div className="space-y-2">
                  {doctors.slice(0, 3).map(d => (
                    <Link
                      key={d.id}
                      to={`/book/${d.id}`}
                      className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl hover:bg-sky-50 hover:border-sky-200 border border-transparent transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={d.image_url} alt={d.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{d.name}</p>
                          <p className="text-xs text-slate-400 truncate">{d.specialization}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </Link>
                  ))}
                  {doctors.length > 3 && (
                    <button onClick={() => setTab('doctors')} className="w-full text-sm text-sky-600 hover:underline mt-1">
                      View all {doctors.length} doctors
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No doctors available.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-500" /> International Services
              </h3>
              {hospital.international_support ? (
                <ul className="space-y-2 text-sm text-slate-600">
                  {['Medical visa assistance', 'Airport pickup & drop', 'Interpreter services', 'Currency exchange guidance', 'Dedicated patient coordinators', 'International insurance accepted'].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">International support not confirmed.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-500" /> Contact
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{hospital.accreditations.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
