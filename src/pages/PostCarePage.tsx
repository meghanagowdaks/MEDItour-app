import { useState } from 'react';
import { Heart, MapPin, Phone, Video, Star, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { REHAB_CENTERS } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const POST_CARE_TIPS = [
  { icon: '💊', title: 'Medication Management', desc: 'Follow your discharge prescription. MediBridge can connect you with Indian pharmacies for continued supply.' },
  { icon: '🩺', title: 'Follow-up Consultations', desc: 'Schedule teleconsultations with your Indian specialist 2, 6, and 12 weeks post-surgery.' },
  { icon: '🏃', title: 'Physical Rehabilitation', desc: 'Work with a certified physiotherapist. We partner with centers in your home country too.' },
  { icon: '🥗', title: 'Nutrition & Diet', desc: 'Receive personalized dietary guidance from our registered dietitians via teleconsult.' },
  { icon: '🧠', title: 'Mental Wellness', desc: 'Adjustment after surgery can be challenging. Access mental health support through our network.' },
  { icon: '📋', title: 'Medical Records', desc: 'Receive full digital medical records from your Indian hospital, sharable with your home doctor.' },
];

export default function PostCarePage() {
  const { user } = useAuth();
  const [showTeleconsult, setShowTeleconsult] = useState(false);
  const [teleconsultForm, setTeleconsultForm] = useState({ name: '', email: '', concern: '', preferred_date: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleTeleconsult = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-gradient-to-r from-rose-600 to-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-8 h-8 text-white fill-white/40" />
            <h1 className="text-3xl font-bold text-white">Post-Treatment Care</h1>
          </div>
          <p className="text-rose-100">Comprehensive rehabilitation, follow-up care, and teleconsultation support after your treatment in India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Post-care tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-5">Your Recovery Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POST_CARE_TIPS.map(tip => (
              <div key={tip.title} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex gap-4">
                <span className="text-3xl">{tip.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{tip.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rehab centers */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-5">Rehabilitation Centers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REHAB_CENTERS.map(center => (
              <div key={center.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{center.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {center.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">{center.rating}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {center.specialties.map(s => (
                    <span key={s} className="text-xs bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full font-medium">{s}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {center.contact}
                  </div>
                  {center.teleconsult && (
                    <span className="text-xs bg-teal-50 text-teal-600 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Video className="w-3 h-3" /> Teleconsult
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 text-sm font-medium text-sky-600 border border-sky-200 hover:bg-sky-50 py-2 rounded-xl transition-colors">
                    View Details
                  </button>
                  {center.teleconsult && (
                    <button
                      onClick={() => setShowTeleconsult(true)}
                      className="flex-1 flex items-center justify-center gap-1 text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" /> Book Teleconsult
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Follow-up booking */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl p-6 text-white">
            <Calendar className="w-10 h-10 mb-4 opacity-80" />
            <h2 className="text-xl font-bold mb-2">Schedule a Follow-up</h2>
            <p className="text-sky-100 text-sm leading-relaxed mb-5">
              Book a follow-up appointment with your Indian doctor or find a specialist near you. We recommend check-ups at 2 weeks, 6 weeks, and 3 months post-surgery.
            </p>
            {user ? (
              <Link
                to="/bookings"
                className="inline-flex items-center gap-2 bg-white text-sky-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-sky-50 transition-colors text-sm"
              >
                My Appointments <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-sky-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-sky-50 transition-colors text-sm"
              >
                Sign In to Book <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <Video className="w-10 h-10 text-teal-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Teleconsultation</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Connect with your Indian specialist from anywhere in the world via secure video call. Available for post-operative follow-ups and ongoing care.
            </p>
            {submitted ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-4 py-3 rounded-xl">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Request submitted! We'll confirm your teleconsult slot within 24 hours.
              </div>
            ) : (
              <button
                onClick={() => setShowTeleconsult(true)}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                <Video className="w-4 h-4" /> Request Teleconsult
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Teleconsult modal */}
      {showTeleconsult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Request Teleconsultation</h3>
              <button onClick={() => setShowTeleconsult(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                ✕
              </button>
            </div>
            {submitted ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Request Received!</h3>
                <p className="text-slate-500 text-sm">Our medical team will contact you within 24 hours to confirm your teleconsult slot.</p>
                <button onClick={() => { setShowTeleconsult(false); }} className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleTeleconsult} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Full Name</label>
                  <input
                    required
                    type="text"
                    value={teleconsultForm.name}
                    onChange={e => setTeleconsultForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email</label>
                  <input
                    required
                    type="email"
                    value={teleconsultForm.email}
                    onChange={e => setTeleconsultForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Medical Concern</label>
                  <textarea
                    required
                    rows={3}
                    value={teleconsultForm.concern}
                    onChange={e => setTeleconsultForm(f => ({ ...f, concern: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 resize-none"
                    placeholder="Describe your post-treatment concern or question..."
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Preferred Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={teleconsultForm.preferred_date}
                    onChange={e => setTeleconsultForm(f => ({ ...f, preferred_date: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                  />
                </div>
                <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
