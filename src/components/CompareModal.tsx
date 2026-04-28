import { X, Check, Minus } from 'lucide-react';
import { Hospital } from '../lib/types';
import StarRating from './StarRating';

interface CompareModalProps {
  hospitals: Hospital[];
  onClose: () => void;
}

const rows: { label: string; key: keyof Hospital | 'cost' }[] = [
  { label: 'City', key: 'city' },
  { label: 'Rating', key: 'rating' },
  { label: 'Accreditations', key: 'accreditations' },
  { label: 'Specializations', key: 'specializations' },
  { label: 'Facilities', key: 'facilities' },
  { label: 'Est. Cost Range', key: 'cost' },
  { label: 'Intl. Support', key: 'international_support' },
];

export default function CompareModal({ hospitals, onClose }: CompareModalProps) {
  const renderCell = (hospital: Hospital, key: keyof Hospital | 'cost') => {
    if (key === 'cost') {
      return <span className="text-emerald-600 font-semibold text-sm">₹{hospital.min_cost.toLocaleString()} – ₹{hospital.max_cost.toLocaleString()}</span>;
    }
    const val = hospital[key as keyof Hospital];
    if (key === 'rating') return <StarRating rating={hospital.rating} reviewCount={hospital.review_count} />;
    if (key === 'international_support') return val ? <Check className="w-5 h-5 text-emerald-500" /> : <Minus className="w-5 h-5 text-slate-300" />;
    if (Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1">
          {(val as string[]).map(v => (
            <span key={v} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{v}</span>
          ))}
        </div>
      );
    }
    return <span className="text-sm text-slate-700">{String(val)}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Hospital Comparison</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500 w-32">Feature</th>
                {hospitals.map(h => (
                  <th key={h.id} className="px-4 py-4 text-center">
                    <img src={h.image_url} alt={h.name} className="w-full h-28 object-cover rounded-xl mb-2" />
                    <p className="text-sm font-bold text-slate-800">{h.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.key} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.label}</td>
                  {hospitals.map(h => (
                    <td key={h.id} className="px-4 py-4 text-center">
                      {renderCell(h, row.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
