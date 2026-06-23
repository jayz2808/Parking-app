// Seeds fresh, recent parking reports so the live app shows current data.
// Reads spots via the anon key, then inserts a few recent reports per spot.
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load env from .env.local
const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data: spots, error } = await supabase.from('parking_spots').select('id');
if (error) {
  console.error('Failed to read spots:', error.message);
  process.exit(1);
}
console.log(`Found ${spots.length} spots`);

const rows = [];
for (const spot of spots) {
  // 1-3 reports per spot, each within the last ~25 minutes
  const n = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const minutesAgo = Math.floor(Math.random() * 25);
    rows.push({
      spot_id: spot.id,
      status: Math.random() < 0.6 ? 'free' : 'taken',
      timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    });
  }
}

const { error: insErr, count } = await supabase
  .from('parking_reports')
  .insert(rows, { count: 'exact' });

if (insErr) {
  console.error('Failed to insert reports:', insErr.message);
  process.exit(1);
}
console.log(`Inserted ${rows.length} fresh reports.`);
