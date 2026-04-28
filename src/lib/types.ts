export interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  image_url: string;
  rating: number;
  review_count: number;
  specializations: string[];
  facilities: string[];
  international_support: boolean;
  accreditations: string[];
  description: string;
  min_cost: number;
  max_cost: number;
  created_at: string;
}

export interface Doctor {
  id: string;
  hospital_id: string;
  name: string;
  specialization: string;
  qualifications: string[];
  experience_years: number;
  rating: number;
  review_count: number;
  image_url: string;
  bio: string;
  languages: string[];
  consultation_fee: number;
  available_days: string[];
  created_at: string;
  hospital?: Hospital;
}

export interface TimeSlot {
  id: string;
  doctor_id: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  doctor_id: string;
  hospital_id: string;
  slot_id: string | null;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  treatment_type: string;
  notes: string;
  status: string;
  appointment_date: string;
  appointment_time: string;
  created_at: string;
  doctor?: Doctor;
  hospital?: Hospital;
}

export interface Review {
  id: string;
  user_id: string;
  hospital_id: string | null;
  doctor_id: string | null;
  rating: number;
  title: string;
  body: string;
  reviewer_name: string;
  reviewer_country: string;
  created_at: string;
}

export const SPECIALIZATIONS = [
  'All',
  'Cardiology',
  'Cardiac Surgery',
  'Orthopedics',
  'Oncology',
  'Neurology',
  'Neurosciences',
  'Liver Transplant',
  'Hematology',
  'Urology',
  'Nephrology',
  'Transplant',
  'Bone Marrow Transplant',
  'Fertility',
  'Gastroenterology',
  'Ophthalmology',
  'Pediatrics',
];

export const CITIES = [
  'All',
  'Chennai',
  'Gurugram',
  'Mumbai',
  'Bangalore',
  'Vellore',
  'Delhi',
  'Hyderabad',
  'Kolkata',
  'Pune',
];

export const MOCK_FLIGHTS = [
  {
    id: 'f1',
    airline: 'Air India',
    from: 'Dubai (DXB)',
    to: 'Chennai (MAA)',
    departure: '08:30',
    arrival: '13:45',
    duration: '3h 45m',
    price: 280,
    stops: 'Non-stop',
    logo: 'AI',
  },
  {
    id: 'f2',
    airline: 'Emirates',
    from: 'London (LHR)',
    to: 'Mumbai (BOM)',
    departure: '14:20',
    arrival: '03:30+1',
    duration: '9h 10m',
    price: 520,
    stops: 'Non-stop',
    logo: 'EK',
  },
  {
    id: 'f3',
    airline: 'IndiGo',
    from: 'Singapore (SIN)',
    to: 'Bangalore (BLR)',
    departure: '10:15',
    arrival: '12:45',
    duration: '4h 30m',
    price: 180,
    stops: 'Non-stop',
    logo: '6E',
  },
  {
    id: 'f4',
    airline: 'Qatar Airways',
    from: 'Doha (DOH)',
    to: 'Delhi (DEL)',
    departure: '22:10',
    arrival: '04:30+1',
    duration: '3h 20m',
    price: 310,
    stops: 'Non-stop',
    logo: 'QR',
  },
  {
    id: 'f5',
    airline: 'Etihad Airways',
    from: 'Abu Dhabi (AUH)',
    to: 'Hyderabad (HYD)',
    departure: '06:55',
    arrival: '11:25',
    duration: '3h 30m',
    price: 265,
    stops: 'Non-stop',
    logo: 'EY',
  },
  {
    id: 'f6',
    airline: 'Singapore Airlines',
    from: 'Singapore (SIN)',
    to: 'Chennai (MAA)',
    departure: '09:00',
    arrival: '11:30',
    duration: '4h 0m',
    price: 340,
    stops: 'Non-stop',
    logo: 'SQ',
  },
];

export const MOCK_HOTELS = [
  {
    id: 'h1',
    name: 'The Leela Palace',
    city: 'Chennai',
    image: 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg',
    rating: 5,
    price_per_night: 180,
    distance_to_hospital: '1.2 km',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Airport Shuttle'],
    type: 'Luxury',
  },
  {
    id: 'h2',
    name: 'Vivanta Chennai IT Expressway',
    city: 'Chennai',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    rating: 4,
    price_per_night: 95,
    distance_to_hospital: '0.8 km',
    amenities: ['Free WiFi', 'Gym', 'Restaurant', 'Room Service'],
    type: 'Business',
  },
  {
    id: 'h3',
    name: 'Medanta Guest House',
    city: 'Gurugram',
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
    rating: 3,
    price_per_night: 40,
    distance_to_hospital: '0.1 km',
    amenities: ['Free WiFi', 'Cafeteria', 'Laundry'],
    type: 'Budget',
  },
  {
    id: 'h4',
    name: 'The Oberoi Mumbai',
    city: 'Mumbai',
    image: 'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg',
    rating: 5,
    price_per_night: 220,
    distance_to_hospital: '2.5 km',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Fine Dining', 'Concierge'],
    type: 'Luxury',
  },
  {
    id: 'h5',
    name: 'Lemon Tree Hotel',
    city: 'Bangalore',
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
    rating: 4,
    price_per_night: 70,
    distance_to_hospital: '1.5 km',
    amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Gym'],
    type: 'Comfort',
  },
  {
    id: 'h6',
    name: 'CMC Guest House',
    city: 'Vellore',
    image: 'https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg',
    rating: 3,
    price_per_night: 25,
    distance_to_hospital: '0.05 km',
    amenities: ['Free WiFi', 'Cafeteria', 'Medical Support'],
    type: 'Budget',
  },
];

export const REHAB_CENTERS = [
  {
    id: 'r1',
    name: 'Apollo Rehabilitation Center',
    city: 'Chennai',
    specialties: ['Post-Cardiac Rehab', 'Physiotherapy', 'Occupational Therapy'],
    rating: 4.7,
    contact: '+91-44-2829-3333',
    teleconsult: true,
  },
  {
    id: 'r2',
    name: 'Medanta Physiotherapy Unit',
    city: 'Gurugram',
    specialties: ['Orthopedic Rehab', 'Neuro Rehab', 'Stroke Recovery'],
    rating: 4.8,
    contact: '+91-124-4141-414',
    teleconsult: true,
  },
  {
    id: 'r3',
    name: 'Kokilaben Wellness Centre',
    city: 'Mumbai',
    specialties: ['Cancer Rehab', 'Pain Management', 'Palliative Care'],
    rating: 4.9,
    contact: '+91-22-3069-7000',
    teleconsult: true,
  },
  {
    id: 'r4',
    name: 'NIMHANS Neuro Rehab',
    city: 'Bangalore',
    specialties: ['Neurological Rehab', 'Cognitive Therapy', 'Speech Therapy'],
    rating: 4.8,
    contact: '+91-80-4611-5555',
    teleconsult: false,
  },
];
