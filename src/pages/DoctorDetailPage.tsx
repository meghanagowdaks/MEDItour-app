import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Globe, Award, Calendar, ChevronRight, Building2, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Doctor, Review } from '../lib/types';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('doctors').select('*, hospital:hospitals(*)').eq('id', id).maybeSingle(),
      supabase.from('reviews').select('*').eq('doctor_id', id).order('created_at', { ascending: false }),
    ]).then(([{ data: d }, { data: r }]) => {
      setDoctor(d as Doctor);
      setReviews(r || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="pt-16"><LoadingSpinner text="Loading doctor profile..." /></div>;
  if (!doctor) return <div className="pt-16 text-center py-24 text-slate-500">Doctor not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="relative h-52 bg-gradient-to-br from-sky-100 to-teal-100">
                <img
                  src={doctor.image_url}
                  alt={doctor.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-5">
                <h1 className="text-xl font-bold text-slate-800">{doctor.name}</h1>
                <p className="text-sky-600 font-medium mt-0.5">{doctor.specialization}</p>
                <div className="mt-2">
                  <StarRating rating={doctor.rating} reviewCount={doctor.review_count} size="md" />
                </div>

                {doctor.hospital && (
                  <Link
                    to={`/hospitals/${doctor.hospital_id}`}
                    className="mt-3 flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{(doctor.hospital as { name: string }).name}</span>
                  </Link>
                )}

                <div className="mt-4 space-y-3 text-sm border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Experience</span>
                    <span className="font-semibold text-slate-800">{doctor.experience_years} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Consultation</span>
                    <span className="font-semibold text-emerald-600">₹{doctor.consultation_fee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 flex items-center gap-1.5 shrink-0"><Globe className="w-4 h-4" /> Languages</span>
                    <span className="font-medium text-slate-700 text-right">{doctor.languages.join(', ')}</span>
                  </div>
                </div>

                <Link
                  to={`/book/${doctor.id}`}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Book Appointment <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-3">About Dr. {doctor.name.split(' ').slice(-1)[0]}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{doctor.bio}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-500" /> Qualifications & Certifications
              </h2>
              <div className="space-y-2">
                {doctor.qualifications.map(q => (
                  <div key={q} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-2 h-2 bg-sky-500 rounded-full shrink-0" />
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-500" /> Available Days
              </h2>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <span
                    key={day}
                    className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
                      doctor.available_days.includes(day)
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Patient Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-slate-400 text-sm">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{r.reviewer_name}</p>
                          <p className="text-xs text-slate-400">{r.reviewer_country}</p>
                        </div>
                        <StarRating rating={r.rating} showValue={false} />
                      </div>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{r.body}</p>
                      <p className="text-xs text-slate-300 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
