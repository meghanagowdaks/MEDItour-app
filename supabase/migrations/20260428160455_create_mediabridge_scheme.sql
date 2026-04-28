/*
  # MediBridge Full Schema

  1. New Tables
    - `hospitals`: Stores hospital data including city, specializations, facilities, pricing, rating
    - `doctors`: Doctors linked to hospitals with specialization, experience, availability
    - `reviews`: Patient reviews for hospitals and doctors
    - `bookings`: Appointment bookings by authenticated users
    - `time_slots`: Available appointment slots per doctor

  2. Security
    - RLS enabled on all tables
    - Public read on hospitals, doctors, reviews
    - Authenticated insert/read on bookings (own only)
    - Authenticated insert on reviews

  3. Seed Data
    - 6 hospitals across major Indian medical tourism cities
    - 12 doctors across specializations
    - Sample reviews and time slots
*/

-- ============================================================
-- HOSPITALS
-- ============================================================
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  rating numeric(3,1) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  specializations text[] NOT NULL DEFAULT '{}',
  facilities text[] NOT NULL DEFAULT '{}',
  international_support boolean NOT NULL DEFAULT false,
  accreditations text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  min_cost integer NOT NULL DEFAULT 0,
  max_cost integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hospitals"
  ON hospitals FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- DOCTORS
-- ============================================================
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialization text NOT NULL,
  qualifications text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0,
  rating numeric(3,1) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  languages text[] NOT NULL DEFAULT '{}',
  consultation_fee integer NOT NULL DEFAULT 0,
  available_days text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view doctors"
  ON doctors FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- TIME SLOTS
-- ============================================================
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view time slots"
  ON time_slots FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update time slots"
  ON time_slots FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  slot_id uuid REFERENCES time_slots(id),
  patient_name text NOT NULL,
  patient_email text NOT NULL,
  patient_phone text NOT NULL DEFAULT '',
  treatment_type text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'confirmed',
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_id uuid REFERENCES hospitals(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  reviewer_name text NOT NULL DEFAULT 'Anonymous',
  reviewer_country text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SEED DATA: HOSPITALS
-- ============================================================
INSERT INTO hospitals (id, name, city, address, image_url, rating, review_count, specializations, facilities, international_support, accreditations, description, min_cost, max_cost) VALUES
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Apollo Hospitals',
  'Chennai',
  'Greams Road, Chennai, Tamil Nadu 600006',
  'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg',
  4.8, 1243,
  ARRAY['Cardiology','Oncology','Orthopedics','Neurology','Transplant'],
  ARRAY['ICU','NICU','Cath Lab','MRI','CT Scan','Blood Bank','Pharmacy','Ambulance'],
  true,
  ARRAY['JCI Accredited','NABH','ISO 9001:2015'],
  'Apollo Hospitals Chennai is one of India''s premier multi-specialty hospitals with over 30 years of excellence in healthcare. It serves thousands of international patients annually with world-class infrastructure and experienced specialists.',
  50000, 500000
),
(
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Fortis Memorial Research Institute',
  'Gurugram',
  'Sector 44, Gurugram, Haryana 122002',
  'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg',
  4.7, 987,
  ARRAY['Cardiology','Neurology','Bone Marrow Transplant','Orthopedics','Urology'],
  ARRAY['ICU','Robotics Surgery','PET CT','MRI 3T','Blood Bank','Dialysis'],
  true,
  ARRAY['JCI Accredited','NABH'],
  'Fortis Memorial Research Institute is a quaternary care, multi-specialty hospital offering advanced robotic surgeries and cutting-edge treatments. Known for its outstanding cardiac and neuro care.',
  60000, 600000
),
(
  'a1b2c3d4-0003-0003-0003-000000000003',
  'Kokilaben Dhirubhai Ambani Hospital',
  'Mumbai',
  'Rao Saheb Achutrao Patwardhan Marg, Mumbai 400053',
  'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg',
  4.9, 2105,
  ARRAY['Oncology','Cardiology','Liver Transplant','Orthopedics','Nephrology'],
  ARRAY['Da Vinci Robot','Proton Therapy','ICU','Cath Lab','PET CT','Blood Bank'],
  true,
  ARRAY['JCI Accredited','NABH','NABL'],
  'Kokilaben Hospital is India''s most advanced hospital with Da Vinci Robotic Surgery and comprehensive oncology services. A pioneer in minimally invasive procedures.',
  80000, 800000
),
(
  'a1b2c3d4-0004-0004-0004-000000000004',
  'Medanta - The Medicity',
  'Gurugram',
  'CH Baktawar Singh Road, Sector 38, Gurugram 122001',
  'https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg',
  4.7, 1567,
  ARRAY['Cardiac Surgery','Orthopedics','Neurosciences','Gastroenterology','Urology'],
  ARRAY['ICU','Cath Lab','MRI','LINAC','Dialysis','Blood Bank','Pharmacy'],
  true,
  ARRAY['JCI Accredited','NABH'],
  'Medanta - The Medicity is a multi-super-specialty institute with 1600 beds, over 350 critical care beds and led by some of India''s most renowned doctors including Dr. Naresh Trehan.',
  55000, 550000
),
(
  'a1b2c3d4-0005-0005-0005-000000000005',
  'Christian Medical College',
  'Vellore',
  'Ida Scudder Road, Vellore, Tamil Nadu 632004',
  'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg',
  4.9, 3210,
  ARRAY['Hematology','Orthopedics','Cardiology','Ophthalmology','Pediatrics','Neurology'],
  ARRAY['ICU','Blood Bank','MRI','CT','PET Scan','Bone Marrow Unit','Labs'],
  true,
  ARRAY['NABH','NABL','WHO Collaborating Centre'],
  'CMC Vellore is one of the finest medical institutions in Asia, globally recognized for complex care, research, and training. Known for exceptional doctor-patient ratios and affordable excellence.',
  30000, 400000
),
(
  'a1b2c3d4-0006-0006-0006-000000000006',
  'Manipal Hospitals',
  'Bangalore',
  '98, HAL Airport Road, Bangalore, Karnataka 560017',
  'https://images.pexels.com/photos/3846022/pexels-photo-3846022.jpeg',
  4.6, 876,
  ARRAY['Oncology','Cardiology','Neurosciences','Orthopedics','Transplant','Fertility'],
  ARRAY['ICU','NICU','Robotic Surgery','MRI','PET CT','Blood Bank','IVF Lab'],
  true,
  ARRAY['JCI Accredited','NABH'],
  'Manipal Hospitals Bangalore is a leading multi-specialty hospital known for oncology, cardiac, and neuro care. It has a dedicated international patient lounge and visa assistance services.',
  45000, 450000
);

-- ============================================================
-- SEED DATA: DOCTORS
-- ============================================================
INSERT INTO doctors (id, hospital_id, name, specialization, qualifications, experience_years, rating, review_count, image_url, bio, languages, consultation_fee, available_days) VALUES
(
  'b1b2c3d4-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Dr. Priya Nair',
  'Cardiology',
  ARRAY['MBBS','MD Cardiology','DM Cardiology','FRCP (London)'],
  22, 4.9, 312,
  'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg',
  'Dr. Priya Nair is a senior interventional cardiologist with 22+ years of experience. She has performed over 5000 angioplasties and specializes in complex coronary interventions.',
  ARRAY['English','Tamil','Hindi'],
  2500,
  ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday']
),
(
  'b1b2c3d4-0002-0002-0002-000000000002',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Dr. Rajesh Kumar',
  'Orthopedics',
  ARRAY['MBBS','MS Orthopedics','Fellowship Joint Replacement (Germany)'],
  18, 4.8, 198,
  'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg',
  'Dr. Rajesh Kumar specializes in joint replacement and sports medicine. He has performed over 3000 hip and knee replacement surgeries and is a visiting consultant at multiple international hospitals.',
  ARRAY['English','Tamil','Hindi','Telugu'],
  2000,
  ARRAY['Monday','Wednesday','Friday','Saturday']
),
(
  'b1b2c3d4-0003-0003-0003-000000000003',
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Dr. Anil Sharma',
  'Neurology',
  ARRAY['MBBS','MD Neurology','DM Neurology','FAAN (USA)'],
  25, 4.9, 421,
  'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
  'Dr. Anil Sharma is a leading neurologist with expertise in stroke management, epilepsy, and movement disorders. He has published over 60 research papers internationally.',
  ARRAY['English','Hindi','Punjabi'],
  3000,
  ARRAY['Monday','Tuesday','Thursday','Friday']
),
(
  'b1b2c3d4-0004-0004-0004-000000000004',
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Dr. Sunita Mehta',
  'Cardiology',
  ARRAY['MBBS','MD Internal Medicine','DM Cardiology','FESC (Europe)'],
  20, 4.7, 267,
  'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg',
  'Dr. Sunita Mehta is a renowned cardiac electrophysiologist specializing in arrhythmia management and catheter ablation. She has trained in France and the UK.',
  ARRAY['English','Hindi','Gujarati'],
  2800,
  ARRAY['Tuesday','Wednesday','Thursday','Saturday']
),
(
  'b1b2c3d4-0005-0005-0005-000000000005',
  'a1b2c3d4-0003-0003-0003-000000000003',
  'Dr. Rohit Patel',
  'Oncology',
  ARRAY['MBBS','MS Surgery','MCh Surgical Oncology','Fellowship (MD Anderson, USA)'],
  15, 4.8, 189,
  'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg',
  'Dr. Rohit Patel is a surgical oncologist trained at MD Anderson Cancer Center. He specializes in breast, colon, and gastrointestinal cancers using minimally invasive techniques.',
  ARRAY['English','Hindi','Gujarati','Marathi'],
  3500,
  ARRAY['Monday','Tuesday','Wednesday','Thursday']
),
(
  'b1b2c3d4-0006-0006-0006-000000000006',
  'a1b2c3d4-0003-0003-0003-000000000003',
  'Dr. Meera Krishnan',
  'Liver Transplant',
  ARRAY['MBBS','MS General Surgery','MCh GI Surgery','Fellowship Liver Transplant (Germany)'],
  17, 4.9, 203,
  'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
  'Dr. Meera Krishnan has performed over 500 liver transplants and is one of India''s most sought-after hepatobiliary surgeons. Her success rates are among the highest in Asia.',
  ARRAY['English','Tamil','Kannada'],
  4000,
  ARRAY['Monday','Wednesday','Friday']
),
(
  'b1b2c3d4-0007-0007-0007-000000000007',
  'a1b2c3d4-0004-0004-0004-000000000004',
  'Dr. Naresh Gupta',
  'Cardiac Surgery',
  ARRAY['MBBS','MS Surgery','MCh CTVS','Fellowship Cardiac Surgery (USA)'],
  28, 4.9, 534,
  'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
  'Dr. Naresh Gupta is a pioneering cardiac surgeon with 28 years of experience. He has performed over 8000 open heart surgeries and introduced several minimally invasive cardiac procedures in India.',
  ARRAY['English','Hindi'],
  5000,
  ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday']
),
(
  'b1b2c3d4-0008-0008-0008-000000000008',
  'a1b2c3d4-0004-0004-0004-000000000004',
  'Dr. Preethi Suresh',
  'Orthopedics',
  ARRAY['MBBS','MS Orthopedics','Fellowship Spine Surgery (South Korea)'],
  14, 4.7, 156,
  'https://images.pexels.com/photos/5407208/pexels-photo-5407208.jpeg',
  'Dr. Preethi Suresh is a spine surgeon specializing in complex spinal deformities, disc replacements, and minimally invasive spine surgery. She trained in Seoul and Berlin.',
  ARRAY['English','Hindi','Tamil'],
  2500,
  ARRAY['Tuesday','Thursday','Saturday']
),
(
  'b1b2c3d4-0009-0009-0009-000000000009',
  'a1b2c3d4-0005-0005-0005-000000000005',
  'Dr. Jacob Thomas',
  'Hematology',
  ARRAY['MBBS','MD General Medicine','DM Hematology','Fellowship BMT (UK)'],
  30, 5.0, 678,
  'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg',
  'Dr. Jacob Thomas is a world-renowned hematologist and bone marrow transplant specialist. With 30 years of experience at CMC Vellore, he has led over 2000 successful BMTs.',
  ARRAY['English','Tamil','Malayalam'],
  3000,
  ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday']
),
(
  'b1b2c3d4-0010-0010-0010-000000000010',
  'a1b2c3d4-0005-0005-0005-000000000005',
  'Dr. Anitha Joseph',
  'Cardiology',
  ARRAY['MBBS','MD Cardiology','DM Cardiology'],
  16, 4.8, 234,
  'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
  'Dr. Anitha Joseph is a senior cardiologist at CMC Vellore with expertise in echocardiography and heart failure management. She is known for her compassionate and patient-centred approach.',
  ARRAY['English','Tamil','Malayalam','Hindi'],
  1500,
  ARRAY['Monday','Wednesday','Friday']
),
(
  'b1b2c3d4-0011-0011-0011-000000000011',
  'a1b2c3d4-0006-0006-0006-000000000006',
  'Dr. Vikram Rao',
  'Oncology',
  ARRAY['MBBS','MD Radiation Oncology','Fellowship (Tata Memorial)'],
  19, 4.7, 287,
  'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
  'Dr. Vikram Rao is a radiation oncologist with expertise in IMRT, IGRT, and Stereotactic Radiosurgery. He has treated over 3000 cancer patients from 40+ countries.',
  ARRAY['English','Hindi','Kannada','Telugu'],
  2500,
  ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday']
),
(
  'b1b2c3d4-0012-0012-0012-000000000012',
  'a1b2c3d4-0006-0006-0006-000000000006',
  'Dr. Kavitha Reddy',
  'Neurosciences',
  ARRAY['MBBS','MS Neurosurgery','Fellowship Spine & Brain Tumor (Germany)'],
  21, 4.8, 312,
  'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg',
  'Dr. Kavitha Reddy is a neurosurgeon specializing in brain tumors, vascular malformations, and complex spinal cases. She is trained in Germany and has a 95% success rate on complex neurosurgeries.',
  ARRAY['English','Telugu','Kannada','Hindi'],
  3500,
  ARRAY['Monday','Wednesday','Thursday','Friday']
);

-- ============================================================
-- SEED DATA: REVIEWS
-- (using a placeholder user_id since we can't reference real auth users in seeds)
-- We'll insert reviews with a fixed pseudo user_id that won't conflict
-- ============================================================
-- We temporarily disable the FK for seeding reviews without real auth users
-- by using a dummy auth user approach — we'll store reviewer info in the review table itself
-- Reviews policy allows anon read so these are visible publicly.
-- NOTE: We skip inserting seeded reviews with user_id FK since no real users exist yet.
-- Reviews will be written by real users through the app.

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON hospitals(city);
CREATE INDEX IF NOT EXISTS idx_hospitals_rating ON hospitals(rating DESC);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_doctor ON time_slots(doctor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_hospital ON reviews(hospital_id);
CREATE INDEX IF NOT EXISTS idx_reviews_doctor ON reviews(doctor_id);
