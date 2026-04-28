import { Plane, Clock, MapPin, FileText, AlertCircle, ChevronRight, Globe } from 'lucide-react';
import { MOCK_FLIGHTS } from '../lib/types';

const VISA_STEPS = [
  { step: 1, title: 'Medical Visa (MED)', desc: 'Apply for an Indian medical visa online via the Indian embassy or e-Visa portal. Requires a letter from the hospital.' },
  { step: 2, title: 'Hospital Invitation Letter', desc: 'Your selected hospital will provide an official invitation/confirmation letter needed for the visa application.' },
  { step: 3, title: 'Documents Required', desc: 'Passport, visa application, hospital letter, recent photos, bank statement, and confirmed flight tickets.' },
  { step: 4, title: 'Duration & Validity', desc: 'Medical visa is typically granted for up to 1 year with multiple entry, depending on treatment duration.' },
];

const INDIA_AIRPORTS = [
  { code: 'MAA', city: 'Chennai', full: 'Chennai International Airport', link: 'Apollo Hospitals, CMC Vellore nearby' },
  { code: 'BOM', city: 'Mumbai', full: 'Chhatrapati Shivaji Maharaj International Airport', link: 'Kokilaben, Nanavati, Hinduja nearby' },
  { code: 'DEL', city: 'Delhi', full: 'Indira Gandhi International Airport', link: 'AIIMS, Max Hospital, Medanta nearby' },
  { code: 'BLR', city: 'Bangalore', full: 'Kempegowda International Airport', link: 'Manipal, Narayana, Columbia Asia nearby' },
  { code: 'HYD', city: 'Hyderabad', full: 'Rajiv Gandhi International Airport', link: 'Yashoda, Care, KIMS nearby' },
];

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 to-sky-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Plane className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Travel Assistance</h1>
          </div>
          <p className="text-sky-100">Plan your journey to India for medical treatment — flights, airports, and visa guidance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Flights */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Plane className="w-5 h-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-slate-800">Popular Flight Routes to India</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-2 text-sm text-amber-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            Prices are indicative and for guidance only. Book through your preferred airline or travel agent for real-time fares.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {MOCK_FLIGHTS.map(flight => (
              <div key={flight.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center font-bold text-sky-700 text-sm">
                    {flight.logo}
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-full">
                    {flight.stops}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-medium mb-1">{flight.airline}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-slate-800">{flight.departure}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{flight.from}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1 mx-3">
                    <div className="w-full flex items-center gap-1">
                      <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                      <Plane className="w-3.5 h-3.5 text-sky-400" />
                      <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {flight.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">{flight.arrival}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{flight.to}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">From</span>
                    <p className="text-lg font-bold text-sky-600">${flight.price}</p>
                  </div>
                  <button className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700">
                    Check Fare <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Airports */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-slate-800">Major Airports Near Top Hospitals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDIA_AIRPORTS.map(airport => (
              <div key={airport.code} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-700 text-sm">
                    {airport.code}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{airport.city}</p>
                    <p className="text-xs text-slate-400">{airport.full}</p>
                  </div>
                </div>
                <div className="text-xs text-teal-600 bg-teal-50 px-3 py-2 rounded-lg">
                  {airport.link}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visa */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-5 h-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-slate-800">Medical Visa Guidance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VISA_STEPS.map(item => (
              <div key={item.step} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex gap-4">
                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-sky-50 border border-sky-200 rounded-2xl p-5 flex items-start gap-3">
            <Globe className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Apply Online</h3>
              <p className="text-xs text-slate-500 mt-1">
                Visit the official Indian e-Visa portal at <span className="text-sky-600 font-medium">indianvisaonline.gov.in</span> to apply for your medical visa. Most applications are processed within 3-5 business days.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
