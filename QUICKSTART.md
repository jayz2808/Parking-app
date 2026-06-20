# Quick Start - Parking Spots App

## 1. Install & Configure (3 minutes)

```bash
cd /Users/chrzimme/dev/parking-spots

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local and add:
# - NEXT_PUBLIC_MAPBOX_TOKEN (from Mapbox account)
# - NEXT_PUBLIC_SUPABASE_URL (from Supabase project)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase project)
```

## 2. Setup Database (5 minutes)

**In Supabase SQL Editor**, run all commands from [SETUP.md](SETUP.md):

1. Create `parking_spots` table
2. Create `parking_reports` table
3. Add indexes
4. Enable RLS policies
5. Seed initial data (optional but recommended)

## 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 4. Test the App

- **View spots**: Select a city from the dropdown
- **See map**: Parking spots display with green (free) or red (taken) markers
- **Report status**: Click "Report Status" on any spot card
- **Search**: Type street name or neighborhood in search box

## File Structure Created

```
src/
├── app/
│   ├── api/
│   │   ├── reports/route.ts     ← Handle report submissions
│   │   └── spots/route.ts       ← Fetch spots & aggregated data
│   └── page.tsx                  ← Main app UI
├── components/
│   ├── Map.tsx                   ← Mapbox visualization
│   ├── SpotCard.tsx              ← Spot listing card
│   └── ReportModal.tsx           ← Report submission form
└── types/
    └── index.ts                  ← TypeScript interfaces
```

## Key Features

✓ Real-time parking status (free/taken)  
✓ Multi-city support (SF, Oakland, Berkeley, Palo Alto, San Jose)  
✓ Interactive map with color-coded markers  
✓ 1-hour report aggregation window  
✓ Search by street or neighborhood  
✓ Mobile responsive design  

## Next Steps

1. **Add more cities**: Edit `CITIES` array in page.tsx
2. **Customize styling**: Edit Tailwind classes in components
3. **Deploy**: Push to GitHub → Deploy to Vercel
4. **Add auth**: Integrate Supabase Auth for user accounts
5. **Track favorites**: Add localStorage or auth-based favorites

## Troubleshooting

**No spots showing?**
- Check database is initialized and has data
- Verify city parameter matches database city value

**Map not loading?**
- Verify NEXT_PUBLIC_MAPBOX_TOKEN in .env.local
- Check browser console for errors

**Reports not working?**
- Verify Supabase credentials
- Check RLS policies allow public insert

## Files Created

- `src/app/page.tsx` - Main application
- `src/app/api/spots/route.ts` - API endpoint for fetching spots
- `src/app/api/reports/route.ts` - API endpoint for reports
- `src/components/Map.tsx` - Mapbox integration
- `src/components/SpotCard.tsx` - Spot display card
- `src/components/ReportModal.tsx` - Report submission modal
- `src/types/index.ts` - TypeScript type definitions
- `SETUP.md` - Complete database setup guide
- `README.md` - Project documentation

## Build Status

✓ TypeScript compilation: Passing  
✓ Next.js build: Successful  
✓ Page generation: Complete  

Ready to run `npm run dev`!
