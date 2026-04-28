import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Medi<span className="text-sky-400">Bridge</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted partner for world-class medical treatment in India. Connecting international patients with the best hospitals and doctors.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                +91 1800-MEDI-BRIDGE
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                support@medibridge.in
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                New Delhi, India 110001
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Find Hospitals', to: '/hospitals' },
                { label: 'Find Doctors', to: '/doctors' },
                { label: 'Book Appointment', to: '/hospitals' },
                { label: 'Travel Assistance', to: '/travel' },
                { label: 'Accommodation', to: '/accommodation' },
                { label: 'Post-Treatment Care', to: '/post-care' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-sky-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Specializations</h3>
            <ul className="space-y-2 text-sm">
              {['Cardiology', 'Orthopedics', 'Oncology', 'Neurology', 'Liver Transplant', 'Hematology', 'Urology', 'Fertility'].map(s => (
                <li key={s}>
                  <Link to={`/hospitals?spec=${s}`} className="hover:text-sky-400 transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h3 className="text-white font-semibold mb-4">Top Cities</h3>
            <ul className="space-y-2 text-sm">
              {['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Gurugram', 'Hyderabad', 'Vellore', 'Pune'].map(c => (
                <li key={c}>
                  <Link to={`/hospitals?city=${c}`} className="hover:text-sky-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 MediBridge. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
