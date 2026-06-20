# Parking Spots - Real-Time Parking Availability

Find free parking spots in the Bay Area in real-time. Users submit crowding reports to help others find available parking.

## Features

- **Real-time Status Updates**: See which parking spots are free or taken based on recent community reports
- **Multi-City Coverage**: San Francisco, Oakland, Berkeley, Palo Alto, and San Jose
- **Quick Reporting**: Report parking status in one tap
- **Smart Aggregation**: Status updates based on recent reports (1-hour window)
- **Neighborhood Search**: Find spots by street name or neighborhood
- **Interactive Map**: Mapbox-powered visualization of all parking spots

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL

## Getting Started

### Prerequisites

- Node.js 18+
- Mapbox account (free tier available)
- Supabase account (free tier available)

### Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure database** - See [SETUP.md](SETUP.md) for Supabase setup

3. **Add environment variables**:
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

4. **Run locally**:
```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── reports/route.ts    # Report submission endpoint
│   │   └── spots/route.ts      # Fetch spots with aggregated data
│   └── page.tsx                 # Main UI
├── components/
│   ├── Map.tsx                  # Mapbox GL integration
│   ├── SpotCard.tsx             # Spot display card
│   └── ReportModal.tsx          # Report submission form
└── types/
    └── index.ts                 # TypeScript definitions
```

## Deployment

Deploy to Vercel with automatic GitHub integration:

```bash
vercel
```

## Database Setup

See [SETUP.md](SETUP.md) for complete database initialization instructions including SQL schema and seed data.
