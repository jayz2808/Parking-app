# Parking Spots App - Setup Guide

## Database Setup (Supabase)

### 1. Create Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create parking_spots table
CREATE TABLE parking_spots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  city VARCHAR(50) NOT NULL,
  neighborhood VARCHAR(100) NOT NULL,
  street_name VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create parking_reports table
CREATE TABLE parking_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES parking_spots(id) ON DELETE CASCADE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('free', 'taken')),
  timestamp TIMESTAMP NOT NULL,
  user_id UUID,
  created_at TIMESTAMP DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_parking_spots_city ON parking_spots(city);
CREATE INDEX idx_parking_spots_neighborhood ON parking_spots(neighborhood);
CREATE INDEX idx_parking_reports_spot_id ON parking_reports(spot_id);
CREATE INDEX idx_parking_reports_timestamp ON parking_reports(timestamp DESC);

-- Enable Row Level Security (optional, for production)
ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_reports ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/insert (development only)
CREATE POLICY "Allow public read" ON parking_spots FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON parking_reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON parking_reports FOR INSERT WITH CHECK (true);
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with:
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox access token
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 3. Seed Initial Data (Optional)

You can insert sample parking spots using the Supabase dashboard or via the SQL Editor. Here's an example:

```sql
INSERT INTO parking_spots (latitude, longitude, city, neighborhood, street_name, notes) VALUES
-- San Francisco
(37.7749, -122.4194, 'sf', 'Downtown', 'Market Street', 'Popular street parking'),
(37.7816, -122.4120, 'sf', 'SOMA', '3rd Street', 'Industrial area'),
(37.7909, -122.3996, 'sf', 'Mission', 'Valencia Street', 'Mission District'),
(37.7749, -122.4380, 'sf', 'Marina', 'Marina Boulevard', 'Marina District'),
(37.7597, -122.4315, 'sf', 'Castro', 'Castro Street', 'Near Castro Theater'),
(37.7694, -122.4862, 'sf', 'Richmond', 'Geary Boulevard', 'Richmond District'),

-- Oakland
(37.8044, -122.2712, 'oakland', 'Downtown', 'Broadway', 'Downtown Oakland'),
(37.8050, -122.2743, 'oakland', 'Lake Merritt', 'Lake Shore Avenue', 'Lake Merritt'),
(37.8215, -122.2824, 'oakland', 'Rockridge', 'College Avenue', 'Rockridge Village'),
(37.8509, -122.2680, 'oakland', 'Piedmont', 'Piedmont Avenue', 'Piedmont Ave'),
(37.7810, -122.2232, 'oakland', 'Fruitvale', 'E 14th Street', 'Fruitvale'),

-- Berkeley
(37.8715, -122.2727, 'berkeley', 'Downtown', 'Shattuck Avenue', 'Berkeley Downtown'),
(37.8690, -122.2700, 'berkeley', 'Telegraph Ave', 'Telegraph Avenue', 'Telegraph Ave'),
(37.8824, -122.2796, 'berkeley', 'North Berkeley', 'Solano Avenue', 'North Berkeley'),
(37.8603, -122.2711, 'berkeley', 'South Berkeley', 'College Avenue', 'South Berkeley'),

-- Palo Alto
(37.4419, -122.143, 'palo-alto', 'Downtown', 'University Avenue', 'Palo Alto Downtown'),
(37.4428, -122.1411, 'palo-alto', 'California Ave', 'California Avenue', 'California Ave'),
(37.4391, -122.1586, 'palo-alto', 'Professional Park', 'El Camino Real', 'El Camino'),

-- San Jose
(37.3382, -121.8863, 'san-jose', 'Downtown', 'Santa Clara Street', 'San Jose Downtown'),
(37.3450, -121.8945, 'san-jose', 'Japantown', 'Jackson Street', 'Japantown'),
(37.3382, -121.9061, 'san-jose', 'East Side', 'E Santa Clara Street', 'East Side'),
(37.3690, -121.8875, 'san-jose', 'North San Jose', 'San Carlos Street', 'North San Jose');
```

## Running Locally

1. Install dependencies (already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Features

- **Real-time Parking Status**: See which spots are free or taken based on recent reports
- **Multi-City Support**: SF, Oakland, Berkeley, Palo Alto, San Jose
- **Report Submissions**: Users can quickly report parking status
- **Report History**: View recent reports for each spot
- **Search**: Find spots by street name or neighborhood
- **Interactive Map**: Mapbox-powered map showing all spots

## Production Deployment

1. Deploy to Vercel:
   - Push to GitHub
   - Connect repo to Vercel
   - Add environment variables in Vercel project settings
   - Deploy

2. Update RLS policies in Supabase for production security

## Troubleshooting

- If no spots appear, check that the database is initialized and has data
- Verify Mapbox token is valid by checking browser console
- Check Supabase credentials in .env.local
