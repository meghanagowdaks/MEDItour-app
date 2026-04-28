import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Building2, User, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Booking } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('bookings')
      .select('*, doctor:doctors(id,name,specialization,image_url), hospital:hospitals(id,name,city)')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: false })
      .then(({ data }) => {
        setBookings((data as Booking[]) || []);
        setLoading(false);
      });
  }, [user]);

  const handleCancel = async (id: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    }
  };

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Please sign in to view your bookings.</p>
          <Link to="/login" className="text-sky-600 font-medium hover:underline">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-gradient-to-r from-sky-600 to-teal-600 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">My Appointments</h1>
          <p className="mt-2 text-sky-100 text-sm">Track and manage your bookings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner text="Loading your bookings..." />
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-600">No appointments yet</h2>
            <p className="text-slate-400 text-sm mt-2">Start by finding a hospital or doctor</p>
            <Link
              to="/hospitals"
              className="mt-5 inline-flex bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              Browse Hospitals
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const doctor = booking.doctor as { name: string; specialization: string; image_url: string } | undefined;
              const hospital = booking.hospital as { name: string; city: string } | undefined;
              const isPast = new Date(booking.appointment_date) < new Date();
              const isCancelled = booking.status === 'cancelled';

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-opacity ${isCancelled ? 'opacity-60 border-slate-100' : 'border-slate-100'}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex gap-4">
                      {doctor && (
                        <img src={doctor.image_url} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      )}
                      <div>
                        <h3 className="font-bold text-slate-800">{doctor?.name || 'Doctor'}</h3>
                        <p className="text-sky-600 text-sm font-medium">{doctor?.specialization}</p>
                        {hospital && (
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> {hospital.name}, {hospital.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isCancelled ? 'bg-red-50 text-red-500' :
                      isPast ? 'bg-slate-100 text-slate-500' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {isCancelled ? 'Cancelled' : isPast ? 'Completed' : 'Confirmed'}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(booking.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {booking.appointment_time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" />
                      {booking.patient_name}
                    </div>
                  </div>

                  {booking.treatment_type && (
                    <p className="mt-2 text-xs text-slate-400">Treatment: {booking.treatment_type}</p>
                  )}

                  {!isCancelled && !isPast && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <Link
                        to={`/book/${booking.doctor_id}`}
                        className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Rebook
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
