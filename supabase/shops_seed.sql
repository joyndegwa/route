-- Create shops table for repair and recycling centres
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('repair', 'recycle')),
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone TEXT,
  services TEXT[],
  hours TEXT,
  rating DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shops"
  ON public.shops FOR SELECT
  USING (true);

-- Seed data for Nairobi area (replace with your actual city coordinates)
INSERT INTO public.shops (name, type, address, lat, lng, phone, services, hours, rating)
VALUES
  (
    'GreenFix Repair Hub',
    'repair',
    '12 Eco Street, Green District, Nairobi',
    -1.2921,
    36.8219,
    '+254 700 123 456',
    ARRAY['Smartphone', 'Laptop', 'Tablet'],
    'Mon-Fri 8am-6pm',
    4.7
  ),
  (
    'ReCycle Point',
    'recycle',
    '45 Reuse Avenue, Central, Nairobi',
    -1.2864,
    36.8172,
    '+254 700 234 567',
    ARRAY['E-waste', 'Batteries', 'Cables'],
    'Mon-Sat 9am-5pm',
    4.4
  ),
  (
    'TechCare Studio',
    'repair',
    '88 Circuit Road, Tech Park, Nairobi',
    -1.2975,
    36.8125,
    '+254 700 345 678',
    ARRAY['Laptop', 'Desktop', 'Printer'],
    'Mon-Fri 9am-7pm',
    4.9
  ),
  (
    'EcoDrop Center',
    'recycle',
    '7 Sustainability Lane, Westlands, Nairobi',
    -1.2639,
    36.8068,
    '+254 700 456 789',
    ARRAY['E-waste', 'Appliances', 'TVs'],
    'Tue-Sun 8am-4pm',
    4.2
  ),
  (
    'FixIt Fast',
    'repair',
    '23 Tech Avenue, CBD, Nairobi',
    -1.2833,
    36.8167,
    '+254 700 567 890',
    ARRAY['Smartphone', 'Tablet'],
    'Mon-Sat 10am-6pm',
    4.5
  ),
  (
    'GreenCycle Hub',
    'recycle',
    '56 Environmental Road, Karen, Nairobi',
    -1.3197,
    36.7286,
    '+254 700 678 901',
    ARRAY['E-waste', 'Furniture', 'Metal'],
    'Mon-Fri 8am-5pm',
    4.6
  )
ON CONFLICT (id) DO NOTHING;
