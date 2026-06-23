import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DIFFICULTIES = ['easy', 'moderate', 'hard'];
const PARKING_TYPES = ['free', 'metered', 'permit', 'mixed'];

export async function POST(request: Request) {
  try {
    const {
      latitude,
      longitude,
      city,
      neighborhood,
      street_name,
      difficulty,
      parking_type,
      best_times,
      notes,
    } = await request.json();

    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      !city ||
      !street_name
    ) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: spot, error: spotError } = await supabase
      .from('parking_spots')
      .insert([
        {
          latitude,
          longitude,
          city,
          neighborhood: neighborhood || 'Unknown',
          street_name,
          difficulty: DIFFICULTIES.includes(difficulty) ? difficulty : 'moderate',
          parking_type: PARKING_TYPES.includes(parking_type) ? parking_type : 'free',
          best_times: best_times || null,
          notes: notes || null,
        },
      ])
      .select()
      .single();

    if (spotError) {
      console.error('Supabase error (add spot):', spotError);
      return Response.json({ error: spotError.message }, { status: 500 });
    }

    return Response.json({ success: true, spot });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'sf';

    const { data: spots, error } = await supabase
      .from('parking_spots')
      .select('*')
      .eq('city', city)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ spots: [] }, { status: 200 });
    }

    return Response.json({ spots: spots || [] });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { spots: [], error: 'Internal server error' },
      { status: 500 }
    );
  }
}
