import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, Stethoscope, Plane, Hotel, Heart,
  Shield, Star, ArrowRight, CheckCircle, Users, Award
} from 'lucide-react';
import { SPECIALIZATIONS, CITIES } from '../lib/types';

const STATS = [
  { label: 'Partner Hospitals', value: '350+', icon: Heart },
  { label: 'Verified Doctors', value: '2,800+', icon: Stethoscope },
  { label: 'Countries Served', value: '85+', icon: MapPin },
  { label: 'Happy Patients', value: '1.2M+', icon: Users },
];

const TESTIMONIALS = [
  {
    name: 'Ahmed Al-Rashid',
    country: 'UAE',
    flag: '🇦🇪',
    treatment: 'Cardiac Bypass Surgery',
    hospital: 'Apollo Hospitals, Chennai',
    text: 'MediBridge made everything seamless. From finding the right cardiologist to booking my flight and hotel — all in one place. The surgery was a complete success at a fraction of the cost back home.',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    country: 'UK',
    flag: '🇬🇧',
    treatment: 'Hip Replacement',
    hospital: 'Fortis Memorial, Gurugram',
    text: 'I was skeptical at first, but MediBridge helped me compare hospitals, read verified reviews, and book an appointment with a top orthopedic surgeon. The care I received was outstanding.',
    rating: 5,
  },
  {
    name: 'Nguyen Van Long',
    country: 'Vietnam',
    flag: '🇻🇳',
    treatment: 'Bone Marrow Transplant',
    hospital: 'CMC Vellore',
    text: 'CMC Vellore gave me a second chance at life. MediBridge guided us through every step, including visa assistance and accommodation near the hospital. Forever grateful.',
    rating: 5,
  },
];

const WHY_INDIA = [
  { icon: '💰', title: '60–80% Cost Savings', desc: 'World-class treatment at a fraction of Western costs' },
  { icon: '🏥', title: 'JCI-Accredited Hospitals', desc: 'Internationally accredited hospitals with global standards' },
  { icon: '👨‍⚕️', title: 'Expert Surgeons', desc: 'Many trained in the US, UK, and Europe' },
  { icon: '⚡', title: 'Short Wait Times', desc: 'No long NHS-style waiting lists — get treated fast' },
  { icon: '🌐', title: 'English-Speaking Staff', desc: 'Easy communication throughout your treatment journey' },
  { icon: '✈️', title: 'Medical Visa Support', desc: 'Dedicated support for medical visa applications' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [city, setCity] = useState('All');
  const [spec, setSpec] = useState('All');
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city !== 'All') params.set('city', city);
    if (spec !== 'All') params.set('spec', spec);
    if (query) params.set('q', query);
    navigate(`/hospitals?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-slate-900 via-sky-900 to-teal-900 overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-sky-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-500/30 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4 text-sky-400" />
              <span className="text-sky-300 text-sm font-medium">India's #1 Medical Tourism Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              World-Class Care,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">
                One Bridge Away
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              Compare top Indian hospitals, connect with expert doctors, and plan your entire medical journey — flights, stays, and post-care — all in one place.
            </p>

            {/* Search form */}
            <form onSubmit={handleSearch} className="mt-8 bg-white rounded-2xl p-3 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search hospital or treatment..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm text-slate-800 bg-transparent outline-none"
                  />
                </div>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="sm:w-36 py-2.5 px-3 text-sm text-slate-700 bg-slate-50 rounded-xl outline-none border border-slate-100"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={spec}
                  onChange={e => setSpec(e.target.value)}
                  className="sm:w-44 py-2.5 px-3 text-sm text-slate-700 bg-slate-50 rounded-xl outline-none border border-slate-100"
                >
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Cardiology', 'Orthopedics', 'Oncology', 'Neurology'].map(s => (
                <button
                  key={s}
                  onClick={() => navigate(`/hospitals?spec=${s}`)}
                  className="text-xs text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 px-3 py-1 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Hero image placeholder on the right */}
        <div className="hidden lg:block absolute right-0 bottom-0 w-1/2 h-full">
          <img
            src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg"
            alt="Doctor"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Everything You Need in One Place</h2>
            <p className="mt-3 text-slate-500 text-lg">From finding the right hospital to settling back home after treatment</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                color: 'sky',
                title: 'Hospital Search',
                desc: 'Compare 350+ hospitals by specialization, city, cost, and rating. Filter by JCI accreditation and international patient support.',
                to: '/hospitals',
                cta: 'Find Hospitals',
              },
              {
                icon: Stethoscope,
                color: 'teal',
                title: 'Doctor Profiles',
                desc: 'Browse verified profiles of 2,800+ doctors with detailed qualifications, experience, and patient reviews.',
                to: '/doctors',
                cta: 'Find Doctors',
              },
              {
                icon: Plane,
                color: 'sky',
                title: 'Travel Assistance',
                desc: 'Compare flights from major international hubs and get medical visa guidance for your journey to India.',
                to: '/travel',
                cta: 'Plan Travel',
              },
              {
                icon: Hotel,
                color: 'teal',
                title: 'Accommodation',
                desc: 'Find hotels near hospitals — from budget guesthouses to luxury hotels — with distances and pricing.',
                to: '/accommodation',
                cta: 'Find Stays',
              },
              {
                icon: CheckCircle,
                color: 'sky',
                title: 'Appointment Booking',
                desc: 'Book appointments online with your chosen doctor. Select a time slot and receive instant confirmation.',
                to: '/hospitals',
                cta: 'Book Now',
              },
              {
                icon: Heart,
                color: 'teal',
                title: 'Post-Treatment Care',
                desc: 'Rehabilitation centers, follow-up scheduling, and teleconsultation to help you recover from home.',
                to: '/post-care',
                cta: 'Explore Care',
              },
            ].map(item => {
              const Icon = item.icon;
              const colorMap = {
                sky: { bg: 'bg-sky-50', icon: 'text-sky-600', hover: 'hover:border-sky-200' },
                teal: { bg: 'bg-teal-50', icon: 'text-teal-600', hover: 'hover:border-teal-200' },
              };
              const c = colorMap[item.color as keyof typeof colorMap];
              return (
                <div key={item.title} className={`bg-white rounded-2xl p-6 border border-slate-100 ${c.hover} transition-colors hover:shadow-sm`}>
                  <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  <Link
                    to={item.to}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
                  >
                    {item.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why India */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Why Choose India for Medical Treatment?</h2>
            <p className="mt-3 text-slate-500">India is the world's fastest-growing medical tourism destination</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_INDIA.map(item => (
              <div key={item.title} className="flex gap-4 p-5 bg-slate-50 rounded-2xl">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Patient Success Stories</h2>
            <p className="mt-3 text-slate-500">Hear from international patients who trusted MediBridge</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-lg">
                    {t.flag}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.treatment}</p>
                    <p className="text-xs text-sky-600">{t.hospital}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Ready to Start Your Medical Journey?</h2>
          <p className="mt-4 text-sky-100 text-lg">
            Get a free consultation with our medical coordinators and find the best hospital for your needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hospitals"
              className="bg-white text-sky-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-sky-50 transition-colors shadow-sm"
            >
              Find Hospitals
            </Link>
            <Link
              to="/doctors"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-sky-400"
            >
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
