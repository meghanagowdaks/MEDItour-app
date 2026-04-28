import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Doctor, TimeSlot } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BookingPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    patient_name: user?.user_metadata?.full_name || '',
    patient_email: user?.email || '',
    patient_phone: '',
    treatment_type: '',
    notes: '',
  });

  // Dates available: next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (!doctorId) return;
    supabase.from('doctors').select('*, hospital:hospitals(id,name,city)').eq('id', doctorId).maybeSingle()
      .then(({ data }) => {
        setDoctor(data as Doctor);
        setLoading(false);
      });
  }, [doctorId]);

  useEffect(() => {
    if (!doctorId || !selectedDate) return;
    supabase.from('time_slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('slot_date', selectedDate)
      .eq('is_booked', false)
      .order('slot_time')
      .then(({ data }) => setSlots(data || []));
  }, [doctorId, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!selectedSlot) { setError('Please select a time slot.'); return; }
    setSubmitting(true);
    setError('');

    const { error: bookErr } = await supabase.from('bookings').insert({
      user_id: user.id,
      doctor_id: doctorId,
      hospital_id: doctor!.hospital_id,
      slot_id: selectedSlot.id,
      patient_name: form.patient_name,
      patient_email: form.patient_email,
      patient_phone: form.patient_phone,
      treatment_type: form.treatment_type,
      notes: form.notes,
      status: 'confirmed',
      appointment_date: selectedDate,
      appointment_time: selectedSlot.slot_time,
    });

    if (bookErr) {
      setError(bookErr.message);
      setSubmitting(false);
      return;
    }

    // Mark slot as booked
    await supabase.from('time_slots').update({ is_booked: true }).eq('id', selectedSlot.id);
    setSuccess(true);
    setSubmitting(false);
  };

  if (loading) return <div className="pt-16"><LoadingSpinner text="Loading booking form..." /></div>;
  if (!doctor) return <div className="pt-16 text-center py-24 text-slate-500">Doctor not found.</div>;

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Sign In Required</h2>
          <p className="text-slate-500 text-sm mb-6">Please sign in to book an appointment with {doctor.name}.</p>
          <Link to="/login" className="block w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors text-center">
            Sign In
          </Link>
          <Link to="/register" className="block mt-2 text-sm text-sky-600 hover:underline">Create Account</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointment Confirmed!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your appointment with <span className="font-semibold text-slate-700">{doctor.name}</span> on{' '}
            <span className="font-semibold text-slate-700">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>{' '}
            at <span className="font-semibold text-slate-700">{selectedSlot?.slot_time}</span> has been confirmed.
          </p>
          <p className="text-xs text-slate-400 mt-3">A confirmation will be sent to {form.patient_email}</p>
          <div className="mt-6 space-y-2">
            <Link to="/bookings" className="block w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors text-center">
              View My Bookings
            </Link>
            <Link to="/hospitals" className="block w-full text-sm text-sky-600 hover:underline py-2">
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hospital = doctor.hospital as { name: string; city: string } | undefined;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor info sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm sticky top-24">
              <img src={doctor.image_url} alt={doctor.name} className="w-full h-44 object-cover rounded-xl mb-4" />
              <h3 className="font-bold text-slate-800">{doctor.name}</h3>
              <p className="text-sky-600 text-sm font-medium">{doctor.specialization}</p>
              <div className="mt-2"><StarRating rating={doctor.rating} reviewCount={doctor.review_count} /></div>
              {hospital && (
                <p className="text-xs text-slate-400 mt-2">{hospital.name}, {hospital.city}</p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Consultation</span>
                  <span className="font-semibold text-emerald-600">₹{doctor.consultation_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience</span>
                  <span className="font-semibold text-slate-700">{doctor.experience_years} years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-teal-50">
                <h1 className="text-xl font-bold text-slate-800">Book Appointment</h1>
                <p className="text-sm text-slate-500 mt-0.5">Fill in your details to confirm your appointment</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-500" /> Select Date
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.slice(0, 10).map(date => {
                      const d = new Date(date);
                      const isAvail = doctor.available_days.includes(
                        d.toLocaleDateString('en-US', { weekday: 'long' })
                      );
                      return (
                        <button
                          key={date}
                          type="button"
                          disabled={!isAvail}
                          onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                          className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            selectedDate === date
                              ? 'bg-sky-500 text-white'
                              : isAvail
                              ? 'bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-600 border border-slate-200'
                              : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                          }`}
                        >
                          <span>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="text-sm font-bold">{d.getDate()}</span>
                          <span>{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-500" /> Select Time Slot
                    </label>
                    {slots.length === 0 ? (
                      <p className="text-sm text-slate-400">No available slots for this date.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {slots.map(slot => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                              selectedSlot?.id === slot.id
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-600 border border-slate-200'
                            }`}
                          >
                            {slot.slot_time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Patient info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" /> Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.patient_name}
                      onChange={e => setForm(f => ({ ...f, patient_name: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" /> Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.patient_email}
                      onChange={e => setForm(f => ({ ...f, patient_email: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" /> Phone
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.patient_phone}
                      onChange={e => setForm(f => ({ ...f, patient_phone: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400" /> Treatment Type
                    </label>
                    <input
                      type="text"
                      value={form.treatment_type}
                      onChange={e => setForm(f => ({ ...f, treatment_type: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition"
                      placeholder="e.g., Knee Replacement"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition resize-none"
                    placeholder="Describe your symptoms or any specific concerns..."
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !selectedDate || !selectedSlot}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                >
                  {submitting ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
