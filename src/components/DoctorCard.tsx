import { Link } from 'react-router-dom';
import { Stethoscope, Clock, Globe, ChevronRight } from 'lucide-react';
import { Doctor } from '../lib/types';
import StarRating from './StarRating';

interface DoctorCardProps {
  doctor: Doctor;
  showHospital?: boolean;
}

export default function DoctorCard({ doctor, showHospital }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-5">
        <div className="flex gap-4">
          <div className="relative shrink-0">
            <img
              src={doctor.image_url}
              alt={doctor.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" title="Available" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{doctor.name}</h3>
            <p className="text-sky-600 text-sm font-medium mt-0.5">{doctor.specialization}</p>
            <div className="mt-1.5">
              <StarRating rating={doctor.rating} reviewCount={doctor.review_count} />
            </div>
            {showHospital && doctor.hospital && (
              <p className="text-xs text-slate-400 mt-1 truncate">{doctor.hospital.name}, {doctor.hospital.city}</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{doctor.experience_years} yrs exp.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Stethoscope className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">₹{doctor.consultation_fee.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>{doctor.languages.join(', ')}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {doctor.qualifications.slice(0, 2).map(q => (
            <span key={q} className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">
              {q}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/doctors/${doctor.id}`}
            className="flex-1 text-center text-sm font-medium text-sky-600 border border-sky-500 py-2 rounded-lg hover:bg-sky-50 transition-colors"
          >
            View Profile
          </Link>
          <Link
            to={`/book/${doctor.id}`}
            className="flex-1 flex items-center justify-center gap-1 text-sm font-medium bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg transition-colors"
          >
            Book Now <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
