import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'sf';

    // Fetch parking spots for the city
    const { data: spotsData, error: spotsError } = await supabase
      .from('parking_spots')
      .select('*')
      .eq('city', city);

    if (spotsError) {
      console.error('Supabase error:', spotsError);
      return Response.json(
        { spots: [] },
        { status: 200 }
      );
    }

    if (!spotsData || spotsData.length === 0) {
      return Response.json({ spots: [] });
    }

    // Fetch reports for the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: reportsData, error: reportsError } = await supabase
      .from('parking_reports')
      .select('*')
      .in('spot_id', spotsData.map(s => s.id))
      .gte('timestamp', oneHourAgo);

    if (reportsError) {
      console.error('Reports error:', reportsError);
      return Response.json({ spots: spotsData });
    }

    // Aggregate reports for each spot
    const spotsWithReports = spotsData.map(spot => {
      const spotReports = (reportsData || []).filter(r => r.spot_id === spot.id);

      // Get most recent report status
      const mostRecentReport = spotReports.length > 0
        ? spotReports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
        : null;

      const lastReportTime = mostRecentReport?.timestamp || spot.created_at || new Date().toISOString();
      const status = mostRecentReport?.status || 'free';

      return {
        ...spot,
        status,
        recent_reports: spotReports.length,
        last_report_time: lastReportTime,
        report_count_1h: spotReports.length,
      };
    });

    return Response.json({ spots: spotsWithReports });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { spots: [], error: 'Internal server error' },
      { status: 500 }
    );
  }
}
