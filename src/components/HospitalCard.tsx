import { Link } from 'react-router-dom';
import { MapPin, Shield, Users, ChevronRight } from 'lucide-react';
import { Hospital } from '../lib/types';
import StarRating from './StarRating';

interface HospitalCardProps {
  hospital: Hospital;
  showCompare?: boolean;
  isSelected?: boolean;
  onToggleCompare?: (id: string) => void;
}

export default function HospitalCard({ hospital, showCompare, isSelected, onToggleCompare }: HospitalCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={hospital.image_url}
          alt={hospital.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-sm font-medium">{hospital.city}</span>
        </div>
        {hospital.international_support && (
          <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <Shield className="w-3 h-3" /> Intl. Support
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{hospital.name}</h3>
          {showCompare && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleCompare?.(hospital.id)}
              className="mt-1 accent-sky-500 w-4 h-4 shrink-0 cursor-pointer"
              title="Add to compare"
            />
          )}
        </div>

        <div className="mt-2">
          <StarRating rating={hospital.rating} reviewCount={hospital.review_count} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {hospital.specializations.slice(0, 3).map(s => (
            <span key={s} className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-medium">
              {s}
            </span>
          ))}
          {hospital.specializations.length > 3 && (
            <span className="text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full">
              +{hospital.specializations.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1 text-slate-500 text-xs">
          <Users className="w-3.5 h-3.5" />
          <span>{hospital.accreditations.join(' • ')}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Est. cost from</span>
            <p className="text-sm font-bold text-emerald-600">
              ₹{hospital.min_cost.toLocaleString()} – ₹{hospital.max_cost.toLocaleString()}
            </p>
          </div>
          <Link
            to={`/hospitals/${hospital.id}`}
            className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            View Details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
